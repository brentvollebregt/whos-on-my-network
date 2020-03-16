import dataclasses
import importlib
import inspect
import socket
import time
from typing import Optional, List

from scapy.all import arping, ARP, Ether

from .. import config
from .. import models


@dataclasses.dataclass
class DiscoveredDevice:
    mac_address: str
    ip_address: str
    hostname: str


def __scan_network(network_id: str, verbose: bool, plugin_config: dict) -> List[DiscoveredDevice]:
    """ Built in method to scan a network """
    scan_data: List[DiscoveredDevice] = []

    answered, _ = arping(network_id, verbose=0)

    for s, r in answered:
        mac_address = r[Ether].src
        ip_address = s[ARP].pdst
        hostname = socket.getfqdn(ip_address)

        scan_data.append(DiscoveredDevice(mac_address, ip_address, hostname))

    return scan_data


def __save_scan_data(network_id: str, scan_data: List[DiscoveredDevice], verbose: bool = False) -> int:
    """ Save a list of DiscoveredDevice objects """
    scan = models.Scan.create(
        network_id=network_id
    )

    if verbose:
        print(f'Scan at {scan.scan_time.strftime("%d-%m-%y %H:%M:%S")}')

    for discovered_device in scan_data:
        device, _ = models.Device.get_or_create(
            mac_address=discovered_device.mac_address.upper()
        )
        models.Discovery.create(
            scan=scan,
            device=device,
            ip_address=discovered_device.ip_address,
            hostname=discovered_device.hostname,
        )

        if verbose:
            print(f'{discovered_device.mac_address} : {discovered_device.ip_address} : {discovered_device.hostname}')

    return scan.id


def __get_plugin(name: str):
    """ Import a plugin by name to use as a network scanner """
    # Import the plugin
    plugin = importlib.import_module(f'.plugins.{name}', 'whos_on_my_network')

    # Validate the plugin
    assert hasattr(plugin, 'scan') and inspect.isfunction(plugin.scan), \
        'A function named "scan" does not exist in this plugin'

    return plugin.scan


def scan_network_single(network_id: str, use_plugin: Optional[str], verbose: bool = False):
    """ Scan the provided network once """
    if use_plugin is None:
        scan_data = __scan_network(network_id, verbose, config.PLUGIN_CONFIG)
    else:
        plugin = __get_plugin(use_plugin)
        scan_data = plugin(network_id, verbose, config.PLUGIN_CONFIG)

    scan_id = __save_scan_data(network_id, scan_data, verbose)
    return scan_id


def scan_network_repeatedly(network_id: str, delay: int, amount: Optional[int], use_plugin: Optional[str], verbose: bool = False):
    """ Repeatedly scan the provided network """
    scan_count = 0

    if amount == 0:
        return

    while True:
        if use_plugin is None:
            scan_data = __scan_network(network_id, verbose, config.PLUGIN_CONFIG)
        else:
            plugin = __get_plugin(use_plugin)
            scan_data = plugin(network_id, verbose, config.PLUGIN_CONFIG)

        __save_scan_data(network_id, scan_data, verbose)
        scan_count += 1

        if amount is None or scan_count < amount:
            time.sleep(delay)
        else:
            break


def get_discoveries_from_scan(scan_id: int) -> List[models.Discovery]:
    """ Get the discoveries from a scan joined with the associated device """
    scan = models.Scan.get(models.Scan.id == scan_id)
    return models.Discovery().select().where(models.Discovery.scan == scan).join(models.Device)
