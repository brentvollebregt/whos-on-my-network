import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import PersonDetail from "./PersonDetail";
import PersonDevices from "./PersonDevices";
import { Person as PersonDTO } from "../../api/dto";
import { getPersonById } from "../../api";
import { Spinner } from "react-bootstrap";
import { genericApiErrorMessage } from "../../utils/toasts";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  const [person, setPerson] = useState<PersonDTO | undefined>(undefined);

  useEffect(() => {
    getPersonById(id)
      .then(p => setPerson(p))
      .catch(err => genericApiErrorMessage(`person #${id}`));
  }, [id]);

  const updatePerson = (p: PersonDTO) => setPerson(p);

  return (
    <PageSizeWrapper>
      <h1 className="text-center mb-4">
        {person?.name} (#{id})
      </h1>

      {person !== undefined ? (
        <PersonDetail person={person} setPerson={updatePerson} />
      ) : (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}

      <div className="mt-4">
        <PersonDevices id={id} />
      </div>
    </PageSizeWrapper>
  );
};

export default Person;
