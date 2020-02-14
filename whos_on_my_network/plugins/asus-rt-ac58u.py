import base64
import time
from typing import List

import requests

from ..service.scanning import DiscoveredDevice


ROUTER_USERNAME = 'admin'
ROUTER_PASSWORD = 'admin'  # Change password


def scan(network_id: str, verbose: bool = False) -> List[DiscoveredDevice]:
    """ A dirty way of obtaining devices connected to an Asus RT-AC58U router """

    # Login to get cookie
    headers = {
        'Referer': 'http://192.168.1.1/Main_Login.asp',
    }
    data = {
        'group_id': '',
        'action_mode': '',
        'action_script': '',
        'action_wait': '5',
        'current_page': 'Main_Login.asp',
        'next_page': 'index.asp',
        'login_authorization': base64.b64encode(f'{ROUTER_USERNAME}:{ROUTER_PASSWORD}'.encode()).decode()
    }
    response = requests.post('http://192.168.1.1/login.cgi', headers=headers, data=data, verify=False)
    token = response.cookies.get('asus_token')

    # Get clients
    cookies = {
        'asus_token': token
    }
    headers = {
        'Referer': 'http://192.168.1.1/index.asp',
    }
    params = (
        ('_', {str(int(time.time() * 1000))}),
    )
    response = requests.get('http://192.168.1.1/update_clients.asp', headers=headers, params=params, cookies=cookies, verify=False)

    # Pull the string we need out of the JavaScript response
    unsplit_data = response.text.split('\n')[6][len("fromNetworkmapd: '"):-len("'.replace(/&#62/g, \">\").replace(/&#60/g, \"<\").split('<'),")]
    replaced_and_split = unsplit_data.replace('&#62', '>').replace('&#60', '<').split('<')

    # Get devices out of target string
    values: List[DiscoveredDevice] = []
    for entry in replaced_and_split:
        if entry == '':
            continue

        device = entry.split('>')
        values.append(DiscoveredDevice(
            mac_address=device[3],
            ip_address=device[2],
            hostname=device[1]
        ))

    return values
