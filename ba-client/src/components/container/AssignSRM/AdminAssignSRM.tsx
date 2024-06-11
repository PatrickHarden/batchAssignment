import React, { lazy, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { adminStepperFormDataAtom, currentSchoolYearDetailsAtom } from '../../../atoms/atoms';
import Stepper from '../../pure/Stepper/Stepper';
import Steps, { type StepsProps } from '../../pure/Stepper/Steps/Steps';
import AssignSRMHeader from './AssignSRMHeader';
import styles from './AdminAssignSRM.module.scss';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import { useOrgsApi, type Org } from '../../../hooks/apis/use-org-api';
import { constructInitialState } from '../../pure/Stepper/Steps/AdminSteps/Step2/AdminStep2Content';
import { initialConfirmation } from '../../../atoms/atoms';

const AdminStep1Content = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step1/AdminStep1Content')
);
const AdminStep2Content = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step2/AdminStep2Content')
);
const AdminStep3Content = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step3/AdminStep3Content')
);
const AdminStep4Subheader = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step4/AdminStep4Subheader')
);
const AdminStep4Content = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step4/AdminStep4Content')
);
const AdminStep5Content = lazy(
  () => import('../../pure/Stepper/Steps/AdminSteps/Step5/AdminStep5Content')
);

const AdminAssignSRM = () => {
  const setAdminStepperFormData = useSetAtom(adminStepperFormDataAtom);
  const { shortDescription, schoolYear } = useAtomValue(currentSchoolYearDetailsAtom);
  const { orgId, user_id: userId } = useAtomValue(sdmInfoAtom);

  const orgs: Org = useOrgsApi({
    orgId: orgId,
    adminId: userId,
    schoolYear: schoolYear
  });

  const isMultipleOrgs = orgs.organizations.length > 1;

  const adminStepsContent: StepsProps[] = [
    {
      header: 'Step 1: Select Assessment Period',
      subheader: `Consider choosing the assessment period that most closely relates to where you are in your school year. \
      For example, if you would like to assign the SRM to students in the first few months of the school year, choose "Beginning of Year".`,
      content: <AdminStep1Content />
    },
    {
      header: isMultipleOrgs ? 'Step 2: Select Sites and Grades' : 'Step 2: Select Grades',
      subheader: isMultipleOrgs
        ? `Please select the sites and grade levels to be assigned the SRM.`
        : 'Please select the grade levels to be assigned the Scholastic Reading Measure.',
      content: <AdminStep2Content />
    },
    {
      header: 'Step 3: Select Date & Time',
      content: <AdminStep3Content />
    },
    {
      header: 'Step 4: Student Selection',
      subheader: <AdminStep4Subheader />,
      content: <AdminStep4Content />
    },
    {
      header: 'Step 5: Auto Assign',
      subheader:
        'Do you want to automatically assign this assessment to new students who join the grades you selected for the duration of the assessment period?',
      content: <AdminStep5Content />
    }
  ];

  const schoolYearText = (
    <span className={styles.schoolYear}>
      School Year <span className={styles.year}>{shortDescription}</span>
    </span>
  );

  // reset the admin stepper form data on route load
  useEffect(() => {
    setAdminStepperFormData({
      assessmentPeriod: '',
      sitesAndGrades: constructInitialState(orgs),
      dateTime: { startDate: undefined, startTime: null, endDate: undefined, endTime: null },
      students: [],
      autoAssign: undefined,
      confirmation: initialConfirmation
    });
  }, []);

  return (
    <>
      <AssignSRMHeader title="New Assignment" helperText={schoolYearText} />
      <Stepper totalSteps={adminStepsContent.length} finalStepText="assign" navigatesOnCancel>
        {adminStepsContent.map(({ header, subheader, content }, index) => (
          <Steps key={index} header={header} subheader={subheader} content={content} />
        ))}
      </Stepper>
    </>
  );
};

export default AdminAssignSRM;
