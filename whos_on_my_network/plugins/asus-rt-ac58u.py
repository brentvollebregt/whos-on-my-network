from typing import List

from ..service.scanning import DiscoveredDevice


def scan(network_id: str, verbose: bool = False) -> List[DiscoveredDevice]:
    print(network_id)
    return []
