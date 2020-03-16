import os
from pathlib import Path
import json
from typing import Optional

from . import utils


CONFIG_FILENAME = 'config.json'
DATABASE_FILENAME = 'database.sqlite'
PACKAGED_PLUGIN_FILE = '.packagedplugin'


packaged = utils.is_packaged() or os.getenv('FORCE_PACKAGED_MODE', 'false').lower() == 'true'


def __get_data_folder() -> Path:
    """ Identify a directory for where the settings and database reside """
    if not packaged:
        return Path(__file__).absolute().parent.parent  # Top level of the project for development
    elif os.name == 'nt':
        return Path(os.getenv('APPDATA')) / 'WhoIsOnMyNetwork'  # Windows default is in local Appdata
    else:
        return Path.home() / 'WhoIsOnMyNetwork'  # Default is the home directory


def __get_default_configuration() -> dict:
    """ The default contents of {CONFIG_FILENAME} """
    default_config = {
        'host': '0.0.0.0',
        'port': 8080,
        'verbose': False,
        'default_network_id': '192.168.1.0/24'
    }

    if not packaged:
        default_config['default_plugin'] = None

    if not packaged or __get_packaged_plugin() is not None:
        default_config['plugin_config'] = {}

    return default_config


def __get_packaged_plugin() -> Optional[str]:
    """ Identify whether a plugin is available when packaged """
    packaged_plugin_file = Path(__file__).absolute().parent / PACKAGED_PLUGIN_FILE
    if packaged_plugin_file.exists():
        with open(packaged_plugin_file, 'r') as f:
            return f.read()

    return None


# Make sure the root exists
root = __get_data_folder()
root.mkdir(parents=True, exist_ok=True)

# Populate config with default data if it doesn't exist already
config_file = (root / CONFIG_FILENAME)
if not config_file.exists():
    with config_file.open('w') as f:
        json.dump(__get_default_configuration(), f, indent=4)

# Read in config
with config_file.open('r') as f:
    config_data = json.load(f)

# Get expected config values
DATABASE_FILE_LOCATION = str(root / DATABASE_FILENAME)
HOST = os.getenv('HOST', config_data['host'])
PORT = int(str(os.getenv('PORT', config_data['port'])))
VERBOSE = str(os.getenv('VERBOSE', config_data['verbose'])).lower() == 'true'
DEFAULT_NETWORK_ID = os.getenv('DEFAULT_NETWORK_ID', config_data['default_network_id'])
DEFAULT_PLUGIN = __get_packaged_plugin() if packaged else os.getenv('DEFAULT_PLUGIN', config_data['default_plugin'])
PLUGIN_CONFIG = config_data['plugin_config'] if 'plugin_config' in config_data else {}
