import useBAApi from './use-ba-api';
import { useSchoolYearsApi } from './use-school-years-api';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

describe('useSchoolYearsApi', () => {
  it('should make a request for school years when org and user id are provided', () => {
    useSchoolYearsApi({ orgId: '7894', userId: '227807' });

    expect(useBAApi).toHaveBeenCalled();
  });
});
