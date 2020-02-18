import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const Current: React.FunctionComponent = () => {
  useTitle(`Current - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Current</h1>

      <div>Run Scan button (is disabled while a scan occurs)</div>

      <div>
        Possibly some summary stats? (time, network, device count, people count)
      </div>

      <div>Show people on the network using primary devices</div>

      <div>Typical device list</div>
    </PageSizeWrapper>
  );
};

export default Current;
