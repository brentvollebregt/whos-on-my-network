import React from "react";
import { Scan } from "../../api/dto";
import { InputGroup, FormControl } from "react-bootstrap";

interface ScanDetailProps {
  scan: Scan;
}

const ScanDetail: React.FunctionComponent<ScanDetailProps> = ({ scan }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: 20
      }}
    >
      <div>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Time</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl value={scan.scan_time.toFormat("FF")} disabled />
        </InputGroup>
      </div>
      <div />
    </div>
  );
};

export default ScanDetail;
