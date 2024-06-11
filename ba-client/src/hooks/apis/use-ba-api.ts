import type { Mixed } from 'io-ts';
import appendWithQueryParams from '../../utils/append-with-query-params';
import useFetch, { type UseFetchProps } from '../use-fetch/use-fetch';

export interface UseBAApiProps<T extends Mixed> extends Omit<UseFetchProps<T>, 'url' | 'token'> {
  /**
   * Path for the generated BA url
   */
  path: string;
}

/**
 * Make a request to BA
 * A GET request will be made by default
 */
export const useBAApi = <T extends Mixed>({
  path,
  query,
  appendWithQueryOptions,
  ...otherProps
}: UseBAApiProps<T>) => {
  const url = appendWithQueryParams(`${path}`, query, appendWithQueryOptions);

  return useFetch({ url, ...otherProps });
};

export default useBAApi;
