import React from 'react';
import RadioGroup, {
  type RadioGroupProps,
  type RadioButtonOptions
} from '../../../../RadioGroup/RadioGroup';
import { useAtom, useSetAtom } from 'jotai';
import { adminStepperFormDataAtom, isNextDisabledAtom } from '../../../../../../atoms/atoms';
import style from './AdminStep4Content.module.scss';
import { useAdminStatisticsApiHelper } from './AdminStep4Subheader';

export type BooleanText = 'true' | 'false';

const radioGroupOptions: RadioButtonOptions<BooleanText>[] = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
];

export function booleanTextToBoolean(booleanText: BooleanText): boolean {
  return booleanText === 'true';
}

export function booleanToBooleanText(boolean: boolean): BooleanText {
  return boolean ? 'true' : 'false';
}

export function pluralizeStudentHas(count: number) {
  return count === 1 ? 'student has' : 'students have';
}

export function pluralizeStudentAlreadyHas(count: number) {
  return count === 1 ? 'student already has' : 'students already have';
}

export function useStep4() {
  const stats = useAdminStatisticsApiHelper();
  const [stepperFormData, setStepperFormData] = useAtom(adminStepperFormDataAtom);
  const setDisableButton = useSetAtom(isNextDisabledAtom);

  const hasNotAssignedOption = stats.notAssigned > 0;

  const canContinue =
    stats.notAssigned > 0 &&
    stepperFormData.confirmation.includeStudentsWithNoExistingOrCompleted !== undefined;

  setDisableButton(!canContinue);

  function getNotAssignedDescription(): JSX.Element {
    return (
      <p className={style.adminStep4ConflictDescription}>
        <strong className={style.adminStep4StudentCount}>{stats.notAssigned}</strong>{' '}
        {pluralizeStudentHas(stats.notAssigned)} no assessments assigned or completed.
      </p>
    );
  }

  function getNotAssignedRadioProps(): RadioGroupProps<BooleanText> {
    return {
      buttonInfo: radioGroupOptions,
      className: style.adminStep4Radio,
      groupLabel: 'Not Assigned',
      value:
        stepperFormData.confirmation.includeStudentsWithNoExistingOrCompleted === undefined
          ? undefined
          : booleanToBooleanText(
              stepperFormData.confirmation.includeStudentsWithNoExistingOrCompleted
            ),
      onValueChange: (value: BooleanText) => {
        setStepperFormData((formData) => ({
          ...formData,
          confirmation: {
            ...formData.confirmation,
            includeStudentsWithNoExistingOrCompleted: booleanTextToBoolean(value)
          }
        }));
      }
    };
  }

  const hasConflictsHeader = stats.assigned + stats.inProgress + stats.completed > 0;
  const hasAlreadyAssignedConflict = stats.assigned > 0;
  const hasInProgressConflict = stats.inProgress > 0;
  const hasCompletedConflict = stats.completed > 0;

  function getAlreadyAssignedConflictDescription(): JSX.Element {
    return (
      <p className={style.adminStep4ConflictDescription}>
        <strong className={style.adminStep4StudentCount}>{stats.assigned}</strong>{' '}
        {pluralizeStudentAlreadyHas(stats.assigned)} Scholastic Reading Measure assigned to them.
      </p>
    );
  }

  function getInProgressConflictDescription(): JSX.Element {
    return (
      <p className={style.adminStep4ConflictDescription}>
        <strong className={style.adminStep4StudentCount}>{stats.inProgress}</strong>{' '}
        {pluralizeStudentAlreadyHas(stats.inProgress)} Scholastic Reading Measure in progress.
      </p>
    );
  }

  function getCompletedConflictDescription(): JSX.Element {
    return (
      <p className={style.adminStep4ConflictDescription}>
        <strong className={style.adminStep4StudentCount}>{stats.completed}</strong>{' '}
        {pluralizeStudentAlreadyHas(stats.completed)} Scholastic Reading Measure completed.
      </p>
    );
  }

  function getAlreadyAssignedConflictRadioProps(): RadioGroupProps<BooleanText> {
    return {
      buttonInfo: radioGroupOptions,
      className: style.adminStep4Radio,
      groupLabel: 'Already Assigned',
      value:
        stepperFormData.confirmation.includedStudentWithAlreadyAssigned === undefined
          ? undefined
          : booleanToBooleanText(stepperFormData.confirmation.includedStudentWithAlreadyAssigned),
      onValueChange: (value: BooleanText) => {
        setStepperFormData((formData) => ({
          ...formData,
          confirmation: {
            ...formData.confirmation,
            includedStudentWithAlreadyAssigned: booleanTextToBoolean(value)
          }
        }));
      }
    };
  }

  function getInProgressConflictRadioProps(): RadioGroupProps<BooleanText> {
    return {
      buttonInfo: radioGroupOptions,
      className: style.adminStep4Radio,
      groupLabel: 'In Progress',
      value:
        stepperFormData.confirmation.includeStudentsWithInProgress === undefined
          ? undefined
          : booleanToBooleanText(stepperFormData.confirmation.includeStudentsWithInProgress),
      onValueChange: (value: BooleanText) => {
        setStepperFormData((formData) => ({
          ...formData,
          confirmation: {
            ...formData.confirmation,
            includeStudentsWithInProgress: booleanTextToBoolean(value)
          }
        }));
      }
    };
  }

  function getCompletedConflictRadioProps(): RadioGroupProps<BooleanText> {
    return {
      buttonInfo: radioGroupOptions,
      className: style.adminStep4Radio,
      groupLabel: 'Completed',
      value:
        stepperFormData.confirmation.includeStudentsWithCompleted === undefined
          ? undefined
          : booleanToBooleanText(stepperFormData.confirmation.includeStudentsWithCompleted),
      onValueChange: (value: BooleanText) => {
        setStepperFormData((formData) => ({
          ...formData,
          confirmation: {
            ...formData.confirmation,
            includeStudentsWithCompleted: booleanTextToBoolean(value)
          }
        }));
      }
    };
  }

  return {
    hasNotAssignedOption,
    hasConflictsHeader,
    hasAlreadyAssignedConflict,
    hasInProgressConflict,
    hasCompletedConflict,
    getNotAssignedDescription,
    getNotAssignedRadioProps,
    getAlreadyAssignedConflictDescription,
    getAlreadyAssignedConflictRadioProps,
    getInProgressConflictDescription,
    getInProgressConflictRadioProps,
    getCompletedConflictDescription,
    getCompletedConflictRadioProps
  };
}

