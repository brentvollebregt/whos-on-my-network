import React, { useState, useEffect } from "react";
import { Device, DiscoveryTimes } from "../../api/dto";
import { DateTime } from "luxon";
import EntityPlot from "../../components/EntityPlot";
import DateRangeSelector from "../../components/DateRangeSelector";
import useStoredDatePair from "../../hooks/useStoredDatePair";
import { getDeviceDiscoveryTimes } from "../../api";

interface DeviceDiscoveriesPlotProps {
  device: Device;
}

const defaultStartDate = DateTime.local()
  .minus({ weeks: 1 })
  .startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

const DeviceDiscoveriesPlot: React.FunctionComponent<DeviceDiscoveriesPlotProps> = ({ device }) => {
  const {
    getStartDate,
    getEndDate,
    getStartAndEndDates,
    setStartAndEndDates,
    storedStartAndEndDates,
  } = useStoredDatePair("device", defaultStartDate, defaultEndDate);
  const [discoveryTimes, setDiscoveryTimes] = useState<DiscoveryTimes>({
    [device.id]: [],
  });

  // Fetch discovery times
  useEffect(() => {
    getDeviceDiscoveryTimes([device.id], getStartDate(), getEndDate()).then(d =>
      setDiscoveryTimes(d)
    );
  }, [device.id, storedStartAndEndDates]);

  return (
    <div>
      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      <EntityPlot
        entityIds={[device.id + ""]}
        entityDiscoveryTimes={{ [device.id]: [], ...discoveryTimes }}
        entityIdNameMap={{ [device.id]: device.name }}
        minDate={getStartDate()}
        maxDate={getEndDate()}
        height={90}
      />
    </div>
  );
};

export default DeviceDiscoveriesPlot;
