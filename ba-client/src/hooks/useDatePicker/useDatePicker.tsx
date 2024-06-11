import React, { useState, useRef, useEffect, useCallback } from 'react';
import { format, isAfter, isBefore, isEqual, parse } from 'date-fns';
import { PopoverContentProps } from '@radix-ui/react-popover';
import { uniqueId } from 'lodash-es';

interface UseDatePickerProps {
  /**
   * Current value displayed in picker
   */
  readonly date?: Date;

  /**
   * Picker has chosen a new date
   * @param day new day selected
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
   * Prevent interaction with picker
   */
  readonly disabled?: boolean;

  /**
   * Placeholder text for when the date picker hasn't been selected yet
   */
  readonly placeholder?: string;
}

export const useDatePicker = ({
  date,
  onDateChange,
  allowedFromDate,
  allowedToDate,
  disabled,
  placeholder
}: UseDatePickerProps) => {
  const inputId = useRef(uniqueId('datepicker-input-'));
  const validationId = useRef(uniqueId('datepicker-validation-'));
  const [isValid, setIsValid] = useState(true);
  const [selected, setSelected] = useState(date);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [initialFocus, setInitialFocus] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateFormat = 'MM/dd/yyyy';
  const updateDate = useCallback((day: Date) => {
    setInputValue(format(day, dateFormat));
    setSelected(day);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (e.target.value.length < 10) {
        setIsValid(false);
        return;
      }
      try {
        const day = parse(e.target.value, dateFormat, new Date());

        const fromDateValid =
          !allowedFromDate ||
          (allowedFromDate && (isAfter(day, allowedFromDate) || isEqual(day, allowedFromDate)));
        const toDateValid =
          !allowedToDate ||
          (allowedToDate &&
            allowedFromDate &&
            (isBefore(day, allowedToDate) || isEqual(day, allowedToDate)) &&
            (isAfter(allowedToDate, allowedFromDate) || isEqual(day, allowedToDate)));
        if (fromDateValid && toDateValid) {
          updateDate(day);
          onDateChange?.(day);
          setSelected(day);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (e: unknown) {
        setIsValid(false);
      }
    },
    [updateDate, onDateChange, allowedFromDate, allowedToDate]
  );

  const openCalendar = useCallback(() => setOpen(true), []);

  const closeCalendar = useCallback(() => {
    setOpen(false);
    setInitialFocus(false);
  }, []);

  const focusInput = () => inputRef.current?.focus();

  const handleSelect = useCallback(
    (day: Date | undefined) => {
      if (day) {
        updateDate(day);
        onDateChange?.(day);
      }
      focusInput();
      closeCalendar();
      setIsValid(true);
    },
    [closeCalendar, onDateChange, updateDate]
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
      if (!inputContainerRef.current?.contains(e.target as Node)) {
        closeCalendar();
      }
      e.preventDefault();
    },
    [closeCalendar]
  );

  const handleEscapeKeyDown = useCallback(
    (e: KeyboardEvent) => {
      focusInput();
      closeCalendar();
      e.preventDefault();
    },
    [closeCalendar]
  );

  const handleContainerClick = useCallback(() => {
    focusInput();
  }, []);

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
        htmlFor: inputId.current
      } as const),
    []
  );

  const getInputContainerProps = useCallback(
    () =>
      ({
        ref: inputContainerRef,
        onClick: handleContainerClick,
        'aria-invalid': !isValid
      } as const),
    [handleContainerClick, isValid]
  );

  const getInputProps = useCallback(
    () =>
      ({
        id: inputId.current,
        type: 'text',
        placeholder: placeholder ?? (disabled ? 'Not Available' : 'MM/DD/YYYY'),
        disabled,
        ref: inputRef,
        value: inputValue,
        maxLength: 10,
        size: 10,
        'aria-invalid': !isValid,
        'aria-errormessage': validationId.current,
        autoComplete: 'off',
        onChange: handleInputChange,
        onFocus: openCalendar,
        onClick: openCalendar,
        onKeyDown: handleInputKeyDown
      } as const),
    [
      handleInputChange,
      handleInputKeyDown,
      inputValue,
      openCalendar,
      disabled,
      isValid,
      placeholder
    ]
  );

  const getCalendarProps = useCallback(
    () =>
      ({
        selected,
        fromDate: allowedFromDate,
        toDate: allowedToDate,
        onSelect: handleSelect,
        initialFocus
      } as const),
    [handleSelect, initialFocus, selected, allowedFromDate, allowedToDate]
  );

  const getIcon = useCallback(
    () =>
      ({
        iconName: isValid ? 'calendar' : 'warning'
      } as const),
    [isValid]
  );

  const getValidationHelpProps = useCallback(
    () =>
      ({
        id: validationId.current,
        children: isValid ? null : 'Please enter a valid date in the following format: MM/DD/YYYY',
        role: 'alert'
      } as const),
    [isValid]
  );

  useEffect(() => {
    if (date) {
      updateDate(date);
    }
  }, [date, updateDate]);

  return {
    getPopoverRootProps,
    getPopoverContentProps,
    getLabelProps,
    getInputContainerProps,
    getInputProps,
    getCalendarProps,
    getIcon,
    getValidationHelpProps
  };
};
