from datetime import datetime
from typing import List, Dict, Optional

import peewee

from .. import models
from .. import utils


def get_discovery_times_for_devices(ids: List[int], start_date: Optional[datetime], end_date: Optional[datetime]) -> Dict[int, datetime]:
    """ Gets times a device was seen in a scan """
    start_date_no_timezone = utils.remove_timezome(start_date) if start_date is not None else None
    end_date_no_timezone = utils.remove_timezome(end_date) if end_date is not None else None

    devices: List[models.Device] = models.Device.select(
        models.Device,
    ).where(
        models.Device.id.in_(ids)
    )
    discoveries = models.Discovery.select(
        models.Discovery, models.Scan
    ).where(
        ((start_date is None) | (models.Scan.scan_time >= start_date_no_timezone))
        & ((end_date is None) | (models.Scan.scan_time <= end_date_no_timezone))
    ).join(models.Scan)

    devices_with_discoveries: List[models.Device] = peewee.prefetch(devices, discoveries)
    device_seen_times: Dict[int, datetime] = {}

    for device in devices_with_discoveries:
        device_seen_times[device.id] = [utils.to_utc_datetime(d.scan.scan_time) for d in device.discoveries]

    return device_seen_times


def get_discovery_times_for_people(ids: List[int], start_date: Optional[datetime], end_date: Optional[datetime]) -> Dict[int, datetime]:
    """ Gets times a person was seen in a scan  """
    people: List[models.Person] = models.Person.select(
        models.Person,
        peewee.fn.GROUP_CONCAT(models.Device.id)
            .python_value(lambda id_list: [int(id) for id in id_list.split(',') if id != ''] if id_list is not None else [])
            .alias('device_ids')
    ).where(
        models.Person.id.in_(ids)
    ) \
        .join(models.Device, peewee.JOIN.LEFT_OUTER) \
        .group_by(models.Person.id)

    device_ids = [device_id for person in people for device_id in person.device_ids]
    device_discovery_times = get_discovery_times_for_devices(device_ids, start_date, end_date)

    people_seen_times: Dict[int, datetime] = {}

    for person in people:
        devices_seen_times = map(lambda _id: device_discovery_times[_id], person.device_ids)
        person_seen_times = [time for device_seen_times in devices_seen_times for time in device_seen_times]
        people_seen_times[person.id] = list(dict.fromkeys(person_seen_times))  # Remove dupes

    return people_seen_times