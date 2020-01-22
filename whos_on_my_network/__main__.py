import click
from typing import Optional

from . import config
from . import service
from .api import app


@click.group()
def cli():
    """ Who's On My Network """


@cli.command()
@click.option('-h', '--host', 'host', default=config.HOST)
@click.option('-p', '--port', 'port', type=int, default=config.PORT)
def start(host, port):
    """ Start the web server """
    print(f'Server starting at http://{host}:{port}')
    app.run(host=host, port=port)


@cli.command()
@click.option('-t', '--refresh-time', default=300, type=int, help="Seconds until the network is re-scanned. Default is 300s.")
@click.option('-n', '--network-id', metavar='view', default='192.168.1.0/24', help="Network id to scan. Default is 192.168.1.0/24.")
@click.option('-a', '--amount', type=int, default=None, help="Amount of times to scan network. Default is no limit (0).")
@click.option('-v', '--verbose', is_flag=True, default=config.VERBOSE, help='Verbose output of scans')
def watch(refresh_time: int, network_id: str, amount: Optional[int], verbose: bool):
    """ Watch and record who is on a network periodically """
    print("Scanning... Press Ctrl+C to stop.")
    try:
        service.repeatedly_scan_network(network_id, refresh_time, amount, verbose)
    except KeyboardInterrupt:
        print("Stopped")


@cli.command()
@click.option('-n', '--network-id', metavar='view', default='192.168.1.0/24', help="Network id to scan. Default is 192.168.1.0/24.")
def current(network_id: str):
    """ Look at who is currently on the network """
    print("Scanning...")
    scan_id = service.scan_network(network_id)
    discoveries = service.get_discoveries_from_scan(scan_id)

    print(f'+-{"-"*17}---{"-"*15}---{"-"*30}-+')
    print(f'| {"MAC Address":^17} | {"IP Address":^15} | {"Hostname":^30} |')
    for discovery in discoveries:
        print(f'| {discovery.device.mac_address:<17} | {discovery.ip_address:^15} | {discovery.hostname:^30} |')
    print(f'+-{"-"*17}---{"-"*15}---{"-"*30}-+')


if __name__ == '__main__':
    cli(prog_name='whos_on_my_network')
