"""
Plugin to support ASUS RT-AC58U (3.0.0.4.382.51939 - 2019/12/23)

Configuration values:
- username: Username to use to log into the router
- password: Password to use to log into the router
"""

import ast
import base64
import os
import time
from typing import List

import requests

from ..service.scanning import DiscoveredDevice


def __get_config(provided_config: dict):
    """
    Try to get username and password out of the provided configuration.
    Fall back to environment variables if not found otherwise otherwise use 'admin'.
    """
    username = provided_config['username'] if 'username' in provided_config else os.getenv('ROUTER_USERNAME', 'admin')
    password = provided_config['password'] if 'password' in provided_config else os.getenv('ROUTER_PASSWORD', 'admin')

    return {
        'username': username,
        'password': password,
    }


def scan(network_id: str, verbose: bool, plugin_config: dict) -> List[DiscoveredDevice]:
    """ A dirty way of obtaining devices connected to an Asus RT-AC58U router """

    config = __get_config(plugin_config)

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
        'login_authorization': base64.b64encode(f'{config["username"]}:{config["password"]}'.encode()).decode()
    }
    response = requests.post('http://router.asus.com/login.cgi', headers=headers, data=data, verify=False)
    token = response.cookies.get('asus_token')

    # Get active clients
    cookies = {
        'asus_token': token
    }
    headers = {
        'Referer': 'http://router.asus.com/index.asp',
    }
    params = (
        ('_', {str(int(time.time() * 1000))}),
    )
    response = requests.get('http://router.asus.com/update_networkmapd.asp', headers=headers, params=params, cookies=cookies, verify=False)

    active_devices = ast.literal_eval(response.text.split('\n')[0].split('= ')[1][:-1])[0]

    # Get client details
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

        if entry not in active_devices:
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
