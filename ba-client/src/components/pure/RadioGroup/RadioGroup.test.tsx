import React from 'react';
import RadioGroup from './RadioGroup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const buttonInfo = [
  { value: '1st', label: '1st label' },
  { value: '2nd', label: '2nd label' }
];

it('should have no selected radio buttons by default', () => {
  render(<RadioGroup buttonInfo={buttonInfo} />);

  expect(screen.getByText('1st label')).toBeInTheDocument();
});

it('should select a radio button on click', () => {
  render(<RadioGroup buttonInfo={buttonInfo} groupLabel="Mock Group Label" />);
  const firstRadioButton = screen.getByRole('radio', { name: '1st label' });
  expect(firstRadioButton).not.toBeChecked();

  userEvent.click(firstRadioButton);
  expect(firstRadioButton).toBeChecked();
});
