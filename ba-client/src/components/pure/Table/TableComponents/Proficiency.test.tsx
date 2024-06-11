import React from 'react';
import { render, screen } from '@testing-library/react';
import Proficiency from './Proficiency';

describe('Proficiency', () => {
  it('should handle having a level', () => {
    render(<Proficiency proficiency="Advanced" />);
    const icon = screen.getByTestId('proficiency-icon');
    expect(icon).toHaveClass('blueDot');
  });

  it('should handle missing level', () => {
    render(<Proficiency proficiency={null} />);
    const icon = screen.getByTestId('proficiency-icon');
    expect(icon).not.toHaveClass();
  });
});
