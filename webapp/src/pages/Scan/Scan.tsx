import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

interface ScanProps {
  id: number;
}

const Scan: React.FunctionComponent<ScanProps> = ({ id }) => {
  useTitle(`Scans - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Scan ({id}): Temporary</h1>
      <div style={{ background: "lightgrey" }}>Scan details</div>
    </PageSizeWrapper>
  );
};

export default Scan;
