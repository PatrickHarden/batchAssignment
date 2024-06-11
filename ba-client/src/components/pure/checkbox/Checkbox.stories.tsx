import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { expect, jest } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import { linkTo } from '@storybook/addon-links';

import Checkbox from './Checkbox';

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  argTypes: { onClick: { action: 'clicked' } }
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => {
  return <Checkbox {...args} />;
};

export const Default = Template.bind({});

export const UserClicked = Template.bind({});
const mockCallback = jest.fn(() => {
  console.log('user clicked');
});
UserClicked.args = {
  handleChange: () => {
    mockCallback();
  }
};
UserClicked.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('checkbox'));
  await expect(mockCallback).toHaveBeenCalled();
};

const LinkToExample: ComponentStory<typeof Checkbox> = (args) => {
  return (
    <div style={{ display: 'flex' }}>
      <button onClick={linkTo('Example/Checkbox', 'Default')}>Go to Default</button>
      <Checkbox {...args} />
    </div>
  );
};

export const LinkTo = LinkToExample.bind({});
