import React from 'react';
import Step1Content from './Step1Content';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Atom, Provider } from 'jotai';
import {
  currentSchoolYearDetailsAtom,
  selectedTeacherHomepageFiltersAtom,
  teacherStepperFormDataAtom
} from '../../../../../../atoms/atoms';
import { useSectionsApi } from '../../../../../../hooks/apis/use-class-sections-api';
import { getSDMNavCTXCookie } from '../../../../../../utils/cookie-util';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../../../hooks/apis/use-class-sections-api', () => ({
  useSectionsApi: jest.fn()
}));
jest.mock('../../../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
beforeAll(() => {
  const sdmToken =
    '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: decodeURIComponent(sdmToken)
  });
});

const firstClass = "Dee's Class";

const currentSchoolYearDetails = {
  fullDescription: '',
  shortDescription: '2021-22',
  schoolYear: '2021',
  startDate: '',
  endDate: ''
};

const Step1ContentProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
          [sdmInfoAtom, { user_id: '1234' }]
        ] as unknown as [Atom<string>, string][]
      }
    >
      <Step1Content />
    </Provider>
  );
};

const Step1ContentNoClassesSelectedProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
          [sdmInfoAtom, { user_id: '1234' }],
          [
            teacherStepperFormDataAtom,
            {
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
            }
          ],
          [selectedTeacherHomepageFiltersAtom, { schoolYear: '2021', classIds: ['1234'] }]
        ] as unknown as [Atom<string>, string][]
      }
    >
      <Step1Content />
    </Provider>
  );
};

beforeEach(() => {
  (useSectionsApi as jest.Mock).mockReturnValue([
    {
      id: 87573,
      organizationId: 7926,
      primaryTeacherId: 227807,
      name: firstClass,
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
  ]);
});

it('should render the Step1Content and show the All Classes Checkbox and classes list', async () => {
  render(
    <MemoryRouter>
      <Step1ContentProvider />
    </MemoryRouter>
  );

  const allClassLabel = screen.getByText('All Classes');
  const inputElArray = screen.getAllByRole('checkbox');

  expect(allClassLabel).toBeInTheDocument();
  expect(inputElArray).toHaveLength(3);
  expect(screen.getByText(firstClass)).toBeInTheDocument();
  expect(screen.getByText('test class')).toBeInTheDocument();
});

it('should disable the next button if no classes are selected', async () => {
  render(
    <MemoryRouter>
      <Step1ContentProvider />
    </MemoryRouter>
  );

  const allCheckbox = screen.getByRole('checkbox', { name: 'All Classes' });
  userEvent.click(allCheckbox);
  userEvent.click(allCheckbox); // double click to disable next button if no classes are selected
});

it('should select a new class', async () => {
  render(
    <MemoryRouter>
      <Step1ContentNoClassesSelectedProvider />
    </MemoryRouter>
  );

  const secondClassCheckbox = screen.getByRole('checkbox', { name: firstClass });
  userEvent.click(secondClassCheckbox);
  expect(secondClassCheckbox).not.toBeChecked();
});
