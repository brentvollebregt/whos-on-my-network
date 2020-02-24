import ast
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

    # Get individual JavaScript lines
    response_lines = response.text.split('\n')

    # Parse out arrays on lines 9,10,11,12,13,14 to get active devices
    array_names = [('wlList_2g', 9), ('wlList_5g', 10), ('wlList_5g_2', 11), ('wlListInfo_2g', 12), ('wlListInfo_5g', 13), ('wlListInfo_5g_2', 14)]
    array_string_values = [response_lines[line[1]][len(line[0] + ': '): -1] for line in array_names]
    array_values = [ast.literal_eval(a) for a in array_string_values]
    values = [v for array in array_values for v in array]
    values_filtered = [v for v in values if len(v) == 5]
    active_devices = [d[0] for d in values_filtered]

    # Pull the string we need out of the JavaScript response
    unsplit_data = response_lines[6][len("fromNetworkmapd: '"):-len("'.replace(/&#62/g, \">\").replace(/&#60/g, \"<\").split('<'),")]
    replaced_and_split = unsplit_data.replace('&#62', '>').replace('&#60', '<').split('<')

    # Get devices out of target string
    values: List[DiscoveredDevice] = []
    for entry in replaced_and_split:
        if entry == '':
            continue

        device = entry.split('>')
        mac_address = device[3]
        if mac_address not in active_devices:
            continue

        values.append(DiscoveredDevice(
            mac_address=mac_address,
            ip_address=device[2],
            hostname=device[1]
        ))

    return values
