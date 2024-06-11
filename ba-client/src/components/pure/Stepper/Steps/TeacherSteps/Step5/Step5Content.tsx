import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import styles from './Step5Content.module.scss';
import { teacherStepperFormDataAtom } from '../../../../../../atoms/atoms';
import ToggleGroup from '../../../../ToggleGroup/ToggleGroup';
import {
  ToggleGroupStudentList,
  teacherAppraisalToggleDetails
} from '../../../../ToggleGroup/MockToggleGroupData';
import BannerMessage, { BannerMessageTheme } from '../../../../BannerMessage/BannerMessage';

const Step5Content = () => {
  const [stepperFormData, setStepperFormData] = useAtom(teacherStepperFormDataAtom);

  const studentToggleData = useMemo<ToggleGroupStudentList[]>(() => {
    return stepperFormData.students
      .filter((student) => student.daysSinceLastAssessmentOriginal === null)
      .map(({ studentId, name, initialTeacherAppraisal }) => {
        return {
          student: {
            id: studentId,
            name: name,
            teacherAppraisal: initialTeacherAppraisal
          },
          buttonInfo: teacherAppraisalToggleDetails,
          groupLabel: `${name} Teacher Appraisal`
        };
      });
  }, [stepperFormData.students]);

  return (
    <>
      <div className={styles.toggleGroupContainer}>
        {studentToggleData[0] ? (
          studentToggleData.map(({ buttonInfo, groupLabel, student }) => (
            <div key={student.id} className={styles.toggleStudentContainer}>
              <p className={styles.studentName}>{student.name}</p>
              <ToggleGroup
                toggleButtonInfo={buttonInfo}
                toggleGroupLabel={groupLabel}
                id={student.id}
                value={stepperFormData.teacherAppraisal[student.id]}
                onValueChange={(selectedRadioButtonValue) => {
                  setStepperFormData((stepperFormData) => ({
                    ...stepperFormData,
                    teacherAppraisal: {
                      ...stepperFormData.teacherAppraisal,
                      [student.id]: selectedRadioButtonValue
                    }
                  }));
                }}
              />
            </div>
          ))
        ) : (
          <BannerMessage theme={BannerMessageTheme.Info}>
            <div>
              All students you selected already have a recorded Lexile measure. Choose
              &ldquo;Assign&rdquo; to create the Scholastic Reading Measure assignment for these
              students.
            </div>
          </BannerMessage>
        )}
      </div>
    </>
  );
};
export default Step5Content;
