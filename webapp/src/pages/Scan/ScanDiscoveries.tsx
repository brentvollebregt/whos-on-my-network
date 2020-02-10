import React, { useState, useEffect } from "react";
import { Scan, DeviceSummary, PersonSummary } from "../../api/dto";
import { Table, Spinner } from "react-bootstrap";
import { getDevicesByFilter, getPeopleByFilter } from "../../api";
import { navigate } from "hookrouter";

interface ScanDiscoveriesProps {
  scan: Scan | undefined;
}

const ScanDiscoveries: React.FunctionComponent<ScanDiscoveriesProps> = ({
  scan
}) => {
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  useEffect(() => {
    if (scan !== undefined) {
      getDevicesByFilter(scan.discoveries.map(d => d.device_id))
        .then(d => setDevices(d))
        .catch(err => console.error(err));
    }
  }, [scan]);

  useEffect(() => {
    if (devices !== undefined) {
      getPeopleByFilter(
        devices.filter(d => d.owner_id !== null).map(d => d.owner_id as number)
      )
        .then(p => setPeople(p))
        .catch(err => console.error(err));
    }
  }, [devices]);

  const getDeviceName = (deviceId: number) => {
    if (devices === undefined) {
      return "";
    }
    const device = devices.find(d => d.id === deviceId);
    return device === undefined ? "NOT FOUND" : device.name;
  };
  const getDeviceMACAddress = (deviceId: number) => {
    if (devices === undefined) {
      return "";
    }
    const device = devices.find(d => d.id === deviceId);
    return device === undefined
      ? "NOT FOUND"
      : device.mac_address.toUpperCase();
  };
  const getDeviceIsPrimary = (deviceId: number) => {
    if (devices === undefined) {
      return "";
    }
    const device = devices.find(d => d.id === deviceId);
    return device === undefined ? "NOT FOUND" : device.is_primary ? "✔️" : "❌";
  };
  const getOwnerName = (deviceId: number) => {
    if (devices === undefined || people === undefined) {
      return "";
    }
    const device = devices.find(d => d.id === deviceId);
    if (device === undefined) {
      return "CANNOT FIND DEVICE";
    }
    if (device.owner_id === null) {
      return "";
    }
    const person = people.find(p => p.id === device.owner_id);
    return person === undefined ? "NOT FOUND" : person.name;
  };

  const onDiscoveryClick = (deviceId: number) => () =>
    navigate(`/devices/${deviceId}`);

  return scan === undefined ? (
    <Spinner animation="border" />
  ) : (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>MAC</th>
          <th>Primary</th>
          <th>Owner</th>
          <th>Hostname</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        {scan.discoveries !== undefined &&
          scan.discoveries.map(discovery => (
            <tr
              key={discovery.id}
              onClick={onDiscoveryClick(discovery.device_id)}
            >
              <td>{getDeviceName(discovery.device_id)}</td>
              <td>{getDeviceMACAddress(discovery.device_id)}</td>
              <td>{getDeviceIsPrimary(discovery.device_id)}</td>
              <td>{getOwnerName(discovery.device_id)}</td>
              <td>{discovery.hostname}</td>
              <td>{discovery.ip_address}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default ScanDiscoveries;
