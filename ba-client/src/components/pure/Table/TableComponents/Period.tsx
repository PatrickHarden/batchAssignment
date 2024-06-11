import React from 'react';
import type { Period as PeriodType } from '../../../../hooks/apis/use-students-api';

interface PeriodProps {
  period: PeriodType | '' | null;
}

const periodDisplayText: { [period in PeriodType]: string } = {
  BEGINNING: 'Beginning of Year',
  MIDDLE: 'Middle of Year',
  END: 'End of Year'
};

export default function Period({ period }: PeriodProps) {
  if (!period) {
    return <></>;
  }
  return <>{periodDisplayText[period]}</>;
}
