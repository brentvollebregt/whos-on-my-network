import datetime
from typing import List, Optional

from . import models
from . import utils


class ToJsonSupport:
    def json(self) -> dict:
        return self.__dict__


class ScanSummary(ToJsonSupport):
    """ A scan with the amount of devices discovered """

    def __init__(self, scan: models.Scan, discovered_device_count: int):
        self.id = scan.id
        self.scan_time = utils.datetime_to_iso_string(scan.scan_time)
        self.network_id = scan.network_id
        self.discovered_device_count = discovered_device_count


class Scan(ToJsonSupport):
    """ A scan with a list of all discovered devices """

    def __init__(self, scan: models.Scan, discovered_devices: List[models.Discovery]):
        self.id = scan.id
        self.scan_time = utils.datetime_to_iso_string(scan.scan_time)
        self.network_id = scan.network_id
        self.discovered_devices = [Discovery(d).json() for d in discovered_devices]


class Discovery(ToJsonSupport):
    """ A discovered device """

    def __init__(self, discovery: models.Discovery):
        # self.id = discovered_device.id
        # self.scan_id = discovered_device.scan.id
        self.mac_address = discovery.device.mac_address
        self.ip_address = discovery.ip_address
        self.hostname = discovery.hostname


class Device(ToJsonSupport):
    """ A device identified by its MAC address """

    def __init__(self, device: models.Device, first_seen_date: Optional[datetime.datetime], last_seen_date: Optional[datetime.datetime]):
        self.id = device.id
        self.mac_address = device.mac_address
        self.name = device.name
        self.note = device.note
        self.first_seen_date = utils.datetime_to_iso_string(first_seen_date) if first_seen_date is not None else None
        self.last_seen_date = utils.datetime_to_iso_string(last_seen_date)if last_seen_date is not None else None
