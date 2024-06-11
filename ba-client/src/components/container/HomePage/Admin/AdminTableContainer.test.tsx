import React from 'react';
import { getSDMNavCTXCookie, SDMNavCtx } from '../../../../utils/cookie-util';
import { render, screen } from '@testing-library/react';
import AdminTableContainer from './AdminTableContainer';
import { MemoryRouter } from 'react-router-dom';
import { Atom, Provider } from 'jotai';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import {
  initialOrgAndGradesAtom,
  assessmentAtom,
  adminFilterSchoolYearAtom,
  sitesAtom,
  fromDateAtom,
  toDateAtom,
  InitialOrg
} from '../../../../atoms/atoms';
import {
  useAdminAssessmentsApi,
  type AssessmentsResponse
} from '../../../../hooks/apis/use-admin-assessments-api';
import { initialAssessmentState } from '../FiltersDrawer/FiltersDrawer';

jest.mock('../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../hooks/apis/use-admin-assessments-api', () => ({
  useAdminAssessmentsApi: jest.fn()
}));

const assessments: AssessmentsResponse = {
  results: [
    {
      organizationName: 'SEVERNA PARK HIGH SCHOOL',
      grades: [
        {
          grade: '1',
          assessments: [
            {
              assignmentId: 9,
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
        },
        {
          grade: '3',
          assessments: [
            {
              assignmentId: null,
              period: 'BEGINNING',
              status: 'NO_TEST_SCHEDULED',
              percentCompleted: null,
              assignedByFirstName: null,
              assignedByLastName: null,
              startDate: null,
              endDate: null
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

const initialData: InitialOrg = {
  availableGrades: [
    { code: 'k', name: 'Kindergarten' },
    { code: '1', name: 'Grade 1' },
    { code: '2', name: 'Grade 2' }
  ],
  organizations: [
    { grades: ['k'], id: 1, name: 'SITE A' },
    { grades: ['1', '2'], id: 2, name: 'SITE B' }
  ],
  schoolYear: 2023,
  startDate: '2023-01-01 00:00:00.0',
  endDate: '2023-12-31 00:00:00.0'
};

describe('<AdminTableContainer />', () => {
  const sdmInfo: SDMNavCtx = {
    firstName: 'Ihor',
    name: 'Harmati',
    portalBaseUrl: 'https://digital-stage.scholastic.com',
    orgId: '7894',
    orgName: 'MAYO ELEMENTARY SCHOOL',
    orgType: 'school',
    appCodes: ['literacy', 'srm'],
    staff: true,
    admin: true,
    extSessionId: '3b953db6-1e28-41c0-9630-0db38511b177',
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

  beforeAll(() => {
    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      sdm_nav_ctx: sdmInfo
    });
  });
  // const schoolYearParam = schoolYearAtom ? schoolYearAtom : String(initialData.schoolYear);
  it('should render the admin table container', async () => {
    (useAdminAssessmentsApi as jest.Mock).mockReturnValue(assessments);
    render(
      <React.Suspense fallback="loading">
        <MemoryRouter>
          <Provider
            initialValues={
              [
                [sdmInfoAtom, { user_id: '1234', orgId: '123456' }],
                [initialOrgAndGradesAtom, initialData],
                [assessmentAtom, initialAssessmentState],
                [adminFilterSchoolYearAtom, '2023']
              ] as unknown as [Atom<any>, any]
            }
          >
            <AdminTableContainer
              orgIds={[1, 2]}
              grades={['k', '1', '2']}
              mappedSitesAndIds={{ 'SITE A': 1, 'SITE B': 2, year: 2023 }}
            />
          </Provider>
        </MemoryRouter>
      </React.Suspense>
    );

    expect(screen.getByText(/sites and users/i)).toBeInTheDocument();
  });

  it('should render with atom', async () => {
    (useAdminAssessmentsApi as jest.Mock).mockReturnValue(assessments);
    render(
      <React.Suspense fallback="loading">
        <MemoryRouter>
          <Provider
            initialValues={
              [
                [sdmInfoAtom, { user_id: '1234', orgId: '123456' }],
                [initialOrgAndGradesAtom, initialData],
                [assessmentAtom, initialAssessmentState],
                [adminFilterSchoolYearAtom, '2023'],
                [sitesAtom, [1, 2]],
                [fromDateAtom, new Date('2023-01-01')],
                [toDateAtom, new Date('2023-12-31')]
              ] as unknown as [Atom<any>, any]
            }
          >
            <AdminTableContainer
              orgIds={[1, 2]}
              grades={['k', '1', '2']}
              mappedSitesAndIds={{ 'SITE A': 1, 'SITE B': 2, year: 2022 }}
            />
          </Provider>
        </MemoryRouter>
      </React.Suspense>
    );

    expect(screen.getByText(/sites and users/i)).toBeInTheDocument();
  });
});
