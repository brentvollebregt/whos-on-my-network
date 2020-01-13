from typing import List

import arrow

from . import models


class ToJsonSupport:
    def json(self) -> dict:
        return self.__dict__


class ScanSummary(ToJsonSupport):
    """ A scan with the amount of devices discovered """

    def __init__(self, scan: models.Scan, discovered_device_count: int):
        self.id = scan.id
        self.scan_time = arrow.get(scan.scan_time).isoformat()  # ISO formatted date
        self.network_id = scan.network_id
        self.discovered_device_count = discovered_device_count


class Scan(ToJsonSupport):
    """ A scan with a list of all discovered devices """

    def __init__(self, scan: models.Scan, discovered_devices: List[models.Discovery]):
        self.id = scan.id
        self.scan_time = arrow.get(scan.scan_time).isoformat()  # ISO formatted date
        self.network_id = scan.network_id
        self.devices = [DiscoveredDevice(d).json() for d in discovered_devices]


class DiscoveredDevice(ToJsonSupport):
    """ A discovered device """

    def __init__(self, discovered_device: models.Discovery):
        # self.id = discovered_device.id
        self.scan_id = discovered_device.scan.id
        self.mac_address = discovered_device.mac_address
        self.ip_address = discovered_device.ip_address
        self.hostname = discovered_device.hostname


class NamedDevice(ToJsonSupport):
    """ A named device """

    def __init__(self, device: models.NamedDevice):
        # self.id = device.id
        self.mac_address = device.mac_address
        self.name = device.name
        self.note = device.note
