import React from 'react';
import { render, screen } from '@testing-library/react';
import Drawer, { DrawerProps } from './Drawer';
import userEvent from '@testing-library/user-event';
import { ReactComponent as FilterIcon } from '../../../assets/icons/filter.svg';

const drawerProps: DrawerProps = {
  title: 'Test title',
  triggerIcon: <FilterIcon />,
  headerIcon: <FilterIcon />,
  triggerTitle: 'Test trigger',
  children: <div>Test content</div>
};

const titleIcon = 'title-icon';

it('renders children upon trigger click', () => {
  render(<Drawer {...drawerProps} />);
  const trigger = screen.getByRole('button', { name: /test trigger/i });
  expect(screen.getByTestId('icon')).toBeInTheDocument();

  userEvent.click(trigger);
  expect(screen.getByRole('heading', { name: /test title/i })).toBeInTheDocument();
  expect(screen.getByText(/test content/i)).toBeInTheDocument();
  expect(screen.getByTestId(titleIcon)).toBeInTheDocument();
});

it('renders correctly with no icon and no children', () => {
  render(<Drawer title="title" triggerTitle="trigger title" />);
  const trigger = screen.getByRole('button', { name: /trigger title/i });

  userEvent.click(trigger);
  expect(screen.queryByTestId(titleIcon)).not.toBeInTheDocument();
});

it('opens and closes via x button', () => {
  render(<Drawer {...drawerProps} />);
  const trigger = screen.getByRole('button', { name: /test trigger/i });

  userEvent.click(trigger);
  expect(screen.getByText(/test content/i)).toBeInTheDocument();

  const closeButton = screen.getByRole('button', { name: 'Close' });
  userEvent.click(closeButton);
  expect(screen.queryByText(/test content/i)).not.toBeInTheDocument();
});

it('renders footer', () => {
  render(<Drawer {...drawerProps} footer={<div>Test footer</div>} />);
  const trigger = screen.getByRole('button', { name: /test trigger/i });

  userEvent.click(trigger);
  expect(screen.getByText(/test footer/i)).toBeInTheDocument();

  const closeButton = screen.getByRole('button', { name: 'Close' });
  userEvent.click(closeButton);
  expect(screen.queryByText(/test footer/i)).not.toBeInTheDocument();
});

const Footer = () => {
  return (
    <div>
      <button>Clear All</button>
      <button>Apply Filters</button>
    </div>
  );
};

it('renders correctly with large children and footer component', () => {
  render(
    <Drawer {...drawerProps} footer={<Footer />}>
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i}>{`${i + 1} line`}</p>
        ))}
      </>
    </Drawer>
  );
  const trigger = screen.getByRole('button', { name: /test trigger/i });

  userEvent.click(trigger);
  expect(screen.getByText(/clear all/i)).toBeInTheDocument();
  expect(screen.getByText(/apply filter/i)).toBeInTheDocument();
});

it('functions correctly on mobile', () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 359
  });
  render(<Drawer {...drawerProps} />);

  const trigger = screen.getByRole('button', { name: /test trigger/i });
  expect(screen.getByTestId('icon')).toBeInTheDocument();

  userEvent.click(trigger);
  const heading = screen.getByRole('heading', { name: /test title/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByText(/test content/i)).toBeInTheDocument();
  expect(screen.getByTestId(titleIcon)).toBeInTheDocument();
});

it('does not open with disableOpen', () => {
  render(<Drawer {...drawerProps} disabled />);

  expect(screen.queryByText(/test content/i)).not.toBeInTheDocument();
  const trigger = screen.getByRole('button', { name: /test trigger/i });
  userEvent.click(trigger);
  expect(screen.queryByText(/test content/i)).not.toBeInTheDocument();
});
