import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { Person as PersonDTO } from "../../api/dto";
import { getPersonById, updatePersonById } from "../../api";
import {
  Spinner,
  Form,
  Button,
  InputGroup,
  FormControl
} from "react-bootstrap";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  const [person, setPerson] = useState<PersonDTO | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [nameDirty, setNameDirty] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [noteDirty, setNoteDirty] = useState<boolean>(false);

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
    setNoteDirty(true);
  };
  const onNameChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setName(event.currentTarget.value);
    setNameDirty(true);
  };
  const saveName = () => {
    if (person !== undefined) {
      updatePersonById(id, name, person.note).then(p => {
        setPerson(p);
        setName(p === undefined ? "" : p.name);
        setNote(p === undefined ? "" : p.note);
        setNameDirty(false);
      });
    }
  };
  const saveNote = () => {
    if (person !== undefined) {
      updatePersonById(id, person.name, note).then(p => {
        setPerson(p);
        setName(p === undefined ? "" : p.name);
        setNote(p === undefined ? "" : p.note);
        setNoteDirty(false);
      });
    }
  };

  return (
    <PageSizeWrapper>
      {person === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          <h1 className="text-center">
            {person.name} (#{person.id})
          </h1>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Name</InputGroup.Text>
            </InputGroup.Prepend>
            <InputGroup.Append>
              <FormControl
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                value={name}
                onChange={onNameChange}
              />
            </InputGroup.Append>
            <Button
              className="ml-2"
              variant="primary"
              disabled={!nameDirty}
              onClick={saveName}
            >
              Save Name
            </Button>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: "none"
              }}
            >
              First Seen
            </InputGroup.Text>
            <FormControl
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
              value={person.first_seen.toFormat("FF")}
            />
            <InputGroup.Text
              style={{
                borderRadius: 0,
                borderLeft: "none",
                borderRight: "none"
              }}
            >
              Last Seen
            </InputGroup.Text>
            <FormControl
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
              value={person.last_seen.toRelative() ?? ""}
              title={person.last_seen.toFormat("FF")}
            />
          </InputGroup>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              value={note}
              onChange={onNoteChange}
            />
          </Form.Group>
          <Button variant="primary" disabled={!noteDirty} onClick={saveNote}>
            Save Note
          </Button>
        </>
      )}
    </PageSizeWrapper>
  );
};

export default Person;
