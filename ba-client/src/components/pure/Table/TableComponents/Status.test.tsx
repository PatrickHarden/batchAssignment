import React from 'react';
import { render, screen } from '@testing-library/react';
import Status from './Status';

describe('Status', () => {
  it('should display assigned status', () => {
    render(<Status status="ASSIGNED" />);
    expect(screen.getByText('Assigned')).toBeInTheDocument();
  });

  it('should display in progress status', () => {
    render(<Status status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should display no test scheduled status', () => {
    render(<Status status="NO_TEST_SCHEDULED" />);
    expect(screen.getByText('No Test Scheduled')).toBeInTheDocument();
  });

  it('should throw on null value', () => {
    expect(() => render(<Status status={null} />)).toThrow();
  });
});
