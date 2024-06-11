import React from 'react';
import ToggleGroup from './ToggleGroup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const buttonInfo = [
  { value: '1st', label: '1st label' },
  { value: '2nd', label: '2nd label' }
];

describe('<Step2Content/>', () => {
  it('should have no selected radio buttons by default', () => {
    render(<ToggleGroup toggleButtonInfo={buttonInfo} />);

    expect(screen.getByText('1st label')).toBeInTheDocument();
  });

  it('should select and unselect a toggle button on click', () => {
    render(<ToggleGroup toggleButtonInfo={buttonInfo} toggleGroupLabel="Mock Group Label" />);
    const firstToggleButton = screen.getByRole('radio', { name: '1st label' });
    expect(firstToggleButton).not.toBeChecked();

    userEvent.click(firstToggleButton);
    expect(firstToggleButton).toBeChecked();

    userEvent.click(firstToggleButton);
    expect(firstToggleButton).not.toBeChecked();
  });
});
