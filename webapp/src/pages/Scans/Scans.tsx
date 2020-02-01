import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const Scans: React.FunctionComponent = () => {
  useTitle(`Scans - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Scans: Temporary</h1>
      <div style={{ background: "lightgrey", height: 200 }}>
        Scan table - click to view scan
        <ul>
          <li>Scan time</li>
          <li>Network id</li>
          <li>Devices discovered</li>
          <li>People seen</li>
          <li>Primary devices seen</li>
        </ul>
      </div>
    </PageSizeWrapper>
  );
};

export default Scans;
