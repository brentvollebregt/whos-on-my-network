import React, { useState } from "react";
import {
  Spinner,
  FormControl,
  Button,
  InputGroup,
  ButtonToolbar
} from "react-bootstrap";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import PeopleTable from "./PeopleTable";
import useAllPeople from "../../hooks/useAllPeople";
import { createPerson } from "../../api";

const People: React.FunctionComponent = () => {
  useTitle(`People - ${Constants.title}`);

  const { people, refresh } = useAllPeople();
  const [textFilter, setTextFilter] = useState<string | undefined>(undefined);

  const onAddPerson = () => createPerson().then(p => refresh());
  const onTextFilter = (event: React.FormEvent<HTMLInputElement>) =>
    setTextFilter(event.currentTarget.value);

  const filteredPeople = people
    ?.slice() // Do not modify the original list
    .filter(p => textFilter === undefined || p.name.indexOf(textFilter) !== -1);

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

      {filteredPeople !== undefined && <PeopleTable people={filteredPeople} />}

      {filteredPeople === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default People;
