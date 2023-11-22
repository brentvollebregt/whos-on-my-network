from datetime import datetime
from typing import List, Optional

import peewee

from .. import models
from .. import dto
from .. import utils


def get_scans_by_filter(
    ids: Optional[List[int]],
    start_date: Optional[datetime],
    end_date: Optional[datetime],
    device_ids: Optional[List[int]],
    owner_ids: Optional[List[int]],
    limit: Optional[int],
    page: Optional[int],
) -> List[dto.ScanSummary]:
    # TODO Filter by device ids
    # TODO Filter by owner ids
    # TODO Limit / paging
    ids_definite_list = ids if ids is not None else []
    start_date_no_timezone = utils.remove_timezome(start_date) if start_date is not None else None
    end_date_no_timezone = utils.remove_timezome(end_date) if end_date is not None else None

    scans = (
        models.Scan.select(models.Scan)
        .where(
            ((ids is None) | (models.Scan.id.in_(ids_definite_list)))
            & ((start_date is None) | (models.Scan.scan_time >= start_date_no_timezone))
            & ((end_date is None) | (models.Scan.scan_time <= end_date_no_timezone))
        )
        .join(models.Discovery, peewee.JOIN.LEFT_OUTER)
        .join(models.Device, peewee.JOIN.LEFT_OUTER)
        .join(models.Person, peewee.JOIN.LEFT_OUTER)
        .group_by(models.Scan.id)
        .order_by(models.Scan.scan_time.desc())
    )
    discoveries = (
        models.Discovery.select(models.Discovery, models.Device, models.Person)
        .join(models.Device)
        .join(models.Person, peewee.JOIN.LEFT_OUTER)
    )

    scans_with_discoveries = peewee.prefetch(scans, discoveries)
    scan_dtos: List[dto.ScanSummary] = []

    for scan in scans_with_discoveries:
        discovered_devices_ids = []
        discovered_devices_people_ids = []
        primary_discovered_devices_ids = []
        for discovery in scan.discoveries:
            if discovery.device.id not in discovered_devices_ids:
                discovered_devices_ids.append(discovery.device.id)
            if discovery.device.owner is not None and discovery.device.owner.id not in discovered_devices_people_ids:
                discovered_devices_people_ids.append(discovery.device.owner.id)
            if discovery.device.is_primary and (discovery.device.id not in primary_discovered_devices_ids):
                primary_discovered_devices_ids.append(discovery.device.id)

        scan_dtos.append(
            dto.ScanSummary(
                id=scan.id,
                scan_time=utils.to_utc_datetime(scan.scan_time),
                devices_discovered_count=len(discovered_devices_ids),
                people_seen_count=len(discovered_devices_people_ids),
                primary_devices_seen_count=len(primary_discovered_devices_ids),
            )
        )

    return scan_dtos


def get_scan_by_id(scan_id: int) -> dto.Scan:
    scan: models.Scan = models.Scan.get(models.Scan.id == scan_id)
    discoveries: List[models.Discovery] = (
        models.Discovery.select().where(models.Discovery.scan == scan).join(models.Scan)
    )

    discovery_dtos: List[dto.Discovery] = [
        dto.Discovery(
            id=d.id,
            ip_address=d.ip_address,
            hostname=d.hostname,
            device_id=d.device.id,
            scan_id=d.scan.id,
        )
        for d in discoveries
    ]

    return dto.Scan(
        id=scan.id,
        scan_time=utils.to_utc_datetime(scan.scan_time),
        discoveries=discovery_dtos,
    )
