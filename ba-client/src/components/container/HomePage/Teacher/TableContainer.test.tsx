import React from 'react';
import TableContainer, { transformStudentResponseIntoTableData } from './TableContainer';
import { selectedFilters } from '../../FilterHeader/FiltersHeader.test';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import { selectedTeacherHomepageFiltersAtom } from '../../../../atoms/atoms';
import { useStudentsApi } from '../../../../hooks/apis/use-students-api';
import { Atom, Provider } from 'jotai';
import { openDialog } from '../../../../atoms/atoms';
import { render, screen } from '@testing-library/react';
import { mockNewAssessmentApiData } from '../../../pure/Table/TableComponents/MockTableData';

jest.mock('../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../hooks/apis/use-students-api', () => ({ useStudentsApi: jest.fn() }));

const TableContainerProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
          [openDialog, null],
          [selectedTeacherHomepageFiltersAtom, selectedFilters]
        ] as unknown as [Atom<any>, any]
      }
    >
      <TableContainer />
    </Provider>
  );
};

describe('<TableContainer />', () => {
  beforeEach(() => {
    (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);
  });

  it('should render the table container', () => {
    render(<TableContainerProvider />);

    expect(screen.getByText('TIME SPENT')).toBeInTheDocument();
  });

  it('should render no results', () => {
    (useStudentsApi as jest.Mock).mockReturnValue({ results: [] });
    render(
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [openDialog, null],
            [selectedTeacherHomepageFiltersAtom, selectedFilters]
          ] as unknown as [Atom<any>, any]
        }
      >
        <TableContainer />
      </Provider>
    );
  });
});

const assignedBy = 'White, Walter';
const studentName = 'Pinkman, Jesse';

describe('transformStudentResponseIntoTableData', () => {
  it('should handle missing filter', () => {
    const data = transformStudentResponseIntoTableData(mockNewAssessmentApiData);
    expect(data).toMatchObject([
      {
        action: true,
        assessmentId: 49575,
        assessmentPeriod: 'BEGINNING',
        assignedBy,
        benchmark: 'BEGINNING',
        daysSinceLastAssessment: null,
        daysSinceLastAssessmentOriginal: null,
        firstName: 'Jesse',
        initialTeacherAppraisal: null,
        lastName: 'Pinkman',
        name: studentName,
        proficiency: null,
        result: 'BR100L',
        status: 'COMPLETED',
        studentId: '34567',
        timeSpent: 5494950
      },
      {
        action: true,
        assessmentId: 49577,
        assessmentPeriod: 'MIDDLE',
        assignedBy,
        benchmark: 'MIDDLE',
        daysSinceLastAssessment: null,
        daysSinceLastAssessmentOriginal: null,
        firstName: 'Jesse',
        initialTeacherAppraisal: null,
        lastName: 'Pinkman',
        name: studentName,
        proficiency: null,
        result: '200L',
        status: 'IN_PROGRESS',
        studentId: '34567',
        timeSpent: 5494950
      },
      {
        action: true,
        assessmentId: 49576,
        assessmentPeriod: 'MIDDLE',
        assignedBy,
        benchmark: 'MIDDLE',
        daysSinceLastAssessment: null,
        daysSinceLastAssessmentOriginal: null,
        firstName: 'Jesse',
        initialTeacherAppraisal: null,
        lastName: 'Pinkman',
        name: studentName,
        proficiency: null,
        result: '200L',
        status: 'COMPLETED',
        studentId: '34567',
        timeSpent: 5494950
      },
      {
        action: true,
        assessmentId: 49578,
        assessmentPeriod: 'BEGINNING',
        assignedBy,
        benchmark: 'BEGINNING',
        daysSinceLastAssessment: null,
        daysSinceLastAssessmentOriginal: null,
        firstName: 'Alice',
        initialTeacherAppraisal: null,
        lastName: 'Wonderland',
        name: 'Wonderland, Alice',
        proficiency: null,
        result: '200L',
        status: 'NOT_STARTED',
        studentId: '509385',
        timeSpent: 5494950
      },
      {
        action: true,
        assessmentId: null,
        assessmentPeriod: 'MIDDLE',
        assignedBy: '',
        benchmark: '',
        daysSinceLastAssessment: null,
        daysSinceLastAssessmentOriginal: null,
        endDate: '',
        firstName: 'Alice',
        initialTeacherAppraisal: null,
        lastName: 'Wonderland',
        name: 'Wonderland, Alice',
        proficiency: null,
        result: null,
        startDate: '',
        status: 'NO_TEST_SCHEDULED',
        studentId: '509385',
        timeSpent: null
      }
    ]);
  });
});
