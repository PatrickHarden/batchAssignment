import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { render, screen } from '@testing-library/react';
import ToastOutlet, { Toast, useToast } from './ToastOutlet';
import userEvent from '@testing-library/user-event';

const successMessage = 'Success message';

const TestComponent = () => {
  const toast = useToast();

  return (
    <>
      <button type="button" onClick={() => toast.success(successMessage)}>
        Success
      </button>
      <button type="button" onClick={() => toast.error('Error message')}>
        Error
      </button>
      <button type="button" onClick={() => toast.warning('Warning message')}>
        Warning
      </button>
      <button type="button" onClick={() => toast.info('Info message')}>
        Info
      </button>
    </>
  );
};

beforeAll(() => jest.useFakeTimers());

afterAll(() => jest.useRealTimers());

it('should show toast and messages by status one at a time', () => {
  render(
    <>
      <TestComponent />
      <ToastOutlet />
    </>
  );

  const successButton = screen.getByRole('button', { name: 'Success' });
  const errorButton = screen.getByRole('button', { name: 'Error' });
  const warningButton = screen.getByRole('button', { name: 'Warning' });
  const infoButton = screen.getByRole('button', { name: 'Info' });

  userEvent.click(successButton);
  const successToast = screen.getByText(successMessage);
  expect(successToast).toBeInTheDocument();

  userEvent.click(errorButton);
  const errorToast = screen.getByText('Error message');
  expect(successToast).not.toBeInTheDocument();
  expect(errorToast).toBeInTheDocument();

  userEvent.click(warningButton);
  const warningToast = screen.getByText('Warning message');
  expect(errorToast).not.toBeInTheDocument();
  expect(warningToast).toBeInTheDocument();

  userEvent.click(infoButton);
  expect(warningToast).not.toBeInTheDocument();
  expect(screen.getByText('Info message')).toBeInTheDocument();
});

it('should remove the toast after 5 seconds', () => {
  render(
    <>
      <TestComponent />
      <ToastOutlet />
    </>
  );

  userEvent.click(screen.getByRole('button', { name: 'Success' }));
  const successToast = screen.getByText(successMessage);

  jest.runAllTimers();

  expect(successToast).not.toBeInTheDocument();
});

it('should remove the toast on esc key', () => {
  render(
    <>
      <TestComponent />
      <ToastOutlet />
    </>
  );

  userEvent.click(screen.getByRole('button', { name: 'Success' }));
  const successToast = screen.getByText(successMessage);

  userEvent.keyboard('{esc}');

  expect(successToast).not.toBeInTheDocument();
});

it('should not close while hovering over toast', () => {
  render(
    <>
      <TestComponent />
      <ToastOutlet />
    </>
  );

  userEvent.click(screen.getByRole('button', { name: 'Success' }));
  const successToast = screen.getByText(successMessage);

  userEvent.hover(successToast);
  jest.advanceTimersByTime(5000);
  expect(successToast).toBeInTheDocument();

  userEvent.unhover(successToast);
  jest.advanceTimersByTime(5000);
  expect(successToast).not.toBeInTheDocument();
});

it('should default to 5s if duration is not passed', () => {
  render(
    <ToastPrimitive.Provider>
      <Toast>I am toast</Toast>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
  const text = screen.getByText('I am toast');

  jest.advanceTimersByTime(5000);
  expect(text).not.toBeInTheDocument();
});

it('should override the duration', () => {
  render(
    <ToastPrimitive.Provider>
      <Toast duration={10000}>I am toast</Toast>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
  const text = screen.getByText('I am toast');

  jest.advanceTimersByTime(5000);
  expect(text).toBeInTheDocument();

  jest.advanceTimersByTime(5000);
  expect(text).not.toBeInTheDocument();
});
