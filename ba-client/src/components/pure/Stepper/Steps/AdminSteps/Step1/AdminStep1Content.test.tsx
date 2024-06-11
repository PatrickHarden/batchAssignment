import React from 'react';
import AdminStep1Content from './AdminStep1Content';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { isNextDisabledAtom, adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';

const Step1ContentWithProvider = ({ defaultValue = '' }: { defaultValue?: string }) => {
  return (
    <Provider
      initialValues={
        [
          [adminStepperFormDataAtom, { assessmentPeriod: defaultValue }],
          [isNextDisabledAtom, true]
        ] as unknown as [Atom<any>, any][]
      }
    >
      <AdminStep1Content />
    </Provider>
  );
};

describe('<AdminStep1Content />', () => {
  it('should render and not crash', () => {
    render(<AdminStep1Content />);

    expect(screen.getByRole('radio', { name: 'Beginning of Year' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Middle of Year' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'End of Year' })).toBeInTheDocument();
  });

  it('should select the Middle of Year radio button by default', () => {
    render(<Step1ContentWithProvider defaultValue="MOY" />);

    expect(screen.getByText('Middle of Year')).toBeInTheDocument();
    expect(isNextDisabledAtom.init).toBe(false);
  });

  it('should select a radio button on click', () => {
    render(<Step1ContentWithProvider />);
    const firstRadioButton = screen.getByRole('radio', {
      name: 'Beginning of Year'
    });
    expect(firstRadioButton).not.toBeChecked();

    userEvent.click(firstRadioButton);
    expect(firstRadioButton).toBeChecked();
  });
});
