import React, { useEffect, useState } from "react";
import Constants from "../../constants";
import { useTitle, navigate } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { getScansByFilter } from "../../api";
import { ScanSummary } from "../../api/dto";
import {
  Table,
  Spinner,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime, Interval } from "luxon";

const dateRanges = ["1 Day", "1 Week", "1 Month"];
const dateRangeToInterval: { [key: string]: Interval } = {
  "1 Day": Interval.fromDateTimes(
    DateTime.local().minus({ days: 1 }),
    DateTime.local()
  ),
  "1 Week": Interval.fromDateTimes(
    DateTime.local().minus({ weeks: 1 }),
    DateTime.local()
  ),
  "1 Month": Interval.fromDateTimes(
    DateTime.local().minus({ months: 1 }),
    DateTime.local()
  )
};

const Scans: React.FunctionComponent = () => {
  useTitle(`Scans - ${Constants.title}`);

  const [scans, setScans] = useState<ScanSummary[] | undefined>(undefined);
  const [fromDate, setFromDate] = useState<DateTime>(
    dateRangeToInterval["1 Day"].start
  );
  const [toDate, setToDate] = useState<DateTime>(
    dateRangeToInterval["1 Day"].end
  );

  useEffect(() => {
    getScansByFilter(fromDate, toDate)
      .then(s => setScans(s))
      .catch(err => console.error(err));
  }, [fromDate, toDate]);

  const onScanClick = (scanId: number) => () => navigate(`/scans/${scanId}`);
  const onStartDateSelection = (date: Date | null) =>
    date !== null && setFromDate(DateTime.fromJSDate(date));
  const onEndDateSelection = (date: Date | null) =>
    date !== null && setToDate(DateTime.fromJSDate(date));
  const onDateRangeSelection = (range: string) => {
    setFromDate(dateRangeToInterval[range].start);
    setToDate(dateRangeToInterval[range].end);
  };

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Scans</h1>

      <InputGroup className="mb-3">
        <InputGroup.Text
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: "none"
          }}
        >
          From
        </InputGroup.Text>
        <DatePicker
          selected={fromDate.toJSDate()}
          onChange={onStartDateSelection}
          customInput={
            <FormControl
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
          }
        />
        <InputGroup.Text
          style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}
        >
          to
        </InputGroup.Text>
        <DatePicker
          selected={toDate.toJSDate()}
          onChange={onEndDateSelection}
          customInput={
            <FormControl
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
            />
          }
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title="Select Range"
          id="date-range-dropdown"
        >
          {dateRanges.map(dateRange => (
            <Dropdown.Item
              onClick={() => onDateRangeSelection(dateRange)}
              key={dateRange}
            >
              {dateRange}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </InputGroup>

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
              <tr key={scan.id} onClick={onScanClick(scan.id)}>
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

      <div>TODO Paging</div>
    </PageSizeWrapper>
  );
};

export default Scans;
