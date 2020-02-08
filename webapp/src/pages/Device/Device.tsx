import React from "react";
import { useTitle } from "hookrouter";
import Constants from "../../constants";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import DeviceDetail from "./DeviceDetail";
import DeviceDiscoveries from "./DeviceDiscoveries";

interface DeviceProps {
  id: number;
}

const Device: React.FunctionComponent<DeviceProps> = ({ id }) => {
  useTitle(`Device - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <DeviceDetail id={id} />
      <div className="mt-4">
        <DeviceDiscoveries id={id} />
      </div>
    </PageSizeWrapper>
  );
};

export default Device;
