import React, { Suspense } from 'react';
import Step4Content from './Step4Content';
import { render, screen, within } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import {
  isNextDisabledAtom,
  teacherStepperFormDataAtom,
  currentSchoolYearDetailsAtom
} from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import { useSchoolYearsApi } from '../../../../../../hooks/apis/use-school-years-api';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import { getSDMNavCTXCookie } from '../../../../../../utils/cookie-util';
import { useStudentsApi } from '../../../../../../hooks/apis/use-students-api';
import { mockNewAssessmentApiData } from '../../../../Table/TableComponents/MockTableData';

jest.mock('../../../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../../../hooks/apis/use-school-years-api', () => ({
  useSchoolYearsApi: jest.fn()
}));
jest.mock('../../../../../../hooks/apis/use-students-api', () => ({
  __esModule: true,
  useStudentsApi: jest.fn()
}));

beforeAll(() => {
  const sdmToken =
    '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: decodeURIComponent(sdmToken)
  });
});

beforeEach(() => {
  (useStudentsApi as jest.Mock).mockReturnValue(mockNewAssessmentApiData);
  (useSchoolYearsApi as jest.Mock).mockReturnValue([
    { startDate: '2021-08-01', endDate: '2022-07-31', description: '2021-2022 School Year' }
  ]);
});

const Step4ContentWithProvider = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Provider
        initialValues={
          [
            [
              teacherStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: 'MIDDLE',
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
            [
              currentSchoolYearDetailsAtom,
              {
                fullDescription: '',
                shortDescription: '',
                schoolYear: '2021',
                startDate: '',
                endDate: ''
              }
            ],
            [sdmInfoAtom, { user_id: '1234', orgId: '123456' }]
          ] as unknown as [Atom<any>, any][]
        }
      >
        <Step4Content />
      </Provider>
    </Suspense>
  );
};

it('should render step4 content with the table', () => {
  render(<Step4ContentWithProvider />);

  const studentNameTitle = screen.getByText('STUDENT NAME');
  const firstStudent = screen.getByTestId('name-0-0');
  const status = screen.getByText('Completed');
  expect(studentNameTitle).toBeInTheDocument();
  expect(firstStudent).toBeInTheDocument();
  within(firstStudent).getByLabelText('Pinkman, Jesse');
  expect(status).toBeInTheDocument();
});

it('should check a student checkbox', () => {
  render(<Step4ContentWithProvider />);

  const inputEl = screen.getByTestId('checkbox-0');
  userEvent.click(inputEl);
  expect(inputEl).toBeChecked();
});

afterAll(() => {
  jest.clearAllMocks();
});
