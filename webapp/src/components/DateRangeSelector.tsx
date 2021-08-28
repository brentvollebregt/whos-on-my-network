import React from "react";
import { InputGroup, FormControl, DropdownButton, Dropdown } from "react-bootstrap";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime, Interval } from "luxon";

const dateRangeGenerators: { [key: string]: (date: DateTime) => Interval } = {
  "1 Day": (date: DateTime) =>
    Interval.fromDateTimes(date.minus({ days: 1 }).startOf("day"), date.endOf("day")),
  "1 Week": (date: DateTime) =>
    Interval.fromDateTimes(date.minus({ weeks: 1 }).startOf("day"), date.endOf("day")),
  "1 Month": (date: DateTime) =>
    Interval.fromDateTimes(date.minus({ months: 1 }).startOf("day"), date.endOf("day"))
};

const datePickerFormatting: Partial<ReactDatePickerProps> = {
  customInput: <FormControl style={{ borderRadius: 0 }} />,
  showTimeSelect: true,
  timeIntervals: 60,
  timeCaption: "time",
  dateFormat: "dd MMM yyyy h:mm aa"
};

interface DateRangeSelectorProps {
  startAndEndDates: [DateTime, DateTime];
  setStartAndEndDates: (startDate: DateTime, endDate: DateTime) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startAndEndDates,
  setStartAndEndDates
}) => {
  const getStartDate = () => startAndEndDates[0];
  const getEndDate = () => startAndEndDates[1];

  const onStartDateSelection = (date: Date | null) =>
    date !== null && setStartAndEndDates(DateTime.fromJSDate(date), getEndDate());
  const onEndDateSelection = (date: Date | null) =>
    date !== null && setStartAndEndDates(getStartDate(), DateTime.fromJSDate(date));
  const onDateRangeSelection = (range: string) => () => {
    const interval = dateRangeGenerators[range](DateTime.local());
    setStartAndEndDates(interval.start, interval.end);
  };

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
        maxDate={getEndDate().toJSDate()}
        {...datePickerFormatting}
      />
      <InputGroup.Text style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}>
        to
      </InputGroup.Text>
      <DatePicker
        selected={getEndDate().toJSDate()}
        onChange={onEndDateSelection}
        minDate={getStartDate().toJSDate()}
        {...datePickerFormatting}
      />
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title="Select Range"
        id="date-range-dropdown"
      >
        {Object.keys(dateRangeGenerators).map(dateRange => (
          <Dropdown.Item onClick={onDateRangeSelection(dateRange)} key={dateRange}>
            {dateRange}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </InputGroup>
  );
};

export default DateRangeSelector;
