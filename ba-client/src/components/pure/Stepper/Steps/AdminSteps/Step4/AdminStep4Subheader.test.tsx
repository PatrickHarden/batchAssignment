import React from 'react';
import AdminStep4Subheader, { pluralizeStudentMatch, useStudentCount } from './AdminStep4Subheader';
import { render, screen } from '@testing-library/react';
import { type AdminStepperData, adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import {
  useAdminStatisticsApi,
  type Statistics
} from '../../../../../../hooks/apis/use-admin-statistics-api';
import { type SDMNavCtx } from '../../../../../../utils/cookie-util';
import { type Atom, Provider } from 'jotai';
import { renderHook } from '@testing-library/react-hooks';
import { type SitesAndGrade } from '../Step2/AdminStep2Content';

jest.mock('../../../../../../utils/cookie-util', () => {
  const mockSDMNavContext: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456' };
  return {
    getSDMNavCTXCookie: jest.fn().mockReturnValue(mockSDMNavContext)
  };
});

jest.mock('../../../../../../hooks/apis/use-admin-statistics-api', () => ({
  useAdminStatisticsApi: jest.fn()
}));

const mockStatistics: Statistics = {
  notAssigned: 1,
  assigned: 0,
  inProgress: 0,
  completed: 0
};

const sitesAndGrades: SitesAndGrade[] = [
  {
    orgName: 'All Sites & Grades',
    orgsAndGrades: [
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
        code: '4',
        name: 'Grade 4'
      },
      {
        code: '5',
        name: 'Grade 5'
      }
    ],
    id: -1,
    grades: ['1']
  },
  {
    orgName: 'Bodkin Elementary School',
    orgsAndGrades: [
      {
        code: '5',
        name: 'Grade 5'
      }
    ],
    id: 8013,
    grades: []
  },
  {
    orgName: 'Crofton Elementary School',
    orgsAndGrades: [
      {
        code: '1',
        name: 'Grade 1'
      },
      {
        code: '2',
        name: 'Grade 2'
      }
    ],
    id: 8002,
    grades: ['1']
  },
  {
    orgName: 'Southgate Elementary School',
    orgsAndGrades: [
      {
        code: 'k',
        name: 'Kindergarten'
      },
      {
        code: '4',
        name: 'Grade 4'
      },
      {
        code: '5',
        name: 'Grade 5'
      }
    ],
    id: 7930,
    grades: ['k']
  }
];

const mockStepperData: Partial<AdminStepperData> = {
  assessmentPeriod: 'BEGINNING',
  confirmation: {
    includeStudentsWithNoExistingOrCompleted: undefined,
    includedStudentWithAlreadyAssigned: undefined,
    includeStudentsWithInProgress: undefined,
    includeStudentsWithCompleted: undefined
  },
  sitesAndGrades: sitesAndGrades
};

function TestWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Provider
      initialValues={[[adminStepperFormDataAtom, mockStepperData]] as unknown as [Atom<any>, any][]}
    >
      {children}
    </Provider>
  );
}

describe('pluralize student match', () => {
  it('should handle singular', () => {
    expect(pluralizeStudentMatch(1)).toContain('student matches');
  });

  it('should handle many', () => {
    expect(pluralizeStudentMatch(3)).toContain('students match');
  });

  it('should handle zero', () => {
    expect(pluralizeStudentMatch(0)).toContain('students match');
  });
});

describe('useStudentCount', () => {
  beforeEach(() => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatistics);
  });

  it('should stop when it is without a grading period', () => {
    const mockStepperDataNoPeriod: Partial<AdminStepperData> = {
      assessmentPeriod: ''
    };
    const { result } = renderHook(() => useStudentCount(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Provider
          initialValues={
            [[adminStepperFormDataAtom, mockStepperDataNoPeriod]] as unknown as [Atom<any>, any][]
          }
        >
          {children}
        </Provider>
      )
    });

    expect(result.error?.name).toBe('TypeError');
    expect(result.error?.message).toBe('benchmark period must be set before admin step 4');
  });

  it('should tally up the statistics', () => {
    const { result } = renderHook(() => useStudentCount(), {
      wrapper: TestWrapper
    });

    expect(result.current).toBe(1);
  });
});

describe('<AdminStep4Subheader />', () => {
  beforeEach(() => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatistics);
  });

  it('should render the subheader', () => {
    render(<AdminStep4Subheader />, { wrapper: TestWrapper });
    expect(
      screen.getByText('your criteria for assigning this assessment', { exact: false })
    ).toBeInTheDocument();
  });
});
