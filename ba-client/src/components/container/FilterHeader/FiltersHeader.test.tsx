import React from 'react';
import FiltersHeader, { safeParseDate } from './FiltersHeader';
import { render, screen } from '@testing-library/react';
import { type SchoolYear, useSchoolYearsApi } from '../../../hooks/apis/use-school-years-api';
import { useSectionsApi } from '../../../hooks/apis/use-class-sections-api';
import { Atom, Provider } from 'jotai';
import {
  type TeacherApiFilters,
  currentSchoolYearDetailsAtom,
  selectedTeacherHomepageFiltersAtom,
  type CurrentSchoolYear
} from '../../../atoms/atoms';
import { SDMNavCtx, getSDMNavCTXCookie } from '../../../utils/cookie-util';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import userEvent from '@testing-library/user-event';
import { Section } from '../../../hooks/apis/use-class-sections-api';

const className = 'Test Class Name';
const schoolYearLabel = 'School Year:';

jest.mock('@scholastic/volume-react', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../../../hooks/apis/use-school-years-api', () => ({ useSchoolYearsApi: jest.fn() }));
jest.mock('../../../hooks/apis/use-class-sections-api', () => ({ useSectionsApi: jest.fn() }));
jest.mock('../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));

const schoolYear2022StartDate = '2022-08-04';
const schoolYear2022EndDate = '2023-08-05';

beforeAll(() => {
  const sdmToken =
    '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: decodeURIComponent(sdmToken)
  });
});

export const schoolYears: SchoolYear = [
  {
    startDate: '2022-08-05',
    endDate: '2023-08-04',
    description: '2022-2023 School Year',
    isCurrentCalendar: true,
    schoolYear: 2022
  },
  {
    startDate: '2021-08-05',
    endDate: schoolYear2022StartDate,
    description: '2021-2022 School Year',
    isCurrentCalendar: false,
    schoolYear: 2021
  },
  {
    startDate: '2020-08-05',
    endDate: '2021-08-04',
    description: '2020-2021 School Year',
    isCurrentCalendar: false,
    schoolYear: 2020
  },
  {
    startDate: '2019-08-01',
    endDate: '2020-08-04',
    description: '2019-2020 School Year',
    isCurrentCalendar: false,
    schoolYear: 2019
  },
  {
    startDate: '2018-08-01',
    endDate: '2019-07-31',
    description: '2018-2019 School Year',
    isCurrentCalendar: false,
    schoolYear: 2018
  }
];

export const selectedFilters: TeacherApiFilters = {
  schoolYear: ['2022-23'],
  classIds: ['87452'],
  startDateBegin: [schoolYear2022StartDate],
  startDateEnd: [schoolYear2022EndDate],
  benchmark: ['BEGINNING_ALL'],
  status: [
    'COMPLETED',
    'IN_PROGRESS',
    'SCHEDULED',
    'NOT_STARTED',
    'NO_TEST_SCHEDULED',
    'CANCELED',
    'DELETED'
  ]
};

const FiltersHeaderProvider = () => {
  const sdmInfo: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' };
  const currentSchoolYear: CurrentSchoolYear = {
    schoolYear: '2022',
    fullDescription: '',
    shortDescription: '2022-23',
    startDate: '2022-08-05 00:00:00.0',
    endDate: '2023-08-04 00:00:00.0'
  };
  const selectedProviderFilters: TeacherApiFilters = {
    schoolYear: ['2022-23'],
    classIds: [className],
    startDateBegin: [schoolYear2022StartDate],
    startDateEnd: [schoolYear2022EndDate],
    benchmark: [],
    status: []
  };

  return (
    <Provider
      initialValues={
        [
          [selectedTeacherHomepageFiltersAtom, selectedProviderFilters],
          [currentSchoolYearDetailsAtom, currentSchoolYear],
          [sdmInfoAtom, sdmInfo]
        ] as unknown as [Atom<any>, any]
      }
    >
      <FiltersHeader schoolYears={schoolYears} selectedFilters={selectedProviderFilters} />
    </Provider>
  );
};

const FiltersHeaderProviderJustSDMInfo = () => {
  const currentSchoolYear: CurrentSchoolYear = {
    schoolYear: '2022',
    fullDescription: '',
    shortDescription: '2022-23',
    startDate: '2022-08-05 00:00:00.0',
    endDate: '2023-08-04 00:00:00.0'
  };
  const sdmInfo: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' };
  return (
    <Provider
      initialValues={
        [
          [currentSchoolYearDetailsAtom, currentSchoolYear],
          [sdmInfoAtom, sdmInfo]
        ] as unknown as [Atom<any>, any]
      }
    >
      <FiltersHeader schoolYears={schoolYears} selectedFilters={selectedFilters} />
    </Provider>
  );
};

