import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
  adminStepperFormDataAtom,
  initialConfirmation,
  isNextDisabledAtom
} from '../../../../../../atoms/atoms';
import RadioGroup from '../../../../RadioGroup/RadioGroup';
import { assessmentPeriodDetails } from '../../TeacherSteps/Step2/Step2Content';
import type { Period } from '../../../../../../hooks/apis/use-students-api';

const AdminStep1Content = () => {
  const [stepperFormData, setStepperFormData] = useAtom(adminStepperFormDataAtom);
  const setDisableButton = useSetAtom(isNextDisabledAtom);

  useEffect(() => {
    setDisableButton(!stepperFormData.assessmentPeriod);
  }, [setDisableButton, stepperFormData.assessmentPeriod]);

  return (
    <RadioGroup
      buttonInfo={assessmentPeriodDetails}
      groupLabel="Assessment Period"
      value={stepperFormData.assessmentPeriod}
      onValueChange={(value: Period) => {
        setStepperFormData({
          ...stepperFormData,
          assessmentPeriod: value,
          students: [],
          confirmation: initialConfirmation
        });
      }}
    />
  );
};
export default AdminStep1Content;