const AdminStep4Content = (): JSX.Element => {
  const {
    getNotAssignedRadioProps,
    getNotAssignedDescription,
    getAlreadyAssignedConflictDescription,
    getAlreadyAssignedConflictRadioProps,
    getInProgressConflictDescription,
    getInProgressConflictRadioProps,
    getCompletedConflictDescription,
    getCompletedConflictRadioProps,
    hasNotAssignedOption,
    hasConflictsHeader,
    hasAlreadyAssignedConflict,
    hasInProgressConflict,
    hasCompletedConflict
  } = useStep4();
  return (
    <>
      <h3 className={style.adminStep4ConflictHeader}>
        Students with no existing or completed assessments
      </h3>
      {getNotAssignedDescription()}
      {hasNotAssignedOption ? (
        <>
          <section className={style.adminStep4ConflictDescription}>
            Do you want to assign Scholastic Reading Measure to these students?
          </section>
          <RadioGroup {...getNotAssignedRadioProps()} />
        </>
      ) : null}
      {hasConflictsHeader ? (
        <>
          <h3 className={style.adminStep4PleaseResolveHeader}>
            Please resolve the following conflicts
          </h3>
          <hr className={style.adminStep4LineBreak} />
        </>
      ) : null}

      {hasAlreadyAssignedConflict ? (
        <p>
          <h4 className={style.adminStep4ConflictHeader}>Already assigned</h4>
          <section className={style.adminStep4ConflictDescription}>
            {getAlreadyAssignedConflictDescription()}
          </section>
          <section className={style.adminStep4ConflictDescription}>
            Would you like to override this existing assignment? Overriding the assignment will
            cancel that assessment.
          </section>
          <RadioGroup {...getAlreadyAssignedConflictRadioProps()} />
        </p>
      ) : null}

      {hasInProgressConflict ? (
        <p>
          <h4 className={style.adminStep4ConflictHeader}>In Progress</h4>
          <section className={style.adminStep4ConflictDescription}>
            {getInProgressConflictDescription()}
          </section>
          <section className={style.adminStep4ConflictDescription}>
            Would you like to override this assessment in progress? Overriding the assessment will
            cancel that assignment and all work done will be lost.
          </section>
          <RadioGroup {...getInProgressConflictRadioProps()} />
        </p>
      ) : null}

      {hasCompletedConflict ? (
        <p>
          <h4 className={style.adminStep4ConflictHeader}>Completed</h4>
          <section className={style.adminStep4ConflictDescription}>
            {getCompletedConflictDescription()}
          </section>
          <section className={style.adminStep4ConflictDescription}>
            Would you like to assign these students another assessment?
          </section>
          <RadioGroup {...getCompletedConflictRadioProps()} />
        </p>
      ) : null}
    </>
  );
};

export default AdminStep4Content;
