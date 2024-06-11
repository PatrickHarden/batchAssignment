import React from 'react';
import AdminStep2Content from './AdminStep2Content';
import { render, screen } from '@testing-library/react';
import { Atom, Provider } from 'jotai';
import { isNextDisabledAtom, adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import { getSDMNavCTXCookie, SDMNavCtx } from '../../../../../../utils/cookie-util';
import { useOrgsApi, type Org } from '../../../../../../hooks/apis/use-org-api';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import { constructInitialState } from './AdminStep2Content';

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
      code: '3',
      name: 'Grade 3'
    },
    {
      code: '4',
      name: 'Grade 4'
    },
    {
      code: '6',
      name: 'Grade 6'
    },
    {
      code: '8',
      name: 'Grade 8'
    },
    {
      code: '10',
      name: 'Grade 10'
    }
  ],
  organizations: [
    {
      id: 8002,
      name: 'CROFTON ELEMENTARY SCHOOL',
      grades: ['k']
    },
    {
      id: 7971,
      name: 'MAYO ELEMENTARY SCHOOL',
      grades: ['k', '1', '6']
    },
    {
      id: 7926,
      name: 'SEVERNA PARK HIGH SCHOOL',
      grades: ['1', '2', '3', '4', '8', '10']
    },
    {
      id: 7929,
      name: 'SOUTHERN MIDDLE SCHOOL',
      grades: ['1', '2']
    },
    {
      id: 7940,
      name: 'WOODSIDE ELEMENTARY SCHOOL',
      grades: ['k']
    }
  ]
};

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

jest.mock('../../../../../../utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));
jest.mock('../../../../../../hooks/apis/use-org-api', () => ({ useOrgsApi: jest.fn() }));

const Step2ContentWithProvider = () => {
  return (
    <Provider
      initialValues={
        [
          [adminStepperFormDataAtom, { sitesAndGrades: constructInitialState(orgs) }],
          [isNextDisabledAtom, true],
          [sdmInfoAtom, sdmInfo]
        ] as unknown as [Atom<any>, any][]
      }
    >
      <AdminStep2Content />
    </Provider>
  );
};

const Step2ContentWithProviderAndOneOrganization = () => {
  const sitesAndGradesMock = [
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
      grades: ['k', '4', '5']
    }
  ];
  return (
    <Provider
      initialValues={
        [
          [adminStepperFormDataAtom, { sitesAndGrades: sitesAndGradesMock }],
          [isNextDisabledAtom, true],
          [sdmInfoAtom, sdmInfo]
        ] as unknown as [Atom<any>, any][]
      }
    >
      <AdminStep2Content />
    </Provider>
  );
};

describe('<AdminStep2Content />', () => {
  beforeAll(() => {
    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      sdm_nav_ctx: sdmInfo
    });
  });
  beforeEach(() => {
    (useOrgsApi as jest.Mock).mockReturnValue(orgs);
  });
  it('should render and select a grade and a checkbox', () => {
    render(<Step2ContentWithProvider />);

    const kindergartenButton = screen.queryAllByText('K', { exact: false });
    expect(kindergartenButton[0]).toBeInTheDocument();
    // expect multiple orgs
    expect(kindergartenButton.length).toBeGreaterThan(1);
    userEvent.click(kindergartenButton[0]);

    const checkbox = screen.queryAllByRole('checkbox')[0];
    expect(checkbox).toBeInTheDocument();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
  beforeEach(() => {
    (useOrgsApi as jest.Mock).mockReturnValue(orgs);
  });

  it('should render with only one organization', () => {
    const temporaryOrgs = {
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
    render(<Step2ContentWithProviderAndOneOrganization />);

    const kindergartenButton = screen.queryAllByText('K', { exact: false });
    expect(kindergartenButton[0]).toBeInTheDocument();
    expect(kindergartenButton.length).toBeLessThanOrEqual(1);
    userEvent.click(kindergartenButton[0]);

    const checkbox = screen.queryAllByRole('checkbox')[0];
    expect(checkbox).toBeInTheDocument();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
