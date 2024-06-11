import React from 'react';
import { format } from 'date-fns';
import {
  ClassNames,
  CustomComponents,
  DateRange,
  DayPicker,
  DayPickerRangeProps,
  Formatters
} from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { cx } from 'classix';
import rdpStyles from 'react-day-picker/dist/style.module.css';
import calendarStyles from './Calendar.module.scss';
import datePickerStyles from './DatePicker.module.scss';
import CalendarCaption from './CalendarCaption';
import { useDateRangePicker } from '../../../hooks/useDateRangePicker/useDateRangePicker';
import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import { ReactComponent as WarningTip } from '../../../assets/icons/warning-tip.svg';

const customFormatters: Partial<Formatters> = {
  formatWeekdayName: (date, options) => {
    return <>{format(date, 'EEE', { locale: options?.locale })}</>;
  }
};

const customComponents: CustomComponents = {
  Caption: CalendarCaption
};

const calendarClassNames: ClassNames = {
  ...rdpStyles,
  root: calendarStyles.root,
  month: calendarStyles.month,
  caption_label: calendarStyles.captionLabel,
  head_cell: calendarStyles.head,
  day: calendarStyles.day,
  day_range_middle: calendarStyles.dayRangeMiddle,
  day_range_start: calendarStyles.dayRangeStart,
  day_range_end: calendarStyles.dayRangeEnd
};

type CalendarProps = Omit<DayPickerRangeProps, 'mode'>;

function Calendar({ components, formatters, ...props }: CalendarProps): JSX.Element {
  return (
    <DayPicker
      mode="range"
      classNames={calendarClassNames}
      components={{ ...customComponents, ...components }}
      formatters={{ ...customFormatters, ...formatters }}
      {...props}
    />
  );
}

const iconMap: { [key in 'calendar' | 'warning']: JSX.Element } = {
  calendar: <CalendarIcon />,
  warning: <WarningTip className={datePickerStyles.validationWarningIcon} />
};

export interface DateRangePickerProps {
  readonly label?: string;
  readonly secondaryLabel?: string;
  readonly selected: Partial<DateRange>;
  readonly onSelect: (range: Partial<DateRange>) => void;
  readonly allowedFromDate?: Date;
  readonly allowedToDate?: Date;
  readonly disabled?: boolean;
  readonly sticky?: boolean;
}

export default function DateRangePicker({
  label,
  secondaryLabel,
  selected,
  onSelect,
  allowedFromDate,
  allowedToDate,
  disabled,
  sticky
}: DateRangePickerProps) {
  const {
    getPopoverRootProps,
    getPopoverContentProps,
    getLabelProps,
    getFromInputContainerProps,
    getToInputContainerProps,
    getInputFromProps,
    getInputToProps,
    getCalendarProps,
    getFromIcon,
    getToIcon,
    getFromValidationHelpProps,
    getToValidationHelpProps
  } = useDateRangePicker({
    dateRange: selected,
    onDateChange: onSelect,
    allowedFromDate,
    allowedToDate,
    disabled,
    placeholder: 'MM/DD/YYYY'
  });

  const labelContent = (
    <>
      <span>{label}</span>
      {secondaryLabel && <span className={datePickerStyles.secondaryLabel}>{secondaryLabel}</span>}
      <span className="sr-only">Press DOWN ARROW key to select available dates</span>
    </>
  );

  const fromInputContainer = (
    <div
      {...getFromInputContainerProps()}
      className={cx(
        datePickerStyles.inputContainer,
        datePickerStyles.dateRangeInputContainer,
        datePickerStyles.inputContainerFrom
      )}
    >
      <input {...getInputFromProps()} className={datePickerStyles.input} />
      <span aria-hidden="true" className={datePickerStyles.icon}>
        {iconMap[getFromIcon().iconName]}
      </span>
    </div>
  );

  const toInputContainer = (
    <div
      {...getToInputContainerProps()}
      className={cx(
        datePickerStyles.inputContainer,
        datePickerStyles.dateRangeInputContainer,
        datePickerStyles.inputContainerTo
      )}
    >
      <input {...getInputToProps()} className={datePickerStyles.input} />
      <span aria-hidden="true" className={datePickerStyles.icon}>
        {iconMap[getToIcon().iconName]}
      </span>
    </div>
  );

  const validationHelp = (
    <>
      <p {...getFromValidationHelpProps()} className={datePickerStyles.validationWarning} />
      <p {...getToValidationHelpProps()} className={datePickerStyles.validationWarning} />
    </>
  );

  if (sticky) {
    return (
      <div className={datePickerStyles.filterContainer}>
        <div className={cx(datePickerStyles.container, datePickerStyles.containerOverwrite)}>
          <label
            {...getLabelProps()}
            className={cx(
              typeof label === 'string' ? datePickerStyles.label : 'sr-only',
              datePickerStyles.filterLabel
            )}
          >
            {labelContent}
          </label>
          <div className={datePickerStyles.filterLayerContainer}>
            {fromInputContainer}
            {toInputContainer}
          </div>
          {validationHelp}
        </div>
        <Calendar className={datePickerStyles.calendarOverride} {...getCalendarProps()} />
      </div>
    );
  }

  return (
    <Popover.Root {...getPopoverRootProps()}>
      <div className={datePickerStyles.container}>
        <label
          {...getLabelProps()}
          className={cx(typeof label === 'string' ? datePickerStyles.label : 'sr-only')}
        >
          {labelContent}
        </label>
        <Popover.Anchor asChild>
          <div className={datePickerStyles.popoverContainer}>
            {fromInputContainer}
            {toInputContainer}
          </div>
        </Popover.Anchor>
        {validationHelp}
      </div>
      <Popover.Portal>
        <Popover.Content {...getPopoverContentProps()} className={datePickerStyles.portalContent}>
          <Calendar {...getCalendarProps()} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
