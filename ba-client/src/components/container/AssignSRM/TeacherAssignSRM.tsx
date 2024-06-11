import React, { lazy, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styles from './TeacherAssignSRM.module.scss';
import { useResetAtom } from 'jotai/utils';
import { currentSchoolYearDetailsAtom, teacherStepperFormDataAtom } from '../../../atoms/atoms';
import Stepper from '../../pure/Stepper/Stepper';
import Steps, { type StepsProps } from '../../pure/Stepper/Steps/Steps';
import AssignSRMHeader from './AssignSRMHeader';

const Step1Content = lazy(() => import('../../pure/Stepper/Steps/TeacherSteps/Step1/Step1Content'));
const Step2Content = lazy(() => import('../../pure/Stepper/Steps/TeacherSteps/Step2/Step2Content'));
const Step3Content = lazy(() => import('../../pure/Stepper/Steps/TeacherSteps/Step3/Step3Content'));
const Step4Content = lazy(() => import('../../pure/Stepper/Steps/TeacherSteps/Step4/Step4Content'));
const Step5Content = lazy(() => import('../../pure/Stepper/Steps/TeacherSteps/Step5/Step5Content'));

const teacherStepsContent: StepsProps[] = [
  {
    header: 'Step 1: Select Classes',
    subheader: 'Select the classes with students who will be assigned Scholastic Reading Measure.',
    content: <Step1Content />
  },
  {
    header: 'Step 2: Select Assessment Period',
    subheader: `Recommendation: Consider choosing the assessment period that most closely relates to where you are in your school year. \
    For example, if you would like to assign the SRM to students in the first few months of the school year, choose "Beginning of Year".`,
    content: <Step2Content />
  },
  {
    header: 'Step 3: Select Date & Time',
    content: <Step3Content />
  },
  {
    header: 'Step 4: Select Students',
    subheader: (
      <div className={styles.step4SubHeader}>
        Select the students from the classes that you chose in the first step that you would like to
        be assigned the Scholastic Reading Measure. Any teacher associated with a student may assign
        an assessment, and students cannot have more than one assessment in progress or
        scheduled/not started in each assessment period.
      </div>
    ),
    content: <Step4Content />
  },
  {
    header: 'Step 5: Teacher Appraisal (Optional Step)',
    subheader: `The students below do not yet have a recorded Lexile measure. \
    When students begin the Scholastic Reading Measure, they will be placed at a starting point that corresponds to their grade level. \
    However, if you know that a student is above or below grade level, you may indicate that here.`,
    content: <Step5Content />
  }
];

const AssignSRM = () => {
  const { shortDescription } = useAtomValue(currentSchoolYearDetailsAtom);
  const resetTeacherStepperFormData = useResetAtom(teacherStepperFormDataAtom);

  const schoolYearText = (
    <span className={styles.schoolYear}>
      School Year <span className={styles.year}>{shortDescription}</span>
    </span>
  );

  useEffect(() => {
    resetTeacherStepperFormData();
  }, [resetTeacherStepperFormData]);

  return (
    <>
      <AssignSRMHeader title="New Assignment" helperText={schoolYearText} />
      <Stepper totalSteps={teacherStepsContent.length} finalStepText="assign" navigatesOnCancel>
        {teacherStepsContent.map(({ header, subheader, content }, index) => (
          <Steps key={index} header={header} subheader={subheader} content={content} />
        ))}
      </Stepper>
    </>
  );
};

export default AssignSRM;
