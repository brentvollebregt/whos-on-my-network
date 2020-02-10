from typing import List, Optional

import peewee

from .. import dto
from .. import models
from .. import utils


def get_devices_by_filter(ids: Optional[List[int]], search_query: Optional[str], owner_id: Optional[int], is_primary: Optional[bool]) -> List[dto.DeviceSummary]:
    # TODO Filter on ids
    # TODO Filter on search_query (MAC, name)
    # TODO Filter on is_primary
    ids_definite_list = ids if ids is not None else []

    devices: List[models.Device] = models.Device.select(
        models.Device,
        models.Person,
        peewee.fn.MAX(models.Scan.scan_time).alias('last_seen'),
        peewee.fn.MIN(models.Scan.scan_time).alias('first_seen')
    ).where(
        ((ids is None) | (models.Device.id.in_(ids_definite_list)))
        & ((owner_id is None) | (models.Person.id == owner_id))
    ).join(models.Person, peewee.JOIN.LEFT_OUTER) \
        .switch(models.Device) \
        .join(models.Discovery) \
        .join(models.Scan) \
        .group_by(models.Device.id)

    dtos = [dto.DeviceSummary(
        id=d.id,
        mac_address=d.mac_address,
        name=d.name,
        note=d.note,
        owner_id=d.owner.id if d.owner is not None else None,
        is_primary=d.is_primary,
        first_seen=utils.to_utc_datetime(d.first_seen),
        last_seen=utils.to_utc_datetime(d.last_seen)
    ) for d in devices]

    return dtos


def get_device_by_id(device_id: int) -> dto.Device:
    device = models.Device.get(device_id)
    dates = models.Scan().select(
        peewee.fn.MAX(models.Scan.scan_time).alias('last_seen'),
        peewee.fn.MIN(models.Scan.scan_time).alias('first_seen')
    ).where(
        (models.Discovery.device == device)
    ).join(models.Discovery).scalar(as_tuple=True)
    discoveries = models.Discovery.select(
        models.Discovery, models.Device, models.Person
    ).where(
        (models.Discovery.device == device)
    ) \
        .join(models.Device) \
        .join(models.Person, peewee.JOIN.LEFT_OUTER) \
        .switch(models.Discovery) \
        .join(models.Scan) \
        .order_by(models.Scan.scan_time.desc()) \
        .limit(10)

    discovery_dtos: List[dto.Discovery] = [dto.Discovery(
        id=d.id,
        ip_address=d.ip_address,
        hostname=d.ip_address,
        device_id=d.device_id,
        scan_id=d.scan_id,
    ) for d in discoveries]

    device_dto = dto.Device(
        id=device.id,
        mac_address=device.mac_address,
        name=device.name,
        note=device.note,
        owner_id=device.owner.id if device.owner is not None else None,
        is_primary=device.is_primary,
        first_seen=utils.to_utc_datetime(dates[1]),
        last_seen=utils.to_utc_datetime(dates[0]),
        last_10_discoveries=discovery_dtos
    )

    return device_dto


def update_device_by_id(device_id: int, name: str, note: str, owner_id: Optional[int], is_primary: bool) -> dto.Device:
    device = models.Device.get(device_id)

    device.name = name
    device.note = note
    device.owner = models.Person.get(owner_id) if owner_id is not None else None
    device.is_primary = is_primary
    device.save()

    return get_device_by_id(device.id)
