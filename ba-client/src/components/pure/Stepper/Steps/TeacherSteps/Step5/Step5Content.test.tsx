import React from 'react';
import Step5Content from './Step5Content';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { isNextDisabledAtom, teacherStepperFormDataAtom } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import {
  mockStudentData,
  mockStudentDataNoPreviousLexiles
} from '../../../../Table/TableComponents/MockTableData';

const Step5ContentWithProvider = ({
  defaultValue = {}
}: {
  defaultValue?: Record<string, string>;
}) => {
  return (
    <Provider
      initialValues={
        [
          [
            teacherStepperFormDataAtom,
            { teacherAppraisal: defaultValue, students: mockStudentData }
          ],
          [isNextDisabledAtom, true]
        ] as [Atom<any>, any][]
      }
    >
      <Step5Content />
    </Provider>
  );
};

const Step5ContentNoLexileScoresWithProvider = ({
  defaultValue = {}
}: {
  defaultValue?: Record<string, string>;
}) => {
  return (
    <Provider
      initialValues={
        [
          [
            teacherStepperFormDataAtom,
            { teacherAppraisal: defaultValue, students: mockStudentDataNoPreviousLexiles }
          ],
          [isNextDisabledAtom, true]
        ] as [Atom<any>, any][]
      }
    >
      <Step5Content />
    </Provider>
  );
};

it('should render and not crash', () => {
  render(<Step5ContentWithProvider />);

  expect(
    screen.getByText(
      'All students you selected already have a recorded Lexile measure. Choose “Assign” to create the Scholastic Reading Measure assignment for these students.'
    )
  ).toBeInTheDocument();
});

it('should select a radio button on click', () => {
  render(<Step5ContentNoLexileScoresWithProvider />);
  const thirdToggleButton = screen.getAllByRole('radio')[1] as HTMLButtonElement;
  expect(thirdToggleButton.dataset.state).toBe('off');

  userEvent.click(thirdToggleButton);
  expect(thirdToggleButton.dataset.state).toBe('on');
});
