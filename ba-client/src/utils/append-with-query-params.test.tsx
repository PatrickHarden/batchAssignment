import appendWithQueryParams from './append-with-query-params';

describe('appendWithQueryParams()', () => {
  it('should append query params to the provided string', () => {
    expect(appendWithQueryParams('http://example.com', { foo: 'bar' })).toEqual(
      'http://example.com?foo=bar'
    );
  });

  it('should preserve the existing query params of the url', () => {
    expect(appendWithQueryParams('http://example.com?existing=param', { foo: 'bar' })).toEqual(
      'http://example.com?existing=param&foo=bar'
    );
  });

  it('should return the url untouched if the query params are not provided', () => {
    expect(appendWithQueryParams('http://example.com?leave=untouched')).toEqual(
      'http://example.com?leave=untouched'
    );
  });
});
