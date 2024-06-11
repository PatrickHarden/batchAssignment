import * as t from 'io-ts';

export const StringCodec = new t.Type<string, number, number>(
  'StringCodec',
  t.string.is,
  (n) => {
    return t.success(String(n));
  },
  Number
);
