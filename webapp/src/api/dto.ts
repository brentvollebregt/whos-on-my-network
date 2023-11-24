import { DateTime } from "luxon";

export interface Discovery {
  id: number;
  ip_address: string;
  hostname: string;
  device_id: number;
  scan_id: number;
}

export interface Scan {
  id: number;
  scan_time: DateTime;
  discoveries: Discovery[];
}

export interface ScanSummary {
  id: number;
  scan_time: DateTime;
  devices_discovered_count: number;
  people_seen_count: number;
  primary_devices_seen_count: number;
}

export interface Person {
  id: number;
  name: string;
  note: string;
  first_seen: DateTime | null;
  last_seen: DateTime | null;
}

export interface PersonSummary {
  id: number;
  name: string;
  note: string;
  device_count: number;
  first_seen: DateTime | null;
  last_seen: DateTime | null;
}

export interface Device {
  id: number;
  mac_address: string;
  name: string;
  note: string;
  owner_id: number | null;
  is_primary: boolean;
  first_seen: DateTime;
  last_seen: DateTime;
  last_10_discoveries: Discovery[];
}

export interface DeviceSummary {
  id: number;
  mac_address: string;
  name: string;
  note: string;
  owner_id: number | null;
  is_primary: boolean;
  first_seen: DateTime;
  last_seen: DateTime;
}

export interface DiscoveryTimes {
  [key: string]: DateTime[];
}
