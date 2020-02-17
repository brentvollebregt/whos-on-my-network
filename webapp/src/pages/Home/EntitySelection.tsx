import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { getDevicesByFilter, getPeopleByFilter } from "../../api";
import Constants from "../../constants";
import { DeviceSummary, PersonSummary } from "../../api/dto";
import { genericApiErrorMessage } from "../../utils/toasts";
import "./Home.css";

interface EntitySelectionProps {
  entityType: "device" | "person";
  setEntityType: (entityType: "device" | "person") => void;
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

  // When devices and people load, set the selected ids
  useEffect(() => {
    if (entityType === "device" && devices !== undefined) {
      setSelectedIds(devices.map(d => d.id));
    } else if (entityType === "person" && people !== undefined) {
      setSelectedIds(people.map(p => p.id));
    }
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

  const onEntityClick = (entityId: number) => () => {
    if (selectedIds.indexOf(entityId) === -1) {
      setSelectedIds([...selectedIds, entityId]);
    } else {
      setSelectedIds([...selectedIds.filter(id => id !== entityId)]);
    }
  };

  return (
    <div>
      <div>
        <div>{/* TODO Entity selector on the left */}</div>
        <div>{/* TODO Select all/none on the right */}</div>
      </div>

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
    </div>
  );
};

export default EntitySelection;
