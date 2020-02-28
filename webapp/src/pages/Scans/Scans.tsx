import React, { useEffect, useState } from "react";
import Constants from "../../constants";
import { useTitle, navigate } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { getScansByFilter } from "../../api";
import { ScanSummary } from "../../api/dto";
import { Table, Spinner } from "react-bootstrap";
import { DateTime } from "luxon";
import { genericApiErrorMessage } from "../../utils/toasts";
import DateRangeSelector from "../../components/DateRangeSelector";
import useStoredDatePair from "../../hooks/useStoredDatePair";

const defaultStartDate = DateTime.local()
  .minus({ weeks: 1 })
  .startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

const Scans: React.FunctionComponent = () => {
  useTitle(`Scans - ${Constants.title}`);

  const [scans, setScans] = useState<ScanSummary[] | undefined>(undefined);
  const {
    getStartDate,
    getEndDate,
    getStartAndEndDates,
    setStartAndEndDates,
    storedStartAndEndDates
  } = useStoredDatePair("scans", defaultStartDate, defaultEndDate);

  useEffect(() => {
    getScansByFilter(undefined, getStartDate(), getEndDate())
      .then(s => setScans(s))
      .catch(err => genericApiErrorMessage("scans"));
  }, [storedStartAndEndDates]);

  const onScanClick = (scanId: number) => () => navigate(`/scans/${scanId}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Scans</h1>

      <div className="mb-2">
        <DateRangeSelector
          startAndEndDates={getStartAndEndDates()}
          setStartAndEndDates={setStartAndEndDates}
        />
      </div>

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
              <tr
                key={scan.id}
                onClick={onScanClick(scan.id)}
                className="pointer"
              >
                <td title={scan.scan_time.toFormat("FF")}>
                  {scan.scan_time.toRelative()}
                </td>
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
