import datetime
from typing import List

from . import utils


class ToJsonSupport:
    def build(self) -> dict:
        _dict = self.__dict__
        for key in _dict:
            value = _dict[key]
            if hasattr(value, 'build') and callable(value.build):
                _dict[key] = value.build()
            elif type(value) == datetime.datetime:
                _dict[key] = utils.datetime_to_iso_string(value)
            elif type(value) == list:
                _dict[key] = [i.build() if hasattr(i, 'build') else i for i in value]
        return _dict


class Discovery(ToJsonSupport):
    def __init__(self, id: int, ip_address: str, hostname: str, device_id: int, scan_id: int):
        self.id = id
        self.ip_address = ip_address
        self.hostname = hostname
        self.device_id = device_id
        self.scan_id = scan_id


class Scan(ToJsonSupport):
    def __init__(self, id: int, scan_time: datetime.datetime, network_id: str, discoveries: List['Discovery']):
        self.id = id
        self.scan_time = scan_time
        self.network_id = network_id
        self.discoveries = discoveries


class ScanSummary(ToJsonSupport):
    def __init__(self, id: int, scan_time: datetime.datetime, network_id: str, devices_discovered_count: int, people_seen_count: int, primary_devices_seen_count: int):
        self.id = id
        self.scan_time = scan_time
        self.network_id = network_id
        self.devices_discovered_count = devices_discovered_count
        self.people_seen_count = people_seen_count
        self.primary_devices_seen_count = primary_devices_seen_count


class Person(ToJsonSupport):
    def __init__(self, id: int, name: str, note: str, first_seen: datetime.datetime, last_seen: datetime.datetime):
        self.id = id
        self.name = name
        self.note = note
        self.first_seen = first_seen
        self.last_seen = last_seen


class PersonSummary(ToJsonSupport):
    def __init__(self, id: int, name: str, note: str, first_seen: datetime.datetime, last_seen: datetime.datetime):
        self.id = id
        self.name = name
        self.note = note
        self.first_seen = first_seen
        self.last_seen = last_seen


class Device(ToJsonSupport):
    """ Full details of a device """
    def __init__(self, id: int, mac_address: str, name: str, note: str, owner_id: int, is_primary: bool, first_seen: datetime.datetime, last_seen: datetime.datetime):
        self.id = id
        self.mac_address = mac_address
        self.name = name
        self.note = note
        self.owner_id = owner_id
        self.is_primary = is_primary
        self.first_seen = first_seen
        self.last_seen = last_seen


class DeviceSummary(ToJsonSupport):
    """ Reduced details of a device for batch device requests """
    def __init__(self, id: int, mac_address: str, name: str, note: str, owner_id: int, is_primary: bool, first_seen: datetime.datetime, last_seen: datetime.datetime):
        self.id = id
        self.mac_address = mac_address
        self.name = name
        self.note = note
        self.owner_id = owner_id
        self.is_primary = is_primary
        self.first_seen = first_seen
        self.last_seen = last_seen
