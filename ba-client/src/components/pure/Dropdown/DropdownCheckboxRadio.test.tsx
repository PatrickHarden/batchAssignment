import React from 'react';
import DropdownCheckboxRadio, { type DropdownCheckboxRadioProps } from './DropdownCheckboxRadio';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { selectedTeacherHomepageFiltersAtom } from '../../../atoms/atoms';
import userEvent from '@testing-library/user-event';

const beginningOfYear = 'Beginning of Year';
const middleOfYear = 'Middle of Year';
const endOfYear = 'End of Year';
const showAll = 'Show All';
const onlyMostRecent = 'Only Show Most Recent';
const onlyMostRecentTime = 'Only Show Most Recent Time Period';
const beginningAll = 'BEGINNING_ALL';
const beginningLatest = 'BEGINNING_LATEST';
const middleAll = 'MIDDLE_ALL';
const middleLatest = 'MIDDLE_LATEST';
const endAll = 'END_ALL';
const endLatest = 'END_LATEST';

const mockRadioButtons: DropdownCheckboxRadioProps = {
  header: 'Assessment Period:',
  content: [
    {
      title: beginningOfYear,
      id: beginningOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: beginningAll
        },
        {
          title: onlyMostRecentTime,
          defaultValue: false,
          id: beginningLatest
        }
      ]
    },
    {
      title: middleOfYear,
      id: middleOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: middleAll
        },
        {
          title: onlyMostRecent,
          defaultValue: false,
          id: middleLatest
        }
      ]
    },
    {
      title: endOfYear,
      id: endOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: endAll
        },
        {
          title: onlyMostRecent,
          defaultValue: false,
          id: endLatest
        }
      ]
    }
  ],
  applyButton: true,
  openDropdown: true
};

const mockRadioButtonPropsPreSelected: DropdownCheckboxRadioProps = {
  header: 'Assessment Period:',
  content: [
    {
      title: beginningOfYear,
      id: beginningOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: beginningAll
        },
        {
          title: onlyMostRecentTime,
          defaultValue: false,
          id: beginningLatest
        }
      ]
    },
    {
      title: middleOfYear,
      id: middleOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: middleAll
        },
        {
          title: onlyMostRecent,
          defaultValue: false,
          id: middleLatest
        }
      ]
    },
    {
      title: endOfYear,
      id: endOfYear,
      radio: [
        {
          title: showAll,
          defaultValue: true,
          id: endAll
        },
        {
          title: onlyMostRecent,
          defaultValue: false,
          id: endLatest
        }
      ]
    }
  ],
  applyButton: true,
  openDropdown: true,
  preSelectedValues: [middleAll, endLatest]
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

it('should toggle dropdown and focus on second element', () => {
  jest.useFakeTimers();
  render(<DropdownCheckboxRadio {...mockRadioButtonPropsPreSelected} />);
  const dropdownBtn = screen.getByRole('button');

  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  userEvent.click(dropdownBtn);
  const cancelBtn = screen.getByText('Cancel');
  const firstSelectedElem = screen.getByRole('checkbox', { name: middleOfYear });

  jest.runOnlyPendingTimers();
  expect(firstSelectedElem).toHaveFocus();
  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(cancelBtn).toBeInTheDocument();

  userEvent.click(cancelBtn);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  jest.useRealTimers();
});

it('should render the radioButtons according to the props', () => {
  render(<DropdownCheckboxRadio {...mockRadioButtons} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);

  expect(screen.getByText(onlyMostRecentTime)).toBeInTheDocument();
});

it('should disable apply button when no checkboxes are selected', () => {
  render(<DropdownCheckboxRadio {...mockRadioButtonPropsPreSelected} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);

  const secondCheckbox = screen.getByRole('checkbox', { name: middleOfYear });
  const thirdCheckbox = screen.getByRole('checkbox', { name: endOfYear });
  const applyBtn = screen.getByRole('button', { name: 'Apply' });

  userEvent.click(secondCheckbox);
  userEvent.click(thirdCheckbox);

  expect(applyBtn).toBeDisabled();
});

it('should close dropdown when Escape is pressed', () => {
  render(<DropdownCheckboxRadio {...mockRadioButtons} />);
  const dropdownBtn = screen.getByRole('button');

  userEvent.click(dropdownBtn);
  expect(screen.getByRole('menu')).toBeInTheDocument();
  userEvent.keyboard('{esc}');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

it('should apply the changes and show on reopening the dropdown', () => {
  render(<DropdownCheckboxRadio {...mockRadioButtons} />);
  const dropdownBtn = screen.getByRole('button');
  userEvent.click(dropdownBtn);

  const middleOfYearCheckbox = screen.getByRole('checkbox', { name: middleOfYear });
  userEvent.click(middleOfYearCheckbox);

  const applyBtn = screen.getByText('Apply');

  userEvent.click(applyBtn);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  userEvent.click(dropdownBtn);
  expect(middleOfYearCheckbox).toBeChecked();
  userEvent.tab();
  expect(middleOfYearCheckbox).toBeChecked();
});

it('should pre-select values if they exist', () => {
  render(
    <Provider
      initialValues={
        [
          [selectedTeacherHomepageFiltersAtom, { Year: ['2021-22'], Class: ['Test Class Name'] }]
        ] as unknown as [Atom<any>, any]
      }
    >
      <DropdownCheckboxRadio {...mockRadioButtonPropsPreSelected} />
    </Provider>
  );
});
