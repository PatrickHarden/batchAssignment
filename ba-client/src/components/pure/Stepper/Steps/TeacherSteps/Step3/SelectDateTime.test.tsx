import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectDateTime, { SelectDateTimeProps } from './SelectDateTime';
import { formatDate, timeOptions } from '../../../../../../utils/format-date';
import { DateTime } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import { addDays, format, parseISO } from 'date-fns';
import { useNavigation } from 'react-day-picker';
import { getSDMNavCTXCookie } from '../../../../../../utils/cookie-util';
import { useSchoolYearsApi } from '../../../../../../hooks/apis/use-school-years-api';

const reactDayPicker = 'react-day-picker';
const mockUseNavigation = useNavigation as jest.Mock;

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

describe('<SelectDateTime />', () => {
  beforeAll(() => {
    const sdmToken =
      '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';
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
  const endDateString = 'End Date:';

  const schoolYearEndDate = '2023-07-31 00:00:00.0';
  const mockDateTime = {
    startDate: parseISO('2023-03-02T19:00:00.000Z'),
    startTime: '8:00 PM',
    endDate: parseISO('2023-03-26T19:00:00.000Z'),
    endTime: '3:00 PM'
  };

  const mockSelectDateTimeProps: SelectDateTimeProps = {
    startTimeOptions: timeOptions,
    endTimeOptions: timeOptions,
    onDateTimeChange: (data: DateTime) => console.log(data),
    isValidDateTime: () => true,
    dateTime: mockDateTime,
    schoolYearEndDate: schoolYearEndDate
  };

  it('should render the component', () => {
    render(<SelectDateTime {...mockSelectDateTimeProps} />);
    const inputEls = screen.getAllByRole('textbox');

    expect(inputEls.length).toBe(2);
    expect(screen.getByText(startDateString)).toBeInTheDocument();
    expect(screen.getByText(endDateString)).toBeInTheDocument();
    expect(screen.getByText('Start Time:')).toBeInTheDocument();
    expect(screen.getByText('End Time:')).toBeInTheDocument();
  });

  it('should open the datepicker', async () => {
    const mockTwelfthDay = parseISO('2023-03-12T19:00:00.000Z');
    jest.useFakeTimers().setSystemTime(mockTwelfthDay);

    render(<SelectDateTime {...mockSelectDateTimeProps} />);

    const startDateInput = screen.getByLabelText(startDateString, { exact: false });

    userEvent.click(startDateInput);
    let dialog = await screen.findByRole('dialog', { name: 'calendar' });
    expect(dialog).toBeInTheDocument();

    const twelfthDay = formatDate(mockTwelfthDay.toString(), 'dd');

    const testTwelfthDay = screen.getByRole('gridcell', { name: twelfthDay });
    let testFourteenthDay = screen.getByRole('gridcell', { name: '14' });
    expect(testTwelfthDay).toBeInTheDocument();
    expect(testFourteenthDay).toBeInTheDocument();
    userEvent.click(testTwelfthDay);
    expect(dialog).not.toBeInTheDocument();

    userEvent.click(startDateInput);
    dialog = await screen.findByRole('dialog', { name: 'calendar' });

    testFourteenthDay = screen.getByRole('gridcell', { name: '14' });

    expect(dialog).toBeInTheDocument();
    expect(testFourteenthDay).toBeInTheDocument();
    userEvent.click(testFourteenthDay);
    expect(dialog).not.toBeInTheDocument();

    const firstInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    expect(firstInput.value).toBe('03/14/2023');
  });
});
