from typing import List, Optional

from .. import dto
from .. import models
from .. import utils


def __person_to_person_dto(device: models.Person) -> dto.Person:
    return dto.Person(
        id=device.id,
        name=device.name,
        note=device.note,
        first_seen=utils.get_utc_datetime(),  # TODO Get
        last_seen=utils.get_utc_datetime()  # TODO Get
    )


def ___person_to_person_summary_dto(device: models.Person) -> dto.PersonSummary:
    return dto.PersonSummary(
        id=device.id,
        name=device.name,
        note=device.note,
        first_seen=utils.get_utc_datetime(),  # TODO Get
        last_seen=utils.get_utc_datetime()  # TODO Get
    )


def get_people_by_filter(ids: Optional[List[int]], name_partial: Optional[str]) -> List[dto.PersonSummary]:
    ids_definite_list = ids if ids is not None else []

    people: List[models.Person] = models.Person.select().where(
        ((ids is None) | (models.Person.id.in_(ids_definite_list)))
        & ((name_partial is None) | (models.Person.name.contains(name_partial)))
    )

    return [___person_to_person_summary_dto(p) for p in people]


def create_person(name: str):
    person = models.Person.create(
        name=name,
    )
    return get_person_by_id(person.id)


def get_person_by_id(person_id: int) -> dto.Person:
    person = models.Device.get(person_id)

    return __person_to_person_dto(person)


def update_person_by_id(person_id: int, name: str, note: str) -> dto.Person:
    person = models.Device.get(person_id)

    person.name = name
    person.note = note
    person.save()

    return __person_to_person_dto(person)
