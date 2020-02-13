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

  const onDiscoveryClick = (deviceId: number) => () =>
    navigate(`/devices/${deviceId}`);

  return scan === undefined ? (
    <Spinner animation="border" />
  ) : (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>MAC Address</th>
          <th>Name</th>
          <th>Owner</th>
          <th>Is Primary</th>
          <th>Hostname</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        {scan.discoveries !== undefined &&
          scan.discoveries.map(discovery => {
            const device = devices?.find(d => d.id === discovery.device_id);
            const person =
              device !== undefined
                ? people?.find(p => p.id === device.owner_id)
                : undefined;
            return (
              <tr
                key={discovery.id}
                onClick={onDiscoveryClick(discovery.device_id)}
                className="pointer"
              >
                <td className="mac-address">{device?.mac_address}</td>
                <td>{device?.name}</td>
                <td>{person?.name}</td>
                <td>
                  {device === undefined
                    ? undefined
                    : device.is_primary
                    ? "✔️"
                    : "❌"}
                </td>
                <td>{discovery.hostname}</td>
                <td>{discovery.ip_address}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default ScanDiscoveries;
