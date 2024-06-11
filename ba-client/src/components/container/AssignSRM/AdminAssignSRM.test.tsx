import React, { Suspense } from 'react';
import AdminAssignSRM from './AdminAssignSRM';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { type SDMNavCtx, getSDMNavCTXCookie } from '../../../utils/cookie-util';
import { Provider, type Atom } from 'jotai';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import { useOrgsApi, type Org } from '../../../hooks/apis/use-org-api';

jest.mock('../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../hooks/apis/use-org-api', () => ({ useOrgsApi: jest.fn() }));

const orgs: Org = {
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
      code: '5',
      name: 'Grade 5'
    },
    {
      code: '6',
      name: 'Grade 6'
    }
  ],
  organizations: [
    {
      id: 8013,
      name: 'BODKIN ELEMENTARY SCHOOL',
      grades: ['k', '2', '5', '6']
    },
    {
      id: 8002,
      name: 'CROFTON ELEMENTARY SCHOOL',
      grades: ['1', '2']
    },
    {
      id: 8029,
      name: 'CROFTON MIDDLE SCHOOL',
      grades: ['2']
    },
    {
      id: 7930,
      name: 'SOUTHGATE ELEMENTARY SCHOOL',
      grades: ['k']
    }
  ]
};

const mockSDMInfo: Partial<SDMNavCtx> = { user_id: '1234', orgId: '123456', portalBaseUrl: 'url' };
const adminAssignmentHeader = 'New Assignment';

interface TestWrapperProps {
  children: React.ReactElement;
}
function TestWrapper({ children }: TestWrapperProps) {
  return (
    <MemoryRouter>
      <Provider initialValues={[[sdmInfoAtom, mockSDMInfo]] as unknown as [Atom<any>, any]}>
        <Suspense fallback={<div></div>}>{children}</Suspense>
      </Provider>
    </MemoryRouter>
  );
}

describe('<AdminAssignSRM />', () => {
  beforeAll(() => {
    const sdmToken =
      '%7B%20%20%20%22firstName%22%20%3A%20%22Ihor%22%2C%20%20%20%22name%22%20%3A%20%22Harmati%22%2C%20%20%20%22portalBaseUrl%22%20%3A%20%22https%3A%2F%2Fdigital-stage.scholastic.com%22%2C%20%20%20%22orgId%22%20%3A%20%227894%22%2C%20%20%20%22orgName%22%20%3A%20%22ANNE%20ARUNDEL%20COUNTY%20PUB%20SCHS%22%2C%20%20%20%22orgType%22%20%3A%20%22district%22%2C%20%20%20%22appCodes%22%20%3A%20%5B%20%22admindashsim%22%2C%20%22literacy%22%2C%20%22nsgrak2%22%2C%20%22teacherdashsim%22%2C%20%22action%22%2C%20%22srr%22%2C%20%22srm%22%2C%20%22nsgra36%22%20%5D%2C%20%20%20%22staff%22%20%3A%20true%2C%20%20%20%22admin%22%20%3A%20true%2C%20%20%20%22extSessionId%22%20%3A%20%22255bdcc4-6460-46d6-9c3b-76db5a9b426b%22%2C%20%20%20%22extSessionEndpoint%22%20%3A%20%22https%3A%2F%2Fkle2zjsmk5.execute-api.us-east-1.amazonaws.com%2Fstage%2Fextendedsession%22%2C%20%20%20%22appCode%22%20%3A%20%22srm%22%2C%20%20%20%22appId%22%20%3A%20%2252%22%2C%20%20%20%22env%22%20%3A%20%22stage%22%2C%20%20%20%22role%22%20%3A%20%22educator%22%2C%20%20%20%22iamUserId%22%20%3A%20%2298479023%22%2C%20%20%20%22user_id%22%20%3A%20%22227807%22%20%7D';

    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      sdm_nav_ctx: decodeURIComponent(sdmToken)
    });
  });

  beforeEach(() => {
    (useOrgsApi as jest.Mock).mockReturnValue(orgs);
  });

  it('should render the AssignSRM page', () => {
    render(<AdminAssignSRM />, { wrapper: TestWrapper });

    expect(screen.getByText(adminAssignmentHeader)).toBeInTheDocument();
  });

  it('should render the Batch Assign Header and current school year', () => {
    render(<AdminAssignSRM />, { wrapper: TestWrapper });

    expect(screen.getByText(adminAssignmentHeader)).toBeInTheDocument();
    expect(
      screen.getByText('Step 1: Select Assessment Period', { exact: false })
    ).toBeInTheDocument();
  });

  it('should render the AssignSRM page with one organization', () => {
    const temporaryOrgs: Org = {
      ...orgs,
      organizations: [
        {
          id: 8002,
          name: 'CROFTON ELEMENTARY SCHOOL',
          grades: ['k']
        }
      ]
    };

    (useOrgsApi as jest.Mock).mockReturnValue(temporaryOrgs);
    render(<AdminAssignSRM />, { wrapper: TestWrapper });
    expect(screen.getByText(adminAssignmentHeader)).toBeInTheDocument();
    expect(
      screen.getByText('Step 1: Select Assessment Period', { exact: false })
    ).toBeInTheDocument();
  });
});