const FiltersHeaderProviderOlderYear = () => {
  const filters: TeacherApiFilters = {
    schoolYear: ['2021-22'],
    classIds: [className],
    startDateBegin: [schoolYear2022StartDate],
    startDateEnd: [schoolYear2022EndDate],
    benchmark: [],
    status: []
  };
  const currentSchoolYear: CurrentSchoolYear = {
    fullDescription: '',
    shortDescription: '2022-23',
    schoolYear: '2022',
    startDate: '2022-08-04 00:00:00.0',
    endDate: '2023-08-05 00:00:00.0'
  };
  const sdmInfo: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456' };
  return (
    <Provider
      initialValues={
        [
          [selectedTeacherHomepageFiltersAtom, filters],
          [currentSchoolYearDetailsAtom, currentSchoolYear],
          [sdmInfoAtom, sdmInfo]
        ] as unknown as [Atom<any>, any]
      }
    >
      <FiltersHeader schoolYears={schoolYears} selectedFilters={selectedFilters} />
    </Provider>
  );
};

describe('<FiltersHeader />', () => {
  beforeEach(() => {
    const schoolYears: SchoolYear = [
      {
        startDate: '2021-08-01',
        endDate: '2022-07-31',
        description: '2021-2022 School Year',
        schoolYear: 2021,
        isCurrentCalendar: true
      }
    ];
    const sections: Section = [
      {
        id: '9987209',
        organizationId: 997942,
        primaryTeacherId: 227807,
        name: 'ZZTest Class Name',
        period: null,
        lowGrade: 1,
        highGrade: 1,
        schoolYear: '2020',
        hasStudents: true
      },
      {
        id: '87209',
        organizationId: 7942,
        primaryTeacherId: 227807,
        name: className,
        period: null,
        lowGrade: 1,
        highGrade: 1,
        schoolYear: '2020',
        hasStudents: true
      }
    ];

    (useSchoolYearsApi as jest.Mock).mockReturnValue(schoolYears);
    (useSectionsApi as jest.Mock).mockReturnValue(sections);
  });

  it('should render the School Year Dropdown component', async () => {
    useSchoolYearsApi({ orgId: '7894', userId: '227807' });

    render(<FiltersHeaderProviderJustSDMInfo />);

    const dropdownTitle = screen.getByText(schoolYearLabel);
    const dropdownDefault = screen.getByText('2022-23');

    expect(dropdownTitle).toBeInTheDocument();
    expect(dropdownDefault).toBeInTheDocument();

    userEvent.click(dropdownDefault);
    jest.useFakeTimers();
    const year = screen.queryAllByText('2022-23')[0];
    expect(year).toBeInTheDocument();
    year.click();
    jest.useFakeTimers();
  });

  it('should render the School Year Dropdown component with a noncurrent school year', async () => {
    useSchoolYearsApi({ orgId: '7894', userId: '227807' });

    render(<FiltersHeaderProviderOlderYear />);

    const dropdownTitle = screen.getByText(schoolYearLabel);
    const dropdownDefault = screen.queryAllByText('2022-23')[0];

    expect(dropdownTitle).toBeInTheDocument();
    expect(dropdownDefault).toBeInTheDocument();
  });

  it('should render the School Year Dropdown component with blank school year if no schools returned', async () => {
    (useSchoolYearsApi as jest.Mock).mockReturnValue(undefined);
    useSchoolYearsApi({ orgId: '7894', userId: '227807' });

    render(<FiltersHeaderProviderOlderYear />);

    const dropdownTitle = screen.getByText(schoolYearLabel);
    const dropdownDefault = screen.queryAllByText('Select Value')[0];

    expect(dropdownTitle).toBeInTheDocument();
    expect(dropdownDefault).toBeInTheDocument();
  });

  it('should render the Class Section Dropdown component', async () => {
    useSectionsApi({ userId: '227807', orgId: '7894', schoolYear: '2022' });
    useSchoolYearsApi({ orgId: '7894', userId: '227807' });

    render(<FiltersHeaderProvider />);

    const dropdownTitle = screen.getByText('Class:');
    const dropdownDefault = screen.queryAllByText('Select Value')[0];

    expect(dropdownTitle).toBeInTheDocument();
    expect(dropdownDefault).toBeInTheDocument();
  });

  it('should trigger changes in the filter dropdowns', () => {
    render(<FiltersHeaderProvider />);

    const dropdown = screen.getByRole('button', { name: '2022-23' });
    expect(screen.queryByRole('menuitem', { name: '2021-22' })).not.toBeInTheDocument();
    userEvent.click(dropdown);
    const firstYear: HTMLLIElement = screen.getByRole('menuitem', { name: '2021-22' });
    expect(firstYear).toBeInTheDocument();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllTimers();
  });
});

describe('safeParseDate', () => {
  it('should parse valid ISO date', () => {
    expect(safeParseDate('1000-01-01')).toEqual(new Date(1000, 0, 1));
  });

  it('should return undefined for invalid date', () => {
    expect(safeParseDate('')).toBe(undefined);
  });
});
