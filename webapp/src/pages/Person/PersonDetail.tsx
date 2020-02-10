import React, { useState, useEffect } from "react";
import { Person } from "../../api/dto";
import { getPersonById, updatePersonById } from "../../api";
import {
  Spinner,
  Form,
  Button,
  InputGroup,
  FormControl
} from "react-bootstrap";

interface PersonDetailProps {
  id: number;
}

const PersonDetail: React.FunctionComponent<PersonDetailProps> = ({ id }) => {
  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    getPersonById(id)
      .then(p => {
        setPerson(p);
        setName(p === undefined ? "" : p.name);
        setNote(p === undefined ? "" : p.note);
      })
      .catch(err => console.error(err));
  }, []);

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
      updatePersonById(id, name, note).then(p => {
        setPerson(p);
        setName(p === undefined ? "" : p.name);
        setNote(p === undefined ? "" : p.note);
        setDirty(false);
      });
    }
  };

  return (
    <div>
      {person === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          <h1 className="text-center mb-4">
            {person.name} (#{person.id})
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
                  <InputGroup.Text>First Seen</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={
                    person.first_seen === null
                      ? "Never"
                      : person.first_seen.toFormat("FF")
                  }
                  disabled
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Last Seen</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  value={
                    person.last_seen === null
                      ? "Never"
                      : person.last_seen.toRelative() ?? ""
                  }
                  title={
                    person.last_seen === null
                      ? ""
                      : person.last_seen.toFormat("FF")
                  }
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

export default PersonDetail;
