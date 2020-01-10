import os
from pathlib import Path

# Database
DATABASE_SQLITE_FILE_LOCATION = os.getenv('DATABASE_SQLITE_FILE_LOCATION', Path(__file__).absolute().parent / 'database.sqlite')

# Web interface
HOST = '0.0.0.0'
PORT = 8080
