import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import ScanDetail from "./ScanDetail";
import ScanDiscoveries from "./ScanDiscoveries";

interface ScanProps {
  id: number;
}

const Scan: React.FunctionComponent<ScanProps> = ({ id }) => {
  useTitle(`Scans - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <ScanDetail id={id} />
      <div className="mt-4">
        <ScanDiscoveries id={id} />
      </div>
    </PageSizeWrapper>
  );
};

export default Scan;
