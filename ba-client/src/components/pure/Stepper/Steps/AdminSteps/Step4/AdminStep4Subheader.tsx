import React from 'react';
import { useAtomValue } from 'jotai';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import {
  type Statistics,
  useAdminStatisticsApi
} from '../../../../../../hooks/apis/use-admin-statistics-api';
import { adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import style from './AdminStep4Subheader.module.scss';

export function pluralizeStudentMatch(count: number) {
  return count === 1 ? 'student matches' : 'students match';
}

export function useAdminStatisticsApiHelper(): Statistics {
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const stepperData = useAtomValue(adminStepperFormDataAtom);

  if (stepperData.assessmentPeriod === '') {
    throw new TypeError('benchmark period must be set before admin step 4');
  }

  // filter out "all sites and grades" if it exists and orgs without a grade selected
  const organizations = stepperData.sitesAndGrades
    .filter(({ id, grades }) => id !== -1 && grades.length > 0)
    .map(({ id, grades }) => ({
      id: id,
      grades: grades
    }));

  return useAdminStatisticsApi({
    sdmInfo: sdmInfo,
    filters: {
      benchmark: stepperData.assessmentPeriod,
      organizations: organizations
    }
  });
}

export function useStudentCount() {
  const stats = useAdminStatisticsApiHelper();

  return stats.notAssigned + stats.assigned + stats.inProgress + stats.completed;
}

const AdminStep4Subheader = () => {
  const studentCount = useStudentCount();
  return (
    <>
      <strong className={style.adminStep4SubtitleStudentCount}>{studentCount}</strong>{' '}
      {pluralizeStudentMatch(studentCount)} your criteria for assigning this assessment.
    </>
  );
};

export default AdminStep4Subheader;
