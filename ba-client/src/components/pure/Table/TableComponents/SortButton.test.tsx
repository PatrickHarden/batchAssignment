import { render, screen } from '@testing-library/react';
import React from 'react';
import SortButton from './SortButton';
import userEvent from '@testing-library/user-event';

describe('SortButton', () => {
  it('should have arrows', () => {
    const spy = jest.fn();
    render(<SortButton isAlphabetical onSortAlphabetically={spy} columnId="testColumn" />);
    expect(screen.getByTestId('sortAscending')).toBeInTheDocument();
    expect(screen.getByTestId('sortDescending')).toBeInTheDocument();
  });

  it('should switch sorting on click', () => {
    const spy = jest.fn();
    render(<SortButton isAlphabetical onSortAlphabetically={spy} columnId="testColumn" />);
    userEvent.click(screen.getByTestId('sortDescending'));
    expect(spy).toBeCalledWith('testColumn', false);
  });
});
