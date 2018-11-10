import ipaddress
import subprocess
import threading
import socket
import time
from uuid import getnode as get_mac
from pathlib import Path


ONLY_IN_PING_SUCCESS = 'Approximate round trip times in milli-seconds'


def _scan_host(host, pings, db_access, verbose):
    """ Check if a particular host address is connected to the currently connected network """
    # Ping the host and wait until done
    process = subprocess.Popen('ping -n {pings} {host} '.format(pings=pings, host=host), stdout=subprocess.PIPE)
    process.wait()
    output = process.stdout.read().decode()

    # Check if the destination was reachable
    if ONLY_IN_PING_SUCCESS in output:
        # Get the hostname and mac address of this host and then put the data in the database
        hostname = ip_to_name(host)
        mac = ip_to_mac(host)
        if verbose:
            print('[' + Path(__file__).name + '] {host}/{hostname} is connected'.format(host=host, hostname=hostname))
        db_access.log(host, hostname, mac, time.time())


def scan_network(db_access, network_id, pings, block=False, verbose=True):
    """ Scan all possible hosts provided a network id """
    # Find all hosts using the network id
    network = ipaddress.ip_network(network_id)
    threads = {}

    # Start threads for each host
    for host in network.hosts():
        host_ip = str(host)
        threads[host_ip] = threading.Thread(target=_scan_host, args=(host_ip, pings, db_access, verbose))
        threads[host_ip].start()

    # If asked to block, wait for all threads to stop
    if block:
        for host in threads:
            threads[host].join()


def ip_to_mac(ip):
    """ Convert an ip address to a mac address """

    # Check if this ip is mine, if so return my mac address (this mac will not be in 'arp -a')
    if ip == my_ip():
        return my_mac()

    try:
        # Get the arp table
        process = subprocess.Popen('arp -a', stdout=subprocess.PIPE)
        process.wait()
        output = process.stdout.read().decode()

        # Look for this ip in the arp table and return the corresponding mac address
        for line in output.split('\r\n'):
            line_items = [i for i in line.strip().split(' ') if i != '']
            if ip in line_items:
                return line_items[1]
    except:
        # Sometimes when calling subprocess.Popen we will be given "ValueError: embedded null character"
        pass

    return None


def ip_to_name(ip):
    """ Convert an ip address to a hostname """
    return socket.getfqdn(ip)


def my_ip():
    """ Get my ip address """
    return socket.gethostbyname(socket.gethostname())


def my_mac():
    """ Get my mac address """
    return ':'.join(("%012X" % get_mac())[i:i + 2] for i in range(0, 12, 2))
