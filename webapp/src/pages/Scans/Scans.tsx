import React, { useEffect, useState } from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { getScansByFilter } from "../../api";
import { ScanSummary } from "../../api/dto";
import { Table, Spinner } from "react-bootstrap";

const Scans: React.FunctionComponent = () => {
  useTitle(`Scans - ${Constants.title}`);

  const [scans, setScans] = useState<ScanSummary[] | undefined>(undefined);

  useEffect(() => {
    getScansByFilter()
      .then(s => setScans(s))
      .catch(err => console.error(err));
  }, []);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Scans: Temporary</h1>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Time</th>
            <th>Network Id</th>
            <th>Devices</th>
            <th>People</th>
            <th>Primary Devices</th>
          </tr>
        </thead>
        <tbody>
          {scans !== undefined &&
            scans.map(scan => (
              <tr key={scan.id}>
                <td>{scan.scan_time.toRelative()}</td>
                <td>{scan.network_id}</td>
                <td>{scan.devices_discovered_count}</td>
                <td>{scan.people_seen_count}</td>
                <td>{scan.primary_devices_seen_count}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      {scans === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Scans;
