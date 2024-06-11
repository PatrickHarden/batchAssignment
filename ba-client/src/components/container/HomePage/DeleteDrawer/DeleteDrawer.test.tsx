import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteDrawer from './DeleteDrawer';

describe('<DeleteDrawer />', () => {
  it('should require a setOpen prop to be passed', () => {
    expect(() => render(<DeleteDrawer />)).toThrowError(
      'DeleteDrawer requires setOpen to be passed'
    );
  });

  it('should render with setOpen passed in', () => {
    const spy = jest.fn();
    render(<DeleteDrawer setOpen={spy} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Score' })).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    const spy = jest.fn();
    render(<DeleteDrawer setOpen={spy} />);
    expect(spy).not.toBeCalled();
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(spy).toBeCalledWith(false);
  });

  it('should close modal on delete', () => {
    const spy = jest.fn();
    render(<DeleteDrawer setOpen={spy} />);
    expect(spy).not.toBeCalled();
    userEvent.click(screen.getByRole('button', { name: 'Delete Score' }));
    expect(spy).toBeCalledWith(false);
  });
});
