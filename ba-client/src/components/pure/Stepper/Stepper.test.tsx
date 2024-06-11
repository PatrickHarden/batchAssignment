import React from 'react';
import Stepper, { StepperProps, preloadStudentsApi, getTeacherAppraisal } from './Stepper';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { getSDMNavCTXCookie } from '../../../utils/cookie-util';
import { Provider, Atom } from 'jotai';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import { useSchoolYearsApi } from '../../../hooks/apis/use-school-years-api';
import {
  teacherStepperFormDataAtom,
  isNextDisabledAtom,
  currentSchoolYearDetailsAtom,
  type TeacherStepperData
} from '../../../atoms/atoms';
import { Env } from '../../../utils/cookie-util';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from '@remix-run/router';

const firstChild = 'First Child';
const middlePeriod = 'MIDDLE';
const currentSchoolYearDetails = {
  fullDescription: '',
  shortDescription: '',
  schoolYear: '2021',
  startDate: '',
  endDate: ''
};

const mockReviewStepperProps: StepperProps = {
  totalSteps: 3,
  children: [
    <div key={1}>First Child</div>,
    <div key={2}>Second Child</div>,
    <div key={3}>Third Child</div>,
    <div key={4}>Review Child</div>
  ],
  hasReviewPage: true,
  reviewButtonText: 'Assign',
  finalStepText: 'Review',
  navigatesOnCancel: true
};

const mockSkipToStepStepperProps: StepperProps = {
  totalSteps: 4,
  children: [
    <div key={0}>First Child</div>,
    <div key={1}>Second Child</div>,
    <div key={2}>Third Child</div>,
    <div key={3}>Fourth Child</div>,
    <div key={4}>Review Child</div>
  ],
  hasReviewPage: false,
  finalStepText: 'Assign',
  canSkipToStep: true
};

const mockSkipToStepStepperPropsWithReview: StepperProps = {
  totalSteps: 4,
  children: [
    <div key={0}>First Child</div>,
    <div key={1}>Second Child</div>,
    <div key={2}>Third Child</div>,
    <div key={3}>Fourth Child</div>,
    <div key={4}>Review Child</div>
  ],
  hasReviewPage: true,
  finalStepText: 'Review',
  canSkipToStep: true
};

const mockDefaultStepperProps: StepperProps = {
  totalSteps: 2,
  children: [<div key={1}>First Child</div>, <div key={2}>Second Child</div>]
};

jest.mock('../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../hooks/apis/use-school-years-api', () => ({
  useSchoolYearsApi: jest.fn()
}));

beforeAll(() => {
  const sdmToken =
    '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: decodeURIComponent(sdmToken)
  });
});

beforeEach(() => {
  (useSchoolYearsApi as jest.Mock).mockReturnValue([
    {
      startDate: '2021-08-01',
      endDate: '2022-07-31',
      description: '2021-2022 School Year',
      isCurrentCalendar: true,
      schoolYear: 2021
    }
  ]);
});

it('should render the stepper and not show the previous button', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    text: jest.fn(() => Promise.resolve('Hello, World!'))
  } as unknown as Promise<Response>);

  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, false],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockReviewStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const previousBtn = screen.queryByText('Previous');
  const cancelBtn = screen.getByText('Cancel');
  const nextBtn = screen.getByText('Next');
  const content = screen.getByText(firstChild);

  expect(previousBtn).not.toBeInTheDocument();
  expect(cancelBtn).toBeInTheDocument();
  expect(nextBtn).toBeInTheDocument();
  expect(content).toBeInTheDocument();
});

it('should render previous button and second child content after clicking next', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockReviewStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const nextBtn = screen.getByText('Next');
  let previousBtn = screen.queryByText('Previous');

  const firstContent = screen.getByText(firstChild);

  expect(previousBtn).not.toBeInTheDocument();
  expect(firstContent).toBeInTheDocument();
  expect(nextBtn).toBeInTheDocument();

  userEvent.click(nextBtn);
  previousBtn = screen.getByText(firstChild);

  expect(previousBtn).toBeInTheDocument();

  userEvent.click(previousBtn);
  expect(screen.getByText(firstChild)).toBeInTheDocument();
});

it('should render the assign button if you click through to the last child', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockReviewStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const nextBtn = screen.getByText('Next');

  userEvent.click(nextBtn);
  userEvent.click(nextBtn);
  userEvent.click(nextBtn);

  const assignBtn = screen.getByText('Cancel');

  expect(assignBtn).toBeInTheDocument();

  userEvent.click(assignBtn);
});

