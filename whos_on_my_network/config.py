import os


DATABASE_PATH = os.getenv("DATABASE_PATH", "./database.sqlite")
PORT = int(os.getenv("PORT", "8080"))
VERBOSE = str(os.getenv("VERBOSE", "false")).lower() == "true"
SCANNER = os.getenv("SCANNER", "default")
