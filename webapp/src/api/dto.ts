import { DateTime } from 'luxon';

export interface ScanSummary {
    id: number;
    scan_time: DateTime;
    network_id: string;
    discovered_device_count: number;
}

export interface Scan {
    id: number;
    scan_time: DateTime;
    network_id: string;
    devices: DiscoveredDevice[];
}

export interface DiscoveredDevice {
    scan_id: number;
    mac_address: string;
    ip_address: string;
    hostname: string;
}

export interface NamedDevice {
    mac_address: string;
    name: string;
    note: string;
}