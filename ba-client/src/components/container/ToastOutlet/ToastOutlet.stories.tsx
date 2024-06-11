import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ToastOutlet, { useToast, Status } from './ToastOutlet';

export default {
  title: 'Example/Toast',
  component: ToastOutlet
} as ComponentMeta<typeof ToastOutlet>;

const ToastStory = () => {
  const toast = useToast();

  const showToast = (message: string, status: Status) => {
    toast[status](message);
  };

  const ToastTemplate = ({ status }: { status: Status }) => (
    <div>
      <p>Status: {status}</p>
      <button
        type="button"
        onClick={() => {
          showToast('Scholastic Reading Measure assigned successfully.', status);
        }}
      >
        Trigger short {status} toast message
      </button>
      <button
        type="button"
        onClick={() => {
          showToast(
            `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Provident pariatur fugiat eveniet amet quo possimus dolor illo, quia rerum laborum iure sint ad obcaecati nobis quae sed minima id ullam minus reprehenderit non!
              Ut voluptas asperiores aut, aliquid facere nihil odit aperiam nisi laudantium voluptate eius dolore perferendis deleniti necessitatibus!`,
            status
          );
        }}
      >
        Trigger long {status} toast message
      </button>
    </div>
  );

  return (
    <>
      {(['success', 'error', 'warning', 'info'] as const).map((status) => (
        <ToastTemplate status={status} key={status} />
      ))}
    </>
  );
};

export const Default: ComponentStory<typeof ToastOutlet> = ({ ...args }) => {
  return (
    <>
      <ToastStory />
      <ToastOutlet {...args} />
    </>
  );
};
