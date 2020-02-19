import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Table,
  DropdownButton,
  Dropdown,
  ButtonToolbar
} from "react-bootstrap";
import { getDevicesByFilter, getPeopleByFilter } from "../../api";
import { DeviceSummary, PersonSummary } from "../../api/dto";
import { genericApiErrorMessage } from "../../utils/toasts";
import { EntityType } from "./ChartWrapper";
import "./Home.css";

interface EntitySelectionProps {
  entityType: EntityType;
  setEntityType: (entityType: EntityType) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

const EntitySelection: React.FC<EntitySelectionProps> = ({
  entityType,
  setEntityType,
  selectedIds,
  setSelectedIds
}) => {
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  // Fetch all devices and people
  useEffect(() => {
    getDevicesByFilter()
      .then(d => setDevices(d))
      .catch(err => genericApiErrorMessage("devices"));

    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => genericApiErrorMessage("people"));
  }, []);

  // Reset selection on an entity type change
  useEffect(() => {
    if (entityType === "device") {
      setSelectedIds(devices?.map(d => d.id) || []);
    } else if (entityType === "person") {
      setSelectedIds(people?.map(p => p.id) || []);
    }
  }, [entityType]);

  const selectAll = () => {
    if (entityType === "device" && devices !== undefined) {
      setSelectedIds(devices.map(d => d.id));
    } else if (entityType === "person" && people !== undefined) {
      setSelectedIds(people.map(p => p.id));
    }
  };
  const deselectAll = () => setSelectedIds([]);

  // When devices and people load, set the selected ids
  useEffect(() => {
    selectAll();
  }, [devices, people]);

  const getDeviceOwnerName = (ownerId: number | null) => {
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

  const onEntityTypeSelection = (entityType: EntityType) => () =>
    setEntityType(entityType);

  const onEntityClick = (entityId: number) => () => {
    if (selectedIds.indexOf(entityId) === -1) {
      setSelectedIds([...selectedIds, entityId]);
    } else {
      setSelectedIds([...selectedIds.filter(id => id !== entityId)]);
    }
  };

  return (
    <div>
      <ButtonToolbar className="justify-content-between mb-2">
        <DropdownButton
          id="dropdown-basic-button"
          title={`View by: ${entityType === "device" ? "Device" : "Person"}`}
        >
          <Dropdown.Item onClick={onEntityTypeSelection("device")}>
            Device
          </Dropdown.Item>
          <Dropdown.Item onClick={onEntityTypeSelection("person")}>
            Person
          </Dropdown.Item>
        </DropdownButton>

        <ButtonGroup>
          <Button onClick={selectAll}>Select All</Button>
          <Button onClick={deselectAll}>Deselect All</Button>
        </ButtonGroup>
      </ButtonToolbar>

      {entityType === "device" && (
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
                  onClick={onEntityClick(device.id)}
                  className={`pointer ${
                    selectedIds.indexOf(device.id) !== -1 ? "" : "unselected"
                  }`}
                >
                  <td className="mac-address">{device.mac_address}</td>
                  <td>{device.name}</td>
                  <td>{getDeviceOwnerName(device.owner_id)}</td>
                  <td>{device.is_primary ? "✔️" : "❌"}</td>
                  <td>{device.first_seen.toFormat("ff")}</td>
                  <td title={device.last_seen.toFormat("FF")}>
                    {device.last_seen.toRelative()}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {entityType === "person" && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Devices</th>
              <th>First Seen</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {people !== undefined &&
              people.map(person => (
                <tr
                  key={person.id}
                  onClick={onEntityClick(person.id)}
                  className={`pointer ${
                    selectedIds.indexOf(person.id) !== -1 ? "" : "unselected"
                  }`}
                >
                  <td>{person.name}</td>
                  <td>{person.device_count}</td>
                  <td>
                    {person.first_seen === null
                      ? "Never"
                      : person.first_seen.toFormat("ff")}
                  </td>
                  <td
                    title={
                      person.last_seen === null
                        ? "Never"
                        : person.last_seen.toFormat("ff")
                    }
                  >
                    {person.last_seen === null
                      ? "Never"
                      : person.last_seen.toRelative()}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default EntitySelection;
