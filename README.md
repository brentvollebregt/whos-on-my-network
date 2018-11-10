# Who is on my Network?
This command line tool allows you to keep records of who is on your network and when. Only Windows is supported (I recommend using nmap for Linux) and all data is saved in a sqlite database.

## How Does This Work?
This works by trying to ping all hosts using a given network id (default is 192.168.0.1/24). When a host responds, it mac and hostname are obtained and an entry is written to an sqlite database with a timestamp.

## Command Line Arguments
### watch
*Watch and record who is on a network periodically*

| Argument                | Description                                                    |
|-------------------------|----------------------------------------------------------------|
| -t, --refresh-time      | Seconds until the network is re-scanned. Default is 300s.      |
| -p, --pings             | Amount of pings to check that host is reachable. Default is 2. |
| -n, --network-id        | Network id to scan. Default is 192.168.1.0/24.                 |
| -d, --database-filename | Filename to save database as.                                  |
| -a, --amount            | Amount of times to scan network. Default is no limit.          |

For example, `python who_is_on_my_network.py watch -t 30` will constantly check who is on your network every 30 seconds and then will write this to records.sqlite.

### view
*View logs of devices that have been seen on a network*

| Argument                | Description                                    |
|-------------------------|------------------------------------------------|
| view                    | Name of the view to display.                   |
| -d, --database-filename | Database filename to read from.                |
| -l, --limit             | Limit the amount of results that are returned. |

Calling `python who_is_on_my_network.py view` *(no extra arguments)* will display all the available views.

For example, `python who_is_on_my_network.py view devices` will print print a table with hostnames, ips and mac addresses.

### current
*Look at who is currently on the network*

| Argument         | Description                                                    |
|------------------|----------------------------------------------------------------|
| -p, --pings      | Amount of pings to check that host is reachable. Default is 2. |
| -n, --network-id | Network id to scan. Default is 192.168.1.0/24.                 |

For example, `python who_is_on_my_network.py current` will display all the current devices on the network you are connected to in the form of "ip: hostname".
