import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { mockStudentData } from './TableComponents/MockTableData';
import Table from './Table';
import { columnDefs } from '../../container/HomePage/Teacher/TableContainerColumnDefinitions';

export default {
  title: 'Scholastic Table',
  component: Table,
  args: { enableCheckbox: false, data: mockStudentData, columnDefs }
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});

const Checkboxes: ComponentStory<typeof Table> = (args) => {
  args.enableCheckbox = true;
  return <Table {...args} />;
};

export const CheckBoxes = Checkboxes.bind({});

const MaxHeight: ComponentStory<typeof Table> = (args) => {
  args.maxHeight = '400px';
  return <Table {...args} />;
};

export const MaxHeight400 = MaxHeight.bind({});

const HideDuplicateName: ComponentStory<typeof Table> = (args) => {
  args.hideDuplicateNameCells = true;
  return <Table {...args} />;
};

export const HideDuplicateNames = HideDuplicateName.bind({});

const StickyHeader: ComponentStory<typeof Table> = (args) => {
  args.maxHeight = '400px';
  args.stickyHeader = true;
  return <Table {...args} />;
};

export const StickyHeaderMaxHeight = StickyHeader.bind({});
