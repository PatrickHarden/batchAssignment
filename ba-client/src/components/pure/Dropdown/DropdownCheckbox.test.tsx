import React from 'react';
import DropdownCheckbox, { type DropdownCheckboxProps } from './DropdownCheckbox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const allCheckboxText = 'All Testing Checkbox';
const testClassA = 'Test Class A';
const inProgress = 'In Progress';
const notStarted = 'Not Started';
const noTestScheduled = 'No Test Scheduled';

const dropdownProps: DropdownCheckboxProps = {
  content: [
    { title: testClassA, id: '1' },
    { title: 'Test Second B', id: '2' }
  ],
  header: 'Testing',
  maxHeight: '200px',
  applyButton: true,
  hasAllCheckbox: true,
  allCheckboxName: allCheckboxText
};

const mockTitleProps: DropdownCheckboxProps = {
  content: [{ title: ' ', id: '123' }],
  header: '',
  subHeader: 'SubHeader',
  applyButton: true,
  hasAllCheckbox: true,
  openDropdown: false
};

const mockOneClassProps: DropdownCheckboxProps = {
  content: [{ title: 'Single Class', id: '1' }],
  header: 'Testing',
  applyButton: true,
  hasAllCheckbox: true
};

const statusMock: DropdownCheckboxProps = {
  content: [
    { title: 'Completed', id: 'COMPLETED' },
    { title: inProgress, id: 'IN_PROGRESS' },
    { title: notStarted, id: 'NOT_STARTED' },
    { title: 'Scheduled', id: 'SCHEDULED' },
    { title: noTestScheduled, id: 'NO_TEST_SCHEDULED' },
    { title: 'Canceled', id: 'CANCELED' },
    { title: 'Deleted', id: 'DELETED' }
  ],
  header: 'Testing',
  applyButton: true,
  checkAll: true
};

jest.mock('@scholastic/volume-react', () => ({
  Button: ({ children, ...rest }: { children: React.ReactNode }) => (
    <button {...rest}>{children}</button>
  ),
  Checkbox: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllTimers();
});

it('should render the dropdown and see the dropdown title', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    text: jest.fn(() => Promise.resolve('Hello, World!'))
  } as unknown as Promise<Response>);

  render(<DropdownCheckbox {...dropdownProps} />);

  const caret = screen.getByTestId('caretDown');
  const title = screen.getByText(testClassA);

  expect(caret).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

it('should render nothing as the dropdown title if content.title does not exist', async () => {
  render(<DropdownCheckbox {...mockTitleProps} />);

  const dropdownBtn = screen.getByRole('button');
  const title = screen.getByTestId('dropdownCheckboxTitle');

  expect(dropdownBtn).toBeDisabled();
  expect(title.innerHTML).toEqual(' ');
  expect(title).toBeInTheDocument();
});

it('should show all checkbox selected if only one class', async () => {
  render(<DropdownCheckbox {...mockOneClassProps} />);
  const dropdownBtn = screen.getByRole('button');
  userEvent.click(dropdownBtn);
  const allCheckbox = screen.getByRole('checkbox', { name: 'All Checkbox' });

  expect(screen.getByTestId('caretUp')).toBeInTheDocument();
  expect(allCheckbox).toBeChecked();

  userEvent.click(allCheckbox);
  expect(allCheckbox).not.toBeChecked();

  const secondCheckbox = screen.getByRole('checkbox', { name: 'Single Class' });
  expect(secondCheckbox.localName).toBe('input');
  expect(secondCheckbox).not.toBeChecked();

  userEvent.click(secondCheckbox);
  expect(secondCheckbox).toBeChecked();
});

it('should toggle dropdown and focus on second element', () => {
  jest.useFakeTimers();
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  userEvent.click(dropdownBtn);
  const firstSelectedElem = screen.getByRole('checkbox', { name: testClassA });
  firstSelectedElem.ariaChecked = 'true';
  const cancelBtn = screen.getByText('Cancel');

  jest.runOnlyPendingTimers();
  expect(firstSelectedElem).toHaveFocus();

  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(cancelBtn).toBeInTheDocument();

  userEvent.click(cancelBtn);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  jest.useRealTimers();
});

it('should open the STATUS dropdown and show all options selected', async () => {
  render(<DropdownCheckbox {...statusMock} />);

  const title = screen.getByTestId('dropdownCheckboxTitle');
  const dropdownBtn = screen.getByRole('button');

  expect(title).toBeInTheDocument();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  userEvent.click(dropdownBtn);

  const completedCheckbox = screen.getByRole('checkbox', { name: 'Completed' });
  const inProgressCheckbox = screen.getByRole('checkbox', { name: inProgress });

  expect(completedCheckbox).toBeChecked();
  expect(inProgressCheckbox).toBeChecked();

  userEvent.click(completedCheckbox);

  expect(completedCheckbox).not.toBeChecked();
  expect(inProgressCheckbox).toBeChecked();

  completedCheckbox.focus();
  userEvent.keyboard('{space}');
  expect(completedCheckbox).toBeChecked();
  expect(inProgressCheckbox).toBeChecked();
});

