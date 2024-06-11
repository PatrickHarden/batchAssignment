import { differenceInDays, startOfToday } from 'date-fns';
import type { Status } from '../hooks/apis/use-students-api';

export const modifyStatus = (status: Status, date: string): Status => {
  if (status === 'ASSIGNED') {
    const today = startOfToday();
    const dateFrom = new Date(date).getTime();
    const diff = differenceInDays(today, dateFrom);
    if (diff < 0) {
      return 'SCHEDULED';
    } else {
      return 'NOT_STARTED';
    }
  } else {
    return status;
  }
};

export const modifyLexile = (lexile: number | null) => {
  if (lexile === null) {
    return null;
  }
  if (lexile < 0) {
    return 'BR' + Math.abs(lexile) + 'L';
  }
  return lexile + 'L';
};
