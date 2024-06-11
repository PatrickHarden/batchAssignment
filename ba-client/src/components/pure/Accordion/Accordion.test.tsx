import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultAccordion, OpenAll } from './Accordion.stories';

it('renders items and allows opening and closing', () => {
  render(<DefaultAccordion />);

  const title0 = 'title-0';
  const title0Content = 'Item 0';
  const title0Subtitle = 'subtitle-0';
  const title0Helper = 'helper-0';
  const item0 = screen.getByText(title0);

  expect(item0).toBeInTheDocument();
  screen.getByText(title0Subtitle);
  screen.getByText(title0Helper);
  expect(screen.queryByText(title0Content)).not.toBeInTheDocument();
  userEvent.click(item0);
  expect(screen.getByText(title0Content)).toBeInTheDocument();

  const title1 = 'title-1';
  const title1Content = 'Item 1';
  const item1 = screen.getByText(title1);

  expect(item1).toBeInTheDocument();
  expect(screen.queryByText(title1Content)).not.toBeInTheDocument();
  userEvent.click(item1);
  expect(screen.getByText(title0)).toBeInTheDocument();
});

it('opens all', () => {
  render(<OpenAll />);

  expect(screen.getByText('Item 0')).toBeInTheDocument();
  expect(screen.getByText('Item 1')).toBeInTheDocument();
  expect(screen.getByText('Item 2')).toBeInTheDocument();
});
