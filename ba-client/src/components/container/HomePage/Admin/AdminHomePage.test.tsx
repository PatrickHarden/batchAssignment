import React, { ReactElement, Suspense } from 'react';
import { Atom, Provider } from 'jotai';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminHomePage from './AdminHomePage';
import { useAdminSchoolYearsApi } from '../../../../hooks/apis/use-school-years-api';
import { type OrgResponse, useOrgsApi } from '../../../../hooks/apis/use-org-api';
import { type SDMNavCtx, getSDMNavCTXCookie } from '../../../../utils/cookie-util';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import { type SchoolYear } from '../../../../hooks/apis/use-school-years-api';
import {
  type AssessmentsResponse,
  useAdminAssessmentsApi
} from '../../../../hooks/apis/use-admin-assessments-api';
import {
  CurrentSchoolYear,
  adminOpenDialog,
  currentSchoolYearDetailsAtom
} from '../../../../atoms/atoms';
import { AdminAssessmentDataWithRequiredStartAndEnd } from '../../../pure/Dialog/EditAssessment/AdminEditAssessmentContent';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import ToastOutlet from '../../ToastOutlet/ToastOutlet';
import { AdminOpenEditDialog } from '../../../../atoms/atoms';

jest.mock('../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../hooks/apis/use-school-years-api', () => ({
  useAdminSchoolYearsApi: jest.fn()
}));
jest.mock('../../../../hooks/apis/use-org-api', () => ({
  useOrgsApi: jest.fn()
}));
jest.mock('../../../../hooks/apis/use-admin-assessments-api', () => ({
  useAdminAssessmentsApi: jest.fn()
}));
jest.mock('swr', () => ({
  useSWRConfig: jest.fn()
}));
jest.mock('swr/mutation', () => ({
  __esModule: true,
  default: jest.fn()
}));

const MOY = 'Middle of Year';

export const schoolYears: SchoolYear = [
  {
    startDate: '2023-01-01 00:00:00.0',
    endDate: '2023-12-31 00:00:00.0',
    description: '2023-2024 School Year',
    isCurrentCalendar: true,
    schoolYear: 2023
  },
  {
    startDate: '2023-01-03 00:00:00.0',
    endDate: '2023-12-31 00:00:00.0',
    description: '2023-2024 School Year',
    isCurrentCalendar: false,
    schoolYear: 2022
  }
];

const mockOrganizationName = 'SEVERNA PARK HIGH SCHOOL';

export const orgsResponse: OrgResponse = {
  results: [
    {
      availableGrades: [
        {
          code: 'k',
          name: 'Kindergarten'
        },
        {
          code: '1',
          name: 'Grade 1'
        },
        {
          code: '2',
          name: 'Grade 2'
        },
        {
          code: '3',
          name: 'Grade 3'
        }
      ],
      organizations: [
        {
          id: 8002,
          name: 'CROFTON ELEMENTARY SCHOOL',
          grades: ['k']
        },
        {
          id: 7926,
          name: mockOrganizationName,
          grades: ['1', '2', '3']
        },
        {
          id: 7940,
          name: 'WOODSIDE ELEMENTARY SCHOOL',
          grades: ['k']
        }
      ]
    }
  ]
};

const assessments: AssessmentsResponse = {
  results: [
    {
      organizationName: 'Bodkin Elementary School',
      grades: [
        {
          grade: '1',
          assessments: [
            {
              assignmentId: 49,
              period: 'BEGINNING',
              status: 'ASSIGNED',
              percentCompleted: '0',
              assignedByFirstName: 'sirisha',
              assignedByLastName: 'vuppu',
              startDate: '2023-03-26T03:00:00.000+00:00',
              endDate: '2023-04-23T03:00:00.000+00:00'
            },
            {
              assignmentId: 18,
              period: 'MIDDLE',
              status: 'ASSIGNED',
              percentCompleted: '0',
              assignedByFirstName: 'sirisha',
              assignedByLastName: 'vuppu',
              startDate: '2023-03-26T04:00:00.000+00:00',
              endDate: '2023-04-23T04:00:00.000+00:00'
            },
            {
              assignmentId: 17,
              period: 'END',
              status: 'ASSIGNED',
              percentCompleted: '0',
              assignedByFirstName: 'sirisha',
              assignedByLastName: 'vuppu',
              startDate: '2023-03-26T02:00:00.000+00:00',
              endDate: '2023-04-23T02:00:00.000+00:00'
            }
          ]
        },
        {
          grade: '2',
          assessments: [
            {
              assignmentId: 10,
              period: 'BEGINNING',
              status: 'ASSIGNED',
              percentCompleted: '0',
              assignedByFirstName: 'sirisha',
              assignedByLastName: 'vuppu',
              startDate: '2023-03-26T02:00:00.000+00:00',
              endDate: '2023-04-23T02:00:00.000+00:00'
            },
            {
              assignmentId: null,
              period: 'MIDDLE',
              status: 'NO_TEST_SCHEDULED',
              percentCompleted: null,
              assignedByFirstName: null,
              assignedByLastName: null,
              startDate: null,
              endDate: null
            },
            {
              assignmentId: null,
              period: 'END',
              status: 'NO_TEST_SCHEDULED',
              percentCompleted: null,
              assignedByFirstName: null,
              assignedByLastName: null,
              startDate: null,
              endDate: null
            }
          ]
        }
      ]
    }
  ]
};

