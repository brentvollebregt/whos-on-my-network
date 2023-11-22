import dataclasses


@dataclasses.dataclass
class DiscoveredDevice:
    mac_address: str
    ip_address: str
    hostname: str
