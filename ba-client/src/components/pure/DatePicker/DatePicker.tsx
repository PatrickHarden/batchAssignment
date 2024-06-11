import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import Calendar from './Calendar';
import styles from './DatePicker.module.scss';
import { useDatePicker } from '../../../hooks/useDatePicker/useDatePicker';
import { ReactComponent as CalendarIcon } from '../../../assets/icons/calendar.svg';
import { ReactComponent as WarningTip } from '../../../assets/icons/warning-tip.svg';

export interface DatePickerProps {
  /**
   * Selected date
   */
  readonly date?: Date;

  /**
   * Callback for date change
   * @param day - selected day
   */
  readonly onDateChange?: (day: Date) => void;

  /**
   * Lower bound of date(s) that can be selected
   */
  readonly allowedFromDate?: Date;

  /**
   * Upper bound of date(s) that can be selected
   */
  readonly allowedToDate?: Date;

  /**
   * Label to use
   */
  readonly label: string;

  /**
   * Whether date is editable
   */
  readonly disabled?: boolean;

  /**
   * Placeholder text for when the date picker hasn't been selected yet
   */
  readonly placeholder?: string;
}

const DatePicker = ({
  date,
  onDateChange,
  allowedFromDate,
  allowedToDate,
  label,
  disabled,
  placeholder
}: DatePickerProps) => {
  const {
    getPopoverRootProps,
    getPopoverContentProps,
    getLabelProps,
    getInputContainerProps,
    getInputProps,
    getCalendarProps,
    getIcon,
    getValidationHelpProps
  } = useDatePicker({ date, onDateChange, allowedFromDate, allowedToDate, disabled, placeholder });

  return (
    <Popover.Root {...getPopoverRootProps()}>
      <div className={styles.container}>
        <label {...getLabelProps()} className={styles.label}>
          {label}
          <span className="sr-only">Press DOWN ARROW key to select available dates</span>
        </label>
        <Popover.Anchor asChild>
          <div {...getInputContainerProps()} className={styles.inputContainer}>
            <input {...getInputProps()} className={styles.input} />
            <span aria-hidden="true" className={styles.icon}>
              {getIcon().iconName === 'calendar' ? <CalendarIcon /> : null}
              {getIcon().iconName === 'warning' ? (
                <WarningTip className={styles.validationWarningIcon} />
              ) : null}
            </span>
          </div>
        </Popover.Anchor>
        <p {...getValidationHelpProps()} className={styles.validationWarning} />
      </div>
      <Popover.Portal>
        <Popover.Content {...getPopoverContentProps()} className={styles.portalContent}>
          <Calendar {...getCalendarProps()} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;
