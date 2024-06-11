import React from 'react';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { isNextDisabledAtom, adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import AdminStep5Content from './AdminStep5Content';

const Step5ContentWithProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [adminStepperFormDataAtom, { autoAssign: undefined }],
          [isNextDisabledAtom, true]
        ] as unknown as [Atom<any>, any][]
      }
    >
      <AdminStep5Content />
    </Provider>
  );
};

describe('<AdminStep5Content />', () => {
  it('should render and not crash', () => {
    render(<AdminStep5Content />);

    expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument();
  });

  it('should select a radio button on click', () => {
    render(<Step5ContentWithProvider />);
    const firstRadioButton = screen.getByRole('radio', { name: 'Yes' });
    expect(firstRadioButton).not.toBeChecked();
    userEvent.click(firstRadioButton);
    expect(firstRadioButton).toBeChecked();
  });
});
