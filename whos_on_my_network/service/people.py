from typing import List, Optional

import peewee

from .. import dto
from .. import models
from .. import utils


def get_people_by_filter(ids: Optional[List[int]], name_partial: Optional[str]) -> List[dto.PersonSummary]:
    ids_definite_list = ids if ids is not None else []

    people: List[models.Person] = (
        models.Person.select(
            models.Person,
            peewee.fn.MIN(models.Scan.scan_time).alias("first_seen"),
            peewee.fn.MAX(models.Scan.scan_time).alias("last_seen"),
            peewee.fn.COUNT(models.Device.id.distinct()).alias("device_count"),
        )
        .where(
            ((ids is None) | (models.Person.id.in_(ids_definite_list)))
            & ((name_partial is None) | (models.Person.name.contains(name_partial)))
        )
        .join(models.Device, peewee.JOIN.LEFT_OUTER)
        .join(models.Discovery, peewee.JOIN.LEFT_OUTER)
        .join(models.Scan, peewee.JOIN.LEFT_OUTER)
        .group_by(models.Person.id)
    )

    return [
        dto.PersonSummary(
            id=p.id,
            name=p.name,
            note=p.note,
            device_count=p.device_count,
            first_seen=utils.to_utc_datetime(p.first_seen) if p.first_seen is not None else None,
            last_seen=utils.to_utc_datetime(p.last_seen) if p.first_seen is not None else None,
        )
        for p in people
    ]


def create_person(name: str):
    person = models.Person.create(
        name=name,
    )
    return get_person_by_id(person.id)


def get_person_by_id(person_id: int) -> dto.Person:
    person = models.Person.get(person_id)

    dates = (
        models.Person.select(
            peewee.fn.MAX(models.Scan.scan_time).alias("last_seen"),
            peewee.fn.MIN(models.Scan.scan_time).alias("first_seen"),
        )
        .where(models.Person.id == person.id)
        .join(models.Device, peewee.JOIN.LEFT_OUTER)
        .join(models.Discovery, peewee.JOIN.LEFT_OUTER)
        .join(models.Scan)
        .scalar(as_tuple=True)
    )

    return dto.Person(
        id=person.id,
        name=person.name,
        note=person.note,
        first_seen=utils.to_utc_datetime(dates[1]) if dates[1] is not None else None,
        last_seen=utils.to_utc_datetime(dates[0]) if dates[0] is not None else None,
    )


def update_person_by_id(person_id: int, name: str, note: str) -> dto.Person:
    person = models.Person.get(person_id)

    person.name = name
    person.note = note
    person.save()

    return get_person_by_id(person_id)


def delete_person_by_id(person_id: int) -> None:
    person = models.Person.get(person_id)

    person.delete_instance(recursive=True)
