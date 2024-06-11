import { format } from 'date-fns';
import React from 'react';
import {
  ClassNames,
  CustomComponents,
  DayPicker,
  DayPickerBase,
  Formatters,
  SelectSingleEventHandler
} from 'react-day-picker';
import rdpStyles from 'react-day-picker/dist/style.module.css';
import styles from './Calendar.module.scss';
import CalendarCaption from './CalendarCaption';

export interface CalendarProps extends DayPickerBase {
  selected: Date | undefined;
  onSelect: (day: Date | undefined) => void;
}

const formatters: Partial<Formatters> = {
  formatWeekdayName: (date, options) => {
    return <>{format(date, 'EEE', { locale: options?.locale })}</>;
  }
};

const customComponents: CustomComponents = {
  Caption: CalendarCaption
};

const classNames: ClassNames = {
  ...rdpStyles,
  root: styles.root,
  month: styles.month,
  caption_label: styles.captionLabel,
  head_cell: styles.head,
  day: styles.day,
  day_range_middle: styles.dayRangeMiddle,
  day_range_start: styles.dayRangeStart,
  day_range_end: styles.dayRangeEnd
};

const Calendar = ({ selected, onSelect, initialFocus, ...props }: CalendarProps) => {
  const handleSelect: SelectSingleEventHandler = (day) => {
    onSelect(day);
  };

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      classNames={classNames}
      initialFocus={initialFocus}
      defaultMonth={selected}
      components={customComponents}
      formatters={formatters}
      required
      {...props}
    />
  );
};

export default React.memo(Calendar);
