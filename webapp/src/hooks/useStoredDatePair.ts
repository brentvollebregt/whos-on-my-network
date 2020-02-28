import { DateTime } from "luxon";
import useLocalStorage from "@rehooks/local-storage";

const useStoredDatePair = (
  storageKey: string,
  defaultStartDate: DateTime,
  defaultEndDate: DateTime
) => {
  const [storedStartAndEndDates, setStoredStartAndEndDates] = useLocalStorage<
    [string, string]
  >(storageKey + "_selectedDates", [
    defaultStartDate.toISO(),
    defaultEndDate.toISO()
  ]);

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

  return {
    getStartDate,
    getEndDate,
    getStartAndEndDates,
    setStartAndEndDates,
    storedStartAndEndDates
  };
};

export default useStoredDatePair;
