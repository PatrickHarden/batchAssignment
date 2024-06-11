import React from 'react';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import {
  type AdminEditAssessment,
  adminEditAssessmentAtom,
  currentSchoolYearDetailsAtom,
  CurrentSchoolYear
} from '../../../../atoms/atoms';
import { userEvent } from '@storybook/testing-library';
import {
  AdminAssessmentDataWithRequiredStartAndEnd,
  AdminEditAssessmentContent
} from './AdminEditAssessmentContent';
import { MemoryRouter } from 'react-router-dom';

const blankAdminEditAssessmentData: AdminEditAssessment = {
  assessmentId: null,
  startDate: undefined,
  endDate: undefined,
  benchmark: undefined,
  grade: undefined,
  site: undefined
};

export const mockAdminAssessmentData: AdminAssessmentDataWithRequiredStartAndEnd = {
  grade: null,
  status: 'SCHEDULED',
  completed: null,
  period: 'BEGINNING',
  startDate: '06/16/2023 at 11:00 AM',
  endDate: '06/22/2023 at 08:00 AM',
  assignedBy: 'vuppu, sirisha',
  action: true,
  assessmentId: 49,
  site: 'Bodkin Elementary School',
  rowGrade: 'Grade 5'
};

const currentSchoolYearDetails: CurrentSchoolYear = {
  fullDescription: '',
  shortDescription: '2021-22',
  schoolYear: '2022',
  startDate: '2022-08-04 00:00:00.0',
  endDate: '2023-08-05 00:00:00.0'
};

const AdminEditAssessmentProvider = () => {
  return (
    <React.Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [adminEditAssessmentAtom, blankAdminEditAssessmentData],
              [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
            ] as unknown as [Atom<any>, any]
          }
        >
          <AdminEditAssessmentContent
            editAssessmentData={mockAdminAssessmentData}
            disableActionButton={(value) => !value}
          />
        </Provider>
      </MemoryRouter>
    </React.Suspense>
  );
};

describe('<AdminEditAssessmentContent />', () => {
  it('should open the edit SRM assessment dialog', async () => {
    render(<AdminEditAssessmentProvider />);

    expect(screen.getByText('Bodkin Elementary School - Grade 5')).toBeInTheDocument();
  });

  it('should make edits to an SRM assessment', async () => {
    render(<AdminEditAssessmentProvider />);

    const assessmentPeriodText = screen.getByText('Assessment Period:');
    expect(assessmentPeriodText).toBeInTheDocument();

    const BOYRadioButton = screen.getByRole('radio', { name: 'Beginning of Year' });
    const MOYRadioButton = screen.getByRole('radio', { name: 'Middle of Year' }); // assessment period: MOY

    expect(BOYRadioButton).toBeChecked();
    expect(MOYRadioButton).not.toBeChecked();
    userEvent.click(MOYRadioButton);
    expect(BOYRadioButton).not.toBeChecked();
    expect(MOYRadioButton).toBeChecked();

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

    await screen.findByRole('menu', { hidden: true });

    const sevenPM = await screen.findByRole('menuitem', { name: '7:00 PM', hidden: true });
    expect(sevenPM).toBeInTheDocument();
    userEvent.click(sevenPM, { target: { innerText: '7:00 PM' } } as MouseEventInit);

    const endDateInput = await screen.findByRole('textbox', {
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
