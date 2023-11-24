"""
Default scanner using scapy

Configuration environment values:
- NETWORK_ID: The network id to be scanned, for example, "192.168.1.0/24"
"""

import os
import socket
from typing import List

from scapy.all import arping, ARP, Ether, Scapy_Exception

from ..service.types import DiscoveredDevice


class ScanException(Exception):
    pass


def __get_config():
    network_id = os.getenv("NETWORK_ID", "192.168.1.0/24")
    return {
        "network_id": network_id,
    }


def scan(verbose: bool) -> List[DiscoveredDevice]:
    """Built in method to scan a network"""
    config = __get_config()

    scan_data: List[DiscoveredDevice] = []

    try:
        answered, _ = arping(config["network_id"], verbose=0)
    except Scapy_Exception as exception:  # This happens when running the module using python in the cmd
        # Interface is invalid (no pcap match found) !
        raise ScanException("Npcap must be installed for Windows hosts")
    except OSError as exception:  # This happens when running the application using the vs code launch config
        # b'Error opening adapter: The system cannot find the device specified. (20)'
        raise ScanException("Npcap must be installed for Windows hosts")

    for s, r in answered:
        mac_address = r[Ether].src
        ip_address = s[ARP].pdst
        hostname = socket.getfqdn(ip_address)

        scan_data.append(DiscoveredDevice(mac_address, ip_address, hostname))

    return scan_data
