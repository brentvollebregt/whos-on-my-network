import React, { useState, useEffect } from "react";
import { Scan as ScanDTO } from "../../api/dto";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import ScanDetail from "./ScanDetail";
import ScanDiscoveries from "./ScanDiscoveries";
import { getScanById } from "../../api";

interface ScanProps {
  id: number;
}

const Scan: React.FunctionComponent<ScanProps> = ({ id }) => {
  useTitle(`Scans - ${Constants.title}`);

  const [scan, setScan] = useState<ScanDTO | undefined>(undefined);

  useEffect(() => {
    getScanById(id)
      .then(s => {
        setScan(s);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <PageSizeWrapper>
      <ScanDetail scan={scan} />
      <div className="mt-4">
        <ScanDiscoveries scan={scan} />
      </div>
    </PageSizeWrapper>
  );
};

export default Scan;
