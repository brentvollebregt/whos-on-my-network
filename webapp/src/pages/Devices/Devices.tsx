import React, { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  ButtonToolbar,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown
} from "react-bootstrap";
import { useTitle, navigate } from "hookrouter";
import Constants from "../../constants";
import { DeviceSummary, PersonSummary } from "../../api/dto";
import { getDevicesByFilter, getPeopleByFilter } from "../../api";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const Devices: React.FunctionComponent = () => {
  useTitle(`Devices - ${Constants.title}`);

  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);
  const [textFilter, setTextFilter] = useState<string | undefined>(undefined);
  const [ownerFilter, setOwnerFilter] = useState<number | null>(null);
  const [isPrimaryFilter, setIsPrimaryFilter] = useState<boolean | null>(null);

  useEffect(() => {
    getDevicesByFilter()
      .then(d => setDevices(d))
      .catch(err => console.error(err));

    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => console.error(err));
  }, []);

  const onDeviceClick = (deviceId: number) => () =>
    navigate(`/devices/${deviceId}`);
  const onTextFilter = (event: React.FormEvent<HTMLInputElement>) =>
    setTextFilter(event.currentTarget.value);
  const onOwnerFilter = (ownerId: number | null) => () =>
    setOwnerFilter(ownerId);
  const onIsPrimaryFilter = (value: boolean | null) => () =>
    setIsPrimaryFilter(value);

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

  const sortedAndFilteredDevices = devices
    ?.slice() // Do not modify the original list
    .filter(
      d =>
        (textFilter === undefined ||
          d.name.indexOf(textFilter) !== -1 ||
          d.mac_address.indexOf(textFilter) !== -1) && // Text filter
        (ownerFilter === null || d.owner_id === ownerFilter) && // Owner filter
        (isPrimaryFilter === null || d.is_primary === isPrimaryFilter) // Primary filter
    )
    .sort((a, b) => (a.mac_address > b.mac_address ? 1 : -1)) // Initially sort by MAC address
    .sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      } else if (a.name === "") {
        return 1;
      } else if (b.name === "") {
        return -1;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    }); // Then sort by names (empty names are lowest)

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Devices</h1>

      <ButtonToolbar className="mb-3">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Search</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="text"
            placeholder="Device Name / MAC"
            onChange={onTextFilter}
          />
        </InputGroup>
        <DropdownButton
          className="ml-1"
          id="owner-filter-dropdown"
          title={`Owner: ${
            ownerFilter === null ? "" : getOwnerName(ownerFilter)
          }`}
        >
          <Dropdown.Item onClick={onOwnerFilter(null)}>
            Don't Filter
          </Dropdown.Item>
          {people !== undefined &&
            people.map(p => (
              <Dropdown.Item key={p.id} onClick={onOwnerFilter(p.id)}>
                {p.name}
              </Dropdown.Item>
            ))}
        </DropdownButton>
        <DropdownButton
          className="ml-1"
          id="is_primary-filter-dropdown"
          title={`Primary: ${
            isPrimaryFilter === null ? "" : isPrimaryFilter ? "✔️" : "❌"
          }`}
        >
          <Dropdown.Item onClick={onIsPrimaryFilter(null)}>
            Don't Filter
          </Dropdown.Item>
          <Dropdown.Item onClick={onIsPrimaryFilter(true)}>✔️</Dropdown.Item>
          <Dropdown.Item onClick={onIsPrimaryFilter(false)}>❌</Dropdown.Item>
        </DropdownButton>
      </ButtonToolbar>

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
          {sortedAndFilteredDevices !== undefined &&
            sortedAndFilteredDevices.map(device => (
              <tr
                key={device.id}
                onClick={onDeviceClick(device.id)}
                className="pointer"
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

      {devices === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Devices;
