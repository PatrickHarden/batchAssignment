import React, { useCallback, useReducer, useRef } from 'react';
import DatePicker from '../../../../DatePicker/DatePicker';
import styles from './SelectDateTime.module.scss';
import { DateTime } from '../../../../../../atoms/atoms';
import format from 'date-fns/format';
import { isSameDay, add, clamp, sub, min, isBefore, startOfHour, startOfDay } from 'date-fns';
import { cloneDeep, isArray } from 'lodash-es';
import { convertToMilitaryTime, getTimeFromDate } from '../../../../../../utils/format-date';
import Dropdown, { MenuContent } from '../../../../Dropdown/Dropdown';
import { cx } from 'classix';
export interface SelectDateTimeProps {
  startTimeOptions: MenuContent[];
  endTimeOptions: MenuContent[];
  onDateTimeChange: (data: DateTime) => void;
  isValidDateTime: (data: DateTime) => boolean;
  schoolYearEndDate: string;
  dateTime: DateTime;
  isInsideDialog?: boolean;
}

const selectTimePlaceholder = 'Select Time';

// determine if end dates needs to be updated
const shouldUpdateEndDate = (
  previousEndDate: Date | undefined,
  currentStartDate: Date,
  currentEndDate: Date | undefined,
  isOneDayApartOrFutureDay: boolean,
  schoolYearEndDate: string
) => {
  /* creates/updates end date if any of these conditions are true:
    1. if there is no end date selected
    2. if the start and end dates are a day apart 
       OR the start date is in the future of the end date
    3. if the new start date is the same day as the end date
  */
  if (
    !currentEndDate ||
    isOneDayApartOrFutureDay ||
    (currentStartDate && previousEndDate && isSameDay(currentStartDate, previousEndDate))
  ) {
    return clampEndDate(
      currentStartDate,
      currentEndDate,
      isOneDayApartOrFutureDay,
      schoolYearEndDate
    );
  } else {
    return currentEndDate;
  }
};

// update the endDate depending on the current startDate
const clampEndDate = (
  startDate: Date,
  endDate: Date | undefined,
  isOneDayApartOrFutureDay: boolean,
  schoolYearEndDate: string
) => {
  const currentTimePlusFourWeeks = add(
    new Date(startDate),
    isOneDayApartOrFutureDay || !!endDate
      ? {
          days: 1
        }
      : { weeks: 4 }
  );
  return clamp(currentTimePlusFourWeeks, {
    start: startDate,
    end: new Date(schoolYearEndDate)
  });
};

export const getCurrentTime = (time: string | string[] | null) => {
  return isArray(time) ? time[0] : time;
};

