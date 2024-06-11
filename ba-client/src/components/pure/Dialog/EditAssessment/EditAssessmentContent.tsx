import React, { useEffect, useMemo, useState } from 'react';
import styles from './EditAssessmentContent.module.scss';
import { TableData } from '../../../../hooks/useTable/useTable';
import RadioGroup from '../../RadioGroup/RadioGroup';
import { assessmentPeriodDetails } from '../../Stepper/Steps/TeacherSteps/Step2/Step2Content';
import SelectDateTime from '../../Stepper/Steps/TeacherSteps/Step3/SelectDateTime';
import {
  type DateTimeRequired,
  currentSchoolYearDetailsAtom,
  editAssessmentAtom
} from '../../../../atoms/atoms';
import {
  convertToMilitaryTime,
  getTimeFromDate,
  parseDate,
  timeOptions
} from '../../../../utils/format-date';
import { teacherAppraisalToggleDetails } from '../../ToggleGroup/MockToggleGroupData';
import { useAtom, useAtomValue } from 'jotai';
import { isArray } from 'lodash-es';
import { set } from 'date-fns';
import { isValidDateTime } from '../../Stepper/Steps/TeacherSteps/Step3/Step3Content';

interface DialogContentProps {
  editStudentData: TableData;
  disableActionButton: (value: boolean) => void;
}

export const EditAssessmentContent = ({
  editStudentData,
  disableActionButton
}: DialogContentProps) => {
  const [editAssessmentData, setEditAssessmentData] = useAtom(editAssessmentAtom);
  const { endDate: schoolYearEndDate } = useAtomValue(currentSchoolYearDetailsAtom);

  const [startDate, setStartDate] = useState(parseDate(editStudentData.startDate.valueOf()));
  const [startTime, setStartTime] = useState(getTimeFromDate(startDate));
  const [endDate, setEndDate] = useState(parseDate(editStudentData.endDate.valueOf()));
  const [endTime, setEndTime] = useState(getTimeFromDate(endDate));
  const teacherAppraisalLevel = teacherAppraisalToggleDetails.filter((appraisal) =>
    appraisal.value === editStudentData.initialTeacherAppraisal ? appraisal : false
  )[0];
  const teacherAppraisal = useMemo(() => {
    return teacherAppraisalLevel?.value ?? undefined;
  }, [teacherAppraisalLevel?.value]);
  const benchmark = editStudentData.benchmark;

  useEffect(() => {
    setEditAssessmentData({
      ...editAssessmentData,
      assessmentId: String(editStudentData.assessmentId)
    });
  }, [editStudentData, setEditAssessmentData]);

  const handleDateTimeChange = (data: DateTimeRequired) => {
    const startHour = convertToMilitaryTime(data.startTime);
    const endHour = convertToMilitaryTime(data.endTime);
    const newStartDate = set(data.startDate, { hours: startHour, minutes: 0 });
    const newEndDate = set(data.endDate, { hours: endHour, minutes: 0 });

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setStartTime(isArray(startHour) ? startHour[0] : startHour);
    setEndTime(isArray(endHour) ? endHour[0] : endHour);
    setEditAssessmentData({
      ...editAssessmentData,
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString()
    });
  };

  return (
    <>
      <div className={styles.subHeader}>
        Student Name:{' '}
        <span className={styles.name}>
          {editStudentData.firstName} {editStudentData.lastName}
        </span>
      </div>
      <div className={styles.subHeader}>
        Assessment Period:
        <div className={styles.radioGroupContainer}>
          <RadioGroup
            buttonInfo={assessmentPeriodDetails}
            groupLabel="Assessment Period"
            value={editAssessmentData.benchmark ?? benchmark}
            onValueChange={(selectedRadioButtonValue: string) => {
              disableActionButton(false);
              setEditAssessmentData({
                ...editAssessmentData,
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
      {editStudentData.daysSinceLastAssessmentOriginal === null && (
        <div className={styles.subHeader}>
          Initial Teacher Appraisal (Optional):
          <div className={styles.radioGroupContainer}>
            <RadioGroup
              buttonInfo={teacherAppraisalToggleDetails}
              groupLabel="Teacher Appraisal"
              value={editAssessmentData.teacherAppraisal ?? teacherAppraisal}
              onValueChange={(selectedRadioButtonValue: string) => {
                disableActionButton(false);
                setEditAssessmentData({
                  ...editAssessmentData,
                  teacherAppraisal: selectedRadioButtonValue.toUpperCase()
                });
              }}
            />
          </div>
        </div>
      )}
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
