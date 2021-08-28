import React, { useState, useEffect } from "react";
import { DiscoveryTimes, Person } from "../../api/dto";
import { DateTime } from "luxon";
import EntityPlot from "../../components/EntityPlot";
import DateRangeSelector from "../../components/DateRangeSelector";
import useStoredDatePair from "../../hooks/useStoredDatePair";
import { getPersonDiscoveryTimes } from "../../api";

interface PersonDiscoveriesPlotProps {
  person: Person;
}

const defaultStartDate = DateTime.local().minus({ weeks: 1 }).startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

const PersonDiscoveriesPlot: React.FunctionComponent<PersonDiscoveriesPlotProps> = ({ person }) => {
  const {
    getStartDate,
    getEndDate,
    getStartAndEndDates,
    setStartAndEndDates,
    storedStartAndEndDates
  } = useStoredDatePair("person", defaultStartDate, defaultEndDate);
  const [discoveryTimes, setDiscoveryTimes] = useState<DiscoveryTimes>({
    [person.id]: []
  });

  // Fetch discovery times
  useEffect(() => {
    getPersonDiscoveryTimes([person.id], getStartDate(), getEndDate()).then(d =>
      setDiscoveryTimes(d)
    );
  }, [storedStartAndEndDates]);

  return (
    <div>
      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      <EntityPlot
        entityIds={[person.id + ""]}
        entityDiscoveryTimes={discoveryTimes}
        entityIdNameMap={{ [person.id]: person.name }}
        minDate={getStartDate()}
        maxDate={getEndDate()}
        height={90}
      />
    </div>
  );
};

export default PersonDiscoveriesPlot;
