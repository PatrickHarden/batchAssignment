import React, { useEffect, useMemo } from 'react';
import styles from './Step3Content.module.scss';
import SelectDateTime from './SelectDateTime';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { timeOptions } from '../../../../../../utils/format-date';
import {
  currentSchoolYearDetailsAtom,
  isNextDisabledAtom,
  teacherStepperFormDataAtom,
  DateTime
} from '../../../../../../atoms/atoms';

export const DateTimeStepperInstructions = () => (
  <ul className={styles.step3List}>
    <li>
      Students must begin the SRM within four weeks of the start date. After that, the assignment
      will expire.
    </li>
    <li>
      Once students start the SRM, they must complete it within 2 weeks. After that, the SRM will be
      canceled and any work deleted.
    </li>
  </ul>
);

export const isValidDateTime = (updatedDate: DateTime) => {
  return Object.values(updatedDate).every((value) => {
    return value !== null && value !== undefined;
  });
};

const Step3Content = () => {
  const { endDate } = useAtomValue(currentSchoolYearDetailsAtom);
  const setIsNextDisabled = useSetAtom(isNextDisabledAtom);
  const [stepperFormData, setStepperFormData] = useAtom(teacherStepperFormDataAtom);

  useEffect(() => {
    setIsNextDisabled(!isValidDateTime(stepperFormData.dateTime));
  }, [setIsNextDisabled, stepperFormData.dateTime]);

  const SelectDateTimeMemo = useMemo(() => {
    const onDateTimeChange = (data: DateTime) => {
      setIsNextDisabled(false);
      setStepperFormData({
        ...stepperFormData,
        dateTime: data,
        students: [],
        teacherAppraisal: {}
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
  }, [endDate, setIsNextDisabled, setStepperFormData, stepperFormData]);

  return <div className={styles.step3Container}>{SelectDateTimeMemo}</div>;
};
export default Step3Content;
