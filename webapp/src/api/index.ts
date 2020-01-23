import Config from "../config";
import { DateTime } from "luxon";
import { ScanSummary, Device, Scan } from "./dto";

export function getScanById(scanId: number): Promise<Scan | undefined> {
  return fetch(`${Config.api.root}/api/scan/${scanId}`).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          scan_time: DateTime.fromISO(payload.scan_time),
          network_id: payload.network_id,
          discovered_devices: payload.discovered_devices
        };
      });
    } else {
      return undefined;
    }
  });
}

export function getScansByFilter(
  startDate?: DateTime,
  endDate?: DateTime,
  macAddress?: string
): Promise<ScanSummary[]> {
  return fetch(`${Config.api.root}/api/scan/`, {
    method: "POST",
    body: JSON.stringify({ startDate, endDate, macAddress })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return payload.map((s: any) => ({
          id: s.id,
          scan_time: DateTime.fromISO(s.scan_time),
          network_id: s.network_id,
          discovered_device_count: s.discovered_device_count
        }));
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getNamedDevice(macAddress: string): Promise<Device> {
  return fetch(`${Config.api.root}/api/device/${macAddress}`).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          mac_address: payload.mac_address,
          name: payload.name,
          note: payload.note,
          firstSeenDate: payload.firstSeenDate,
          lastSeenDate: payload.lastSeenDate
        };
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function updateNamedDevice(
  macAddress: string,
  name: string,
  note: string
): Promise<Device> {
  return fetch(`${Config.api.root}/api/device/${macAddress}`, {
    method: "POST",
    body: JSON.stringify({ name, note })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          mac_address: payload.mac_address,
          name: payload.name,
          note: payload.note,
          firstSeenDate: payload.firstSeenDate,
          lastSeenDate: payload.lastSeenDate
        };
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}
