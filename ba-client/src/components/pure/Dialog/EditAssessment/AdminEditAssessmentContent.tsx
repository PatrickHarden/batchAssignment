import React, { useEffect, useState } from 'react';
import { AdminAssessmentData } from '../../../container/HomePage/Admin/TableColumnDefinitions';
import styles from './AdminEditAssessmentContent.module.scss';
import RadioGroup from '../../RadioGroup/RadioGroup';
import SelectDateTime from '../../Stepper/Steps/TeacherSteps/Step3/SelectDateTime';
import { assessmentPeriodDetails } from '../../Stepper/Steps/TeacherSteps/Step2/Step2Content';
import {
  adminEditAssessmentAtom,
  DateTimeRequired,
  currentSchoolYearDetailsAtom
} from '../../../../atoms/atoms';
import { useAtom, useAtomValue } from 'jotai';
import {
  convertToMilitaryTime,
  getTimeFromDate,
  parseDate,
  timeOptions
} from '../../../../utils/format-date';
import { isValidDateTime } from '../../Stepper/Steps/TeacherSteps/Step3/Step3Content';
import { set } from 'date-fns';
import { isArray } from 'lodash-es';

export interface AdminAssessmentDataWithRequiredStartAndEnd extends AdminAssessmentData {
  startDate: string;
  endDate: string;
}

interface AdminEditAssessmentContentProps {
  editAssessmentData: AdminAssessmentDataWithRequiredStartAndEnd;
  disableActionButton: (value: boolean) => void;
}

export const AdminEditAssessmentContent = ({
  editAssessmentData,
  disableActionButton
}: AdminEditAssessmentContentProps) => {
  const [editAdminAssessmentData, setEditAdminAssessmentData] = useAtom(adminEditAssessmentAtom);
  const { endDate: schoolYearEndDate } = useAtomValue(currentSchoolYearDetailsAtom);

  const [startDate, setStartDate] = useState(parseDate(editAssessmentData.startDate.valueOf()));
  const [startTime, setStartTime] = useState(getTimeFromDate(startDate));
  const [endDate, setEndDate] = useState(parseDate(editAssessmentData.endDate.valueOf()));
  const [endTime, setEndTime] = useState(getTimeFromDate(endDate));
  const benchmark = editAssessmentData.period;

  useEffect(() => {
    setEditAdminAssessmentData({
      ...editAdminAssessmentData,
      assessmentId: editAssessmentData.assessmentId
    });
  }, [editAssessmentData, setEditAdminAssessmentData]);

  const handleDateTimeChange = (data: DateTimeRequired) => {
    const startHour = convertToMilitaryTime(data.startTime);
    const endHour = convertToMilitaryTime(data.endTime);
    const newStartDate = set(data.startDate, { hours: startHour, minutes: 0 });
    const newEndDate = set(data.endDate, { hours: endHour, minutes: 0 });

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setStartTime(isArray(startHour) ? startHour[0] : startHour);
    setEndTime(isArray(endHour) ? endHour[0] : endHour);
    setEditAdminAssessmentData({
      ...editAdminAssessmentData,
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString()
    });
  };

  return (
    <>
      <div className={styles.subHeader}>
        Sites and Users:{' '}
        <span className={styles.name}>
          {editAssessmentData.site} - {editAssessmentData.rowGrade}
        </span>
      </div>
      <div className={styles.subHeader}>
        Assessment Period:
        <div className={styles.radioGroupContainer}>
          <RadioGroup
            buttonInfo={assessmentPeriodDetails}
            groupLabel="Assessment Period"
            value={editAdminAssessmentData.benchmark ?? benchmark}
            onValueChange={(selectedRadioButtonValue: string) => {
              disableActionButton(false);
              setEditAdminAssessmentData({
                ...editAdminAssessmentData,
                benchmark: selectedRadioButtonValue
              });
            }}
          />
        </div>
      </div>
      <SelectDateTime
        schoolYearEndDate={schoolYearEndDate}
        startTimeOptions={timeOptions}
        endTimeOptions={timeOptions}
        onDateTimeChange={(data) => {
          handleDateTimeChange(data as DateTimeRequired);
          disableActionButton(false);
        }}
        isValidDateTime={isValidDateTime}
        dateTime={{
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime
        }}
        isInsideDialog
      />
      <div className={styles.assessmentGuidelines}>
        <div className={styles.header}>Assessment Guidelines:</div>
        <p className={styles.text}>
          Students must begin the SRM within four weeks of the start date. After that, the
          assignment will expire.
        </p>{' '}
        <p className={styles.text}>
          {' '}
          Once students start the SRM, they must complete it within two weeks. If not, the SRM will
          be canceled and any work deleted.
        </p>
      </div>
    </>
  );
};
