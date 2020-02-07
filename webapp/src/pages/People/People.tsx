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
import { useTitle, navigate } from "hookrouter";
import { PersonSummary } from "../../api/dto";
import { getPeopleByFilter, createPerson } from "../../api";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const People: React.FunctionComponent = () => {
  useTitle(`People - ${Constants.title}`);

  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);
  const [textFilter, setTextFilter] = useState<string | undefined>(undefined);

  const getPeople = () => {
    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getPeople();
  }, []);

  const onAddPerson = () => createPerson().then(p => getPeople());
  const onPersonClick = (personId: number) => () =>
    navigate(`/people/${personId}`);
  const onTextFilter = (event: React.FormEvent<HTMLInputElement>) =>
    setTextFilter(event.currentTarget.value);

  const sortedPeople = people
    ?.slice()
    .sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? -1 : 1));
  const filteredPeople = sortedPeople?.filter(
    p => textFilter === undefined || p.name.indexOf(textFilter) !== -1
  );

  return (
    <PageSizeWrapper>
      <h1 className="text-center">People</h1>

      <ButtonToolbar className="mb-3 justify-content-between">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Search</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="text"
            placeholder="Person Name"
            onChange={onTextFilter}
          />
        </InputGroup>
        <Button variant="outline-secondary" onClick={onAddPerson}>
          Add Person
        </Button>
      </ButtonToolbar>

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
          {filteredPeople !== undefined &&
            filteredPeople.map(person => (
              <tr key={person.id} onClick={onPersonClick(person.id)}>
                <td>{person.name}</td>
                <td>{person.device_count}</td>
                <td>{person.first_seen.toFormat("ff")}</td>
                <td>{person.last_seen.toRelative()}</td>
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
