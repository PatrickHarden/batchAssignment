import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { teacherAppraisalToggleDetails } from './MockToggleGroupData';
import ToggleGroup from './ToggleGroup';

export default {
  title: 'Example/Toggle Groups',
  component: ToggleGroup,
  args: {
    toggleButtonInfo: teacherAppraisalToggleDetails,
    toggleGroupLabel: 'Appraisal Toggle'
  },
  argTypes: { onValueChange: { action: 'valueChanged' } }
} as ComponentMeta<typeof ToggleGroup>;

const Template: ComponentStory<typeof ToggleGroup> = (args) => {
  return <ToggleGroup {...args} />;
};

export const DefaultToggleUncontrolled = Template.bind({});

const ControlledTemplate: ComponentStory<typeof ToggleGroup> = (args) => {
  const [selectedValue, setSelectedValue] = useState('Above Grade Level');

  args.value = selectedValue;
  const originalOnValueChange = args.onValueChange;
  args.onValueChange = (value: string) => {
    setSelectedValue(value);
    originalOnValueChange?.(value);
  };
  return <ToggleGroup {...args} />;
};

export const ControlledToggle = ControlledTemplate.bind({});
