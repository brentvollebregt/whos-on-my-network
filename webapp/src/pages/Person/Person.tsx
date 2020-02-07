import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import PersonDetails from "./PersonDetails";
import PersonDevices from "./PersonDevices";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <PersonDetails id={id} />
      <div className="mt-5">
        <PersonDevices id={id} />
      </div>
    </PageSizeWrapper>
  );
};

export default Person;
