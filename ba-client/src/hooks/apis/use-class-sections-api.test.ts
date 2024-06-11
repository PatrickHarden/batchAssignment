import useBAApi from './use-ba-api';
import { useSectionsApi } from './use-class-sections-api';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

describe('useSectionsApi', () => {
  it('should make a request for class sections if user id is provided', () => {
    useSectionsApi({ userId: '227807', orgId: '7894', schoolYear: '2022' });

    expect(useBAApi).toHaveBeenCalled();
  });
});
