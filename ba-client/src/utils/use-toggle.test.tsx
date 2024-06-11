import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useToggle from './use-toggle';

const UseToggleWrapper = ({ isOn: isOnInitial }: { isOn: boolean }) => {
  const { isOn, toggle } = useToggle(isOnInitial);

  return (
    <button type="button" onClick={toggle}>
      {isOn ? 'is on' : 'is off'}
    </button>
  );
};

describe('useToggle()', () => {
  it('should respect the initial state', () => {
    render(<UseToggleWrapper isOn />);

    expect(screen.getByText('is on')).toBeTruthy();
  });

  it('should toggle the state', () => {
    render(<UseToggleWrapper isOn={false} />);

    expect(screen.getByText('is off')).toBeTruthy();

    fireEvent.click(screen.getByText('is off') as HTMLElement);

    expect(screen.getByText('is on')).toBeTruthy();
  });
});
