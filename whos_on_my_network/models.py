import peewee

from . import config
from . import utils


database = peewee.SqliteDatabase(
    config.DATABASE_SQLITE_FILE_LOCATION,
    pragmas={
        'foreign_keys': 1  # Enforce foreign-key constraints
    }
)


class BaseModel(peewee.Model):
    class Meta:
        database = database


class Scan(BaseModel):
    """ Scans done on a network """
    id = peewee.PrimaryKeyField(constraints=[peewee.SQL('AUTOINCREMENT')])
    scan_time = peewee.DateTimeField(default=utils.remove_timezome(utils.get_utc_datetime()))  # UTC (no timezone)
    network_id = peewee.TextField()
    # discoveries = Discovery.scan[] backref


class Person(BaseModel):
    """ A person that owns devices """
    id = peewee.PrimaryKeyField(constraints=[peewee.SQL('AUTOINCREMENT')])
    name = peewee.TextField(default='')
    note = peewee.TextField(default='')


class Device(BaseModel):
    id = peewee.PrimaryKeyField(constraints=[peewee.SQL('AUTOINCREMENT')])
    mac_address = peewee.TextField(unique=True)
    name = peewee.TextField(default='')
    note = peewee.TextField(default='')
    owner = peewee.ForeignKeyField(Person, null=True, default=None)
    is_primary = peewee.BooleanField(default=False)


class Discovery(BaseModel):
    """ A discovered device """
    id = peewee.PrimaryKeyField(constraints=[peewee.SQL('AUTOINCREMENT')])
    scan = peewee.ForeignKeyField(Scan, backref='discoveries')
    device = peewee.ForeignKeyField(Device)
    ip_address = peewee.TextField()
    hostname = peewee.TextField(null=True)


database.connect()
database.create_tables([Scan, Person, Device, Discovery])
