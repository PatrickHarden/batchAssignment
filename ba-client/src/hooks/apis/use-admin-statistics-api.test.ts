import type { SDMNavCtx } from '../../utils/cookie-util';
import { useAdminStatisticsApi, type StatisticsFilter } from './use-admin-statistics-api';
import useBAApi from './use-ba-api';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

describe('useAdminStatisticsApi', () => {
  it('should make a request', () => {
    const mockSDMInfo: Pick<SDMNavCtx, 'user_id' | 'orgId'> = {
      user_id: '123',
      orgId: '321'
    };
    const mockFilter: StatisticsFilter = { benchmark: 'BEGINNING', organizations: [] };

    useAdminStatisticsApi({ sdmInfo: mockSDMInfo, filters: mockFilter });

    expect(useBAApi).toHaveBeenCalled();
  });
});
