import React from "react";
import { useTitle } from "hookrouter";
import Constants from "../../constants";

interface DeviceDetailProps {
  id: number;
}

const DeviceDetail: React.FunctionComponent<DeviceDetailProps> = ({ id }) => {
  useTitle(`Device - ${Constants.title}`);

  return <div></div>;
};

export default DeviceDetail;
