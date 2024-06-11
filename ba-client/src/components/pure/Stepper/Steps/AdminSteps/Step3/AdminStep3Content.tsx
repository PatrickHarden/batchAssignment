import React, { useEffect, useMemo } from 'react';
import styles from './AdminStep3Content.module.scss';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { timeOptions } from '../../../../../../utils/format-date';
import {
  currentSchoolYearDetailsAtom,
  type DateTime,
  adminStepperFormDataAtom,
  isNextDisabledAtom
} from '../../../../../../atoms/atoms';
import SelectDateTime from '../../TeacherSteps/Step3/SelectDateTime';
import {
  DateTimeStepperInstructions,
  isValidDateTime
} from '../../TeacherSteps/Step3/Step3Content';

const AdminStep3Content = () => {
  const { endDate } = useAtomValue(currentSchoolYearDetailsAtom);
  const setDisableButton = useSetAtom(isNextDisabledAtom);
  const [stepperFormData, setStepperFormData] = useAtom(adminStepperFormDataAtom);

  useEffect(() => {
    setDisableButton(!isValidDateTime(stepperFormData.dateTime));
  }, [setDisableButton, stepperFormData.dateTime]);

  const SelectDateTimeMemo = useMemo(() => {
    const onDateTimeChange = (data: DateTime) => {
      setDisableButton(false);
      setStepperFormData({
        ...stepperFormData,
        dateTime: data,
        students: []
      });
    };
    return (
      <>
        <DateTimeStepperInstructions />
        <SelectDateTime
          schoolYearEndDate={endDate}
          startTimeOptions={timeOptions}
          endTimeOptions={timeOptions}
          onDateTimeChange={onDateTimeChange}
          isValidDateTime={isValidDateTime}
          dateTime={stepperFormData.dateTime}
        />
      </>
    );
  }, [endDate, setDisableButton, setStepperFormData, stepperFormData]);

  return <div className={styles.step3Container}>{SelectDateTimeMemo}</div>;
};
export default AdminStep3Content;
