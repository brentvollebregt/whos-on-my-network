# Tested with ASUS RT-AC58U (3.0.0.4.382.51939 - 2019/12/23)

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
        'Referer': 'http://router.asus.com/Main_Login.asp',
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
    response = requests.post('http://router.asus.com/login.cgi', headers=headers, data=data, verify=False)
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

    # Get the originData object
    origin_data = '\n'.join(response.text.split('\n')[1:-4])
    origin_data_object_string = origin_data[len('originData = '):] \
        .replace("fromNetworkmapd", '"fromNetworkmapd"') \
        .replace("nmpClient", '"nmpClient"')
    network_map = ast.literal_eval(origin_data_object_string)['fromNetworkmapd'][0]

    # Get devices out of map
    values: List[DiscoveredDevice] = []
    for entry in network_map:
        if entry == 'maclist':
            continue

        mac_address = entry
        ip_address = network_map[entry]['ip']
        hostname = network_map[entry]['name']

        values.append(DiscoveredDevice(
            mac_address=mac_address,
            ip_address=ip_address,
            hostname=hostname
        ))

    return values
