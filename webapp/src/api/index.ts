import Config from '../config';
import { DateTime } from 'luxon';
import { ScanSummary, Device, Scan } from './dto';

export function getScanById(scanId: number): Promise<Scan | undefined> {
    return fetch(`${Config.api.root}/api/scan/${scanId}`)
        .then(r => {
            if (r.status === 200) {
                return r.json().then(payload => {
                    return {
                        id: payload.id,
                        scan_time: DateTime.fromISO(payload.scan_time),
                        network_id: payload.network_id,
                        discovered_devices: payload.discovered_devices
                    }
                })
            } else {
                return undefined
            }
        });
}

export function getScansByFilter(startDate?: DateTime, endDate?: DateTime, macAddress?: string): Promise<ScanSummary[]> {
    return Promise.resolve([]); // TODO
}

export function getNamedDevice(macAddress: string): Promise<Device> {
    return Promise.resolve({} as any); // TODO
}

export function updateNamedDevice(macAddress: string, name: string, note: string): Promise<Device> {
    return Promise.resolve({} as any); // TODO
}

export function deleteNamedDevice(macAddress: string): Promise<void> {
    return Promise.resolve(); // TODO
}
