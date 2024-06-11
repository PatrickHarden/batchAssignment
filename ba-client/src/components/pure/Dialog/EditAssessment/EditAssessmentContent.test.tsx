import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Atom, Provider } from 'jotai';
import {
  type CurrentSchoolYear,
  type EditAssessment,
  currentSchoolYearDetailsAtom,
  editAssessmentAtom
} from '../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';

import { EditAssessmentContent } from './EditAssessmentContent';
import type { TableData } from '../../../../hooks/useTable/useTable';
import { formatDate } from '../../../../utils/format-date';

export const blankEditAssessmentData: EditAssessment = {
  assessmentId: '',
  startDate: undefined,
  endDate: undefined,
  benchmark: undefined,
  teacherAppraisal: undefined
};

const mockSelectedStudent: TableData = {
  name: 'C, Cal',
  daysSinceLastAssessment: null,
  status: 'NOT_STARTED',
  assessmentPeriod: 'BEGINNING',
  startDate: formatDate('2023-01-29T05:00:00.000-05:00'),
  endDate: formatDate('2023-02-27T05:00:00.000-05:00'),
  result: null,
  proficiency: null,
  timeSpent: 0,
  assignedBy: 'Harmati, Ihor',
  initialTeacherAppraisal: 'ON_LEVEL',
  studentId: '230593',
  assessmentId: 78,
  daysSinceLastAssessmentOriginal: null,
  benchmark: 'BEGINNING',
  firstName: 'Cal',
  lastName: 'C',
  action: true
};

const EditAssessmentProvider = () => {
  return (
    <React.Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
              [editAssessmentAtom, blankEditAssessmentData]
            ] as unknown as [Atom<any>, any]
          }
        >
          <EditAssessmentContent
            editStudentData={mockSelectedStudent}
            disableActionButton={(value) => !value}
          />
        </Provider>
      </MemoryRouter>
    </React.Suspense>
  );
};

export const currentSchoolYearDetails: CurrentSchoolYear = {
  fullDescription: '',
  shortDescription: '2021-22',
  schoolYear: '2021',
  startDate: '2022-08-04 00:00:00.0',
  endDate: '2022-08-05 00:00:00.0'
};

describe('<EditAssessmentContent />', () => {
  it('should open the edit SRM assessment dialog', async () => {
    render(<EditAssessmentProvider />);

    expect(screen.getByText('Cal C')).toBeInTheDocument();
  });

  it('should make edits to an SRM assessment', async () => {
    render(<EditAssessmentProvider />);

    const assessmentPeriodText = screen.getByText('Assessment Period:');
    expect(assessmentPeriodText).toBeInTheDocument();

    const BOYRadioButton = screen.getByRole('radio', { name: 'Beginning of Year' });
    const MOYRadioButton = screen.getByRole('radio', { name: 'Middle of Year' }); // assessment period: MOY
    const BelowLevelRadioButton = screen.getByRole('radio', { name: 'Below Grade Level' }); // assessment period: MOY
    const OnLevelRadioButton = screen.getByRole('radio', { name: 'On Grade Level' }); // assessment period: MOY
    expect(BOYRadioButton).toBeChecked();
    expect(MOYRadioButton).not.toBeChecked();
    userEvent.click(MOYRadioButton);
    expect(BOYRadioButton).not.toBeChecked();
    expect(MOYRadioButton).toBeChecked();

    userEvent.click(OnLevelRadioButton);
    expect(BelowLevelRadioButton).not.toBeChecked();
    expect(OnLevelRadioButton).toBeChecked();
    userEvent.click(BelowLevelRadioButton);
    expect(OnLevelRadioButton).not.toBeChecked();

    const startDateInput = screen.getByRole('textbox', {
      name: 'Start Date: Press DOWN ARROW key to select available dates'
    });
    expect(startDateInput).toBeInTheDocument();
    userEvent.click(startDateInput);
    const dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();
    const dayFifteen = screen.getByRole('gridcell', { name: '15' });
    expect(dayFifteen).toBeInTheDocument();

    const startTimeMenu = await screen.findByTitle('startTime-toggle');
    userEvent.click(startTimeMenu);

    const sevenAM = screen.getByText('7:00 AM');
    expect(sevenAM).toBeInTheDocument();
    userEvent.click(sevenAM);

    const endDateInput = screen.getByRole('textbox', {
      name: 'End Date: Press DOWN ARROW key to select available dates'
    });
    userEvent.click(endDateInput);
    const endDialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(endDialog).toBeInTheDocument();
    const daySixteen = screen.getByRole('gridcell', { name: '16' });

    expect(daySixteen).toBeInTheDocument();
    userEvent.click(daySixteen);
    expect(screen.getByText('Start Date:')).toBeInTheDocument();
  });
});
