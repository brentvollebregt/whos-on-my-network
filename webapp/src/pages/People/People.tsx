import React, { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  FormControl,
  Button,
  InputGroup,
  ButtonToolbar
} from "react-bootstrap";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import { PersonSummary } from "../../api/dto";
import { getPeopleByFilter, createPerson } from "../../api";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const People: React.FunctionComponent = () => {
  useTitle(`People - ${Constants.title}`);

  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  const getPeople = () => {
    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getPeople();
  }, []);

  const onAddPerson = () => {
    createPerson().then(p => getPeople());
  };

  return (
    <PageSizeWrapper>
      <h1 className="text-center">People</h1>

      <ButtonToolbar className="mb-3 justify-content-between">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Search</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="text" placeholder="Person Name" />
        </InputGroup>
        <Button variant="outline-secondary" onClick={onAddPerson}>
          Add Person
        </Button>
      </ButtonToolbar>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            {/* <th>Device Count</th> */}
            {/* <th>Primary Device Count</th> */}
            <th>First Seen</th>
            <th>Last Seen</th>
            {/* <th>Truncated note</th> */}
          </tr>
        </thead>
        <tbody>
          {people !== undefined &&
            people.map(person => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.first_seen.toISO()}</td>
                <td>{person.last_seen.toISO()}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      {people === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default People;
