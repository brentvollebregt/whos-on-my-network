import React from "react";
import { DateTime } from "luxon";
import DateRangeSelector from "../../components/DateRangeSelector";
import useLocalStorage from "@rehooks/local-storage";
import "./Home.css";

const defaultStartDate = DateTime.local()
  .minus({ weeks: 1 })
  .startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

export type EntityType = "device" | "person";

interface ChartProps {
  entityType: EntityType;
  selectedIds: number[];
}

const Chart: React.FC<ChartProps> = ({ entityType, selectedIds }) => {
  const [storedStartAndEndDates, setStoredStartAndEndDates] = useLocalStorage<
    [string, string]
  >("home_selectedDates", [defaultStartDate.toISO(), defaultEndDate.toISO()]);

  const getStartAndEndDates = (): [DateTime, DateTime] => [
    storedStartAndEndDates === null
      ? defaultStartDate
      : DateTime.fromISO(storedStartAndEndDates[0]),
    storedStartAndEndDates === null
      ? defaultEndDate
      : DateTime.fromISO(storedStartAndEndDates[1])
  ];

  const setStartAndEndDates = (startDate: DateTime, endDate: DateTime) => {
    setStoredStartAndEndDates([startDate.toISO(), endDate.toISO()]);
  };

  return (
    <>
      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      {/* TODO Graph */}
      <div
        className="mb-2"
        style={{ background: "lightgrey", marginTop: 5, height: 200 }}
      >
        Some sort of chart showing device discoveries
        <br />
        {getStartAndEndDates()[0].toISO()} to {getStartAndEndDates()[1].toISO()}
      </div>
    </>
  );
};

export default Chart;
