import time
from typing import Optional, List


from .. import models
from .types import DiscoveredDevice
from ..scanners.default import scan as scan_default
from ..scanners.asus_rt_ac58u import scan as scan_asus_rt_ac58u
from ..scanners.netcom_wireless_nf18acv import scan as scan_netcom_wireless_nf18acv


def __save_scan_data(network_id: str, scan_data: List[DiscoveredDevice], verbose: bool = False) -> int:
    """Save a list of DiscoveredDevice objects"""
    scan = models.Scan.create(network_id=network_id)

    if verbose:
        print(f'Scan at {scan.scan_time.strftime("%d-%m-%y %H:%M:%S")}')

    for discovered_device in scan_data:
        device, _ = models.Device.get_or_create(mac_address=discovered_device.mac_address.upper())
        models.Discovery.create(
            scan=scan,
            device=device,
            ip_address=discovered_device.ip_address,
            hostname=discovered_device.hostname,
        )

        if verbose:
            print(f"{discovered_device.mac_address} : {discovered_device.ip_address} : {discovered_device.hostname}")

    return scan.id


def __get_scanner(name: str):
    """Get the scanner to use"""
    if name == "default":
        return scan_default
    if name == "asus_rt_ac58u":
        return scan_asus_rt_ac58u
    if name == "netcom_wireless_nf18acv":
        return scan_netcom_wireless_nf18acv

    raise Exception(f'No scanner confiugred with the name "{name}"')


def scan_network_single(network_id: str, scanner_name: str, verbose: bool = False):
    """Scan the provided network once"""
    scanner = __get_scanner(scanner_name)
    scan_data = scanner(network_id, verbose)

    scan_id = __save_scan_data(network_id, scan_data, verbose)
    return scan_id


def scan_network_repeatedly(
    network_id: str, delay: int, amount: Optional[int], scanner_name: str, verbose: bool = False
):
    """Repeatedly scan the provided network"""
    scan_count = 0

    if amount == 0:
        return

    while True:
        scanner = __get_scanner(scanner_name)
        scan_data = scanner(network_id, verbose)

        __save_scan_data(network_id, scan_data, verbose)
        scan_count += 1

        if amount is None or scan_count < amount:
            time.sleep(delay)
        else:
            break


def get_discoveries_from_scan(scan_id: int) -> List[models.Discovery]:
    """Get the discoveries from a scan joined with the associated device"""
    scan = models.Scan.get(models.Scan.id == scan_id)
    return models.Discovery().select().where(models.Discovery.scan == scan).join(models.Device)
