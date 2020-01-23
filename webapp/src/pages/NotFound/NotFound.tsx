import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";

const NotFound: React.FunctionComponent = () => {
  useTitle(`Page Not Found - ${Constants.title}`);

  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
};

export default NotFound;
