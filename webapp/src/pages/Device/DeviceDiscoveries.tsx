import React, { useState, useEffect } from "react";
import { Device, ScanSummary } from "../../api/dto";
import { Table } from "react-bootstrap";
import { navigate } from "hookrouter";
import { getScansByFilter } from "../../api";

interface DeviceDiscoveriesProps {
  device: Device;
}

const DeviceDiscoveries: React.FunctionComponent<DeviceDiscoveriesProps> = ({
  device
}) => {
  const [scans, setScans] = useState<ScanSummary[] | undefined>(undefined);

  useEffect(() => {
    getScansByFilter(device.last_10_discoveries.map(d => d.scan_id))
      .then(s => setScans(s))
      .catch(err => console.error(err));
  }, [device.last_10_discoveries]);

  const getScanTime = (scanId: number) => {
    if (scans === undefined) {
      return "";
    }
    const scan = scans.find(s => s.id === scanId);
    return scan === undefined ? "NOT FOUND" : scan.scan_time.toFormat("FF");
  };
  const getScanNetworkId = (scanId: number) => {
    if (scans === undefined) {
      return "";
    }
    const scan = scans.find(s => s.id === scanId);
    return scan === undefined ? "NOT FOUND" : scan.network_id;
  };

  const onDiscoveryClick = (scanId: number) => () =>
    navigate(`/scans/${scanId}`);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Time</th>
          <th>Network Id</th>
          <th>Hostname</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        {device.last_10_discoveries !== undefined &&
          device.last_10_discoveries.map(discovery => (
            <tr
              key={discovery.id}
              onClick={onDiscoveryClick(discovery.scan_id)}
              className="pointer"
            >
              <td>{getScanTime(discovery.scan_id)}</td>
              <td>{getScanNetworkId(discovery.scan_id)}</td>
              <td>{discovery.hostname}</td>
              <td>{discovery.ip_address}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default DeviceDiscoveries;
