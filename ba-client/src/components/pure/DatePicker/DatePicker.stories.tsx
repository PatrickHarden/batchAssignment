import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import DatePicker, { DatePickerProps } from './DatePicker';
import { add, getTime, sub, toDate } from 'date-fns';

export default {
  title: 'Example/DatePicker',
  component: DatePicker,
  args: {
    label: 'Start Date:'
  },
  argTypes: {
    date: { type: 'number' },
    allowedFromDate: { type: 'number' },
    allowedToDate: { type: 'number' }
  }
} as ComponentMeta<typeof DatePicker>;

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

type StorybookDatePickerProps = Omit<
  DatePickerProps,
  'allowedToDate' | 'allowedFromDate' | 'date'
> & {
  allowedFromDate: number;
  allowedToDate: number;
  date: number;
};

const Template: ComponentStory<(props: StorybookDatePickerProps) => JSX.Element> = ({
  date,
  allowedFromDate,
  allowedToDate,
  ...args
}) => {
  return (
    <DatePicker
      {...args}
      date={storybookParseDate(date)}
      allowedFromDate={storybookParseDate(allowedFromDate)}
      allowedToDate={storybookParseDate(allowedToDate)}
    />
  );
};

export const Empty = Template.bind({});

export const Mobile = Template.bind({});
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile'
  }
};

export const PreSelected = Template.bind({});
PreSelected.args = {
  date: getTime(new Date())
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

export const ConstrainedDateRange = Template.bind({});
ConstrainedDateRange.args = {
  allowedFromDate: getTime(sub(new Date(), { months: 1 })),
  allowedToDate: getTime(add(new Date(), { months: 1 }))
};
