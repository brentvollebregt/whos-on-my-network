from datetime import datetime
from typing import List, Optional, Tuple

import peewee

from .. import models
from .. import dto
from .. import utils


def get_scans_by_filter(ids: Optional[List[int]], start_date: datetime, end_date: datetime, device_ids: Optional[List[int]], owner_ids: Optional[List[int]], limit: Optional[int], page: Optional[int]) -> List[dto.ScanSummary]:
    # TODO Filter on ids
    # TODO Filter by device ids
    # TODO Filter by owner ids
    # TODO Limit / paging

    scans = models.Scan.select(
        models.Scan
    ).where(
        ((start_date is None) | (models.Scan.scan_time >= utils.remove_timezome(start_date))
         & ((end_date is None) | (models.Scan.scan_time <= utils.remove_timezome(end_date))))
    ) \
        .join(models.Discovery) \
        .join(models.Device) \
        .join(models.Person, peewee.JOIN.LEFT_OUTER) \
        .group_by(models.Scan.id) \
        .order_by(models.Scan.scan_time.desc())
    discoveries = models.Discovery.select(
        models.Discovery, models.Device, models.Person
    ).join(models.Device).join(models.Person, peewee.JOIN.LEFT_OUTER)

    scans_with_discoveries = peewee.prefetch(scans, discoveries)
    scan_dtos: List[dto.ScanSummary] = []

    for scan in scans_with_discoveries:
        discovered_devices_id_and_primaries: List[Tuple[int, bool]] = []
        discovered_devices_people_ids: List[int] = []
        for discovery in scan.discoveries:
            discovered_devices_id_and_primaries.append((discovery.device.id, discovery.device.is_primary))
            if discovery.device.owner is not None:
                discovered_devices_people_ids.append(discovery.device.owner.id)

        scan_dtos.append(dto.ScanSummary(
            id=scan.id,
            scan_time=utils.to_utc_datetime(scan.scan_time),
            network_id=scan.network_id,
            devices_discovered_count=len(set(discovered_devices_id_and_primaries)),
            people_seen_count=len(set(discovered_devices_people_ids)),
            primary_devices_seen_count=len([True for d in set(discovered_devices_id_and_primaries) if d[1]]),
        ))

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
