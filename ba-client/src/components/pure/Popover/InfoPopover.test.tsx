import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import InfoPopover, { PopperProps } from './InfoPopover';

const mockTooltipProps: PopperProps = {
  tipMessage: <>Mock Tip Message</>,
  stringedTipMessage: 'Fake SR message',
  placement: 'bottom'
};

it('should close the popover', async () => {
  render(<InfoPopover {...mockTooltipProps} />);

  const popoverButton = screen.getByRole('button');
  userEvent.click(popoverButton);

  expect(screen.getByText('Mock Tip Message')).toBeInTheDocument();
});

it('should call handleBlur onBlur from button', () => {
  render(<InfoPopover {...mockTooltipProps} />);

  const popoverButton = screen.getByRole('button');
  userEvent.click(popoverButton);

  expect(screen.getByText('Mock Tip Message')).toBeInTheDocument();

  fireEvent.blur(popoverButton);
});
