import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const NotFound: React.FunctionComponent = () => {
  useTitle(`Page Not Found - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Not Found</h1>
    </PageSizeWrapper>
  );
};

export default NotFound;
