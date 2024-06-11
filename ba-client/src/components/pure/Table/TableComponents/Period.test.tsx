import React from 'react';
import { render, screen } from '@testing-library/react';
import Period from './Period';

describe('Period', () => {
  it('should render beginning', async () => {
    render(<Period period="BEGINNING" />);
    const text = await screen.findByText('Beginning of Year');
    expect(text).toBeInTheDocument();
  });

  it('should render middle', async () => {
    render(<Period period="MIDDLE" />);
    const text = await screen.findByText('Middle of Year');
    expect(text).toBeInTheDocument();
  });

  it('should render end', async () => {
    render(<Period period="END" />);
    const text = await screen.findByText('End of Year');
    expect(text).toBeInTheDocument();
  });

  it('should render empty for missing value', () => {
    render(<Period period="" />);
    let text = screen.queryByText('Beginning of Year');
    expect(text).not.toBeInTheDocument();
    text = screen.queryByText('Middle of Year');
    expect(text).not.toBeInTheDocument();
    text = screen.queryByText('End of Year');
    expect(text).not.toBeInTheDocument();
  });
});
