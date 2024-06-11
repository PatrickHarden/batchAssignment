import { add, formatISO, sub } from 'date-fns';
import { modifyStatus, modifyLexile } from './format-table-data';

describe('modifyStatus', () => {
  it('should leave most statuses alone', () => {
    const now = formatISO(new Date());
    expect(modifyStatus('COMPLETED', now)).toBe('COMPLETED');
    expect(modifyStatus('IN_PROGRESS', now)).toBe('IN_PROGRESS');
    expect(modifyStatus('NOT_STARTED', now)).toBe('NOT_STARTED');
    expect(modifyStatus('CANCELED', now)).toBe('CANCELED');
    expect(modifyStatus('DELETED', now)).toBe('DELETED');
  });

  it('should adjust future assigned to scheduled', () => {
    const future = formatISO(add(new Date(), { days: 2 }));
    expect(modifyStatus('ASSIGNED', future)).toBe('SCHEDULED');
  });

  it('should adjust past assigned to not started', () => {
    const past = formatISO(sub(new Date(), { days: 2 }));
    expect(modifyStatus('ASSIGNED', past)).toBe('NOT_STARTED');
  });
});

describe('modifyLexile', () => {
  it('should leave empty values alone', () => {
    expect(modifyLexile(null)).toBe(null);
  });

  it('should add a suffix to positive lexile values', () => {
    expect(modifyLexile(0)).toBe('0L');
    expect(modifyLexile(100)).toBe('100L');
  });

  it('should add a prefix and suffix to negative lexile values', () => {
    expect(modifyLexile(-100)).toBe('BR100L');
  });
});
