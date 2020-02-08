import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import PersonDetail from "./PersonDetail";
import PersonDevices from "./PersonDevices";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <PersonDetail id={id} />
      <div className="mt-4">
        <PersonDevices id={id} />
      </div>
    </PageSizeWrapper>
  );
};

export default Person;