const SelectDateTime = ({
  startTimeOptions,
  endTimeOptions,
  onDateTimeChange,
  isValidDateTime,
  dateTime,
  schoolYearEndDate,
  isInsideDialog
}: SelectDateTimeProps) => {
  const updatedStartTimeOptions = useRef(startTimeOptions);
  const updatedEndTimeOptions = useRef(endTimeOptions);

  // update the start time options if the current day is selected
  const filterStartTimeOptions = (currentHourValue: number) => {
    return startTimeOptions.filter((time) => {
      return convertToMilitaryTime(time.title) >= currentHourValue;
    });
  };

  // returns available selections for end time hours
  const filterEndTimeOptions = (endHourValue: number) => {
    return endTimeOptions.filter((time) => {
      return convertToMilitaryTime(time.title) >= endHourValue;
    });
  };

  // function runs when newly selected start date is todays date
  const updateTodaysDateTime = (updatedDateTime: DateTime) => {
    // find the current local hour
    const hour = format(new Date(), 'h:00 a');
    const currentHour = convertToMilitaryTime(hour);

    // finds the selected start hour if it exists and converts is to military time
    let selectedStartHour =
      updatedDateTime.startTime !== null
        ? convertToMilitaryTime(
            isArray(updatedDateTime.startTime)
              ? updatedDateTime.startTime[0]
              : updatedDateTime.startTime
          )
        : -1;

    // update selectedStartHour if newly selected start date is today
    if (updatedDateTime.startDate && isSameDay(updatedDateTime.startDate, new Date())) {
      selectedStartHour = selectedStartHour >= currentHour ? selectedStartHour : currentHour;
    }

    // compare selectedStartHour to currentHour and update the selected
    // hour if current hour is after the selected hour
    const startHourValue =
      currentHour > selectedStartHour && selectedStartHour > -1 ? selectedStartHour : currentHour;

    // updates available dropdown start time selections
    updatedStartTimeOptions.current = filterStartTimeOptions(startHourValue);

    const optionMatch = startTimeOptions.find(
      (option) => option.title === hour && currentHour >= selectedStartHour
    );

    if (optionMatch) {
      updatedDateTime.startTime = optionMatch.title;
    }
  };

  const updateEndTimes = (
    currentStartTime: string | null,
    endTime: string | null,
    selectedStartHourValue: number,
    selectedEndHourValue: number
  ) => {
    let newEndTime = endTime;

    const optionMatch = endTimeOptions.find((option) => option.title === currentStartTime);

    if (optionMatch) {
      const startHourValue = convertToMilitaryTime(optionMatch.title);
      // shows only select hours for end time dropdown
      updatedEndTimeOptions.current = filterEndTimeOptions(startHourValue);

      if (!newEndTime || selectedStartHourValue >= selectedEndHourValue) {
        newEndTime = currentStartTime;
      }
    }
    return newEndTime;
  };

  // update the endTime dropdown options depending on the current start/end date
  const updateEndTimeOptions = (isOneDayApartOrFutureDay: boolean, updatedDateTime: DateTime) => {
    const currentStartTime = getCurrentTime(updatedDateTime.startTime);
    let currentEndTime = getCurrentTime(updatedDateTime.endTime);

    // when a start time exists and the start and end dates are one day apart
    // or the new start date is in the future of the current end date, the end times
    // must be auto-updated
    if (updatedDateTime.startTime && isOneDayApartOrFutureDay) {
      // get the start and end times into military time to determine
      // if they are less than 24 hours apart
      const selectedStartTimeValue =
        currentStartTime !== null ? convertToMilitaryTime(currentStartTime) : -1;
      const selectedEndTimeValue =
        currentEndTime !== null ? convertToMilitaryTime(currentEndTime) : -1;

      // calculates new end time based on current selections and disables
      // any end time hours less than 24 hours from start time
      currentEndTime = updateEndTimes(
        currentStartTime,
        currentEndTime,
        selectedStartTimeValue,
        selectedEndTimeValue
      );
    } else {
      // shows all 24 hours as available for end time
      // because start and end date aren't within 24 hours
      updatedEndTimeOptions.current = endTimeOptions;
      // autopopulate end time value the first time a start date is selected
      if (updatedDateTime.startTime && !updatedDateTime.endTime) {
        currentEndTime = currentStartTime;
      }
    }
    return currentEndTime;
  };

  const onDateTimeSelected = useCallback((prevDateTime: DateTime, currentDateTime: DateTime) => {
    /* updates start date if start date is changed.
    The rest of the logic is to update start time, end date, and 
    end time as needed */
    const updatedDateTime = cloneDeep(currentDateTime);

    if (!(currentDateTime.startDate instanceof Date)) {
      return updatedDateTime;
    }

    const isCurrentDay = isSameDay(currentDateTime.startDate, new Date());
    let sameStartDate = false;
    let isOneDayApartOrFutureDay = false;
    if (prevDateTime.startDate instanceof Date) {
      sameStartDate = isSameDay(prevDateTime.startDate, currentDateTime.startDate);
    }
    if (currentDateTime.endDate instanceof Date) {
      isOneDayApartOrFutureDay =
        isSameDay(currentDateTime.startDate, sub(currentDateTime.endDate, { days: 1 })) ||
        currentDateTime.startDate.getTime() >= currentDateTime.endDate.getTime();
    }

    if (isCurrentDay) {
      // set end date if it doesn't exist
      updatedDateTime.endDate =
        currentDateTime.endDate ??
        clampEndDate(
          currentDateTime.startDate,
          currentDateTime.endDate,
          isOneDayApartOrFutureDay,
          schoolYearEndDate
        );
      updateTodaysDateTime(updatedDateTime);
    } else if (isBefore(currentDateTime.startDate, new Date())) {
      // set startDate to today's date and end date to +4 weeks if start date is in past
      currentDateTime.startDate = new Date();
      currentDateTime.startTime = getTimeFromDate(startOfHour(new Date()));
      currentDateTime.endTime = currentDateTime.startTime;
      currentDateTime.endDate = undefined;
      clampEndDate(currentDateTime.startDate, currentDateTime.endDate, false, schoolYearEndDate);
    } else {
      updatedStartTimeOptions.current = startTimeOptions;
      // determine if end date needs to be updated based on start date selection
      if (prevDateTime.startDate === undefined || !sameStartDate) {
        updatedDateTime.endDate = shouldUpdateEndDate(
          prevDateTime.endDate,
          currentDateTime.startDate,
          currentDateTime.endDate,
          isOneDayApartOrFutureDay,
          schoolYearEndDate
        );
      }
    }
    updatedDateTime.endTime = updateEndTimeOptions(isOneDayApartOrFutureDay, updatedDateTime);
    return updatedDateTime;
  }, []);

  // gets current hour in military time
  // returns 23 for '11:00 PM' and returns 2 for '2:00 AM'
  const currentHourValue = convertToMilitaryTime(format(new Date(), 'h:00 a'));
  let currentStartHour = -1;
  if (typeof dateTime.startTime === 'string') {
    currentStartHour = convertToMilitaryTime(dateTime.startTime);
  } else if (dateTime.startTime) {
    currentStartHour = dateTime.startTime;
  }

  const currentSelectedStartHourValue =
    currentHourValue > currentStartHour ? currentHourValue : currentStartHour;

  // updates selectable start time options for dropdown if start date is today
  updatedStartTimeOptions.current =
    dateTime.startDate && isSameDay(dateTime.startDate, new Date())
      ? filterStartTimeOptions(currentSelectedStartHourValue)
      : updatedStartTimeOptions.current;

  const [selectedDateTime, setSelectedDateTime] = useReducer(
    (prev: DateTime, next: Partial<DateTime>) => {
      const updatedDateTime = onDateTimeSelected({ ...prev }, { ...prev, ...next });
      if (isValidDateTime(updatedDateTime)) {
        onDateTimeChange(updatedDateTime);
      }
      return updatedDateTime;
    },
    onDateTimeSelected(dateTime, dateTime)
  );

  const dateTimeChange = (property: string, data: Date | string[]) => {
    const key = property as keyof DateTime;
    const update: Partial<DateTime> = { [key]: data };
    setSelectedDateTime(update);
  };

  return (
    <div className={cx(styles.selectDateTime, isInsideDialog ? styles.dialog : null)}>
      <div className={styles.selectDate}>
        <DatePicker
          date={selectedDateTime.startDate}
          placeholder=""
          onDateChange={(date) => dateTimeChange('startDate', date)}
          label="Start Date:"
          allowedFromDate={startOfDay(new Date())}
          allowedToDate={sub(new Date(schoolYearEndDate), { days: 1 })}
        />
        <div className={styles.selectTime}>
          <div className={styles.timeLabel}>Start Time:</div>
          <Dropdown
            openDropdown={!!selectedDateTime.startDate}
            content={updatedStartTimeOptions.current}
            header="Start Time"
            placeholder={selectedDateTime.startTime ?? selectTimePlaceholder}
            onChange={dateTimeChange}
            subHeader="startTime"
            maxHeight="340px"
            disablePortal
            preSelectedValue={selectedDateTime.startTime ? [selectedDateTime.startTime] : []}
          />
        </div>
      </div>
      <div className={styles.selectDate}>
        <DatePicker
          date={selectedDateTime.endDate}
          placeholder=""
          onDateChange={(date) => dateTimeChange('endDate', date)}
          label="End Date:"
          disabled={!selectedDateTime.startDate}
          allowedFromDate={
            selectedDateTime.startDate instanceof Date
              ? add(selectedDateTime.startDate, { days: 1 })
              : startOfDay(new Date())
          }
          allowedToDate={
            selectedDateTime.startDate instanceof Date
              ? min([new Date(schoolYearEndDate), add(selectedDateTime.startDate, { weeks: 6 })])
              : new Date(schoolYearEndDate)
          }
        />
        <div className={styles.selectTime}>
          <div className={styles.timeLabel}>End Time:</div>
          <Dropdown
            openDropdown={
              !!selectedDateTime.startTime ||
              (selectedDateTime.startDate instanceof Date &&
                isSameDay(selectedDateTime.startDate, new Date()))
            }
            content={updatedEndTimeOptions.current}
            header="End Time"
            subHeader="endTime"
            placeholder={selectedDateTime.endTime ?? selectTimePlaceholder}
            onChange={dateTimeChange}
            maxHeight="340px"
            disablePortal
          />
        </div>
      </div>
    </div>
  );
};

export default SelectDateTime;
