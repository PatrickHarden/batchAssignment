import React from 'react';
import { screen, render } from '@testing-library/react';
import Footer from './Footer';

it('should contain the all the text', () => {
  render(<Footer />);

  expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  expect(screen.getByText('Terms of Use')).toBeInTheDocument();
  expect(
    screen.getByText(`TM ® & © ${new Date().getFullYear()} Scholastic Inc. All Rights Reserved.`)
  ).toBeInTheDocument();
});
