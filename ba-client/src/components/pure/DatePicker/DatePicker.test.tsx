import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DatePicker from './DatePicker';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { useNavigation } from 'react-day-picker';
import { add, sub } from 'date-fns';

const reactDayPicker = 'react-day-picker';
const mockUseNavigation = useNavigation as jest.Mock;
const arrowDownKey = '{arrowdown}';

jest.mock(reactDayPicker, () => ({
  __esModule: true,
  ...jest.requireActual(reactDayPicker),
  useNavigation: jest.fn()
}));

const renderDatePicker = (props?: Parameters<typeof DatePicker>[0]) => {
  const datePickerProps = props ?? { label: 'Start Date' };
  // render date picker along with buttons for focus testing
  render(
    <>
      <button type="button">Before</button>
      <DatePicker {...datePickerProps} />
      <button type="button">After</button>
    </>
  );

  const input = screen.getByRole('textbox', { name: new RegExp(datePickerProps.label) });

  return {
    preAnchor: screen.getByRole('button', { name: 'Before' }),
    input,
    postAnchor: screen.getByRole('button', { name: 'After' }),
    openDialog: async () => {
      userEvent.click(input);
      return {
        async getDialog() {
          try {
            return await screen.findByRole('dialog', { name: 'calendar' });
          } catch {
            return null;
          }
        },
        getDayButton: (day: number) => screen.getByRole('gridcell', { name: day.toString() }),
        prevButton: screen.getByRole('button', { name: 'Go to previous month' }),
        nextButton: screen.getByRole('button', { name: 'Go to next month' })
      };
    }
  };
};

beforeEach(() => {
  mockUseNavigation.mockImplementation(jest.requireActual(reactDayPicker).useNavigation);
});

it('should render input with a label and placeholder', () => {
  const { input } = renderDatePicker();

  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
});

it('should open and close datepicker on focus and blur', async () => {
  const { input, preAnchor } = renderDatePicker();

  // focus Before button
  userEvent.tab();
  expect(preAnchor).toHaveFocus();
  // focus input
  userEvent.tab();
  expect(input).toHaveFocus();
  // wait for calendar dialog to open
  let dialog = await screen.findByRole('dialog', { name: 'calendar' });
  expect(dialog).toBeInTheDocument();

  // focus After button which should close calendar dialog
  userEvent.tab();
  expect(dialog).not.toBeInTheDocument();

  // back tab to focus input again
  userEvent.tab({ shift: true });
  // wait for calendar to open again
  dialog = await screen.findByRole('dialog', { name: 'calendar' });
  expect(dialog).toBeInTheDocument();
});

it('should open and close datepicker on click in and out', async () => {
  const { preAnchor, openDialog } = renderDatePicker();

  // confirm calendar closed
  expect(screen.queryByRole('dialog', { name: 'calendar' })).not.toBeInTheDocument();

  // open calendar dialog
  const { getDialog } = await openDialog();
  expect(await getDialog()).toBeInTheDocument();

  // click on a button to close calendar
  userEvent.click(preAnchor);
  expect(await getDialog()).not.toBeInTheDocument();
});

it('should close calendar on escape', async () => {
  const { openDialog } = renderDatePicker();

  const { getDialog } = await openDialog();
  expect(await getDialog()).toBeInTheDocument();

  // press escape to close calendar
  userEvent.keyboard('{esc}');
  expect(await getDialog()).not.toBeInTheDocument();
});

it('should open calendar on arrow down and calendar is closed', async () => {
  const { openDialog } = renderDatePicker();
  const { getDialog } = await openDialog();

  // close calendar
  userEvent.keyboard('{esc}');
  expect(await getDialog()).not.toBeInTheDocument();

  // open calendar via arrow down
  userEvent.keyboard(arrowDownKey);
  expect(await getDialog()).toBeInTheDocument();
});

it('should focus today in dialog when arrow down on input and calendar is opened', async () => {
  const { input, openDialog } = renderDatePicker();
  const { getDayButton } = await openDialog();

  // arrow down when input is focused and calendar is opened
  expect(input).toHaveFocus();
  userEvent.keyboard(arrowDownKey);

  // focus today in dialog
  expect(getDayButton(new Date().getDate())).toHaveFocus();
});

