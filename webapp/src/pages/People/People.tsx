import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import { PersonSummary } from "../../api/dto";
import { getPeopleByFilter } from "../../api";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const People: React.FunctionComponent = () => {
  useTitle(`People - ${Constants.title}`);

  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  useEffect(() => {
    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => console.error(err));
  }, []);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">People: Temporary</h1>
      <div style={{ background: "grey" }}>Add person + filter</div>

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
