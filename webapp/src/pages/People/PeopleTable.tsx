import React from "react";
import { Table } from "react-bootstrap";
import { navigate } from "hookrouter";
import { PersonSummary } from "../../api/dto";
import { sortPeople } from "../../utils/sorting";

interface PeopleTableProps {
  people: PersonSummary[];
}

const PeopleTable: React.FunctionComponent<PeopleTableProps> = ({ people }) => {
  const onPersonClick = (personId: number) => () => navigate(`/people/${personId}`);

  const sortedPeople = sortPeople(people);

  return (
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
        {sortedPeople !== undefined &&
          sortedPeople.map(person => (
            <tr key={person.id} onClick={onPersonClick(person.id)} className="pointer">
              <td>{person.name}</td>
              <td>{person.device_count}</td>
              <td>{person.first_seen === null ? "Never" : person.first_seen.toFormat("ff")}</td>
              <td title={person.last_seen === null ? "Never" : person.last_seen.toFormat("ff")}>
                {person.last_seen === null ? "Never" : person.last_seen.toRelative()}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default PeopleTable;
