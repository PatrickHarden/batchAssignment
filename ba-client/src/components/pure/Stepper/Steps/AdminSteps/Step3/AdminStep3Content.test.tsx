import React from 'react';
import AdminStep3Content from './AdminStep3Content';
import { render, screen } from '@testing-library/react';
import { getSDMNavCTXCookie } from '../../../../../../utils/cookie-util';
import { useSchoolYearsApi } from '../../../../../../hooks/apis/use-school-years-api';
import { type Atom, Provider } from 'jotai';
import userEvent from '@testing-library/user-event';
import {
  isNextDisabledAtom,
  currentSchoolYearDetailsAtom,
  adminStepperFormDataAtom
} from '../../../../../../atoms/atoms';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import { useNavigation } from 'react-day-picker';
import { addDays, format, parseISO } from 'date-fns';
import { formatDate } from '../../../../../../utils/format-date';
import { getCurrentTime } from '../../TeacherSteps/Step3/SelectDateTime';

const middlePeriod = 'MIDDLE';
const reactDayPicker = 'react-day-picker';
const mockUseNavigation = useNavigation as jest.Mock;
const currentSchoolYearDetails = {
  fullDescription: '',
  shortDescription: '',
  schoolYear: '2021',
  startDate: '',
  endDate: '2022-07-01'
};

jest.mock(reactDayPicker, () => ({
  __esModule: true,
  ...jest.requireActual(reactDayPicker),
  useNavigation: jest.fn()
}));

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
    '%7B%20%20%20%22firstName%22%20%3A%20%22Ihor%22%2C%20%20%20%22name%22%20%3A%20%22Harmati%22%2C%20%20%20%22portalBaseUrl%22%20%3A%20%22https%3A%2F%2Fdigital-stage.scholastic.com%22%2C%20%20%20%22orgId%22%20%3A%20%227894%22%2C%20%20%20%22orgName%22%20%3A%20%22ANNE%20ARUNDEL%20COUNTY%20PUB%20SCHS%22%2C%20%20%20%22orgType%22%20%3A%20%22district%22%2C%20%20%20%22appCodes%22%20%3A%20%5B%20%22admindashsim%22%2C%20%22literacy%22%2C%20%22nsgrak2%22%2C%20%22teacherdashsim%22%2C%20%22action%22%2C%20%22srr%22%2C%20%22srm%22%2C%20%22nsgra36%22%20%5D%2C%20%20%20%22staff%22%20%3A%20true%2C%20%20%20%22admin%22%20%3A%20true%2C%20%20%20%22extSessionId%22%20%3A%20%22255bdcc4-6460-46d6-9c3b-76db5a9b426b%22%2C%20%20%20%22extSessionEndpoint%22%20%3A%20%22https%3A%2F%2Fkle2zjsmk5.execute-api.us-east-1.amazonaws.com%2Fstage%2Fextendedsession%22%2C%20%20%20%22appCode%22%20%3A%20%22srm%22%2C%20%20%20%22appId%22%20%3A%20%2252%22%2C%20%20%20%22env%22%20%3A%20%22stage%22%2C%20%20%20%22role%22%20%3A%20%22educator%22%2C%20%20%20%22iamUserId%22%20%3A%20%2298479023%22%2C%20%20%20%22user_id%22%20%3A%20%22227807%22%20%7D';
  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: decodeURIComponent(sdmToken)
  });
  jest.useFakeTimers();
  jest.setSystemTime(parseISO('2021-08-02T13:00:00.000Z'));
});

const schoolYearDescription = '2021-2022 School Year';
const startDate = '2021-08-01';
const timeFormat = 'yyyy-MM-dd';

beforeEach(() => {
  (useSchoolYearsApi as jest.Mock).mockReturnValue([
    {
      startDate: startDate,
      // endDate must be in future so it is not disabled/clickable
      endDate: format(addDays(new Date(), 1), timeFormat),
      description: schoolYearDescription
    }
  ]);
  mockUseNavigation.mockImplementation(jest.requireActual(reactDayPicker).useNavigation);
});

const startDateString = 'Start Date:';

const AdminStep3ContentWithProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [
            adminStepperFormDataAtom,
            {
              assessmentPeriod: middlePeriod,
              dateTime: {
                startDate: undefined,
                startTime: null,
                endDate: undefined,
                endTime: null
              },
              students: []
            }
          ],
          [isNextDisabledAtom, true],
          [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
          [sdmInfoAtom, { user_id: '1234', orgId: '123456' }]
        ] as [Atom<any>, any][]
      }
    >
      <AdminStep3Content />
    </Provider>
  );
};

