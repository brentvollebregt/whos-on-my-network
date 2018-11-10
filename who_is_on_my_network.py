from utils import db, network
import argparse
import time
from pathlib import Path


class DBFakerPrint:
    """ A replacement for db.DB that simply prints log() calls"""
    def log(self, ip, hostname, mac, time):
        print(ip + ': ' + hostname)


def watch(refresh_time, pings, network_id, database_filename, amount):
    """ Watch and record who is on a network periodically """
    db_access = db.DB(database_filename)

    refreshes = 0
    try:

        while True:
            print('[' + Path(__file__).name + '] Scanning Network')
            if amount is not None and refreshes + 1 == amount:
                # If an amount has been specified and we are 1 away, call network.scan_network and block
                network.scan_network(db_access, network_id, pings, block=True)
                refreshes += 1
                break
            else:
                # If there is no set amount or we aren't near it, allow network.scan_network to thread
                network.scan_network(db_access, network_id, pings)
                refreshes += 1
                time.sleep(refresh_time)

    except KeyboardInterrupt:
        print("Keyboard Interrupt")
    finally:
        print('Completed with {0} refresh(es)'.format(refreshes))


def view(view_name, database_filename, limit):
    """ View logs of devices that have been seen on a network """
    db_access = db.DB(database_filename)

    if view_name is None:
        # If no view has been supplied, print out the possible views
        for single_view in db.VIEWS:
            print(single_view)
            print('\t' + db.VIEWS[single_view]['query'])
            print('\t' + db.VIEWS[single_view]['description'])
    else:
        # Make sure the view exists before trying to query for it
        if view_name not in db.VIEWS:
            print('That view does not exist')
            return

        # Query for view
        data = db_access.view(view_name, limit)
        if data['error']:
            print('An Error Occurred')
            print(data['message'])
        else:
            if len(data['rows']) > 0:
                # Print row names
                row_names = [title for title in data['rows'][0]]
                header_width_template = ''.join(['| {:^' + str(db.COLUMN_WIDTHS[row_name]) + '} ' for row_name in row_names]) + '|'
                print(header_width_template.format(*row_names))

                # Print separator
                separator = ''.join(['|-' + ('-' * db.COLUMN_WIDTHS[row_name]) + '-' for row_name in row_names]) + '|'
                print(separator)

                # Print data
                data_width_template = header_width_template.replace('^', '')
                for row in data['rows']:
                    # Replace all None values with 'null' to allow .format() to work
                    row_no_none = [cell if cell is not None else 'null' for cell in row.values()]
                    print(data_width_template.format(*row_no_none))


def current(pings, network_id):
    """ Look at who is currently on the network """
    # Call network.scan_network by passing a 'db object' that prints out results and don't let the threads print
    db_faker = DBFakerPrint()
    network.scan_network(db_faker, network_id, pings, block=True, verbose=False)


parser = argparse.ArgumentParser(description='Track users on the current network')
subparsers = parser.add_subparsers(title='commands', dest='command')

arg_watch = subparsers.add_parser('watch', description='Watch and record who is on a network periodically')
arg_watch.add_argument(
    '-t', '--refresh-time',
    action='store', dest='refresh_time',
    type=int, default=300,
    help='Seconds until the network is re-scanned. Default is 300s.'
)
arg_watch.add_argument(
    '-p', '--pings',
    action='store', dest='pings',
    type=int, default=2,
    help='Amount of pings to check that host is reachable. Default is 2.'
)
arg_watch.add_argument(
    '-n', '--network-id',
    action='store', dest='network_id',
    default='192.168.1.0/24',
    help='Network id to scan. Default is 192.168.1.0/24.'
)
arg_watch.add_argument(
    '-d', '--database-filename',
    action='store', dest='database_filename',
    default='records.sqlite',
    help='Filename to save database as.'
)
arg_watch.add_argument(
    '-a', '--amount',
    action='store', dest='amount',
    type=int, default=None,
    help='Amount of times to scan network. Default is no limit.'
)

arg_view = subparsers.add_parser('view', description='View logs of devices that have been seen on a network')
arg_view.add_argument(
    'view_name',
    nargs='?', default=None,
    help='Name of the view to display.'
)
arg_view.add_argument(
    '-d', '--database-filename',
    action='store', dest='database_filename',
    default='records.sqlite',
    help='Database filename to read from.'
)
arg_view.add_argument(
    '-l', '--limit',
    action='store', dest='limit',
    type=int, default=None,
    help='Limit the amount of results that are returned.'
)

arg_current = subparsers.add_parser('current', description='Look at who is currently on the network')
arg_current.add_argument(
    '-p', '--pings',
    action='store', dest='pings',
    type=int, default=2,
    help='Amount of pings to check that host is reachable. Default is 2.'
)
arg_current.add_argument(
    '-n', '--network-id',
    action='store', dest='network_id',
    default='192.168.1.0/24',
    help='Network id to scan. Default is 192.168.1.0/24.'
)

args = parser.parse_args()

if args.command == 'watch':
    watch(args.refresh_time, args.pings, args.network_id, args.database_filename, args.amount)
elif args.command == 'view':
    view(args.view_name, args.database_filename, args.limit)
elif args.command == 'current':
    current(args.pings, args.network_id)
else:
    parser.print_help()
