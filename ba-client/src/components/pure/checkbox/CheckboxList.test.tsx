import React from 'react';
import CheckboxList, { CheckboxListProps } from './CheckboxList';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const allClasses = 'All Classes';
const checkboxListProps: CheckboxListProps = {
  hasAllCheckbox: true,
  allCheckboxName: allClasses,
  listContent: [
    { title: 'Class A', id: '1' },
    { title: 'Class B', id: '2' },
    { title: 'Class C', id: '3' }
  ],
  preSelectedValues: undefined
};

const checkboxListPropsPreSelectedValues: CheckboxListProps = {
  hasAllCheckbox: true,
  listContent: [
    { title: 'Class A', id: '1' },
    { title: 'Class B', id: '2' },
    { title: 'Class C', id: '3' }
  ],
  preSelectedValues: ['2', '3']
};

it('should render the All Classes Checkbox and classes list', async () => {
  render(
    <MemoryRouter>
      <CheckboxList {...checkboxListProps} />
    </MemoryRouter>
  );

  const allClassLabel = screen.getByText(allClasses);
  const inputElArray = screen.getAllByRole('checkbox');

  expect(allClassLabel).toBeInTheDocument();
  expect(inputElArray).toHaveLength(4);
  expect(screen.getByText('Class A')).toBeInTheDocument();
  expect(screen.getByText('Class B')).toBeInTheDocument();
});

it('should correctly render which checkboxes are selected', async () => {
  render(
    <MemoryRouter>
      <CheckboxList {...checkboxListProps} />
    </MemoryRouter>
  );

  const allClassesCheckbox = screen.getByRole('checkbox', { name: 'All Classes' });
  const firstClassCheckbox = screen.getByRole('checkbox', { name: 'Class A' });
  expect(allClassesCheckbox).not.toBeChecked();

  fireEvent.click(allClassesCheckbox);
  expect(allClassesCheckbox).toBeChecked();
  expect(firstClassCheckbox).toBeChecked();

  fireEvent.click(firstClassCheckbox);

  expect(allClassesCheckbox).not.toBeChecked();
  expect(firstClassCheckbox).not.toBeChecked();
});

it('should render the preselected values as checked', async () => {
  render(
    <MemoryRouter>
      <CheckboxList {...checkboxListPropsPreSelectedValues} />
    </MemoryRouter>
  );

  const allClassesCheckbox = screen.getByRole('checkbox', { name: 'All Checkbox' });
  const firstClassCheckbox = screen.getByRole('checkbox', { name: 'Class A' });
  const secondClassCheckbox = screen.getByRole('checkbox', { name: 'Class B' });

  expect(allClassesCheckbox).not.toBeChecked();
  expect(firstClassCheckbox).not.toBeChecked();
  expect(secondClassCheckbox).toBeChecked();
});
