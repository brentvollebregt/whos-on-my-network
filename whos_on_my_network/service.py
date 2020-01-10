import socket
import time
from typing import Optional, List

from scapy.all import arping, ARP, Ether

from . import models


def scan_network(network_id: str) -> int:
    """ Scan the provided network id once """
    scan = models.Scan.create(
        network_id=network_id
    )

    answered, _ = arping(network_id, verbose=0)
    for s, r in answered:
        mac_address = r[Ether].src
        ip_address = s[ARP].pdst
        hostname = socket.getfqdn(ip_address)
        models.Discovery.create(
            scan=scan,
            mac_address=mac_address,
            ip_address=ip_address,
            hostname=hostname,
        )

    return scan.id


def repeatedly_scan_network(network_id: str, delay: int, amount: Optional[int]):
    """ Repeatedly scan the provided network """
    scan_count = 0

    while True:
        scan_network(network_id)
        scan_count += 1

        if amount is None or scan_count < amount:
            time.sleep(delay)
        else:
            break


def get_devices_from_scan(scan_id: int) -> List[models.Discovery]:
    """ Get the discovered devices from a scan """
    scan = models.Scan().get(models.Scan.id == scan_id)
    return models.Discovery().select().where(models.Discovery.scan == scan)