it('should render the submit button if you click through to the last child using default props', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: ''
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockDefaultStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const nextBtn = screen.getByText('Next');

  userEvent.click(nextBtn);

  const assignBtn = screen.getByText(firstChild);

  expect(assignBtn).toBeInTheDocument();
});

it('should cancel and navigate to the ba homepage', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: 'ABOVE GRADE LEVEL'
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockReviewStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const nextBtn = screen.getByText('Next');

  userEvent.click(nextBtn);

  const cancelBtn = screen.getByText('Cancel');
  const previousBtn = screen.getByText(firstChild);
  expect(cancelBtn).toBeInTheDocument();
  expect(previousBtn).toBeInTheDocument();

  userEvent.click(cancelBtn);
});

it('should skip to step 4 when clicking step indicator and will reset stepper on cancel click', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockSkipToStepStepperProps} />
      </Provider>
    </MemoryRouter>
  );

  const thirdStepIndicator = screen.getByTestId('stepIndicator3');
  userEvent.click(thirdStepIndicator);

  expect(screen.getByText('Previous')).toBeInTheDocument();
  const cancelBtn = screen.getByText('Cancel');
  expect(cancelBtn).toBeInTheDocument();

  userEvent.click(cancelBtn);

  expect(screen.queryByText('Previous')).not.toBeInTheDocument();
});

it('should preload the students api call', async () => {
  const stepperFormData: TeacherStepperData = {
    classes: ['87573'],
    assessmentPeriod: middlePeriod,
    dateTime: {
      startDate: undefined,
      startTime: null,
      endDate: undefined,
      endTime: null
    },
    students: [],
    teacherAppraisal: {}
  };

  const sdmInfo = {
    firstName: 'Ihor',
    name: 'Harmati',
    portalBaseUrl: 'https://digital-stage.scholastic.com',
    orgId: '7926',
    orgName: 'SEVERNA PARK HIGH SCHOOL',
    orgType: 'school',
    appCodes: ['srm'],
    staff: true,
    admin: false,
    extSessionId: 'd541ff69-a2eb-44e2-8acf-2deb948e29ad',
    extSessionEndpoint:
      'https://kle2zjsmk5.execute-api.us-east-1.amazonaws.com/stage/extendedsession',
    appCode: 'srm',
    appId: '52',
    parentOrgId: '7894',
    env: 'stage' as Env,
    role: 'educator',
    iamUserId: '98479023',
    user_id: '227807'
  };

  jest.useFakeTimers();
  const jestSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: () => Promise.resolve({ results: [] })
  } as unknown as Promise<Response>);

  await waitFor(() => preloadStudentsApi(currentSchoolYearDetails, stepperFormData, sdmInfo));

  expect(jestSpy).toHaveBeenCalled();
});

it('should step through all steps and click review', async () => {
  const history = createMemoryHistory({ initialEntries: ['/teacher/assign'] });
  render(
    <Router location={history.location} navigator={history}>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: new Date(),
                  startTime: '8:00 PM',
                  endDate: new Date(),
                  endTime: '9:00 PM'
                },
                students: [
                  {
                    assessmentId: 44,
                    benchmark: 'BEGINNING',
                    startDate: '2023-01-09T20:00:00.000-05:00',
                    endDate: '2023-01-19T20:00:00.000-05:00',
                    lexileValue: null,
                    status: 'CANCELED',
                    currentQuestion: 0,
                    proficiency: null,
                    timeSpent: 0,
                    assignedByFirstName: 'Ihor',
                    assignedByLastName: 'Harmati',
                    assignedById: 227807,
                    teacherAppraisal: 'BELOW_LEVEL'
                  }
                ],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, false],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockSkipToStepStepperProps} />
      </Provider>
    </Router>
  );

  const nextBtn = screen.getByText('Next');
  userEvent.click(nextBtn);
  const secondChild = screen.getByText('Second Child');
  expect(secondChild).toBeInTheDocument();

  const nextBtn2 = screen.getByText('Next');
  userEvent.click(nextBtn2);
  const thirdChild = screen.getByText('Third Child');
  expect(thirdChild).toBeInTheDocument();

  const nextBtn3 = screen.getByText('Next');
  userEvent.click(nextBtn3);
  const fourthChild = screen.getByText('Fourth Child');
  expect(fourthChild).toBeInTheDocument();

  // fire off assign logic
  const review = screen.getByText('Assign');
  userEvent.click(review);

  expect(window.location.pathname).toBe('/');
});

