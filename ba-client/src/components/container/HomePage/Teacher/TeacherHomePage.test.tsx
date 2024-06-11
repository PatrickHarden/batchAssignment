import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage, { getClassIds, getAssessmentPeriod } from './TeacherHomePage';
import { getSDMNavCTXCookie } from '../../../../utils/cookie-util';
import { useSectionsApi } from '../../../../hooks/apis/use-class-sections-api';
import { useStudentsApi } from '../../../../hooks/apis/use-students-api';
import { MemoryRouter } from 'react-router-dom';
import { Atom, Provider } from 'jotai';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import {
  type TeacherStepperData,
  currentSchoolYearDetailsAtom,
  openDialog,
  selectedTeacherHomepageFiltersAtom,
  CurrentSchoolYear
} from '../../../../atoms/atoms';
import {
  mockNewAssessmentApiData,
  mockStudentData
} from '../../../pure/Table/TableComponents/MockTableData';
import userEvent from '@testing-library/user-event';
import { selectedFilters, schoolYears } from '../../FilterHeader/FiltersHeader.test';
import { useSchoolYearsApi } from '../../../../hooks/apis/use-school-years-api';
import { formatDate } from '../../../../utils/format-date';
import ToastOutlet from '../../ToastOutlet/ToastOutlet';

jest.mock('../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../hooks/apis/use-class-sections-api', () => ({ useSectionsApi: jest.fn() }));
jest.mock('../../../../hooks/apis/use-students-api', () => ({ useStudentsApi: jest.fn() }));
jest.mock('../../../../hooks/apis/use-school-years-api', () => ({ useSchoolYearsApi: jest.fn() }));
jest.mock('@scholastic/volume-react', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

export const sections = [
  {
    id: 87573,
    organizationId: 7926,
    primaryTeacherId: 227807,
    name: "Dee's Class",
    period: null,
    lowGrade: 3,
    highGrade: 4,
    schoolYear: 2022,
    hasStudents: true
  },
  {
    id: 87570,
    organizationId: 7926,
    primaryTeacherId: 227807,
    name: 'test class',
    period: null,
    lowGrade: 4,
    highGrade: 4,
    schoolYear: 2022,
    hasStudents: true
  }
];

const HomePageProvider = () => {
  return (
    <React.Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
              [openDialog, { data: mockStudentData[3], index: 3, dialogType: 'edit' }],
              [selectedTeacherHomepageFiltersAtom, selectedFilters],
              [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
            ] as unknown as [Atom<any>, any]
          }
        >
          <HomePage />
          <ToastOutlet />
        </Provider>
      </MemoryRouter>
    </React.Suspense>
  );
};

export const mockCurrentSchoolYearDetails: CurrentSchoolYear = {
  fullDescription: '2021-2022 School Year',
  shortDescription: '2021-22',
  schoolYear: '2021',
  startDate: '2022-08-05 00:00:00.0',
  endDate: '2022-08-05 00:00:00.0'
};

const editDialogTitle = 'Edit SRM Assessment';

describe('<TeacherHomePage />', () => {
  beforeEach(() => {
    (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);
    (useSchoolYearsApi as jest.Mock).mockReturnValue(schoolYears);
    (useSectionsApi as jest.Mock).mockReturnValue(sections);
  });

  beforeAll(() => {
    const sdmToken =
      '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      portalBaseUrl: decodeURIComponent(sdmToken)
    });
  });

  it('should open the edit SRM assessment dialog', async () => {
    render(<HomePageProvider />);

    expect(screen.getByText(editDialogTitle)).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');
    userEvent.click(cancelButton);
    expect(screen.queryByText(editDialogTitle)).not.toBeInTheDocument();
    const stepperData: TeacherStepperData = {
      classes: ['87573'],
      assessmentPeriod: 'MIDDLE',
      dateTime: {
        startDate: undefined,
        startTime: null,
        endDate: undefined,
        endTime: null
      },
      students: [
        {
          name: 'C, Cal',
          daysSinceLastAssessment: null,
          status: 'CANCELED',
          assessmentPeriod: 'BEGINNING',
          startDate: formatDate('2023-01-29T05:00:00.000-05:00'),
          endDate: formatDate('2023-02-27T05:00:00.000-05:00'),
          result: null,
          proficiency: null,
          timeSpent: 0,
          assignedBy: 'Harmati, Ihor',
          initialTeacherAppraisal: 'ON_LEVEL',
          studentId: '230593',
          assessmentId: 44,
          daysSinceLastAssessmentOriginal: null,
          benchmark: 'BEGINNING',
          firstName: 'Cal',
          lastName: 'C',
          action: true
        }
      ],
      teacherAppraisal: {}
    };
    const emptyStepperData: TeacherStepperData = {
      classes: [],
      assessmentPeriod: '',
      dateTime: {
        startDate: undefined,
        startTime: null,
        endDate: undefined,
        endTime: null
      },
      students: [],
      teacherAppraisal: {}
    };
    const classIdTest = getClassIds(stepperData, ['12345']);
    expect(classIdTest).toEqual(['87573']);
    const emptyClassIdTest = getClassIds(emptyStepperData, ['12345']);
    expect(emptyClassIdTest).toEqual(['12345']);
    const stepperDataAssessmentPeriod = getAssessmentPeriod(stepperData);
    expect(stepperDataAssessmentPeriod).toEqual(['MIDDLE_ALL']);
    const stepperDataDefaultAssessmentPeriod = getAssessmentPeriod(emptyStepperData);
    expect(stepperDataDefaultAssessmentPeriod).toEqual(['BEGINNING_ALL']);
  });

  it('should open the cancel SRM assessment dialog', async () => {
    (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);

    render(
      <React.Suspense fallback="loading">
        <MemoryRouter>
          <Provider
            initialValues={
              [
                [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
                [openDialog, { data: mockStudentData[3], index: 3, dialogType: 'cancel' }],
                [selectedTeacherHomepageFiltersAtom, selectedFilters],
                [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
              ] as unknown as [Atom<any>, any]
            }
          >
            <HomePage />
          </Provider>
        </MemoryRouter>
      </React.Suspense>
    );

    const cancelAssessmentButton = screen.getByRole('button', { name: 'Cancel Assessment' });
    userEvent.click(cancelAssessmentButton);
  });

  it('should not open the cancel SRM assessment dialog', async () => {
    (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);

    render(
      <React.Suspense fallback="loading">
        <MemoryRouter>
          <Provider
            initialValues={
              [
                [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
                [openDialog, null],
                [selectedTeacherHomepageFiltersAtom, {}],
                [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
              ] as unknown as [Atom<any>, any]
            }
          >
            <HomePage />
          </Provider>
        </MemoryRouter>
      </React.Suspense>
    );

    expect(screen.getByText('Scholastic Reading Measure')).toBeInTheDocument();
  });

  it('should make edits to an SRM assessment and rerender students', () => {
    (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);

    render(<HomePageProvider />);

    const assessmentPeriodText = screen.getByText('Student Name:');
    expect(assessmentPeriodText).toBeInTheDocument();

    const firstRadioButton = screen.getByRole('radio', { name: 'Beginning of Year' });
    expect(firstRadioButton).not.toBeChecked();
    userEvent.click(firstRadioButton);
    expect(firstRadioButton).toBeChecked();
    const editAssessmentButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(editAssessmentButton);

    const BOYTest = screen.getAllByText('Beginning of Year');
    expect(BOYTest.length).toEqual(4);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