const mockAdminAssessmentData: AdminAssessmentDataWithRequiredStartAndEnd = {
  grade: 'Grade 1',
  status: 'SCHEDULED',
  completed: null,
  period: 'BEGINNING',
  startDate: '03/26/3023 at 09:00 AM',
  endDate: '04/23/3023 at 09:00 AM',
  assignedBy: 'vuppu, sirisha',
  action: true,
  assessmentId: 49,
  site: 'Bodkin Elementary School',
  rowGrade: 'Grade 1'
};

const mockCurrentSchoolYearDetails: CurrentSchoolYear = {
  fullDescription: '3022-3023 School Year',
  shortDescription: '3022-23',
  schoolYear: '2021',
  startDate: '3022-08-05 00:00:00.0',
  endDate: '3023-08-05 00:00:00.0'
};

const mockSDMNavCtx: SDMNavCtx = {
  firstName: 'Ihor',
  name: 'Harmati',
  portalBaseUrl: 'https://digital-stage.scholastic.com',
  orgId: '7894',
  orgName: 'SEVERNA PARK HIGH SCHOOL',
  orgType: 'school',
  appCodes: ['srm'],
  staff: true,
  admin: true,
  extSessionId: 'b9bb8b88-1bda-4fcb-b0aa-ade44cb35f1f',
  extSessionEndpoint:
    'https://kle2zjsmk5.execute-api.us-east-1.amazonaws.com/stage/extendedsession',
  appCode: 'srm',
  appId: '52',
  parentOrgId: '7894',
  env: 'stage',
  role: 'educator',
  iamUserId: '98479023',
  user_id: '217099'
};

const mockSDMInfo: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456' };

const mockAdminEditDialog: AdminOpenEditDialog = {
  data: mockAdminAssessmentData,
  dialogType: 'edit'
};

const mockAdminCancelDialog: AdminOpenEditDialog = {
  data: mockAdminAssessmentData,
  dialogType: 'cancel'
};

interface TestWrapperProps {
  children: React.ReactNode;
}
function TestWrapper({ children }: TestWrapperProps): JSX.Element {
  return (
    <Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [sdmInfoAtom, mockSDMInfo],
              [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
            ] as unknown as [Atom<any>, any]
          }
        >
          {children}
        </Provider>
      </MemoryRouter>
    </Suspense>
  );
}

function TestWrapperWithEditDialog({ children }: TestWrapperProps): JSX.Element {
  return (
    <Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [sdmInfoAtom, mockSDMInfo],
              [adminOpenDialog, mockAdminEditDialog],
              [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
            ] as unknown as [Atom<any>, any]
          }
        >
          {children}
        </Provider>
      </MemoryRouter>
    </Suspense>
  );
}

function TestWrapperWithCancelDialog({ children }: TestWrapperProps): JSX.Element {
  return (
    <Suspense fallback="loading">
      <MemoryRouter>
        <Provider
          initialValues={
            [
              [sdmInfoAtom, mockSDMInfo],
              [adminOpenDialog, mockAdminCancelDialog],
              [currentSchoolYearDetailsAtom, mockCurrentSchoolYearDetails]
            ] as unknown as [Atom<any>, any]
          }
        >
          {children}
        </Provider>
      </MemoryRouter>
    </Suspense>
  );
}

