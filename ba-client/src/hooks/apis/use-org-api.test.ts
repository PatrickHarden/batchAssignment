import useBAApi from './use-ba-api';
import { useOrgsApi } from './use-org-api';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

describe('useOrg', () => {
  it('should make a request for org when org and user id are provided', () => {
    useOrgsApi({ adminId: '217099', orgId: '7894', schoolYear: '2023' });
    expect(useBAApi).toHaveBeenCalled();
  });
});
