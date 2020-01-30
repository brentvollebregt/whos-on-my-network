from typing import List, Optional

from .. import dto
from .. import models
from .. import utils


def __device_to_device_dto(device: models.Device) -> dto.Device:
    return dto.Device(
        id=device.id,
        mac_address=device.mac_address,
        name=device.name,
        note=device.note,
        owner_id=device.owner.id if device.owner is not None else None,
        is_primary=device.is_primary,
        first_seen=utils.get_utc_datetime(),  # TODO Get
        last_seen=utils.get_utc_datetime()  # TODO Get
    )


def ___device_to_device_summary_dto(device: models.Device) -> dto.DeviceSummary:
    return dto.DeviceSummary(
        id=device.id,
        mac_address=device.mac_address,
        name=device.name,
        note=device.note,
        owner_id=device.owner.id if device.owner is not None else None,
        is_primary=device.is_primary,
        first_seen=utils.get_utc_datetime(),  # TODO Get
        last_seen=utils.get_utc_datetime()  # TODO Get
    )


def get_devices_by_filter(search_query: Optional[str]) -> List[dto.DeviceSummary]:
    # TODO on query (MAC, name, note)
    # TODO Filter on owner.id
    # TODO Filter on is_primary

    devices: List[models.Device] = models.Device.select()

    return [___device_to_device_summary_dto(d) for d in devices]


def get_device_by_id(device_id: int) -> dto.Device:
    device = models.Device.get(device_id)

    return __device_to_device_dto(device)


def update_device_by_id(device_id: int, name: str, note: str, owner_id: Optional[int], is_primary: bool) -> dto.Device:
    device = models.Device.get(device_id)

    device.name = name
    device.note = note
    device.owner = models.Person.get(owner_id) if owner_id is not None else None
    device.is_primary = is_primary
    device.save()

    return __device_to_device_dto(device)
