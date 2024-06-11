import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Tooltip from './Tooltip';

export default {
  title: 'Example/Tooltip',
  component: Tooltip,
  argTypes: {
    side: { defaultValue: 'bottom' },
    delayDuration: { defaultValue: 150 }
  }
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = ({
  content = 'Student already has an assigned assessment',
  ...args
}) => (
  <div style={{ marginTop: '10%', textAlign: 'center' }}>
    <Tooltip content={content} {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: <button type="button">Hover or focus me for tooltip</button>
};

export const InitiallyOpened = Template.bind({});
InitiallyOpened.args = {
  defaultOpen: true,
  children: <button type="button">My tooltip is initally opened</button>
};

export const DisabledElements: ComponentStory<typeof Tooltip> = ({ content, ...args }) => {
  return (
    <div style={{ marginTop: '10%', textAlign: 'center' }}>
      <Tooltip content="I am showing from a disabled button!" {...args}>
        <button type="button" disabled>
          I am a disabled button
        </button>
      </Tooltip>
      <label htmlFor="checkbox">Hover over the checkbox &gt;</label>
      <Tooltip content="I am showing from a disabled checkbox!" {...args}>
        <input type="checkbox" id="checkbox" disabled />
      </Tooltip>
    </div>
  );
};

export const DifferentSides: ComponentStory<typeof Tooltip> = ({
  content = 'I can change sides',
  ...args
}) => {
  return (
    <div
      style={{
        marginTop: '10%',
        display: 'flex',
        justifyContent: 'center',
        height: 150,
        alignItems: 'center'
      }}
    >
      <Tooltip content={content} {...args} side="left">
        <button type="button">Left</button>
      </Tooltip>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <Tooltip content={content} {...args} side="top">
          <button type="button">Top</button>
        </Tooltip>
        <Tooltip content={content} {...args} side="bottom">
          <button type="button">Bottom</button>
        </Tooltip>
      </div>
      <Tooltip content={content} {...args} side="right">
        <button type="button">Right</button>
      </Tooltip>
    </div>
  );
};

export const LongContent = Template.bind({});
LongContent.args = {
  content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt qui ipsum, reiciendis nihil sed voluptatibus doloribus dignissimos!
  Culpa iste eos inventore deserunt numquam eligendi repellat expedita eaque sed placeat soluta ipsam sit dolores pariatur dolore voluptate rerum,
  voluptatibus tempora praesentium vel aperiam. Harum dicta modi sequi explicabo itaque est voluptatem.`,
  children: <button type="button">Hover or focus me for tooltip</button>
};
