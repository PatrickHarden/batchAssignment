import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerMessage, { BannerMessageProps, BannerMessageTheme } from './BannerMessage';

const defaultBannerProps: BannerMessageProps = {
  children: <div>Unit Testing</div>,
  theme: BannerMessageTheme.Warning,
  isDismissible: true
};

it('should render a banner message with default theme warning', async () => {
  render(<BannerMessage {...defaultBannerProps} />);

  const message = screen.getByText('Unit Testing');
  const button = screen.queryByRole('button');

  expect(message).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});
