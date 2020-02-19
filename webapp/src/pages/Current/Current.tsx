import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { useTitle, navigate } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import { Button, Spinner } from "react-bootstrap";
import {
  runSingleScan,
  getPeopleByFilter,
  getDevicesByFilter
} from "../../api";
import { Scan, PersonSummary, DeviceSummary } from "../../api/dto";
import { genericApiErrorMessage } from "../../utils/toasts";
import { ScanDetail, ScanDiscoveries } from "../Scan";
import { PeopleTable } from "../People";

const Current: React.FunctionComponent = () => {
  useTitle(`Current - ${Constants.title}`);

  const [scanning, setScanning] = useState(false);
  const [scan, setScan] = useState<Scan | undefined>(undefined);
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(
    undefined
  );
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  // Run a single scan
  const runScan = () => {
    setScanning(true);
    setScan(undefined);
    runSingleScan().then(s => {
      setScan(s);
      setScanning(false);
    });
  };

  // Get devices when scan changes
  useEffect(() => {
    if (scan !== undefined) {
      const uniqueDeviceIds = scan.discoveries
        .map(d => d.device_id)
        .filter((v, i, self) => self.indexOf(v) === i);
      getDevicesByFilter(uniqueDeviceIds)
        .then(d => setDevices(d))
        .catch(err => genericApiErrorMessage("devices"));
    }
  }, [scan]);

  // Get people when devices are changed
  useEffect(() => {
    if (devices !== undefined) {
      const uniquePeopleIds = devices
        .filter(d => d.owner_id !== null)
        .map(d => d.owner_id as number)
        .filter((v, i, self) => self.indexOf(v) === i);
      getPeopleByFilter(uniquePeopleIds)
        .then(p => setPeople(p))
        .catch(err => genericApiErrorMessage("people"));
    }
  }, [devices]);

  const goToScan = () => scan !== undefined && navigate(`/scans/${scan.id}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Current</h1>

      <div className="text-center my-3">
        <Button disabled={scanning} onClick={runScan}>
          Run Scan Now
          {scanning && (
            <Spinner animation="border" size="sm" className="ml-2" />
          )}
        </Button>
      </div>

      {scan !== undefined && (
        <>
          <div className="mb-2">
            <ScanDetail scan={scan} />
          </div>

          {people !== undefined ? (
            <div className="mb-2">
              <PeopleTable people={people} />
            </div>
          ) : (
            <div className="text-center mb-2">
              <Spinner animation="border" />
            </div>
          )}

          <div className="text-center mb-2">
            <Button onClick={goToScan}>Go to Scan #{scan.id}</Button>
          </div>

          <div className="mb-3">
            <ScanDiscoveries scan={scan} />
          </div>
        </>
      )}

      {/* <div> TODO Typical device list</div> */}
    </PageSizeWrapper>
  );
};

export default Current;
