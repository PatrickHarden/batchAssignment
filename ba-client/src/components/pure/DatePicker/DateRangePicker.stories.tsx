import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import DateRangePicker, { type DateRangePickerProps } from './DateRangePicker';
import { add, getTime, sub, toDate } from 'date-fns';

export default {
  title: 'Example/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    fromDate: { type: 'number' },
    toDate: { type: 'number' },
    allowedFromDate: { type: 'number' },
    allowedToDate: { type: 'number' }
  }
} as ComponentMeta<typeof DateRangePicker>;

/**
 * Work around for https://github.com/storybookjs/storybook/issues/14508
 * Date from url is not automatically parsed from number to date
 * This does the parsing so you can share storybook with specific dates selected
 * @param unixDate date as a number, unix time stamp
 */
function storybookParseDate(unixTimestamp: number) {
  if (!unixTimestamp) return undefined;
  return toDate(unixTimestamp);
}

type StorybookDateRangePickerProps = Omit<
  DateRangePickerProps,
  'allowedToDate' | 'allowedFromDate' | 'selected'
> & {
  allowedFromDate: number;
  allowedToDate: number;
  fromDate: number;
  toDate: number;
};

const Template: ComponentStory<(props: StorybookDateRangePickerProps) => JSX.Element> = ({
  fromDate,
  toDate,
  allowedFromDate,
  allowedToDate,
  ...props
}) => {
  return (
    <DateRangePicker
      {...props}
      selected={{ from: storybookParseDate(fromDate), to: storybookParseDate(toDate) }}
      allowedFromDate={storybookParseDate(allowedFromDate)}
      allowedToDate={storybookParseDate(allowedToDate)}
    />
  );
};

const label = 'Start Between:';

export const Empty = Template.bind({});
Empty.args = { label };

export const Selection = Template.bind({});
Selection.args = {
  label,
  fromDate: getTime(sub(new Date(), { days: 2 })),
  toDate: getTime(add(new Date(), { days: 2 }))
};

export const Disabled = Template.bind({});
Disabled.args = { label, disabled: true };

export const ConstrainedDateRange = Template.bind({});
ConstrainedDateRange.args = {
  label,
  allowedFromDate: getTime(sub(new Date(), { months: 1 })),
  allowedToDate: getTime(add(new Date(), { months: 1 }))
};
