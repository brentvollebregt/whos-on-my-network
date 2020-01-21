import Config from '../config';
import { DateTime } from 'luxon';
import { ScanSummary, NamedDevice } from './dto';

export function getScansByDate(startDate: DateTime, endDate: DateTime): Promise<ScanSummary[]> {
    return Promise.resolve([]); // TODO
}

export function getScanById(scanId: number): Promise<ScanSummary | undefined> {
    return Promise.resolve(undefined); // TODO
}

export function getNamedDevice(macAddress: string): Promise<NamedDevice> {
    return Promise.resolve({} as any); // TODO
}

export function updateNamedDevice(macAddress: string, name: string, note: string): Promise<NamedDevice> {
    return Promise.resolve({} as any); // TODO
}

export function deleteNamedDevice(macAddress: string): Promise<void> {
    return Promise.resolve(); // TODO
}
