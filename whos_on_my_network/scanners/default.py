"""
Default scanner using scapy

Configuration environment values:
- NETWORK_ID: The network id to be scanned, for example, "192.168.1.0/24"

Known issues:

- Not Working on Windows and MacOS in Docker

    Even when using the `host` network mode in docker, Windows and MacOS still use internal
    networks for the running container. While devices are still reachable and scanners that
    query specific IPs (like netcom_wireless_nf18acv.py) will work, the default scanner will
    not as it uses ARP packets to detect devices.

    ARP packets work by broadcasting packets using MAC addresses, and since docker is running
    in a different network to the host, these packets are not routed out of the docker network
    to the host's network.

    To fix this, either run the application directly on the host or build a scanner that queries
    devices some other way.

- Not Detecting Device Names Automatically

    We use `socket.getfqdn` (similar to `socket.gethostbyaddr`) to get device hostnames - these
    hostnames are then used to pre-populate device names. It has been witnessed on some devices
    that hostnames are unable to be found.

    If executing `python -c "import socket; print(socket.getfqdn('<target IP with a known hostname>'))"`
    on the host system simply prints out the original IP address, this shows the issue is on the
    host and is not caused by docker (if using docker).
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
        print(f"Got a Scapy_Exception when calling arping: {exception}")
        raise ScanException("Npcap must be installed for Windows hosts")
    except OSError as exception:  # This happens when running the application using the vs code launch config
        # b'Error opening adapter: The system cannot find the device specified. (20)'
        print(f"Got an OSError when calling arping: {exception}")
        raise ScanException("Npcap must be installed for Windows hosts")

    for s, r in answered:
        mac_address = r[Ether].src
        ip_address = s[ARP].pdst
        hostname = socket.getfqdn(ip_address)

        scan_data.append(DiscoveredDevice(mac_address, ip_address, hostname))

    return scan_data