it('should show the status menu title properly if only one option is selected', async () => {
  render(<DropdownCheckbox {...statusMock} />);

  const title = screen.getByText('Completed & 6 more');
  const dropdownBtn = screen.getByRole('button');

  expect(title).toBeInTheDocument();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  userEvent.click(dropdownBtn);

  const completedCheckbox = screen.getByRole('checkbox', { name: 'Completed' });
  const inProgressCheckbox = screen.getByRole('checkbox', { name: inProgress });
  const notStartedCheckbox = screen.getByRole('checkbox', { name: notStarted });
  const scheduledCheckbox = screen.getByRole('checkbox', { name: 'Scheduled' });
  const noTestScheduledCheckbox = screen.getByRole('checkbox', { name: noTestScheduled });
  const canceledCheckbox = screen.getByRole('checkbox', { name: 'Canceled' });

  expect(completedCheckbox).toBeChecked();
  expect(inProgressCheckbox).toBeChecked();
  expect(scheduledCheckbox).toBeChecked();
  expect(noTestScheduledCheckbox).toBeChecked();
  expect(canceledCheckbox).toBeChecked();

  const applyButton = screen.getByText('Apply');
  userEvent.click(applyButton);
  expect(screen.getByText('Completed & 6 more')).toBeInTheDocument();

  userEvent.click(inProgressCheckbox);
  userEvent.click(notStartedCheckbox);
  userEvent.click(scheduledCheckbox);
  userEvent.click(noTestScheduledCheckbox);
  userEvent.click(canceledCheckbox);

  expect(inProgressCheckbox).not.toBeChecked();
  expect(notStartedCheckbox).not.toBeChecked();
  expect(scheduledCheckbox).not.toBeChecked();
  expect(noTestScheduledCheckbox).not.toBeChecked();
  expect(canceledCheckbox).not.toBeChecked();

  userEvent.click(applyButton);
  const newTitle = screen.getByText('Completed');
  expect(newTitle).toBeInTheDocument();
});

it('should open dropdown and be able to select/deselect checkboxes', () => {
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);
  const allCheckbox = screen.getByRole('checkbox', { name: allCheckboxText });
  const secondCheckbox = screen.getByRole('checkbox', { name: testClassA });

  expect(allCheckbox).toBeInTheDocument();
  expect(secondCheckbox).toBeInTheDocument();
  expect(screen.getByRole('menu')).toBeInTheDocument();

  expect(allCheckbox).not.toBeChecked();
  expect(secondCheckbox).toBeChecked();

  userEvent.click(allCheckbox);
  expect(allCheckbox).toBeChecked();
  expect(secondCheckbox).toBeChecked();
  const applyButton = screen.getByText('Apply');
  userEvent.click(applyButton);

  expect(screen.getByText(allCheckboxText)).toBeInTheDocument();

  userEvent.click(allCheckbox);
  expect(allCheckbox).not.toBeChecked();
  expect(secondCheckbox).not.toBeChecked();

  userEvent.keyboard('{space');
  expect(secondCheckbox).not.toBeChecked();
});

it('should open dropdown with apply button disabled then enabled it on checkbox state change', () => {
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);
  const applyButton = screen.getByRole('button', { name: 'Apply' });
  const allCheckbox = screen.getByRole('checkbox', { name: allCheckboxText });

  expect(applyButton).toBeInTheDocument();
  expect(applyButton).toBeDisabled();

  userEvent.click(allCheckbox);
  expect(applyButton).not.toBeDisabled();

  userEvent.tab();
  expect(screen.getByRole('checkbox', { name: testClassA })).toHaveFocus();

  userEvent.click(applyButton);

  const title = screen.getByText(allCheckboxText);
  expect(title).toBeInTheDocument();
});

it('should NOT close dropdown when selecting a menu item', () => {
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  userEvent.click(screen.getByRole('checkbox', { name: allCheckboxText }));
  expect(screen.getByRole('menu')).toBeInTheDocument();
});

it('should close dropdown when Escape is pressed', () => {
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  userEvent.keyboard('{esc}');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

it('should apply the changes and show on reopening the dropdown', () => {
  render(<DropdownCheckbox {...dropdownProps} />);
  const dropdownBtn = screen.getByRole('button');
  userEvent.click(dropdownBtn);

  const allCheckbox = screen.getByRole('checkbox', { name: allCheckboxText });
  const applyBtn = screen.getByText('Apply');

  userEvent.click(allCheckbox);
  expect(allCheckbox).toBeChecked();
  expect(screen.getByRole('menu')).toBeInTheDocument();

  userEvent.click(applyBtn);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  userEvent.click(dropdownBtn);
  expect(allCheckbox).toBeChecked();
});
