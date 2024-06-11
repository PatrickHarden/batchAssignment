import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AlertDialog from './AlertDialog';
import { mockCancelData, mockDeleteData } from './mockAlertDialogData';

const { header, subHeader, content, cancelText, actionText } = mockDeleteData;

export default {
  title: 'Example/Alert Dialogs',
  component: AlertDialog,
  args: {
    header: header,
    content: content,
    cancelButtonText: cancelText,
    actionButtonText: actionText,
    TriggerButtonText: 'trigger'
  },
  argTypes: {
    onCancel: { action: 'cancel action' },
    onAction: { action: 'complete action' }
  }
} as ComponentMeta<typeof AlertDialog>;

const Template: ComponentStory<typeof AlertDialog> = (args) => {
  return <AlertDialog {...args} />;
};

export const DefaultTrigger = Template.bind({});

// Trigger is styled like a button
export const ButtonStyleTrigger = Template.bind({});

ButtonStyleTrigger.args = {
  header: mockCancelData.header,
  content: mockCancelData.content,
  cancelButtonText: mockCancelData.cancelText,
  actionButtonText: mockCancelData.actionText,
  TriggerButtonText: 'trigger',
  triggerStyle: 'button--white-red'
};

// Alert Dialog is open by default without a trigger
export const OpenByDefault = Template.bind({});

OpenByDefault.args = {
  isOpen: true
};
