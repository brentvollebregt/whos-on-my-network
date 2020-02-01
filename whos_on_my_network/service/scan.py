from datetime import datetime
from typing import List

import peewee

from .. import models
from .. import dto
from .. import utils


def get_scans_by_filter(start_date: datetime, end_date: datetime) -> List[dto.ScanSummary]:
    # TODO Filter by device ids
    # TODO Filter by person ids
    # TODO Filter by date range
    # TODO Limit / paging
    scans: List[models.Scan] = models.Scan.select(
        models.Scan,
        peewee.fn.COUNT(models.Device.id).alias('devices_discovered_count'),
        peewee.fn.COUNT(models.Person.id).alias('people_seen_count'),
        peewee.fn.GROUP_CONCAT(models.Device.is_primary, ',')
            .python_value(lambda bools: [bool(int(b)) for b in bools.split(',') if id != ''] if bools is not None else [])
            .alias('is_primary_array')
    ) \
        .join(models.Discovery) \
        .join(models.Device) \
        .join(models.Person, peewee.JOIN.LEFT_OUTER) \
        .group_by(models.Scan.id) \
        .order_by(models.Scan.scan_time.desc())

    scan_dtos = [dto.ScanSummary(
        id=s.id,
        scan_time=utils.to_utc_datetime(s.scan_time),
        network_id=s.network_id,
        devices_discovered_count=s.devices_discovered_count,
        people_seen_count=s.people_seen_count,
        primary_devices_seen_count=s.is_primary_array.count(True),
    ) for s in scans]

    return scan_dtos


def get_scan_by_id(scan_id: int) -> dto.Scan:
    scan: models.Scan = models.Scan.get(models.Scan.id == scan_id)
    discoveries: List[models.Discovery] = models.Discovery.select().where(
        models.Discovery.scan == scan
    ).join(models.Scan)

    discovery_dtos: List[dto.Discovery] = [dto.Discovery(
        id=d.id,
        ip_address=d.ip_address,
        hostname=d.hostname,
        device_id=d.device.id,
        scan_id=d.scan.id,
    ) for d in discoveries]

    return dto.Scan(
        id=scan.id,
        scan_time=scan.scan_time,
        network_id=scan.network_id,
        discoveries=discovery_dtos
    )
