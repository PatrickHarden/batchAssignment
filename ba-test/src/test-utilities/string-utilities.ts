import chai from 'chai';

export const BY_SPACE = ' ';
export const BY_COMMA = ',';
export const BY_HIPHEN = '-';
export const BY_BIG_HIPHEN = '–';
export const EMPTY_STR = '';
export const API_DATE_FORMAT = 'YYYY-MM-DD';

export const isBlank = (str: string): boolean => {
  if (!str) {
    return true;
  }
  return str.trim().length === 0;
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const equalsIgnoreOrder = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
};

export function removeContiguousSpace(str: string) {
  const contiguousSpaceRegex = /\s+/g;
  return str.replace(contiguousSpaceRegex, EMPTY_STR);
}

export function removeContiguousInStrArray(strArr: string[]) {
  const arrayWithoutContiguous: string[] = [];
  strArr.forEach((str) => arrayWithoutContiguous.push(removeContiguousSpace(str)));
  return arrayWithoutContiguous;
}

export function validateStringOrTrimmedIsPresent(list: string[], value: string) {
  const listWithoutContiguous: string[] = removeContiguousInStrArray(list);
  const isMember =
    listWithoutContiguous.includes(removeContiguousSpace(value)) || list.includes(value);
  chai.expect(isMember).to.be.true;
}

export function trimStrArray(strArr: string[]) {
  let arr: string[] = [];
  // eslint-disable-next-line no-return-assign
  strArr.forEach((str) => (arr = [...arr, str.trim()]));
  console.debug(`Trimmed Array: ${arr}`);
  return arr;
}
