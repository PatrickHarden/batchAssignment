import React from 'react';
import { render, screen } from '@testing-library/react';
import Tooltip from './Tooltip';
import userEvent from '@testing-library/user-event';

const tooltipContent = 'Hello, I am tooltip content';

it('should render and hide the tooltip on hover/focus and unhover/blur with correct content', async () => {
  render(
    <Tooltip content={tooltipContent}>
      <button type="button">Hover me for tooltip!</button>
    </Tooltip>
  );

  const button = screen.getByRole('button', { name: 'Hover me for tooltip!' });

  expect(screen.queryByRole('tooltip', { name: tooltipContent })).not.toBeInTheDocument();
  userEvent.hover(button);
  const tooltip = await screen.findByRole('tooltip', { name: tooltipContent });
  expect(tooltip).toBeInTheDocument();

  button.focus();
  userEvent.tab();
  expect(tooltip).not.toBeInTheDocument();
});

it('should render on correct side', async () => {
  const { rerender } = render(
    <Tooltip content={tooltipContent}>
      <button type="button">Hover me for tooltip!</button>
    </Tooltip>
  );

  const button = screen.getByRole('button');

  userEvent.hover(button);
  let tooltip = await screen.findAllByText(tooltipContent);
  expect(tooltip[0]).toHaveAttribute('data-side', 'bottom');

  rerender(
    <Tooltip content={tooltipContent} side="right">
      <button type="button">Hover me for tooltip!</button>
    </Tooltip>
  );
  tooltip = await screen.findAllByText(tooltipContent);
  expect(tooltip[0]).toHaveAttribute('data-side', 'right');

  rerender(
    <Tooltip content={tooltipContent} side="top">
      <button type="button">Hover me for tooltip!</button>
    </Tooltip>
  );
  tooltip = await screen.findAllByText(tooltipContent);
  expect(tooltip[0]).toHaveAttribute('data-side', 'top');

  rerender(
    <Tooltip content={tooltipContent} side="left">
      <button type="button">Hover me for tooltip!</button>
    </Tooltip>
  );
  tooltip = await screen.findAllByText(tooltipContent);
  expect(tooltip[0]).toHaveAttribute('data-side', 'left');
});

it('should show tooltip for disabled elements', async () => {
  render(
    <Tooltip content={tooltipContent}>
      <button type="button" disabled>
        I am disabled!
      </button>
    </Tooltip>
  );

  const wrapper = screen.getByTestId('tooltip-disabled-element-wrapper');

  userEvent.hover(wrapper);
  const tooltip = await screen.findByRole('tooltip', { name: tooltipContent });
  expect(tooltip).toBeInTheDocument();
});

it('should throw when invalid children', () => {
  expect(() => render(<Tooltip content={tooltipContent}>I am some text!</Tooltip>)).toThrow(
    'Invalid children used in TooltipTrigger'
  );
});
