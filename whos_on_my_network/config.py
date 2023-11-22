import os


DATABASE_PATH = os.getenv("DATABASE_PATH", "./database.sqlite")
PORT = int(os.getenv("PORT", "8080"))
VERBOSE = str(os.getenv("VERBOSE", "false")).lower() == "true"
NETWORK_ID = os.getenv("NETWORK_ID", "192.168.1.0/24")
SCANNER = os.getenv("SCANNER", "default")
