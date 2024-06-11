import React, { useState, useRef, useCallback } from 'react';
import { format, isAfter, isBefore, isEqual, parse } from 'date-fns';
import { PopoverContentProps } from '@radix-ui/react-popover';
import { uniqueId } from 'lodash-es';
import { DateRange } from 'react-day-picker';

const DATE_FORMAT = 'MM/dd/yyyy';

type InputType = 'from' | 'to';

const isFromDateValid = (selectedDay: Date, allowedFromDate: Date | undefined) => {
  return (
    !allowedFromDate ||
    (allowedFromDate &&
      (isAfter(selectedDay, allowedFromDate) || isEqual(selectedDay, allowedFromDate)))
  );
};

const isToDateValid = (selectedDay: Date, allowedToDate: Date | undefined) => {
  return (
    !allowedToDate ||
    (allowedToDate && (isBefore(selectedDay, allowedToDate) || isEqual(selectedDay, allowedToDate)))
  );
};

const isFromSelectedRangeValid = (selectedTo: Date | undefined, selectedDay: Date) => {
  return (
    !selectedTo ||
    (selectedTo && (isBefore(selectedDay, selectedTo) || isEqual(selectedDay, selectedTo)))
  );
};

const isToSelectedRangeValid = (selectedFrom: Date | undefined, selectedDay: Date) => {
  return (
    !selectedFrom ||
    (selectedFrom && (isAfter(selectedDay, selectedFrom) || isEqual(selectedDay, selectedFrom)))
  );
};

interface UseDatePickerProps {
  /**
   * Current value displayed in picker
   */
  readonly dateRange: Partial<DateRange>;

  /**
   * Picker has chosen a new date
   * @param day new day selected
   */
  readonly onDateChange?: (day: Partial<DateRange>) => void;

  /**
   * Lower bound of date(s) that can be selected
   */
  readonly allowedFromDate?: Date;

  /**
   * Upper bound of date(s) that can be selected
   */
  readonly allowedToDate?: Date;

  /**
   * Prevent interaction with picker
   */
  readonly disabled?: boolean;

  /**
   * Placeholder text for when the datepicker hasn't been selected yet
   */
  readonly placeholder?: string;
}

