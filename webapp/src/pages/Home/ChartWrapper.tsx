import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import DateRangeSelector from "../../components/DateRangeSelector";
import useLocalStorage from "@rehooks/local-storage";
import { DiscoveryTimes } from "../../api/dto";
import { getDeviceDiscoveryTimes } from "../../api";
import Chart from "./Chart";

const defaultStartDate = DateTime.local()
  .minus({ weeks: 1 })
  .startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

export type EntityType = "device" | "person";

interface ChartProps {
  entityType: EntityType;
  selectedIds: number[];
}

const ChartWrapper: React.FC<ChartProps> = ({ entityType, selectedIds }) => {
  const [storedStartAndEndDates, setStoredStartAndEndDates] = useLocalStorage<
    [string, string]
  >("home_selectedDates", [defaultStartDate.toISO(), defaultEndDate.toISO()]);

  const getStartDate = () =>
    storedStartAndEndDates === null
      ? defaultStartDate
      : DateTime.fromISO(storedStartAndEndDates[0]);
  const getEndDate = () =>
    storedStartAndEndDates === null
      ? defaultEndDate
      : DateTime.fromISO(storedStartAndEndDates[1]);

  const getStartAndEndDates = (): [DateTime, DateTime] => [
    getStartDate(),
    getEndDate()
  ];

  const setStartAndEndDates = (startDate: DateTime, endDate: DateTime) => {
    setStoredStartAndEndDates([startDate.toISO(), endDate.toISO()]);
  };

  const [tempData, setTempData] = useState<DiscoveryTimes | undefined>(
    undefined
  );
  useEffect(() => {
    getDeviceDiscoveryTimes(
      [1, 2, 3, 4, 5, 6, 7],
      getStartDate(),
      getEndDate()
    ).then(d => setTempData(d));
  }, [storedStartAndEndDates]);

  return (
    <>
      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      {tempData !== undefined && (
        <Chart
          data={tempData}
          minDate={getStartDate()}
          maxDate={getEndDate()}
        />
      )}
    </>
  );
};

export default ChartWrapper;
