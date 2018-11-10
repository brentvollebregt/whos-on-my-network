import sqlite3


# Views to create in the database and to use in the command line
VIEWS = {
    'raw': {
        'query': 'SELECT * FROM host_logs',
        'description': 'View all host logs'
    },

    'ips': {
        'query': 'SELECT distinct ip FROM host_logs',
        'description': 'Show all ips'
    },
    'hostnames': {
        'query': 'SELECT distinct hostname FROM host_logs',
        'description': 'Show all hostnames'
    },
    'macs': {
        'query': 'SELECT distinct mac FROM host_logs',
        'description': 'Show all mac addresses'
    },

    'devices': {
        'query': 'SELECT hostname, ip, mac FROM host_logs where mac is not null group by mac',
        'description': 'Show all devices grouped my mac addresses. Ignores null mac addresses.'
    },

    'last10mins': {
        'query': "SELECT * FROM host_logs where time > datetime('now', 'localtime', '-10 minutes')",
        'description': 'Get all results in the last 10 minutes'
    },
    'devices_last_seen': {
        'query': "SELECT hostname, time FROM host_logs group by hostname",
        'description': 'Get the last time a hostname was seen'
    }
}

# Column withs used for printing tables
COLUMN_WIDTHS = {
    'id': 4,
    'ip': 15,
    'hostname': 25,
    'mac': 17,
    'time': 19,
}


class DB:
    """ Object to handle database interaction """
    _filename = ''
    _connection = None
    _cursor = None
    _lock = False

    def __init__(self, filename):
        self._filename = filename
        self._open_connection()
        # Create the main table
        self._cursor.execute(
            'CREATE TABLE IF NOT EXISTS host_logs ('
            'id INTEGER PRIMARY KEY, '
            'ip TEXT, '
            'hostname TEXT, '
            'mac TEXT, '
            'time INTEGER'
            ')'
        )
        # Create all views
        for view in VIEWS:
            self._cursor.execute('CREATE VIEW IF NOT EXISTS {view_name} AS {query}'.format(view_name=view, query=VIEWS[view]['query']))
        self._close_connection(commit=True)

    def _open_connection(self):
        """ Open a connection to the database """
        self._lock = True
        self._connection = sqlite3.connect(self._filename)
        self._connection.row_factory = sqlite3.Row
        self._cursor = self._connection.cursor()

    def _close_connection(self, commit=False):
        """ Commit and close the current connection to the database"""
        if commit:
            self._connection.commit()
        self._connection.close()
        self._cursor = None
        self._connection = None
        self._lock = False

    def log(self, ip, hostname, mac, time):
        """ Log a record to the host_logs table """
        # Wait until there is no internal lock on the database
        while self._lock:
            continue
        self._open_connection()
        self._cursor.execute(
            "INSERT INTO host_logs (ip, hostname, mac, time) VALUES (?, ?, ?, datetime(?, 'unixepoch', 'localtime'))",
            (ip, hostname, mac, time)
        )
        self._close_connection(commit=True)

    def view(self, view_name, limit):
        """ Query a view from the active database """
        self._open_connection()

        data = {'error': False, 'message': '', 'rows': []}

        try:
            # Query for view
            if limit is None:
                self._cursor.execute('SELECT * FROM {view_name}'.format(view_name=view_name))
            else:
                # Use a limit if requested
                self._cursor.execute('SELECT * FROM {view_name} LIMIT ?'.format(view_name=view_name), (limit, ))
        except sqlite3.OperationalError as e:
            data['error'] = True
            data['message'] = 'sqlite3.OperationalError: ' + str(e)
            self._close_connection()
            return data

        # Put all data in the form of [ {col: value, col: value, ...}, {col: value, col: value, ...}, ... ]
        rows = self._cursor.fetchall()
        data['rows'] = [{key: row[key] for key in row.keys()} for row in rows]

        self._close_connection()
        return data
