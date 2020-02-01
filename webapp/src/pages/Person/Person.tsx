import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Person ({id}): Temporary</h1>
      <div style={{ background: "grey" }}>Person details</div>
    </PageSizeWrapper>
  );
};

export default Person;
