import Config from "../config";
import { DateTime } from "luxon";
import {
  ScanSummary,
  Device,
  Scan,
  DeviceSummary,
  PersonSummary,
  Person,
  DiscoveryTimes
} from "./dto";

const parsePythonTime = (timeString: string) =>
  DateTime.fromFormat(timeString, "yyyy-MM-dd'T'HH:mm:ss.uZZ");

export function getScansByFilter(
  ids?: number[],
  startDate?: DateTime,
  endDate?: DateTime,
  deviceIds?: number[],
  ownerIds?: number[],
  limit?: number,
  page?: number
): Promise<ScanSummary[]> {
  return fetch(`${Config.api.root}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ids,
      startDate,
      endDate,
      deviceIds,
      ownerIds,
      limit,
      page
    })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return payload.map((s: any) => ({
          id: s.id,
          scan_time: parsePythonTime(s.scan_time),
          network_id: s.network_id,
          devices_discovered_count: s.devices_discovered_count,
          people_seen_count: s.people_seen_count,
          primary_devices_seen_count: s.primary_devices_seen_count
        }));
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getScanById(scanId: number): Promise<Scan | undefined> {
  return fetch(`${Config.api.root}/api/scan/${scanId}`).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          scan_time: parsePythonTime(payload.scan_time),
          network_id: payload.network_id,
          discoveries: payload.discoveries
        };
      });
    } else {
      return undefined;
    }
  });
}

export function getDevicesByFilter(
  ids?: number[],
  search_query?: string,
  owner_id?: number,
  is_primary?: boolean
): Promise<DeviceSummary[]> {
  return fetch(`${Config.api.root}/api/device`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ids, search_query, owner_id, is_primary })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return payload.map((d: any) => ({
          id: d.id,
          mac_address: d.mac_address,
          name: d.name,
          note: d.note,
          owner_id: d.owner_id,
          is_primary: d.is_primary,
          first_seen: parsePythonTime(d.first_seen),
          last_seen: parsePythonTime(d.last_seen)
        }));
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getDeviceById(deviceId: number): Promise<Device | undefined> {
  return fetch(`${Config.api.root}/api/device/${deviceId}`).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          mac_address: payload.mac_address,
          name: payload.name,
          note: payload.note,
          owner_id: payload.owner_id,
          is_primary: payload.is_primary,
          first_seen: parsePythonTime(payload.first_seen),
          last_seen: parsePythonTime(payload.last_seen),
          last_10_discoveries: payload.last_10_discoveries
        };
      });
    } else {
      return undefined;
    }
  });
}

export function updateDeviceById(
  deviceId: number,
  name: string,
  note: string,
  ownerId: number | null,
  isPrimary: boolean
): Promise<Device> {
  return fetch(`${Config.api.root}/api/device/${deviceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, note, ownerId, isPrimary })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          mac_address: payload.mac_address,
          name: payload.name,
          note: payload.note,
          owner_id: payload.owner_id,
          is_primary: payload.is_primary,
          first_seen: parsePythonTime(payload.first_seen),
          last_seen: parsePythonTime(payload.last_seen),
          last_10_discoveries: payload.last_10_discoveries
        };
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getPeopleByFilter(
  ids?: number[],
  name_partial?: string
): Promise<PersonSummary[]> {
  return fetch(`${Config.api.root}/api/person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ids, name_partial })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return payload.map((p: any) => ({
          id: p.id,
          name: p.name,
          note: p.note,
          device_count: p.device_count,
          first_seen:
            p.first_seen !== null ? parsePythonTime(p.first_seen) : null,
          last_seen: p.first_seen !== null ? parsePythonTime(p.last_seen) : null
        }));
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function createPerson(name?: string): Promise<Person | undefined> {
  return fetch(`${Config.api.root}/api/person`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          name: payload.name,
          note: payload.note,
          first_seen:
            payload.first_seen !== null
              ? parsePythonTime(payload.first_seen)
              : null,
          last_seen:
            payload.last_seen !== null
              ? parsePythonTime(payload.last_seen)
              : null
        };
      });
    } else {
      return undefined;
    }
  });
}

export function getPersonById(personId: number): Promise<Person | undefined> {
  return fetch(`${Config.api.root}/api/person/${personId}`).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          name: payload.name,
          note: payload.note,
          first_seen:
            payload.first_seen !== null
              ? parsePythonTime(payload.first_seen)
              : null,
          last_seen:
            payload.last_seen !== null
              ? parsePythonTime(payload.last_seen)
              : null
        };
      });
    } else {
      return undefined;
    }
  });
}

export function updatePersonById(
  personId: number,
  name: string,
  note: string
): Promise<Person> {
  return fetch(`${Config.api.root}/api/person/${personId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, note })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        return {
          id: payload.id,
          name: payload.name,
          note: payload.note,
          first_seen:
            payload.first_seen !== null
              ? parsePythonTime(payload.first_seen)
              : null,
          last_seen:
            payload.last_seen !== null
              ? parsePythonTime(payload.last_seen)
              : null
        };
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getDeviceDiscoveryTimes(
  ids: number[],
  startDate: DateTime,
  endDate: DateTime
): Promise<DiscoveryTimes> {
  return fetch(`${Config.api.root}/api/device/discovery-times`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ids, startDate, endDate })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        const returnPayload = { ...payload };
        Object.keys(returnPayload).forEach((key: string) => {
          returnPayload[parseInt(key)] = returnPayload[key].map((d: string) =>
            parsePythonTime(d)
          );
        });
        return returnPayload as DiscoveryTimes;
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}

export function getPersonDiscoveryTimes(
  ids: number[],
  startDate: DateTime,
  endDate: DateTime
): Promise<DiscoveryTimes> {
  return fetch(`${Config.api.root}/api/person/discovery-times`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ids, startDate, endDate })
  }).then(r => {
    if (r.status === 200) {
      return r.json().then(payload => {
        const returnPayload = { ...payload };
        Object.keys(returnPayload).forEach((key: string) => {
          returnPayload[parseInt(key)] = returnPayload[key].map((d: string) =>
            parsePythonTime(d)
          );
        });
        return returnPayload as DiscoveryTimes;
      });
    } else {
      throw Error(`Server Error (HTTP${r.status})`);
    }
  });
}
