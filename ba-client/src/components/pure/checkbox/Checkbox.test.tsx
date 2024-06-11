import React from 'react';
import Checkbox, { CheckboxProps } from './Checkbox';
import { render, screen } from '@testing-library/react';

const mockCheckboxProps: CheckboxProps = {
  isChecked: false,
  handleChange: jest.fn(),
  value: '123',
  id: '123'
};

it('should render a checkbox and be able to toggle the checked state', () => {
  render(<Checkbox {...mockCheckboxProps} />);
  const inputEl = screen.getByRole('checkbox');

  expect(inputEl).toBeInTheDocument();
});
