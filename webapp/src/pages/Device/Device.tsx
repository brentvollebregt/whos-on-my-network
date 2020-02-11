import React, { useState, useEffect } from "react";
import { useTitle } from "hookrouter";
import Constants from "../../constants";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import DeviceDetail from "./DeviceDetail";
import DeviceDiscoveries from "./DeviceDiscoveries";
import { getDeviceById } from "../../api";
import { Device as DeviceDTO } from "../../api/dto";
import { Spinner } from "react-bootstrap";

interface DeviceProps {
  id: number;
}

const Device: React.FunctionComponent<DeviceProps> = ({ id }) => {
  useTitle(`Device - ${Constants.title}`);

  const [device, setDevice] = useState<DeviceDTO | undefined>(undefined);

  useEffect(() => {
    getDeviceById(id)
      .then(d => {
        setDevice(d);
      })
      .catch(err => console.error(err));
  }, [id]);

  const updateDevice = (device: DeviceDTO) => setDevice(device);

  return (
    <PageSizeWrapper>
      {device === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          <DeviceDetail device={device} updateDevice={updateDevice} />
          <div className="mt-4">
            <DeviceDiscoveries device={device} />
          </div>
        </>
      )}
    </PageSizeWrapper>
  );
};

export default Device;