it('should step through all steps and click review while hasReviewPage props is true', async () => {
  render(
    <MemoryRouter>
      <Provider
        initialValues={
          [
            [sdmInfoAtom, { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }],
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: '',
                  startTime: '',
                  endDate: '',
                  endTime: ''
                },
                students: [
                  {
                    assessmentId: 44,
                    benchmark: 'BEGINNING',
                    startDate: '2023-01-09T20:00:00.000-05:00',
                    endDate: '2023-01-19T20:00:00.000-05:00',
                    lexileValue: null,
                    status: 'CANCELED',
                    currentQuestion: 0,
                    proficiency: null,
                    timeSpent: 0,
                    assignedByFirstName: 'Ihor',
                    assignedByLastName: 'Harmati',
                    assignedById: 227807,
                    teacherAppraisal: 'BELOW_LEVEL'
                  }
                ],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, false],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails]
          ] as unknown as [Atom<any>, any]
        }
      >
        <Stepper {...mockSkipToStepStepperPropsWithReview} />
      </Provider>
    </MemoryRouter>
  );

  const nextBtn = screen.getByText('Next');
  userEvent.click(nextBtn);
  const secondChild = screen.getByText('Second Child');
  expect(secondChild).toBeInTheDocument();

  const nextBtn2 = screen.getByText('Next');
  userEvent.click(nextBtn2);
  const thirdChild = screen.getByText('Third Child');
  expect(thirdChild).toBeInTheDocument();

  const review = screen.getByText('Review');
  userEvent.click(review);
  const submit = screen.getByText('submit');
  expect(submit).toBeInTheDocument();
});

it('test the teacherAppraisal get function', () => {
  const startDate = '2023-03-31T01:00:00.000-04:00';
  const endDate = '2023-04-28T01:00:00.000-04:00';
  const appraisal = getTeacherAppraisal(
    {
      classes: ['87573'],
      assessmentPeriod: middlePeriod,
      dateTime: {
        startDate: undefined,
        startTime: null,
        endDate: undefined,
        endTime: null
      },
      students: [
        {
          assessmentId: 84,
          benchmark: middlePeriod,
          startDate: startDate,
          endDate: endDate,
          status: 'ASSIGNED',
          proficiency: null,
          timeSpent: 0,
          assignedByFirstName: 'Ihor',
          assignedByLastName: 'Harmati',
          assignedById: 227807,
          teacherAppraisal: 'ABOVE_LEVEL',
          studentId: '12345'
        }
      ],
      teacherAppraisal: {
        '12345': 'ABOVE_LEVEL'
      }
    } as any,
    '12345'
  );
  expect(appraisal).toEqual('ABOVE_LEVEL');

  const appraisal2 = getTeacherAppraisal(
    {
      classes: ['87573'],
      assessmentPeriod: middlePeriod,
      dateTime: {
        startDate: undefined,
        startTime: null,
        endDate: undefined,
        endTime: null
      },
      students: [
        {
          assessmentId: 84,
          benchmark: middlePeriod,
          startDate: startDate,
          endDate: endDate,
          status: 'ASSIGNED',
          proficiency: null,
          timeSpent: 0,
          assignedByFirstName: 'Ihor',
          assignedByLastName: 'Harmati',
          assignedById: 227807,
          teacherAppraisal: 'ABOVE_LEVEL',
          studentId: '12345'
        }
      ],
      teacherAppraisal: {
        '12345': 'ABOVE_LEVEL'
      }
    } as any,
    '234567'
  );
  expect(appraisal2).toEqual(null);

  const appraisal3 = getTeacherAppraisal(
    {
      classes: ['87573'],
      assessmentPeriod: middlePeriod,
      dateTime: {
        startDate: undefined,
        startTime: null,
        endDate: undefined,
        endTime: null
      },
      students: [
        {
          assessmentId: 84,
          benchmark: middlePeriod,
          startDate: startDate,
          endDate: endDate,
          status: 'ASSIGNED',
          proficiency: null,
          timeSpent: 0,
          assignedByFirstName: 'Ihor',
          assignedByLastName: 'Harmati',
          assignedById: 227807,
          teacherAppraisal: 'ABOVE_LEVEL',
          studentId: '12345'
        }
      ],
      teacherAppraisal: {
        '12345': ''
      }
    } as any,
    '12345'
  );
  expect(appraisal3).toEqual(null);
});
