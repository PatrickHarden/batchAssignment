import React from 'react';
import Step2Content from './Step2Content';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { isNextDisabledAtom, teacherStepperFormDataAtom } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';

const Step2ContentWithProvider = ({ defaultValue = '' }: { defaultValue?: string }) => {
  return (
    <Provider
      initialValues={
        [
          [teacherStepperFormDataAtom, { assessmentPeriod: defaultValue }],
          [isNextDisabledAtom, true]
        ] as unknown as [Atom<any>, any][]
      }
    >
      <Step2Content />
    </Provider>
  );
};
describe('<Step2Content/>', () => {
  it('should render and not crash', () => {
    render(<Step2Content />);

    expect(screen.getByRole('radio', { name: 'Beginning of Year' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Middle of Year' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'End of Year' })).toBeInTheDocument();
  });

  it('should select a radio button on click', () => {
    render(<Step2ContentWithProvider />);
    const firstRadioButton = screen.getByRole('radio', {
      name: 'Beginning of Year'
    });
    expect(firstRadioButton).not.toBeChecked();

    userEvent.click(firstRadioButton);
    expect(firstRadioButton).toBeChecked();
  });
});

it('should select the Middle of Year radio button by default', () => {
  render(<Step2ContentWithProvider defaultValue="MOY" />);

  expect(screen.getByText('Middle of Year')).toBeInTheDocument();
  expect(isNextDisabledAtom.init).toBe(false);
});

it('should select a radio button on click', () => {
  render(<Step2ContentWithProvider />);
  const firstRadioButton = screen.getAllByRole('radio')[0] as HTMLButtonElement;
  expect(firstRadioButton.dataset.state).toBe('unchecked');

  userEvent.click(firstRadioButton);
  expect(firstRadioButton.dataset.state).toBe('checked');
});
