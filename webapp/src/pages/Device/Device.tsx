import React from "react";
import { useTitle } from "hookrouter";
import Constants from "../../constants";
import PageSizeWrapper from "../../components/PageSizeWrapper";

interface DeviceProps {
  id: number;
}

const Device: React.FunctionComponent<DeviceProps> = ({ id }) => {
  useTitle(`Device - ${Constants.title}`);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Device ({id}): Temporary</h1>
      <div style={{ background: "grey" }}>Device information, linked to</div>
    </PageSizeWrapper>
  );
};

export default Device;
