import React from 'react';
import Dropdown, { type MenuProps } from './Dropdown';
import { fireEvent, render, screen } from '@testing-library/react';

const dropdownProps: MenuProps = {
  content: [{ title: '2022-23' }, { title: '2021-22' }],
  header: 'Year'
};

const dropdownPropsPreSelectedValues: MenuProps = {
  content: [{ title: '2022-23' }, { title: '2021-22' }],
  header: 'Year',
  preSelectedValue: ['2021-22']
};

const mockTitleProps: MenuProps = {
  content: [{ title: ' ' }],
  header: 'Testing'
};

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllTimers();
});

it('should render the dropdown and see the dropdown title', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    text: jest.fn(() => Promise.resolve('Hello, World!'))
  } as unknown as Promise<Response>);

  render(<Dropdown {...dropdownProps} />);

  const title = screen.getByText('2022-23');

  expect(screen.getByTestId('caretDown')).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

it('should render the preselected year dropdown value and not the default value', async () => {
  render(<Dropdown {...dropdownPropsPreSelectedValues} />);

  const title = screen.getByText('2021-22');

  expect(screen.getByTestId('caretDown')).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

it('should render nothing as the dropdown title if content.title does not exist', async () => {
  render(<Dropdown {...mockTitleProps} />);

  const title = screen.getByTestId('dropdown-title');

  expect(title).toBeInTheDocument();
});

it('should render an empty string as the dropdown title no placeholder and no selected values', async () => {
  render(<Dropdown {...mockTitleProps} hasSelectedValues={false} />);

  const title = screen.getByTestId('dropdown-title');

  expect(title.innerText).toEqual(undefined);
});

it('should toggle dropdown', () => {
  jest.useFakeTimers();
  render(<Dropdown {...dropdownProps} />);
  const btn = screen.getByRole('button');

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  fireEvent.click(btn);
  const firstElem = screen.getByRole('menuitem', { name: '2022-23' });
  firstElem.ariaChecked = 'true';

  expect(screen.getByTestId('caretUp')).toBeInTheDocument();
  expect(screen.getByRole('menu')).toBeInTheDocument();
  jest.runOnlyPendingTimers();
  expect(firstElem).toHaveFocus();

  fireEvent.click(btn);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  jest.useRealTimers();
});

it('should close dropdown when selecting a menu item', () => {
  render(<Dropdown {...dropdownProps} />);
  const btn = screen.getByRole('button');

  fireEvent.click(btn);
  expect(screen.getByRole('menu')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('menuitem', { name: '2022-23' }));
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

it('should close dropdown when Escape is pressed', () => {
  render(<Dropdown {...dropdownProps} />);
  const btn = screen.getByRole('button');

  fireEvent.click(btn);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
