import click
from typing import Optional

from . import config
from . import service
from .api import app


@click.group()
def cli():
    """ Who's On My Network """


@cli.command()
@click.option('-h', '--host', 'host', required=False, default=config.HOST)
@click.option('-p', '--port', 'port', required=False, type=int, default=config.PORT)
def start(host, port):
    """ Start the web server """
    print(f'Server starting at http://{host}:{port}')
    app.run(host=host, port=port)


@cli.command()
@click.option('-t', '--refresh-time', default=300, type=int, help="Seconds until the network is re-scanned. Default is 300s.")
@click.option('-n', '--network-id', metavar='view', default='192.168.1.0/24', help="Network id to scan. Default is 192.168.1.0/24.")
@click.option('-a', '--amount', default=int, help="Amount of times to scan network. Default is no limit.")
def watch(refresh_time: int, network_id: str, amount: Optional[int]):
    """ Watch and record who is on a network periodically """
    print("Scanning... Press Ctrl+C to stop.")
    try:
        service.repeatedly_scan_network(network_id, refresh_time, amount)
    except KeyboardInterrupt:
        print("Stopped")


@cli.command()
@click.option('-n', '--network-id', metavar='view', default='192.168.1.0/24', help="Network id to scan. Default is 192.168.1.0/24.")
def current(network_id: str):
    """ Look at who is currently on the network """
    print("Scanning...")
    scan_id = service.scan_network(network_id)
    devices = service.get_devices_from_scan(scan_id)

    for device in devices:
        print(f'{device.mac_address} : {device.ip_address} : {device.hostname}')


if __name__ == '__main__':
    cli(prog_name='whos_on_my_network')
