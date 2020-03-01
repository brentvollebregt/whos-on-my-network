import os
from pathlib import Path


__development_mode = os.getenv('DEVELOPMENT', 'false').lower() == 'true'


def get_default_database_location() -> str:
    directory = 'WhoIsOnMyNetwork'
    filename = 'database.sqlite'

    if __development_mode:
        root = Path(__file__).absolute().parent.parent  # Top level of the project for development
    elif os.name == 'nt':
        root = Path(os.getenv('APPDATA')) / directory  # Windows default is in local Appdata
    else:
        root = Path.home() / directory  # Default is the home directory

    # Make sure the root exists
    root.mkdir(parents=True, exist_ok=True)

    return str(root / filename)


# Database
DATABASE_FILE_LOCATION = os.getenv('DATABASE_FILE_LOCATION', get_default_database_location())

# Web interface
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8080))

# General Application
VERBOSE = False
DEFAULT_NETWORK_ID = '192.168.1.0/24'
DEFAULT_PLUGIN = None
