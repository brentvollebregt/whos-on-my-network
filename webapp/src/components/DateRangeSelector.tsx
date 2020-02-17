import React from "react";
import {
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime, Interval } from "luxon";

const dateRanges: { [key: string]: Interval } = {
  "1 Day": Interval.fromDateTimes(
    DateTime.local()
      .minus({ days: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  ),
  "1 Week": Interval.fromDateTimes(
    DateTime.local()
      .minus({ weeks: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  ),
  "1 Month": Interval.fromDateTimes(
    DateTime.local()
      .minus({ months: 1 })
      .startOf("day"),
    DateTime.local().endOf("day")
  )
};

interface DateRangeSelector {
  startAndEndDates: [DateTime, DateTime];
  setStartAndEndDates: (startDate: DateTime, endDate: DateTime) => void;
}

const DateRangeSelector: React.FC<DateRangeSelector> = ({
  startAndEndDates,
  setStartAndEndDates
}) => {
  const getStartDate = () => startAndEndDates[0];
  const getEndDate = () => startAndEndDates[1];

  const onStartDateSelection = (date: Date | null) =>
    date !== null &&
    setStartAndEndDates(DateTime.fromJSDate(date), getEndDate());
  const onEndDateSelection = (date: Date | null) =>
    date !== null &&
    setStartAndEndDates(getStartDate(), DateTime.fromJSDate(date));
  const onDateRangeSelection = (range: string) => () =>
    setStartAndEndDates(dateRanges[range].start, dateRanges[range].end);

  return (
    <InputGroup>
      <InputGroup.Text
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: "none"
        }}
      >
        From
      </InputGroup.Text>
      <DatePicker
        selected={getStartDate().toJSDate()}
        onChange={onStartDateSelection}
        customInput={<FormControl style={{ borderRadius: 0 }} />}
        maxDate={getEndDate().toJSDate()}
        dateFormat="dd/MM/yyyy"
      />
      <InputGroup.Text
        style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}
      >
        to
      </InputGroup.Text>
      <DatePicker
        selected={getEndDate().toJSDate()}
        onChange={onEndDateSelection}
        customInput={<FormControl style={{ borderRadius: 0 }} />}
        minDate={getStartDate().toJSDate()}
        dateFormat="dd/MM/yyyy"
      />
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title="Select Range"
        id="date-range-dropdown"
      >
        {Object.keys(dateRanges).map(dateRange => (
          <Dropdown.Item
            onClick={onDateRangeSelection(dateRange)}
            key={dateRange}
          >
            {dateRange}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </InputGroup>
  );
};

export default DateRangeSelector;
