import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useDateRangePicker } from './useDateRangePicker';
import type { PopoverContentProps } from '@radix-ui/react-popover';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

const VALID_DATE = '12/12/2021';
const INVALID_DATE_ERROR_MESSAGE = 'Please enter a valid date in the following format: MM/DD/YYYY';

describe('useDateRangePicker hook', () => {
  it('should render empty state', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    // calendar starts closed
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
    expect(result.current.getCalendarProps()).toMatchObject({ initialFocus: false });

    // icon starts as calendar
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'calendar' });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'calendar' });

    // text starts empty
    expect(result.current.getInputFromProps()).toMatchObject({ value: '' });
    expect(result.current.getInputToProps()).toMatchObject({ value: '' });

    // validation starts passing
    expect(result.current.getFromValidationHelpProps()).toMatchObject({ children: null });
    expect(result.current.getToValidationHelpProps()).toMatchObject({ children: null });
  });

  it('should support disabled state', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {}, disabled: true }));

    // calendar starts closed
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
    expect(result.current.getCalendarProps()).toMatchObject({ initialFocus: false });

    // icon starts as calendar
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'calendar' });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'calendar' });

    // text starts empty and disabled
    expect(result.current.getInputFromProps()).toMatchObject({ value: '', disabled: true });
    expect(result.current.getInputToProps()).toMatchObject({ value: '', disabled: true });

    // validation starts passing
    expect(result.current.getFromValidationHelpProps()).toMatchObject({ children: null });
    expect(result.current.getToValidationHelpProps()).toMatchObject({ children: null });
  });

  it('should handle valid "from" value typed in', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: VALID_DATE
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    // value updates
    expect(result.current.getInputFromProps()).toMatchObject({ value: VALID_DATE });
    // validation still passing
    expect(result.current.getFromValidationHelpProps()).toMatchObject({ children: null });
  });

  it('should handle valid "to" value typed in', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: VALID_DATE
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    // value updates
    expect(result.current.getInputToProps()).toMatchObject({ value: VALID_DATE });
    // validation still passing
    expect(result.current.getToValidationHelpProps()).toMatchObject({ children: null });
  });

  it('should handle down arrow and enter on "from" input', async () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputFromProps().onKeyDown({
        key: 'ArrowDown',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current.getInputFromProps().onKeyDown({
        key: 'ArrowDown',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // popover still open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current.getInputFromProps().onKeyDown({
        key: 'ArrowDown',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    // clear microtask queue
    await act(() => Promise.resolve(true));

    // popover still open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current.getInputFromProps().onKeyDown({
        key: 'Enter',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // now closed
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
  });

  it('should handle down arrow and enter on "to" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputToProps().onKeyDown({
        key: 'ArrowDown',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current.getInputToProps().onKeyDown({
        key: 'ArrowDown',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // popover still open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current.getInputToProps().onKeyDown({
        key: 'Enter',
        preventDefault: () => ({})
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });

    // now closed
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
  });

  it('should handle too short "from" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: '01/01/200'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getFromValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle too short "to" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '01/01/200'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle a non-real date in "from" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: '12/32/2000'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getFromValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle a non-real date in "to" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '12/32/2000'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle a date within allowed range in "from" input', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({ dateRange: {}, allowedFromDate: new Date('2000-01-01') })
    );

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: '12/30/2020'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getFromValidationHelpProps()).toMatchObject({
      children: null
    });
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'calendar' });
  });

  it('should handle a date within allowed range in "to" input', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({ dateRange: {}, allowedToDate: new Date('2020-01-01') })
    );

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '12/30/2000'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: null
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'calendar' });
  });

  it('should handle a date outside allowed range in "from" input', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({ dateRange: {}, allowedFromDate: new Date('2020-01-01') })
    );

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: '12/30/2000'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getFromValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle a date outside allowed range in "to" input', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({ dateRange: {}, allowedToDate: new Date('2000-01-01') })
    );

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '12/29/2020'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: INVALID_DATE_ERROR_MESSAGE
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'warning' });
  });

  it('should handle a date outside allowed date range', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({
        dateRange: {},
        allowedFromDate: new Date('2000-12-01'),
        allowedToDate: new Date('3000-02-01')
      })
    );
    jest.setSystemTime(parseISO('2000-12-01T00:00:00.000Z'));

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '12/01/2020'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: null
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'calendar' });
  });

  it('should handle a date on the same date as the allowedFrom date', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({
        dateRange: {},
        allowedFromDate: startOfDay(new Date('2020-12-30T00:00:00.000-23:00')),
        allowedToDate: endOfDay(new Date('3000-01-01T00:00:00.000-23:00'))
      })
    );
    jest.setSystemTime(parseISO('2020-12-30T00:00:00.000Z'));

    act(() => {
      result.current.getInputFromProps().onChange({
        target: {
          value: '12/30/2020'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getFromValidationHelpProps()).toMatchObject({
      children: null
    });
    expect(result.current.getFromIcon()).toMatchObject({ iconName: 'calendar' });
  });

  it('should handle a date on the same date as the allowedTo date', () => {
    const { result } = renderHook(() =>
      useDateRangePicker({
        dateRange: {},
        allowedFromDate: startOfDay(new Date('2020-12-30T00:00:00.000-23:00')),
        allowedToDate: endOfDay(new Date('3000-01-02T00:00:00.000-23:00'))
      })
    );

    act(() => {
      result.current.getInputToProps().onChange({
        target: {
          value: '01/02/3000'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.getToValidationHelpProps()).toMatchObject({
      children: null
    });
    expect(result.current.getToIcon()).toMatchObject({ iconName: 'calendar' });
  });

  it('should handle click on "from" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputFromProps().onClick();
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });
  });

  it('should handle click on "to" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputToProps().onClick();
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });
  });

  it('should handle focus on "from" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputFromProps().onFocus();
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });
  });

  it('should handle focus on "to" input', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputToProps().onFocus();
    });

    // popover is now open
    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });
  });

  it('should handle clear selection from calendar', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {}, onDateChange: spy }));
    act(() => {
      result.current.getCalendarProps().onSelect(undefined);
    });
    expect(spy).not.toBeCalled();
  });

  it('should handle from selection from calendar', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {}, onDateChange: spy }));
    act(() => {
      result.current.getCalendarProps().onSelect({ from: new Date() });
    });
    expect(spy).toBeCalled();
  });

  it('should handle full range selection from calendar', () => {
    const spy = jest.fn();
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {}, onDateChange: spy }));
    act(() => {
      result.current.getCalendarProps().onSelect({ from: new Date(), to: new Date() });
    });
    expect(spy).toBeCalled();
  });

  it('should handle interaction outside calendar', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputToProps().onClick();
    });

    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current
        .getPopoverContentProps()
        ?.onInteractOutside?.({ preventDefault: () => ({}) } as unknown as Parameters<
          Required<PopoverContentProps>['onInteractOutside']
        >[0]);
    });

    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
  });

  it('should handle escape key with calendar', () => {
    const { result } = renderHook(() => useDateRangePicker({ dateRange: {} }));
    act(() => {
      result.current.getInputToProps().onClick();
    });

    expect(result.current.getPopoverRootProps()).toMatchObject({ open: true });

    act(() => {
      result.current
        .getPopoverContentProps()
        ?.onEscapeKeyDown?.({ preventDefault: () => ({}) } as unknown as Parameters<
          Required<PopoverContentProps>['onEscapeKeyDown']
        >[0]);
    });

    expect(result.current.getPopoverRootProps()).toMatchObject({ open: false });
  });
});
