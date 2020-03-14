import { useState, useEffect } from "react";

import { DeviceSummary } from "../api/dto";
import { getDevicesByFilter } from "../api";
import { genericApiErrorMessage } from "../utils/toasts";

const useAllDevices = () => {
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(undefined);

  const refresh = () => {
    getDevicesByFilter()
      .then(d => setDevices(d))
      .catch(err => genericApiErrorMessage("devices"));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { devices, refresh };
};

export default useAllDevices;
