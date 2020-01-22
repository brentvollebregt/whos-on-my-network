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


def get_scan_by_id(scan_id: int) -> dto.Scan:
    """ Get a scan and all discovered devices in the scan """
    scan = models.Scan.get(models.Scan.id == scan_id)
    devices = models.Discovery.select().where(models.Discovery.scan == scan).join(models.Device)
    return dto.Scan(scan, devices)


def get_scans_by_filter(start_date: Optional[datetime] = None, end_date: Optional[datetime] = None, mac_address: Optional[str] = None) -> List[dto.ScanSummary]:
    """ Get all scans between two dates and filter by mac address """
    scans_and_counts = models.Scan.select(
        models.Scan,
        peewee.fn.COUNT(models.Discovery.id).alias('count'),
        peewee.fn.GROUP_CONCAT(models.Device.mac_address, ',')
            .python_value(lambda addresses: [id for id in addresses.split(',') if id != ''] if addresses is not None else [])
            .alias('mac_address_list')
    ).where(
        ((start_date is None) | (models.Scan.scan_time > start_date))
        & ((end_date is None) | (models.Scan.scan_time > end_date))
    ).join(models.Discovery, peewee.JOIN.LEFT_OUTER).join(models.Device, peewee.JOIN.LEFT_OUTER).group_by(models.Scan)

    # Using the MAC addresses discovered, filter only the ones that contain the MAC specified
    if mac_address is not None:
        scans_and_counts = [s for s in scans_and_counts if mac_address in s.mac_address_list]

    # Map into DTOs
    scan_summaries = []
    for scan_and_count in scans_and_counts:
        scan_summaries.append(dto.ScanSummary(scan_and_count, scan_and_count.count))

    return scan_summaries


def get_device(mac_address: str) -> dto.Device:
    """ Get the associated models.NamedDevice object to a MAC address """
    device, created = models.Device.get_or_create(
        mac_address=mac_address,
    )

    scans_with_device = models.Scan.select().where(
        models.Discovery.device == device
    ).join(models.Discovery).order_by(models.Scan.scan_time.asc())

    # If the device has appeared in no scans, there is no first or last seen dates
    if len(scans_with_device) > 0:
        first_seen_date = scans_with_device[0].scan_time
        last_seen_date = scans_with_device[-1].scan_time
        return dto.Device(device, first_seen_date, last_seen_date)
    else:
        device, created = models.Device.get_or_create(
            mac_address=mac_address,
        )
        return dto.Device(device, None, None)


def update_device(mac_address: str, name: str, note: str) -> dto.Device:
    """ Create / update a models.NamedDevice object for a MAC address """
    device, created = models.Device.get_or_create(
        mac_address=mac_address,
    )
    device.name = name
    device.note = note
    device.save()

    device_dto = get_device(mac_address)
    return device_dto


def delete_device(mac_address: str) -> bool:
    """ Delete device relating to a MAC address. Returns True if successful otherwise False """
    try:
        device = models.Device.get(models.Device.mac_address == mac_address)
    except peewee.DoesNotExist:
        return False
    device.delete_instance(recursive=True)
    return True
