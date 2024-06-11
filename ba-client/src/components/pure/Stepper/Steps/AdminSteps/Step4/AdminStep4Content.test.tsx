import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import AdminStep4Content, {
  booleanTextToBoolean,
  booleanToBooleanText,
  pluralizeStudentAlreadyHas,
  pluralizeStudentHas,
  useStep4
} from './AdminStep4Content';
import { type SDMNavCtx } from '../../../../../../utils/cookie-util';
import { Provider, type Atom } from 'jotai';
import { adminStepperFormDataAtom, type AdminStepperData } from '../../../../../../atoms/atoms';
import {
  useAdminStatisticsApi,
  type Statistics
} from '../../../../../../hooks/apis/use-admin-statistics-api';
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

const mockStatisticsWithNotAssigned: Statistics = {
  notAssigned: 1,
  assigned: 0,
  inProgress: 0,
  completed: 0
};

const mockStatisticsWithConflicts: Statistics = {
  notAssigned: 0,
  assigned: 1,
  inProgress: 1,
  completed: 1
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

const mockStepperDataWithPeriod: Partial<AdminStepperData> = {
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
      initialValues={
        [[adminStepperFormDataAtom, mockStepperDataWithPeriod]] as unknown as [Atom<any>, any][]
      }
    >
      {children}
    </Provider>
  );
}

describe('boolean to text', () => {
  it('should handle true', () => {
    expect(booleanToBooleanText(true)).toBe('true');
  });

  it('should handle false', () => {
    expect(booleanToBooleanText(false)).toBe('false');
  });
});

describe('text to boolean', () => {
  it('should handle true', () => {
    expect(booleanTextToBoolean('true')).toBe(true);
  });

  it('should handle false', () => {
    expect(booleanTextToBoolean('false')).toBe(false);
  });
});

describe('pluralize student has', () => {
  it('should show one student as singular', () => {
    expect(pluralizeStudentHas(1)).toBe('student has');
  });

  it('should show many students as plural', () => {
    expect(pluralizeStudentHas(3)).toBe('students have');
  });

  it('should show zero students as plural', () => {
    expect(pluralizeStudentHas(0)).toBe('students have');
  });
});

describe('pluralize already student has', () => {
  it('should show one student as singular', () => {
    expect(pluralizeStudentAlreadyHas(1)).toBe('student already has');
  });

  it('should show many students as plural', () => {
    expect(pluralizeStudentAlreadyHas(3)).toBe('students already have');
  });

  it('should show zero students as plural', () => {
    expect(pluralizeStudentAlreadyHas(0)).toBe('students already have');
  });
});

describe('useStep4', () => {
  beforeEach(() => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatisticsWithNotAssigned);
  });

  it('should stop when it does not have a grading period', () => {
    const mockStepperDataNoPeriod: Partial<AdminStepperData> = {
      assessmentPeriod: ''
    };
    const { result } = renderHook(() => useStep4(), {
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

  it('should show not assigned when there are students and no conflicts', () => {
    const { result } = renderHook(() => useStep4(), {
      wrapper: TestWrapper
    });

    expect(result.current.hasNotAssignedOption).toBe(true);

    render(result.current.getNotAssignedDescription());
    expect(
      screen.getByText('student has no assessments assigned or completed', { exact: false })
    ).toBeInTheDocument();

    expect(result.current.hasAlreadyAssignedConflict).toBe(false);
    expect(result.current.hasInProgressConflict).toBe(false);
    expect(result.current.hasCompletedConflict).toBe(false);
  });

  it('should show conflicts when present', () => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatisticsWithConflicts);

    const { result } = renderHook(() => useStep4(), {
      wrapper: TestWrapper
    });

    expect(result.current.hasNotAssignedOption).toBe(false);
    expect(result.current.hasAlreadyAssignedConflict).toBe(true);

    render(result.current.getAlreadyAssignedConflictDescription());
    expect(
      screen.getByText('student already has Scholastic Reading Measure assigned to them.', {
        exact: false
      })
    ).toBeInTheDocument();

    expect(result.current.hasInProgressConflict).toBe(true);
    render(result.current.getInProgressConflictDescription());
    expect(
      screen.getByText('student already has Scholastic Reading Measure in progress.', {
        exact: false
      })
    ).toBeInTheDocument();

    expect(result.current.hasCompletedConflict).toBe(true);
    render(result.current.getCompletedConflictDescription());
    expect(
      screen.getByText('Scholastic Reading Measure assigned to them.', {
        exact: false
      })
    ).toBeInTheDocument();
  });

  it('should set not assigned value on selection', () => {
    const { result } = renderHook(() => useStep4(), { wrapper: TestWrapper });
    expect(result.current.getNotAssignedRadioProps().value).toBe(undefined);
    act(() => {
      result.current.getNotAssignedRadioProps().onValueChange?.('true');
    });
    expect(result.current.getNotAssignedRadioProps().value).toBe('true');
  });

  it('should set conflict value on selection', () => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatisticsWithConflicts);

    const { result } = renderHook(() => useStep4(), {
      wrapper: TestWrapper
    });

    expect(result.current.getAlreadyAssignedConflictRadioProps().value).toBe(undefined);
    act(() => {
      result.current.getAlreadyAssignedConflictRadioProps().onValueChange?.('true');
    });
    expect(result.current.getAlreadyAssignedConflictRadioProps().value).toBe('true');

    expect(result.current.getInProgressConflictRadioProps().value).toBe(undefined);
    act(() => {
      result.current.getInProgressConflictRadioProps().onValueChange?.('true');
    });
    expect(result.current.getInProgressConflictRadioProps().value).toBe('true');

    expect(result.current.getCompletedConflictRadioProps().value).toBe(undefined);
    act(() => {
      result.current.getCompletedConflictRadioProps().onValueChange?.('true');
    });
    expect(result.current.getCompletedConflictRadioProps().value).toBe('true');
  });
});

describe('<AdminStep4Content />', () => {
  it('should render with not assigned', () => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatisticsWithNotAssigned);

    render(<AdminStep4Content />, { wrapper: TestWrapper });
    expect(
      screen.getByText('Students with no existing or completed assessments')
    ).toBeInTheDocument();
    expect(screen.queryByText('Already assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('In Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });

  it('should render with conflicts', () => {
    (useAdminStatisticsApi as jest.Mock).mockReturnValue(mockStatisticsWithConflicts);

    render(<AdminStep4Content />, { wrapper: TestWrapper });
    expect(screen.getByText('Already assigned')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
