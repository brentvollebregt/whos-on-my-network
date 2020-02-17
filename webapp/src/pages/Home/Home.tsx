import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { getDevicesByFilter, getPeopleByFilter } from "../../api";
import Constants from "../../constants";
import { Interval, DateTime } from "luxon";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { DeviceSummary, PersonSummary } from "../../api/dto";
import { genericApiErrorMessage } from "../../utils/toasts";
import "./Home.css";

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

const Home: React.FunctionComponent = () => {
  useTitle(`Home - ${Constants.title}`);

  const [selectedDateRange, setSelectedDateRange] = useState("1 Week");
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);
  const [disabledIds, setDisabledIds] = useState<number[]>([]);

  useEffect(() => {
    getDevicesByFilter()
      .then(d => setDevices(d))
      .catch(err => genericApiErrorMessage("devices"));

    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => genericApiErrorMessage("people"));
  }, []);

  const getOwnerName = (ownerId: number | null) => {
    if (people === undefined || ownerId === null) {
      return ""; // Loading people or no owner
    }
    const person = people.find(x => x.id === ownerId);
    if (person === undefined) {
      console.error(`Not able to find person ${ownerId}`);
      return "Not Found"; // Should not occur
    } else {
      return person.name;
    }
  };

  const dateRangeClick = (dateRange: string) => () =>
    setSelectedDateRange(dateRange);

  const onDeviceClick = (deviceId: number) => () => {
    if (disabledIds.indexOf(deviceId) === -1) {
      setDisabledIds([...disabledIds, deviceId]);
    } else {
      setDisabledIds([...disabledIds.filter(id => id !== deviceId)]);
    }
  };

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Overview of Scans</h1>

      {/* TODO Put a date selector on the right */}
      <div style={{ textAlign: "right" }}>
        <ButtonGroup aria-label="Basic example">
          {dateRanges.map(r => (
            <Button
              variant="primary"
              active={r === selectedDateRange}
              onClick={dateRangeClick(r)}
            >
              {r}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* TODO Graph */}
      <div
        className="mb-2"
        style={{ background: "lightgrey", marginTop: 5, height: 200 }}
      >
        Some sort of chart showing device discoveries
      </div>

      {/* TODO Entity selector on the left */}
      {/* TODO Select all/none on the right */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>MAC Address</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Is Primary</th>
            <th>First Seen</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {devices !== undefined &&
            devices.map(device => (
              <tr
                key={device.id}
                onClick={onDeviceClick(device.id)}
                className={`pointer ${
                  disabledIds.indexOf(device.id) !== -1 ? "unselected" : ""
                }`}
              >
                <td className="mac-address">{device.mac_address}</td>
                <td>{device.name}</td>
                <td>{getOwnerName(device.owner_id)}</td>
                <td>{device.is_primary ? "✔️" : "❌"}</td>
                <td>{device.first_seen.toFormat("ff")}</td>
                <td title={device.last_seen.toFormat("FF")}>
                  {device.last_seen.toRelative()}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </PageSizeWrapper>
  );
};

export default Home;
