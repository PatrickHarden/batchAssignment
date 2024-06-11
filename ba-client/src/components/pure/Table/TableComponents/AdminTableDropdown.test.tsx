import React from 'react';
import AdminTableDropdown from './AdminTableDropdown';
import { AdminAssessmentData } from '../../../container/HomePage/Admin/TableColumnDefinitions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Atom, Provider } from 'jotai';
import { adminOpenDialog } from '../../../../atoms/atoms';

export const mockScheduledAssessmentData: AdminAssessmentData = {
  grade: 'Grade 5',
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

export const mockInProgressAssessmentData: AdminAssessmentData = {
  grade: 'Grade 5',
  status: 'IN_PROGRESS',
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

describe('<AdminTableDropdown />', () => {
  it('should render the dropdown and set the adminOpenDialog atom to edit data', async () => {
    render(
      <Provider initialValues={[[adminOpenDialog, null]] as unknown as [Atom<any>, any]}>
        <AdminTableDropdown placeholder="Select" tableData={mockScheduledAssessmentData} />
      </Provider>
    );
    const dropdownButton = screen.getByRole('button', { name: 'Select' });
    userEvent.click(dropdownButton);

    const editOption = screen.getByRole('menuitem', { name: 'Edit Test' });
    expect(editOption).toBeInTheDocument();
    userEvent.click(editOption, {
      target: {
        innerText: 'Edit Test'
      }
    } as MouseEventInit);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render the dropdown and set the admin openDialogAtom to cancel data', async () => {
    render(
      <Provider initialValues={[[adminOpenDialog, null]] as unknown as [Atom<any>, any]}>
        <AdminTableDropdown placeholder="Select" tableData={mockScheduledAssessmentData} />
      </Provider>
    );

    const dropdownButton = screen.getByRole('button', { name: 'Select' });
    userEvent.click(dropdownButton);

    const editOption = screen.getByRole('menuitem', { name: 'Cancel Test' });
    expect(editOption).toBeInTheDocument();
    userEvent.click(editOption, {
      target: {
        innerText: 'Cancel Test'
      }
    } as MouseEventInit);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
