import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateRangePicker from './DateRangePicker';
import { act } from 'react-dom/test-utils';

describe('DateRangePicker component', () => {
  it('should render', () => {
    render(<DateRangePicker label="test" onSelect={() => ({})} selected={{ from: new Date() }} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should open popover', async () => {
    render(<DateRangePicker label="test" onSelect={() => ({})} selected={{ from: new Date() }} />);
    const input = screen.getAllByPlaceholderText('MM/DD/YYYY')[0];
    expect(input).toBeInTheDocument();
    userEvent.click(input);

    // work around floating-ui and jest bug
    // https://github.com/floating-ui/floating-ui/issues/1908#issuecomment-1301553793
    await act(async () => Promise.resolve);
  });
});
