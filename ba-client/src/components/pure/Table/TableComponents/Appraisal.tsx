import React from 'react';
import type { Appraisal as AppraisalType } from '../../../../hooks/apis/use-students-api';

interface AppraisalProps {
  appraisal: AppraisalType | null;
}

export const appraisalDisplayText: { [appraisal in AppraisalType]: string } = {
  BELOW_LEVEL: 'Below Grade Level',
  ON_LEVEL: 'On Grade Level',
  ABOVE_LEVEL: 'Above Grade Level'
};

export default function Appraisal({ appraisal }: AppraisalProps) {
  if (appraisal === null) {
    return <></>;
  }
  return <>{appraisalDisplayText[appraisal]}</>;
}
