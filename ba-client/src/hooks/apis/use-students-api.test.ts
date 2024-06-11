import { selectedFilters } from '../../components/container/FilterHeader/FiltersHeader.test';
import { useStudentsApi } from './use-students-api';

jest.mock('./use-ba-api', () => {
  const spy = jest.fn();

  return { __esModule: true, useBAApi: spy, default: spy };
});

beforeEach(() => {
  jest.mock('./use-students-api', () => ({ ...jest.requireActual }));
});

describe('useSchoolYearsApi', () => {
  it('should make a request for school years when org and user id are provided', () => {
    const test = useStudentsApi({ orgId: '8002', userId: '227807', ...selectedFilters });
  });
});
