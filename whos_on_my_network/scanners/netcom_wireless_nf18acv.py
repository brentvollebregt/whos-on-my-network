"""
Scanner to support NetComm Wireless NF18ACV VDSL/ADSL2+ Dual Band AC1600 Gigabit Gateway with VoIP (version unknown)

Configuration values:
- routerIpAddress: IP address of the router

Note: This exploits devices being publicly available at http://192.168.20.1/js/summary.js
"""

import os
import re
from typing import List

import requests

from ..service.scanning import DiscoveredDevice


def __get_config(provided_config: dict):
    """
    Try to get router IP address out of the provided configuration.
    Fall back to environment variable if not found otherwise otherwise use default.
    """
    router_ip_address = provided_config['routerIpAddress'] if 'routerIpAddress' in provided_config else os.getenv('ROUTER_IP_ADDRESS', '192.168.20.1')

    return {
        'router_ip_address': router_ip_address,
    }


def scan(network_id: str, verbose: bool, plugin_config: dict) -> List[DiscoveredDevice]:
    """ A dirty way of obtaining devices connected to a NetComm Wireless NF18ACV router """

    config = __get_config(plugin_config)

    response = requests.get(f'http://{config["router_ip_address"]}/js/summary.js', verify=False)
    javascript = response.text

    devices_connected_to_24ghz_raw = re.search(r"var wlConnDevs_2 = '([\S\s]*?)';", javascript).group(1)
    devices_connected_to_5ghz_raw = re.search(r"var wlConnDevs_5 = '([\S\s]*?)';", javascript).group(1)

    devices_grouped_raw = (devices_connected_to_24ghz_raw + "|" + devices_connected_to_5ghz_raw).strip("|")
    devices_raw = devices_grouped_raw.split("|")

    # Get devices out of map
    values: List[DiscoveredDevice] = []
    for device_raw in devices_raw:
        parts = device_raw.split(",")

        mac_address = parts[3]
        ip_address = parts[2]
        hostname = parts[0]

        values.append(DiscoveredDevice(
            mac_address=mac_address,
            ip_address=ip_address,
            hostname=hostname
        ))

    return values
