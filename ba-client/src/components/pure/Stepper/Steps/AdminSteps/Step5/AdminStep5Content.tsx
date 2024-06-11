import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { adminStepperFormDataAtom, isNextDisabledAtom } from '../../../../../../atoms/atoms';
import RadioGroup, { type RadioButtonOptions } from '../../../../RadioGroup/RadioGroup';
import type { BooleanText } from '../Step4/AdminStep4Content';

const radioGroupOptions: RadioButtonOptions<BooleanText>[] = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
];

const AdminStep5Content = () => {
  const [stepperFormData, setStepperFormData] = useAtom(adminStepperFormDataAtom);
  const setDisableButton = useSetAtom(isNextDisabledAtom);

  useEffect(() => {
    setDisableButton(stepperFormData.autoAssign === undefined);
  }, [setDisableButton, stepperFormData.autoAssign]);

  return (
    <RadioGroup
      buttonInfo={radioGroupOptions}
      groupLabel="Auto Assign"
      value={stepperFormData.autoAssign?.toString()}
      onValueChange={(value) => {
        setStepperFormData({
          ...stepperFormData,
          autoAssign: value === 'true'
        });
      }}
    />
  );
};
export default AdminStep5Content;
