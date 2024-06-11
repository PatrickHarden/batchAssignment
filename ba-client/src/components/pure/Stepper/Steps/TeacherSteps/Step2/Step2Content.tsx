import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { teacherStepperFormDataAtom, isNextDisabledAtom } from '../../../../../../atoms/atoms';
import RadioGroup, { RadioButtonOptions } from '../../../../RadioGroup/RadioGroup';
import type { Period } from '../../../../../../hooks/apis/use-students-api';

export const assessmentPeriodDetails: RadioButtonOptions<Period>[] = [
  { label: 'Beginning of Year', value: 'BEGINNING' },
  { label: 'Middle of Year', value: 'MIDDLE' },
  { label: 'End of Year', value: 'END' }
];

const Step2Content = () => {
  const [stepperFormData, setStepperFormData] = useAtom(teacherStepperFormDataAtom);
  const setIsNextDisabled = useSetAtom(isNextDisabledAtom);

  useEffect(() => {
    setIsNextDisabled(!stepperFormData.assessmentPeriod);
  }, [setIsNextDisabled, stepperFormData.assessmentPeriod]);

  return (
    <RadioGroup
      buttonInfo={assessmentPeriodDetails}
      groupLabel="Assessment Period"
      value={stepperFormData.assessmentPeriod}
      onValueChange={(selectedRadioButtonValue: Period) => {
        setStepperFormData({
          ...stepperFormData,
          assessmentPeriod: selectedRadioButtonValue,
          students: [],
          teacherAppraisal: {}
        });
      }}
    />
  );
};
export default Step2Content;