describe('<AdminHomePage />', () => {
  beforeEach(() => {
    const mockMutate = jest.fn();
    const mockTrigger = jest.fn().mockResolvedValue(null);
    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      sdm_nav_ctx: mockSDMNavCtx
    });
    (useAdminSchoolYearsApi as jest.Mock).mockReturnValue(schoolYears);
    (useOrgsApi as jest.Mock).mockReturnValue(orgsResponse.results[0]);
    (useAdminAssessmentsApi as jest.Mock).mockReturnValue(assessments);
    (useSWRConfig as jest.Mock).mockReturnValue({ mutate: mockMutate });
    (useSWRMutation as jest.Mock).mockReturnValue({ trigger: mockTrigger });
  });

  it('should render with header and actions', () => {
    render(<AdminHomePage />, { wrapper: TestWrapper });

    const heading = screen.getByRole('heading', { name: /scholastic reading measure/i });
    const button = screen.getByRole('button', { name: /new assignment/i });
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should open assignment drawer', async () => {
    render(<AdminHomePage />, { wrapper: TestWrapper });

    const filterDrawer = screen.getByRole('button', { name: /filters/i });
    userEvent.click(filterDrawer);
    const syAccordionHeader = await screen.findByRole('heading', { name: /school year/i });
    expect(syAccordionHeader).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /select filters/i })).toBeInTheDocument();
  });

  it('should open delete drawer', async () => {
    render(<AdminHomePage />, { wrapper: TestWrapper });

    const deleteDrawerTrigger = screen.getByRole('button', { name: /delete a score/i });
    userEvent.click(deleteDrawerTrigger);
    const syAccordionHeader = await screen.findByRole('heading', { name: /Delete Score/i });
    expect(syAccordionHeader).toBeInTheDocument();
  });

  it('should show No Organizations Available Banner if no valid students exist', async () => {
    (useOrgsApi as jest.Mock).mockReturnValue({ organizations: [], availableGrades: [] });
    render(<AdminHomePage />, { wrapper: TestWrapper });

    expect(screen.getByText('No Organizations Available')).toBeInTheDocument();
  });

  it('should fail saving editing an assessment and show error toaster message', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({ trigger: () => Promise.reject() });
    render(
      <>
        <AdminHomePage />
        <ToastOutlet />
      </>,
      { wrapper: TestWrapperWithEditDialog }
    );

    const MOYRadioButton = screen.getByRole('radio', { name: MOY });
    userEvent.click(MOYRadioButton);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    expect(
      await screen.findByText('An error occurred with the assignment process. Please try again.')
    ).toBeInTheDocument();
  });

  it('should show toaster on successful assessment edit', async () => {
    render(
      <>
        <AdminHomePage />
        <ToastOutlet />
      </>,
      { wrapper: TestWrapperWithEditDialog }
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();

    const MOYRadioButton = screen.getByRole('radio', { name: MOY });
    userEvent.click(MOYRadioButton);
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
    userEvent.click(sevenPM);

    userEvent.click(saveButton);

    expect(
      await screen.findByText('The Scholastic Reading Measure was successfully edited.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('should close the cancelAssessment dialog', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({ trigger: () => Promise.reject() });
    render(
      <>
        <AdminHomePage />
        <ToastOutlet />
      </>,
      { wrapper: TestWrapperWithCancelDialog }
    );
    const keepAssessment = screen.getByRole('button', { name: 'Keep Assessment', exact: false });
    expect(keepAssessment).toBeInTheDocument();
    userEvent.click(keepAssessment);
    expect(keepAssessment).not.toBeInTheDocument();
  });

  it('should cancel an assessment via dialog and fail', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({ trigger: () => Promise.reject() });
    render(
      <>
        <AdminHomePage />
        <ToastOutlet />
      </>,
      { wrapper: TestWrapperWithCancelDialog }
    );
    const cancelButton = screen.getByRole('button', { name: 'Cancel Assessment', exact: false });
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
    expect(cancelButton).toBeDisabled();
    expect(
      await screen.findByText('An error occurred with the assignment process. Please try again.')
    ).toBeInTheDocument();
  });

  it('should cancel an assessment via dialog and pass', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({ trigger: () => Promise.resolve() });
    render(
      <>
        <AdminHomePage />
        <ToastOutlet />
      </>,
      { wrapper: TestWrapperWithCancelDialog }
    );
    const cancelButton = screen.getByRole('button', { name: 'Cancel Assessment', exact: false });
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
    expect(cancelButton).toBeDisabled();
    expect(
      await screen.findByText('The Scholastic Reading Measure was successfully canceled.')
    ).toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
  });
});
