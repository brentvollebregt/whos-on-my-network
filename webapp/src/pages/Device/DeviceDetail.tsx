import React, { useEffect, useState } from "react";
import { Device, Person } from "../../api/dto";
import { updateDeviceById, getPeopleByFilter } from "../../api";
import {
  Spinner,
  InputGroup,
  FormControl,
  Form,
  Button,
  DropdownButton,
  Dropdown
} from "react-bootstrap";

interface DeviceDetailProps {
  device: Device;
  updateDevice: (device: Device) => void;
}

const DeviceDetail: React.FunctionComponent<DeviceDetailProps> = ({
  device,
  updateDevice
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState<string>(device.name);
  const [note, setNote] = useState<string>(device.note);
  const [ownerId, setOwnerId] = useState<number | null>(device.owner_id);
  const [isPrimary, setIsPrimary] = useState<boolean | undefined>(
    device.is_primary
  );
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setName(device.name);
    setNote(device.note);
    setOwnerId(device.owner_id);
    setIsPrimary(device.is_primary);
    setDirty(false);
  }, [device]);

  const onNoteChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setNote(event.currentTarget.value);
    setDirty(true);
  };
  const onNameChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setName(event.currentTarget.value);
    setDirty(true);
  };
  const onOwnerIdChange = (ownerId: number | null) => () => {
    setOwnerId(ownerId);
    setDirty(true);
  };
  const onIsPrimaryChange = (isPrimary: boolean) => () => {
    setIsPrimary(isPrimary);
    setDirty(true);
  };
  const saveChanges = () => {
    if (device !== undefined && isPrimary !== undefined) {
      updateDeviceById(device.id, name, note, ownerId, isPrimary).then(d => {
        updateDevice(d);
      });
    }
  };

  return (
    <div>
      {device === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          <h1 className="text-center mb-4">
            {device.name === ""
              ? device.mac_address.toUpperCase()
              : device.name}{" "}
            (#{device.id})
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gridGap: 20
            }}
          >
            <div>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>MAC Address</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={device.mac_address.toUpperCase()}
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>First Seen</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={device.first_seen.toFormat("FF")}
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Last Seen</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={device.last_seen.toRelative() ?? ""}
                  title={device.last_seen.toFormat("FF")}
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Owner</InputGroup.Text>
                </InputGroup.Prepend>
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={
                    ownerId === null
                      ? "Not Set"
                      : people.length === 0
                      ? ""
                      : people.find(x => x.id === ownerId)?.name
                  }
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item onClick={onOwnerIdChange(null)}>
                    Not Set
                  </Dropdown.Item>
                  {people.map(person => (
                    <Dropdown.Item
                      key={person.id}
                      onClick={onOwnerIdChange(person.id)}
                    >
                      {person.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Primary</InputGroup.Text>
                </InputGroup.Prepend>
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={isPrimary === undefined ? "" : isPrimary ? "✔️" : "❌"}
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item onClick={onIsPrimaryChange(true)}>
                    ✔️
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onIsPrimaryChange(false)}>
                    ❌
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </div>
            <div>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={name} onChange={onNameChange} />
              </InputGroup>

              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="4"
                  className="mb-1"
                  value={note}
                  onChange={onNoteChange}
                />
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="primary"
                    disabled={!dirty}
                    onClick={saveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form.Group>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceDetail;
