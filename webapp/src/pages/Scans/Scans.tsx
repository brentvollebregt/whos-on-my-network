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
import { useLocalStorage } from "@rehooks/local-storage";

const dateRanges = ["1 Day", "1 Week", "1 Month"];
const dateRangeToInterval: { [key: string]: Interval } = {
  "1 Day": Interval.fromDateTimes(
    DateTime.local()
      .minus({ days: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  ),
  "1 Week": Interval.fromDateTimes(
    DateTime.local()
      .minus({ weeks: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  ),
  "1 Month": Interval.fromDateTimes(
    DateTime.local()
      .minus({ months: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  )
};
const defaultStartDateRange = "1 Day";
const defaultStartDate = dateRangeToInterval[defaultStartDateRange].start;
const defaultEndDate = dateRangeToInterval[defaultStartDateRange].end;

const Scans: React.FunctionComponent = () => {
  useTitle(`Scans - ${Constants.title}`);

  const [scans, setScans] = useState<ScanSummary[] | undefined>(undefined);
  const [startAndEndDates, setStartAndEndDates] = useLocalStorage<
    [string, string]
  >("scans_selectedDates", [defaultStartDate.toISO(), defaultEndDate.toISO()]);

  const getStartDate = () =>
    startAndEndDates === null
      ? defaultStartDate
      : DateTime.fromISO(startAndEndDates[0]);
  const getEndDate = () =>
    startAndEndDates === null
      ? defaultEndDate
      : DateTime.fromISO(startAndEndDates[1]);

  useEffect(() => {
    getScansByFilter(undefined, getStartDate(), getEndDate())
      .then(s => setScans(s))
      .catch(err => console.error(err));
  }, [startAndEndDates]);

  const onScanClick = (scanId: number) => () => navigate(`/scans/${scanId}`);
  const onStartDateSelection = (date: Date | null) =>
    date !== null &&
    setStartAndEndDates([
      DateTime.fromJSDate(date).toISO(),
      getEndDate().toISO()
    ]);
  const onEndDateSelection = (date: Date | null) =>
    date !== null &&
    setStartAndEndDates([
      getStartDate().toISO(),
      DateTime.fromJSDate(date).toISO()
    ]);
  const onDateRangeSelection = (range: string) => () =>
    setStartAndEndDates([
      dateRangeToInterval[range].start.toISO(),
      dateRangeToInterval[range].end.toISO()
    ]);

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
          selected={getStartDate().toJSDate()}
          onChange={onStartDateSelection}
          customInput={
            <FormControl
              style={{
                borderRadius: 0
              }}
            />
          }
          maxDate={getEndDate().toJSDate()}
          dateFormat="dd/MM/yyyy"
        />
        <InputGroup.Text
          style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}
        >
          to
        </InputGroup.Text>
        <DatePicker
          selected={getEndDate().toJSDate()}
          onChange={onEndDateSelection}
          customInput={
            <FormControl
              style={{
                borderRadius: 0
              }}
            />
          }
          minDate={getStartDate().toJSDate()}
          dateFormat="dd/MM/yyyy"
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title="Select Range"
          id="date-range-dropdown"
        >
          {dateRanges.map(dateRange => (
            <Dropdown.Item
              onClick={onDateRangeSelection(dateRange)}
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
