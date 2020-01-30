from datetime import datetime
import socket
import time
from typing import Optional, List

from scapy.all import arping, ARP, Ether

from .. import models


def scan_network(network_id: str, verbose: bool = False) -> int:
    """ Scan the provided network id once """
    scan = models.Scan.create(
        network_id=network_id
    )

    answered, _ = arping(network_id, verbose=0)
    for s, r in answered:
        mac_address = r[Ether].src
        ip_address = s[ARP].pdst
        hostname = socket.getfqdn(ip_address)

        device, created = models.Device.get_or_create(
            mac_address=mac_address
        )
        models.Discovery.create(
            scan=scan,
            device=device,
            ip_address=ip_address,
            hostname=hostname,
        )

        if verbose:
            print(f'{mac_address} : {ip_address} : {hostname}')

    return scan.id


def repeatedly_scan_network(network_id: str, delay: int, amount: Optional[int], verbose: bool = False):
    """ Repeatedly scan the provided network """
    scan_count = 0

    if amount == 0:
        return

    while True:
        if verbose:
            print(f'Scan at {datetime.now().strftime("%d-%m-%y %H:%M:%S")}')

        scan_network(network_id, verbose)
        scan_count += 1

        if amount is None or scan_count < amount:
            time.sleep(delay)
        else:
            break


def get_discoveries_from_scan(scan_id: int) -> List[models.Discovery]:
    """ Get the discoveries from a scan joined with the associated device """
    scan = models.Scan.get(models.Scan.id == scan_id)
    return models.Discovery().select().where(models.Discovery.scan == scan).join(models.Device)
