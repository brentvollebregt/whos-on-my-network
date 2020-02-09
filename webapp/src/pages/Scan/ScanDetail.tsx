import React, { useEffect, useState } from "react";
import { Device, Person, Scan } from "../../api/dto";
import {
  getDeviceById,
  updateDeviceById,
  getPeopleByFilter,
  getScanById
} from "../../api";
import {
  Spinner,
  InputGroup,
  FormControl,
  Form,
  Button,
  DropdownButton,
  Dropdown
} from "react-bootstrap";

interface ScanDetailProps {
  id: number;
}

const ScanDetail: React.FunctionComponent<ScanDetailProps> = ({ id }) => {
  const [scan, setScan] = useState<Scan | undefined>(undefined);

  useEffect(() => {
    getScanById(id)
      .then(s => {
        setScan(s);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {scan === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          <h1 className="text-center mb-4">#{scan.id}</h1>

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
            <div>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>Network Id</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={scan.network_id} disabled />
              </InputGroup>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScanDetail;
