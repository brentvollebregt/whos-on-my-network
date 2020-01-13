from datetime import datetime
import socket
import time
from typing import Optional, List

import peewee
from scapy.all import arping, ARP, Ether

from . import models
from . import dto


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
        models.Discovery.create(
            scan=scan,
            mac_address=mac_address,
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


def get_devices_from_scan(scan_id: int) -> List[models.Discovery]:
    """ Get the discovered devices from a scan """
    scan = models.Scan.get(models.Scan.id == scan_id)
    return models.Discovery().select().where(models.Discovery.scan == scan)


def get_scans_between_dates(start_date: Optional[datetime], end_date: Optional[datetime]) -> List[dto.ScanSummary]:
    """ Get all scans between two dates """
    scans_and_counts = models.Scan.select(
        models.Scan,
        peewee.fn.COUNT(models.Discovery.id).alias('count')
    ).where(
        ((start_date is None) | (models.Scan.scan_time > start_date))
        & ((end_date is None) | (models.Scan.scan_time > end_date))
    ).join(models.Discovery).group_by(models.Scan)

    scan_summaries = []

    for scan_and_count in scans_and_counts:
        scan_summaries.append(dto.ScanSummary(scan_and_count, scan_and_count.count))

    return scan_summaries


def get_scan(scan_id: int) -> dto.Scan:
    """ Get a scan and all discovered devices in the scan """
    scan = models.Scan.get(models.Scan.id == scan_id)
    devices = models.Discovery.select().where(models.Discovery.scan == scan)
    return dto.Scan(scan, devices)


def get_named_device(mac_address: str) -> models.NamedDevice:
    """ Get the associated models.NamedDevice object to a MAC address """
    try:
        device = models.NamedDevice.get(models.NamedDevice.mac_address == mac_address)
        return device
    except peewee.DoesNotExist:
        device = models.NamedDevice.create(
            mac_address=mac_address,
            name='',
            note='',
        )
    return device


def update_named_device(mac_address: str, name: str, note: str) -> models.NamedDevice:
    """ Create / update a models.NamedDevice object for a MAC address """
    device = get_named_device(mac_address)
    device.name = name
    device.note = note
    device.save()

    return device


def delete_named_device(mac_address: str):
    """ Delete any models.NamedDevice objects relating to a MAC address """
    models.NamedDevice.delete().where(models.NamedDevice.mac_address == mac_address).execute()
