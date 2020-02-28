import React, { useState, useEffect } from "react";
import { Scan as ScanDTO } from "../../api/dto";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import ScanDetail from "./ScanDetail";
import ScanDiscoveries from "./ScanDiscoveries";
import { getScanById } from "../../api";
import { Spinner } from "react-bootstrap";
import { genericApiErrorMessage } from "../../utils/toasts";

interface ScanProps {
  id: number;
}

const Scan: React.FunctionComponent<ScanProps> = ({ id }) => {
  useTitle(`Scan ${id} - ${Constants.title}`);

  const [scan, setScan] = useState<ScanDTO | undefined>(undefined);

  useEffect(() => {
    getScanById(id)
      .then(s => {
        setScan(s);
      })
      .catch(err => genericApiErrorMessage(`scan #${id}`));
  }, [id]);

  return (
    <PageSizeWrapper>
      <h1 className="text-center mb-4">Scan #{id}</h1>

      {scan !== undefined && (
        <>
          <ScanDetail scan={scan} />
          <div className="mt-4">
            <ScanDiscoveries scan={scan} />
          </div>
        </>
      )}

      {scan === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Scan;
