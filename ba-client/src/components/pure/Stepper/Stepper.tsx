import React, { Children, FunctionComponent, useMemo, useCallback } from 'react';
import cx from 'classix';
import { Step, StepConnector, Stepper as MuiStepper, withStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { preload } from 'swr';
import { parse } from 'date-fns';
import useSWRMutation from 'swr/mutation';
import styles from './Stepper.module.scss';
import { ReactComponent as LeftCaret } from '../../../assets/icons/caretLeft.svg';
import { ReactComponent as RightCaret } from '../../../assets/icons/caretRight.svg';
import { useCounter } from '../../../hooks/useCounter/useCounter';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import appendWithQueryParams from '../../../utils/append-with-query-params';
import { SDMNavCtx } from '../../../utils/cookie-util';
import Card from '../Card/Card';
import { useToast } from '../../container/ToastOutlet/ToastOutlet';
import { createModifyingRequest } from '../../../hooks/apis/use-swr-mutation-fetcher';
import {
  isNextDisabledAtom,
  teacherStepperFormDataAtom,
  currentSchoolYearDetailsAtom,
  type TeacherStepperData,
  type CurrentSchoolYear,
  type TeacherApiFilters
} from '../../../atoms/atoms';

export interface StepperProps {
  totalSteps: number;
  children: React.ReactNode;
  canSkipToStep?: boolean;
  finalStepText?: string;
  hasReviewPage?: boolean;
  reviewButtonText?: string;
  cancelActionUrl?: string;
  navigatesOnCancel?: boolean;
}

const StepperConnector = withStyles({
  line: {
    height: 1,
    border: 0,
    backgroundColor: '#b5b5b5',
    borderRadius: 1
  }
})(StepConnector);

export const preloadStudentsApi = (
  currentSchoolYear: CurrentSchoolYear,
  stepperFormData: TeacherStepperData,
  sdmInfo: SDMNavCtx
) => {
  const fetcher = (url: string) => fetch(url)?.then((res) => res.json());
  if (stepperFormData.assessmentPeriod === '') {
    throw new TypeError('a period must be selected');
  }
  const apiParameters: TeacherApiFilters = {
    schoolYear: [currentSchoolYear.schoolYear],
    classIds: stepperFormData.classes,
    startDateBegin: [currentSchoolYear.startDate],
    startDateEnd: [currentSchoolYear.endDate],
    benchmark: [`${stepperFormData.assessmentPeriod}_LATEST`],
    status: [
      'COMPLETED',
      'IN_PROGRESS',
      'SCHEDULED',
      'NOT_STARTED',
      'NO_TEST_SCHEDULED',
      'CANCELED'
    ]
  };

  const url = appendWithQueryParams(
    `/api/v1/assessments/staff/${sdmInfo.user_id}/organization/${sdmInfo.orgId}`,
    { ...apiParameters, assessmentType: 'srm' }
  );

  preload(url, fetcher);
};

export const getTeacherAppraisal = (stepperFormData: TeacherStepperData, studentId: string) => {
  return stepperFormData.teacherAppraisal[studentId]
    ? stepperFormData.teacherAppraisal[studentId]
    : null;
};

const Stepper: FunctionComponent<StepperProps> = ({
  totalSteps,
  children,
  finalStepText = 'submit',
  hasReviewPage,
  reviewButtonText = 'submit',
  cancelActionUrl = '/',
  navigatesOnCancel,
  canSkipToStep
}: StepperProps) => {
  const navigate = useNavigate();
  const isNextDisabled = useAtomValue(isNextDisabledAtom);
  const arrayChildren = useMemo(() => Children.toArray(children), [children]);
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const stepperFormData = useAtomValue(teacherStepperFormDataAtom);
  const currentSchoolYearDetails = useAtomValue(currentSchoolYearDetailsAtom);
  const stepIndicatorLength = hasReviewPage ? totalSteps - 1 : totalSteps;
  const toast = useToast();

  const { trigger } = useSWRMutation(
    `/api/v1/assessments/${sdmInfo.user_id}/assign`,
    createModifyingRequest('POST')
  );

  const { nextCounter, prevCounter, setCounter, reset, activeCounter } = useCounter({
    initialCounter: 0
  });

  const nextButtonAction = () => {
    if (activeCounter === 1 && sdmInfo.admin === false) {
      preloadStudentsApi(currentSchoolYearDetails, stepperFormData, sdmInfo);
    }
    nextCounter();
  };

  const handleStep = useCallback(
    (index: number) => {
      if (canSkipToStep) {
        setCounter(index);
      }
    },
    [canSkipToStep, setCounter]
  );

  const handleCancel = () => {
    navigatesOnCancel ? navigate(cancelActionUrl) : reset();
  };

  const handleAssign = () => {
    const startDate = stepperFormData.dateTime.startDate;
    const endDate = stepperFormData.dateTime.endDate;
    const startTime = stepperFormData.dateTime.startTime;
    const endTime = stepperFormData.dateTime.endTime;
    // need to reaffirm types for parse() arguments
    if (startTime && endTime && startDate && endDate) {
      const payload = stepperFormData.students.map((student) => {
        return {
          studentId: student.studentId,
          benchmark: stepperFormData.assessmentPeriod,
          startDate: parse(startTime, 'hh:mm a', startDate),
          endDate: parse(endTime, 'hh:mm a', endDate),
          teacherAppraisal: getTeacherAppraisal(stepperFormData, student.studentId)
        };
      });
      trigger(payload, {
        onSuccess() {
          navigate(cancelActionUrl);
          toast.success('Scholastic Reading Measure assigned successfully.');
        },
        onError() {
          toast.error('An error occurred with the assignment process. Please try again.');
        }
      });
    }
  };

  const handleLastStep = () => {
    hasReviewPage ? nextCounter() : handleAssign();
  };

  return (
    <div className={styles.stepperContainer}>
      <MuiStepper className={styles.stepper} connector={<StepperConnector />}>
        {[...Array(stepIndicatorLength)].map((e, i) => (
          <Step
            key={i}
            className={`${styles.step} ${i === activeCounter ? styles.stepActive : ''} ${
              i < activeCounter ? styles.stepCompleted : ''
            }`}
            onClick={() => handleStep(i)}
            style={canSkipToStep ? { cursor: 'pointer' } : {}}
            data-testid={`stepIndicator${i}`}
          />
        ))}
      </MuiStepper>
      <Card
        className={styles.card}
        aria-label={`Assign Scholastic Reading Measure Tool - step ${
          activeCounter + 1
        } of ${stepIndicatorLength}`}
      >
        {arrayChildren[activeCounter]}
      </Card>
      <div className={styles.stepControls}>
        <div className={styles.controlsContainer}>
          <span className={styles.leftControls}>
            {activeCounter > 0 && (
              <button className="button--white-black" onClick={prevCounter} aria-label="Previous">
                <LeftCaret className={styles.leftCaret} />
                <span className={styles.previous}>Previous</span>
              </button>
            )}
          </span>
          <span className={styles.rightControls}>
            <button
              className={cx('button--white-black', styles.cancelButton)}
              onClick={handleCancel}
            >
              Cancel
            </button>
            {activeCounter + 1 < stepIndicatorLength && (
              <button
                className="button--black"
                onClick={nextButtonAction}
                disabled={isNextDisabled}
              >
                Next
                <RightCaret className={styles.rightCaret} />
              </button>
            )}
            {activeCounter + 1 === stepIndicatorLength && (
              <button className="button--black" onClick={handleLastStep} disabled={isNextDisabled}>
                {finalStepText}
              </button>
            )}
            {hasReviewPage && activeCounter + 1 > stepIndicatorLength && (
              <button className="button--black">{reviewButtonText}</button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
