import click
from typing import Optional

from . import version
from . import config
from .api import app, pre_flight_checks
from .service import scanning as scanning_service


@click.group()
@click.version_option(version, message="v%(version)s")
def cli():
    """Who's On My Network"""


@cli.command()
@click.option("-p", "--port", "port", type=int, default=config.PORT)
def start(port: bool):
    """Start the web server"""
    pre_flight_checks()
    app.run(host="0.0.0.0", port=port)


@cli.command()
@click.option(
    "-t", "--refresh-time", default=300, type=int, help="Seconds until the network is re-scanned. Default is 300s."
)
@click.option("-n", "--network-id", default=config.NETWORK_ID, help="Network id to scan. Default is 192.168.1.0/24.")
@click.option("-a", "--amount", type=int, default=None, help="Amount of times to scan network. Default is no limit.")
@click.option("-s", "--scanner", default=config.SCANNER, help="Scanner to scan the network.")
@click.option("-v", "--verbose", is_flag=True, default=config.VERBOSE, help="Verbose output of scans.")
def watch(refresh_time: int, network_id: str, amount: Optional[int], scanner: str, verbose: bool):
    """Watch and record who is on a network periodically"""
    print("Scanning... Press Ctrl+C to stop.")
    try:
        scanning_service.scan_network_repeatedly(network_id, refresh_time, amount, scanner, verbose)
    except KeyboardInterrupt:
        print("Stopped")


@cli.command()
@click.option("-n", "--network-id", default=config.NETWORK_ID, help="Network id to scan. Default is 192.168.1.0/24.")
@click.option("-s", "--scanner", default=config.SCANNER, help="Scanner to scan the network.")
@click.option("-v", "--verbose", is_flag=True, default=config.VERBOSE, help="Verbose output of scans.")
def current(network_id: str, scanner: str, verbose: bool):
    """Look at who is currently on the network"""
    print("Scanning...")
    scan_id = scanning_service.scan_network_single(network_id, scanner, verbose)
    discoveries = scanning_service.get_discoveries_from_scan(scan_id)

    print(f'+-{"-"*17}---{"-"*15}---{"-"*30}-+')
    print(f'| {"MAC Address":^17} | {"IP Address":^15} | {"Hostname":^30} |')
    for discovery in discoveries:
        print(f"| {discovery.device.mac_address:<17} | {discovery.ip_address:^15} | {discovery.hostname:^30} |")
    print(f'+-{"-"*17}---{"-"*15}---{"-"*30}-+')


@cli.command()
def debug():
    """Display debug information"""
    print("Config")
    print(f"\tDatabase path: {config.DATABASE_PATH}")
    print(f"\tPort: {config.PORT}")
    print(f"\tVerbose: {config.VERBOSE}")
    print(f"\tNetwork id: {config.NETWORK_ID}")
    print(f"\tScanner: {config.SCANNER}")


if __name__ == "__main__":
    cli(prog_name="whos_on_my_network")