it('should update input value when date is selected', async () => {
  const { input, openDialog } = renderDatePicker();
  const { getDayButton } = await openDialog();
  const dayOfMonth = 15;
  const date = new Date();
  date.setDate(dayOfMonth);

  // input has empty value
  expect(input).toHaveValue('');
  // select a day in the current month
  userEvent.click(getDayButton(dayOfMonth));

  // input value has the date in MM/dd/yyyy format
  expect(input).toHaveValue(format(date, 'MM/dd/yyyy'));
});

it('should be able to navigate months', async () => {
  const { openDialog } = renderDatePicker();
  const { prevButton, nextButton } = await openDialog();
  const today = new Date();
  const prevMonth = sub(new Date(), { months: 1 });
  const nextMonth = add(new Date(), { months: 1 });
  const currentMonthCaptionLabelText = format(today, 'MMMM yyyy');
  const prevMonthCaptionLabelText = format(prevMonth, 'MMMM yyyy');
  const nextMonthCaptionLabelText = format(nextMonth, 'MMMM yyyy');

  // look for current caption label e.g. February 2022
  expect(screen.getByText(currentMonthCaptionLabelText)).toBeInTheDocument();

  // click prev month button to go to January 2022
  userEvent.click(prevButton);
  expect(screen.getByText(prevMonthCaptionLabelText)).toBeInTheDocument();

  // click next month to go back to current month (February 2022)
  userEvent.click(nextButton);
  expect(screen.getByText(currentMonthCaptionLabelText)).toBeInTheDocument();

  // click next month agin to go to March 2022
  userEvent.click(nextButton);
  expect(screen.getByText(nextMonthCaptionLabelText)).toBeInTheDocument();
});

it('should have month navigation buttons disabled', async () => {
  mockUseNavigation.mockReturnValue({
    previousMonth: undefined,
    nextMonth: undefined,
    goToMonth: jest.fn()
  });
  const { openDialog } = renderDatePicker();
  const { prevButton, nextButton } = await openDialog();

  expect(prevButton).toBeDisabled();
  expect(nextButton).toBeDisabled();
});

it('should update input value when typing', async () => {
  const { input } = renderDatePicker();

  expect(input).toHaveValue('');

  userEvent.type(input, '11/11/2023');
  expect(input).toHaveValue('11/11/2023');
});

it('should focus current selected day when arrow down is pressed to focus calendar', async () => {
  const { openDialog } = renderDatePicker();
  const { getDialog, getDayButton } = await openDialog();
  const dayOfMonth = 15;

  expect(await getDialog()).toBeInTheDocument();

  userEvent.click(getDayButton(dayOfMonth));
  expect(await getDialog()).not.toBeInTheDocument();

  // arrow down once to open
  userEvent.keyboard(arrowDownKey);
  // second time to focus into calendar
  userEvent.keyboard(arrowDownKey);
  expect(getDayButton(dayOfMonth)).toHaveFocus();
});

it('should remain opened when moving between input and calendar', async () => {
  const { input, openDialog } = renderDatePicker();
  const todayDate = new Date().getDate();

  const { getDialog, getDayButton } = await openDialog();

  // focus into the calendar
  userEvent.keyboard(arrowDownKey);
  expect(getDayButton(todayDate)).toHaveFocus();

  // clicking on input should still have calendar open
  userEvent.click(input);
  expect(await getDialog()).toBeInTheDocument();

  // focusing back into the calendar still works
  userEvent.keyboard(arrowDownKey);
  await waitFor(() => expect(getDayButton(todayDate)).toHaveFocus());
});

it('should work with pre-selected date', async () => {
  const today = new Date();
  const { input, openDialog } = renderDatePicker({ label: 'Start Date', date: today });

  // pre-selected input value
  expect(input).toHaveValue(format(today, 'MM/dd/yyyy'));

  // open calendar
  const { getDayButton } = await openDialog();
  // expect pre-selected date to be selected in the calendar
  const todayButton = getDayButton(today.getDate());
  expect(todayButton).toHaveAttribute('aria-selected', 'true');

  // expect focus to be on pre-selected date
  userEvent.keyboard(arrowDownKey);
  await waitFor(() => expect(todayButton).toHaveFocus());
});
