import React, { useState, useEffect } from "react";
import { Person } from "../../api/dto";
import { updatePersonById } from "../../api";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { showInfoToast } from "../../utils/toasts";

interface PersonDetailProps {
  person: Person;
  setPerson: (person: Person) => void;
}

const PersonDetail: React.FunctionComponent<PersonDetailProps> = ({ person, setPerson }) => {
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    setName(person.name);
    setNote(person.note);
    setDirty(false);
  }, [person]);

  const onNoteChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setNote(event.currentTarget.value);
    setDirty(true);
  };
  const onNameChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setName(event.currentTarget.value);
    setDirty(true);
  };
  const saveChanges = () => {
    if (person !== undefined) {
      updatePersonById(person.id, name, note).then(p => {
        setPerson(p);
        showInfoToast(`Updated ${p.name} (#${p.id})`);
      });
    }
  };

  return (
    <div>
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
              <InputGroup.Text>First Seen</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              value={person.first_seen === null ? "Never" : person.first_seen.toFormat("FF")}
              disabled
            />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Last Seen</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              value={person.last_seen === null ? "Never" : person.last_seen.toRelative() ?? ""}
              title={person.last_seen === null ? "" : person.last_seen.toFormat("FF")}
              disabled
            />
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
              rows="3"
              className="mb-1"
              value={note}
              onChange={onNoteChange}
            />
            <div style={{ textAlign: "right" }}>
              <Button variant="primary" disabled={!dirty} onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;
