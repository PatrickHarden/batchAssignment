import React from 'react';
import { render, screen } from '@testing-library/react';
import Appraisal from './Appraisal';

describe('Appraisal', () => {
  it('should render above level', async () => {
    render(<Appraisal appraisal="ABOVE_LEVEL" />);
    const text = await screen.findByText('Above Grade Level');
    expect(text).toBeInTheDocument();
  });

  it('should render on level', async () => {
    render(<Appraisal appraisal="ON_LEVEL" />);
    const text = await screen.findByText('On Grade Level');
    expect(text).toBeInTheDocument();
  });

  it('should render below level', async () => {
    render(<Appraisal appraisal="BELOW_LEVEL" />);
    const text = await screen.findByText('Below Grade Level');
    expect(text).toBeInTheDocument();
  });

  it('should render empty for missing value', () => {
    render(<Appraisal appraisal={null} />);
    let text = screen.queryByText('Below Grade Level');
    expect(text).not.toBeInTheDocument();
    text = screen.queryByText('Above Grade Level');
    expect(text).not.toBeInTheDocument();
    text = screen.queryByText('On Grade Level');
    expect(text).not.toBeInTheDocument();
  });
});
