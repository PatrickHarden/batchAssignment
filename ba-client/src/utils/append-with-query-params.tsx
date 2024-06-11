import qs, { IStringifyOptions } from 'qs';

/**
 * Appends url with query params, preserving the existing query params of the url
 */
const appendWithQueryParams = (
  url: string,
  query?: Record<string, unknown>,
  options?: IStringifyOptions
) => {
  if (!query) {
    return url;
  }

  const defaultOptions: IStringifyOptions = { arrayFormat: 'repeat' };

  const [pathWithoutQueryParams, existingQueryString] = url.split('?');

  const queryString = existingQueryString
    ? `${existingQueryString}&${qs.stringify(query, { ...defaultOptions, ...options })}`
    : qs.stringify(query, { ...defaultOptions, ...options });

  return `${pathWithoutQueryParams}?${queryString ?? ''}`;
};

export default appendWithQueryParams;