describe('<Step2Content/>', () => {
  it('should render the step3 content with the selectTime picker', () => {
    render(<AdminStep3ContentWithProvider />);
    const startDate = screen.getByText(startDateString);
    expect(screen.getByText('Start Time:')).toBeInTheDocument();
    expect(screen.getByText('End Date:')).toBeInTheDocument();
    expect(screen.getByText('End Time:')).toBeInTheDocument();
    expect(startDate).toBeInTheDocument();
  });

  it('open the start date day picker and select a date', async () => {
    const currentDay = new Date();
    jest.useFakeTimers().setSystemTime(currentDay);
    (useSchoolYearsApi as jest.Mock).mockReturnValue([
      {
        startDate: startDate,
        // endDate must be in future so it is not disabled/clickable
        endDate: format(addDays(new Date(), 20), timeFormat),
        description: schoolYearDescription
      }
    ]);
    render(<AdminStep3ContentWithProvider />);
    const input = screen.getByLabelText(startDateString, { exact: false });
    userEvent.click(input);

    const dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();
    const day = format(currentDay, 'd');
    const testDay = screen.getByRole('gridcell', { name: day });
    expect(testDay).toBeInTheDocument();
    userEvent.click(testDay);
    expect(dialog).not.toBeInTheDocument();
  });

  it('should the start date day picker and select a date thats not the current day', async () => {
    const currentDay = new Date();
    jest.useFakeTimers().setSystemTime(currentDay);
    (useSchoolYearsApi as jest.Mock).mockReturnValue([
      {
        startDate: startDate,
        endDate: format(addDays(new Date(), 20), timeFormat),
        description: schoolYearDescription
      }
    ]);
    render(<AdminStep3ContentWithProvider />);
    const input = screen.getByLabelText(startDateString, { exact: false });
    userEvent.click(input);

    const dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();

    let day = formatDate(currentDay.toString(), 'dd');
    if (day.charAt(0) === '0') {
      day = day.substring(1);
    }
    const testDay = screen.getByRole('gridcell', { name: '15' });
    expect(testDay).toBeInTheDocument();

    userEvent.click(testDay);
    expect(dialog).not.toBeInTheDocument();
  });

  it('should the start the day picker and select a date thats not the current day within a different date range', async () => {
    const currentDay = new Date();
    jest.useFakeTimers().setSystemTime(currentDay);
    (useSchoolYearsApi as jest.Mock).mockReturnValue([
      {
        startDate: startDate,
        endDate: '3000-09-05',
        description: schoolYearDescription
      }
    ]);
    render(<AdminStep3ContentWithProvider />);
    const input = screen.getByLabelText(startDateString, { exact: false });
    userEvent.click(input);

    const dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();
    let day = formatDate(currentDay.toString(), 'dd');
    if (day.charAt(0) === '0') {
      day = day.substring(1);
    }
    const testDay = screen.getByRole('gridcell', { name: '15' });
    expect(testDay).toBeInTheDocument();
    userEvent.click(testDay);
    expect(dialog).not.toBeInTheDocument();
  });

  it('should open the start Time and select a value', async () => {
    (useSchoolYearsApi as jest.Mock).mockReturnValue([
      {
        startDate: startDate,
        endDate: '3000-09-05',
        description: schoolYearDescription
      }
    ]);
    render(
      <Provider
        initialValues={
          [
            [
              adminStepperFormDataAtom,
              {
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
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
            [sdmInfoAtom, { user_id: '1234', orgId: '123456' }]
          ] as [Atom<any>, any][]
        }
      >
        <AdminStep3Content />
      </Provider>
    );
    const input = screen.getByLabelText(startDateString, { exact: false });
    userEvent.click(input);

    const dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();

    const testDay = screen.getByRole('gridcell', { name: '25' });
    expect(testDay).toBeInTheDocument();
    userEvent.click(testDay);
    expect(dialog).not.toBeInTheDocument();
    const startTime = screen.getAllByText('Select Time')[0];
    userEvent.click(startTime);
    const threepm = screen.getByText('3:00 PM');
    expect(threepm).toBeInTheDocument();
    userEvent.click(threepm);

    const btn = screen.getAllByRole('button')[0];

    userEvent.click(btn);
    expect(await screen.findByRole('menu', { hidden: true })).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('menuitem', { hidden: true })[1]);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    const endDateInput = screen.getByLabelText('End Date:', { exact: false });
    userEvent.click(endDateInput);

    const endDate = await screen.findByRole('dialog', { name: 'calendar' });
    expect(endDate).toBeInTheDocument();

    const dayTwentySix = screen.getByRole('gridcell', { name: '26' });
    expect(dayTwentySix).toBeInTheDocument();
    userEvent.click(dayTwentySix);
    expect(endDate).not.toBeInTheDocument();

    const testTime = getCurrentTime(['8:00 AM']);
    const testTime2 = getCurrentTime('8:00 AM');
    expect(testTime).toEqual('8:00 AM');
    expect(testTime2).toEqual('8:00 AM');
  });

  it('should trigger the isValidDateTime callback', async () => {
    (useSchoolYearsApi as jest.Mock).mockReturnValue([
      {
        startDate: startDate,
        // endDate must be in future so it is not disabled/clickable
        endDate: format(addDays(new Date(), 100), 'yyyy-MM-dd'),
        description: schoolYearDescription
      }
    ]);
    // Create new Date instance
    const date = new Date();

    // Add a day
    date.setDate(date.getDate() + 1);
    render(
      <Provider
        initialValues={
          [
            [
              adminStepperFormDataAtom,
              {
                classes: ['87573'],
                assessmentPeriod: middlePeriod,
                dateTime: {
                  startDate: new Date(),
                  startTime: '9:00 AM',
                  endDate: date,
                  endTime: '10:00 AM'
                },
                students: [],
                teacherAppraisal: {}
              }
            ],
            [isNextDisabledAtom, true],
            [currentSchoolYearDetailsAtom, currentSchoolYearDetails],
            [sdmInfoAtom, { user_id: '1234', orgId: '123456' }]
          ] as [Atom<any>, any][]
        }
      >
        <AdminStep3Content />
      </Provider>
    );

    const btn = screen.getAllByRole('button')[0];
    userEvent.click(btn);
    expect(await screen.findByRole('menu', { hidden: true })).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('menuitem', { hidden: true })[3]);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
