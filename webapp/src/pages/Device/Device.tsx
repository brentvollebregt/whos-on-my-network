import React, { useState, useEffect } from "react";
import { useTitle } from "hookrouter";
import Constants from "../../constants";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import DeviceDetail from "./DeviceDetail";
import DeviceDiscoveries from "./DeviceDiscoveries";
import { getDeviceById } from "../../api";
import { Device as DeviceDTO } from "../../api/dto";
import { Spinner } from "react-bootstrap";
import { genericApiErrorMessage } from "../../utils/toasts";
import DeviceDiscoveriesPlot from "./DeviceDiscoveriesPlot";

interface DeviceProps {
  id: number;
}

const getDeviceName = (id: number, device: DeviceDTO | undefined) =>
  device === undefined
    ? id
    : device.name === ""
    ? device.mac_address.toUpperCase()
    : device.name;

const Device: React.FunctionComponent<DeviceProps> = ({ id }) => {
  const [device, setDevice] = useState<DeviceDTO | undefined>(undefined);
  useTitle(`Device: ${getDeviceName(id, device)} - ${Constants.title}`);

  useEffect(() => {
    getDeviceById(id)
      .then(d => {
        setDevice(d);
      })
      .catch(err => genericApiErrorMessage(`device #${id}`));
  }, [id]);

  const updateDevice = (device: DeviceDTO) => setDevice(device);

  return (
    <PageSizeWrapper>
      <h1 className="text-center mb-4">
        {getDeviceName(id, device)} (#{id})
      </h1>

      {device !== undefined && (
        <>
          <DeviceDetail device={device} updateDevice={updateDevice} />
          <div className="mt-4">
            <DeviceDiscoveriesPlot device={device} />
          </div>
          <div className="mt-4">
            <DeviceDiscoveries device={device} />
          </div>
        </>
      )}

      {device === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Device;
