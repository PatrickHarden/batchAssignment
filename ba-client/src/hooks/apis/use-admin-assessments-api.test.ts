import useBAApi from './use-ba-api';
import { useAdminAssessmentsApi } from './use-admin-assessments-api';
import type { SDMNavCtx } from '../../utils/cookie-util';
import type { AdminApiFilters } from '../../atoms/atoms';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

beforeEach(() => {
  jest.mock('./use-admin-assessments-api', () => ({ ...jest.requireActual }));
});

describe('useOrg', () => {
  it('should make a request for the admin assessments', () => {
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
    const schoolYear = '2023';
    const apiFilters: AdminApiFilters = {
      grade: ['k', '1', '2', '3'],
      startDateBegin: ['2021-03-31'],
      startDateEnd: ['2029-03-31'],
      benchmark: ['BEGINNING_ALL', 'MIDDLE_ALL', 'END_ALL'],
      orgId: [1234, 2345, 23456],
      status: [
        'COMPLETED',
        'IN_PROGRESS',
        'SCHEDULED',
        'NOT_STARTED',
        'NO_TEST_SCHEDULED',
        'CANCELED'
      ]
    };
    useAdminAssessmentsApi({ sdmInfo, schoolYear, ...apiFilters });
    expect(useBAApi).toHaveBeenCalled();
  });
});
