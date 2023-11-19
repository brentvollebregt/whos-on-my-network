"""
Default scanner using scapy
"""

import socket
from typing import List

from scapy.all import arping, ARP, Ether, Scapy_Exception

from ..service.scanning import DiscoveredDevice


class ScanException(Exception):
    pass


def scan(network_id: str, verbose: bool, plugin_config: dict) -> List[DiscoveredDevice]:
    """ Built in method to scan a network """
    scan_data: List[DiscoveredDevice] = []

    try:
        answered, _ = arping(network_id, verbose=0)
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