// part 2 refactor will break this up
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useDateRangePicker({
  dateRange,
  onDateChange,
  allowedFromDate,
  allowedToDate,
  disabled,
  placeholder
}: UseDatePickerProps) {
  const fromInputId = useRef(uniqueId('datepicker-input-from-'));
  const toInputId = useRef(uniqueId('datepicker-input-to-'));
  const fromValidationId = useRef(uniqueId('datepicker-validation-from-'));
  const toValidationId = useRef(uniqueId('datepicker-validation-to-'));
  const [lastTouchedInput, setLastTouchedInput] = useState<InputType>('from');
  const [isFromValid, setIsFromValid] = useState(true);
  const [isToValid, setIsToValid] = useState(true);
  const [selected, setSelected] = useState<Partial<DateRange>>(dateRange);
  const [open, setOpen] = useState(false);
  const [inputFromValue, setInputFromValue] = useState(
    dateRange?.from ? format(dateRange.from, DATE_FORMAT) : ''
  );
  const [inputToValue, setInputToValue] = useState(
    dateRange?.to ? format(dateRange.to, DATE_FORMAT) : ''
  );
  const [initialFocus, setInitialFocus] = useState(false);
  const fromInputContainerRef = useRef<HTMLDivElement>(null);
  const toInputContainerRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const handleInputFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputFromValue(e.target.value);
      if (e.target.value.length < 10) {
        setIsFromValid(false);
        return;
      }
      try {
        const day = parse(e.target.value, DATE_FORMAT, new Date());

        const fromDateValid = isFromDateValid(day, allowedFromDate);
        const toDateValid = isToDateValid(day, allowedToDate);
        const selectedRangeIsValid = isFromSelectedRangeValid(selected.to, day);

        if (fromDateValid && toDateValid && selectedRangeIsValid) {
          const range = { ...selected, from: day };
          setInputFromValue(range.from ? format(range.from, DATE_FORMAT) : '');
          setInputToValue(range.to ? format(range.to, DATE_FORMAT) : '');
          onDateChange?.(range);
          setSelected(range);
          setIsFromValid(true);
        } else {
          setIsFromValid(false);
        }
      } catch (e: unknown) {
        setIsFromValid(false);
      }
    },
    [onDateChange, allowedFromDate, allowedToDate, selected]
  );

  const openCalendar = useCallback(() => setOpen(true), []);

  const closeCalendar = useCallback(() => {
    setOpen(false);
    setInitialFocus(false);
  }, []);

  const handleInputToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputToValue(e.target.value);
      if (e.target.value.length < 10) {
        setIsToValid(false);
        closeCalendar();
        return;
      }
      try {
        const day = parse(e.target.value, DATE_FORMAT, new Date());

        const fromDateValid = isFromDateValid(day, allowedFromDate);
        const toDateValid = isToDateValid(day, allowedToDate);

        const selectedRangeIsValid = isToSelectedRangeValid(selected.from, day);

        if (fromDateValid && toDateValid && selectedRangeIsValid) {
          const range: Partial<DateRange> = { ...selected, to: day };
          setInputFromValue(range.from ? format(range.from, DATE_FORMAT) : '');
          setInputToValue(range.to ? format(range.to, DATE_FORMAT) : '');
          setSelected(range);
          setIsToValid(true);
          onDateChange?.(range);
        } else {
          setIsToValid(false);
          closeCalendar();
        }
      } catch (e: unknown) {
        setIsToValid(false);
        closeCalendar();
      }
    },
    [onDateChange, allowedFromDate, allowedToDate, selected, closeCalendar]
  );

  const focusInput = (input: InputType) => {
    setLastTouchedInput(input);
    if (input === 'to') {
      toInputRef.current?.focus();
      return;
    }
    fromInputRef.current?.focus();
  };

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      if (range) {
        setInputFromValue(range.from ? format(range.from, DATE_FORMAT) : '');
        setInputToValue(range.to ? format(range.to, DATE_FORMAT) : '');
        setSelected(range);
        onDateChange?.(range);
      }
      focusInput(range?.to ? lastTouchedInput : 'to');
      if (range?.from && range?.to) {
        closeCalendar();
      }
      setIsFromValid(true);
      setIsToValid(true);
    },
    [onDateChange, lastTouchedInput, closeCalendar]
  );

  const focusCalendar = useCallback(() => {
    if (!initialFocus) {
      setInitialFocus(true);
    } else {
      // if initial focus was already set before, we have to reopen the calendar before refocusing
      closeCalendar();
      queueMicrotask(() => {
        openCalendar();
        setInitialFocus(true);
      });
    }
  }, [closeCalendar, initialFocus, openCalendar]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        if (open) {
          focusCalendar();
        } else {
          openCalendar();
        }
        e.preventDefault();
      } else if (e.key === 'Enter') {
        closeCalendar();
      }
    },
    [focusCalendar, open, openCalendar, closeCalendar]
  );

  const handleInteractOutside = useCallback(
    (e: CustomEvent) => {
      // allow interactions with input
      if (
        !fromInputContainerRef.current?.contains(e.target as Node) &&
        !toInputContainerRef.current?.contains(e.target as Node)
      ) {
        closeCalendar();
      }
      e.preventDefault();
    },
    [closeCalendar]
  );

  const handleEscapeKeyDown = useCallback(
    (e: KeyboardEvent) => {
      focusInput(lastTouchedInput);
      closeCalendar();
      e.preventDefault();
    },
    [closeCalendar, lastTouchedInput]
  );

  const handleContainerClick = useCallback(
    (input: InputType) => () => {
      focusInput(input);
    },
    []
  );

  const getPopoverRootProps = useCallback(
    () =>
      ({
        open,
        onOpenChange: setOpen
      } as const),
    [open]
  );

  const getPopoverContentProps: () => PopoverContentProps = useCallback(
    () =>
      ({
        'aria-label': 'calendar',
        align: 'start',
        sideOffset: 8,
        collisionPadding: 15,
        onOpenAutoFocus: (e: Event) => e.preventDefault(),
        onInteractOutside: handleInteractOutside,
        onEscapeKeyDown: handleEscapeKeyDown
      } as const),
    [handleEscapeKeyDown, handleInteractOutside]
  );

  const getLabelProps = useCallback(
    () =>
      ({
        htmlFor: fromInputId.current
      } as const),
    []
  );

  const getFromInputContainerProps = useCallback(
    () =>
      ({
        ref: fromInputContainerRef,
        onClick: handleContainerClick('from'),
        'aria-invalid': !isFromValid
      } as const),
    [handleContainerClick, isFromValid]
  );

  const getToInputContainerProps = useCallback(
    () =>
      ({
        ref: toInputContainerRef,
        onClick: handleContainerClick('to'),
        'aria-invalid': !isToValid
      } as const),
    [handleContainerClick, isToValid]
  );

  const getInputFromProps = useCallback(
    () =>
      ({
        id: fromInputId.current,
        type: 'text',
        placeholder: placeholder ?? (disabled ? 'Not Available' : 'MM/DD/YYYY'),
        disabled,
        ref: fromInputRef,
        value: inputFromValue,
        maxLength: 10,
        size: 10,
        'aria-invalid': !isFromValid,
        'aria-errormessage': fromValidationId.current,
        autoComplete: 'off',
        onChange: handleInputFromChange,
        onFocus: () => {
          setLastTouchedInput('from');
          openCalendar();
        },
        onClick: () => {
          setLastTouchedInput('from');
          openCalendar();
        },
        onKeyDown: handleInputKeyDown
      } as const),
    [
      handleInputFromChange,
      handleInputKeyDown,
      inputFromValue,
      openCalendar,
      disabled,
      isFromValid,
      placeholder
    ]
  );

  const getInputToProps = useCallback(
    () =>
      ({
        id: toInputId.current,
        type: 'text',
        placeholder: placeholder ?? (disabled ? 'Not Available' : 'MM/DD/YYYY'),
        disabled,
        ref: toInputRef,
        value: inputToValue,
        maxLength: 10,
        size: 10,
        'aria-invalid': !isToValid,
        'aria-errormessage': toValidationId.current,
        autoComplete: 'off',
        onChange: handleInputToChange,
        onFocus: () => {
          setLastTouchedInput('to');
          openCalendar();
        },
        onClick: () => {
          setLastTouchedInput('to');
          openCalendar();
        },
        onKeyDown: handleInputKeyDown
      } as const),
    [
      handleInputToChange,
      handleInputKeyDown,
      inputToValue,
      openCalendar,
      disabled,
      isToValid,
      placeholder
    ]
  );

  const getCalendarProps = useCallback(
    () =>
      ({
        selected: selected as DateRange,
        fromDate: allowedFromDate,
        toDate: allowedToDate,
        onSelect: handleSelect,
        initialFocus
      } as const),
    [handleSelect, initialFocus, selected, allowedFromDate, allowedToDate]
  );

  const getFromIcon = useCallback(
    () =>
      ({
        iconName: isFromValid ? 'calendar' : 'warning'
      } as const),
    [isFromValid]
  );

  const getToIcon = useCallback(
    () =>
      ({
        iconName: isToValid ? 'calendar' : 'warning'
      } as const),
    [isToValid]
  );

  const getFromValidationHelpProps = useCallback(
    () =>
      ({
        id: fromValidationId.current,
        children: isFromValid
          ? null
          : 'Please enter a valid date in the following format: MM/DD/YYYY',
        role: 'alert'
      } as const),
    [isFromValid]
  );

  const getToValidationHelpProps = useCallback(
    () =>
      ({
        id: toValidationId.current,
        children: isToValid
          ? null
          : 'Please enter a valid date in the following format: MM/DD/YYYY',
        role: 'alert'
      } as const),
    [isToValid]
  );

  return {
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
  };
}
