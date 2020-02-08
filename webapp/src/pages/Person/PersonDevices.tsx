import React, { useState, useEffect } from "react";
import { DeviceSummary } from "../../api/dto";
import { getDevicesByFilter } from "../../api";
import { Table } from "react-bootstrap";
import { navigate } from "hookrouter";

interface PersonDevicesProps {
  id: number;
}

const PersonDevices: React.FunctionComponent<PersonDevicesProps> = ({ id }) => {
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );

  useEffect(() => {
    getDevicesByFilter(undefined, undefined, id, undefined)
      .then(d => setDevices(d))
      .catch(err => console.error(err));
  }, []);

  const onDeviceClick = (deviceId: number) => () =>
    navigate(`/devices/${deviceId}`);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>MAC Address</th>
          <th>Name</th>
          <th>Is Primary</th>
          <th>First Seen</th>
          <th>Last Seen</th>
        </tr>
      </thead>
      <tbody>
        {devices !== undefined &&
          devices.map(device => (
            <tr key={device.id} onClick={onDeviceClick(device.id)}>
              <td>{device.mac_address}</td>
              <td>{device.name}</td>
              <td>{device.is_primary ? "✔️" : "❌"}</td>
              <td>{device.first_seen.toFormat("ff")}</td>
              <td>{device.last_seen.toRelative()}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default PersonDevices;
