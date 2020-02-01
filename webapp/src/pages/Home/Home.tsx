import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { getScanById } from "../../api";
import Constants from "../../constants";
import { Interval, DateTime } from "luxon";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";

const dateRanges = ["1 Day", "1 Week", "1 Month"];
const dateRangeToInterval: { [key: string]: Interval } = {
  "1 Day": Interval.fromDateTimes(
    DateTime.local().minus({ days: 7 }),
    DateTime.local()
  ),
  "1 Week": Interval.fromDateTimes(
    DateTime.local().minus({ days: 7 }),
    DateTime.local()
  ),
  "1 Month": Interval.fromDateTimes(
    DateTime.local().minus({ days: 7 }),
    DateTime.local()
  )
};

const Home: React.FunctionComponent = () => {
  useTitle(`Home - ${Constants.title}`);
  const [selectedDateRange, setSelectedDateRange] = useState("1 Week");

  useEffect(() => {
    getScanById(1).then(d => console.log(d));
  });

  const dateRangeClick = (dateRange: string) => () =>
    setSelectedDateRange(dateRange);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Home: Temporary</h1>
      <div style={{ textAlign: "right" }}>
        <ButtonGroup aria-label="Basic example">
          {dateRanges.map(r => (
            <Button
              variant="primary"
              active={r === selectedDateRange}
              onClick={dateRangeClick(r)}
            >
              {r}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div style={{ background: "lightgrey", marginTop: 5, height: 200 }}>
        Some sort of chart showing device discoveries
      </div>
    </PageSizeWrapper>
  );
};

export default Home;
