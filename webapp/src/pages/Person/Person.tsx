import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { navigate, useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import PersonDetail from "./PersonDetail";
import PersonDevices from "./PersonDevices";
import { Person as PersonDTO } from "../../api/dto";
import { getPersonById, deletePersonById } from "../../api";
import { Button, Spinner } from "react-bootstrap";
import { genericApiErrorMessage, showErrorToast, showInfoToast } from "../../utils/toasts";
import PersonDiscoveriesPlot from "./PersonDiscoveriesPlot";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  const [person, setPerson] = useState<PersonDTO | undefined>(undefined);
  useTitle(`Person: ${person === undefined ? id : person.name} - ${Constants.title}`);

  useEffect(() => {
    getPersonById(id)
      .then(p => setPerson(p))
      .catch(err => genericApiErrorMessage(`person #${id}`));
  }, [id]);

  const updatePerson = (p: PersonDTO) => setPerson(p);

  const onDeletePerson = async () => {
    const answer = window.confirm(`Are you sure you want to delete "${person?.name}"?`);
    if (answer) {
      const deleted = await deletePersonById(id);
      if (deleted) {
        navigate(`/people`);
        showInfoToast(`Successfully deleted "${person?.name}"`);
      } else {
        showErrorToast(
          `Failed to deleted "${person?.name}"`,
          "Unknown server error - maybe they don't exist anymore?"
        );
      }
    }
  };

  return (
    <PageSizeWrapper>
      <h1 className="text-center mb-4">
        {person?.name} (#{id})
      </h1>

      {person !== undefined && (
        <>
          <PersonDetail person={person} setPerson={updatePerson} />
          <div className="mt-4">
            <PersonDiscoveriesPlot person={person} />
          </div>
          <div className="mt-4">
            <PersonDevices id={id} />
          </div>
        </>
      )}

      {person === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}

      {person !== undefined && (
        <div className="mt-5 text-center">
          <Button variant="outline-danger" onClick={onDeletePerson}>
            Delete Person
          </Button>
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Person;
