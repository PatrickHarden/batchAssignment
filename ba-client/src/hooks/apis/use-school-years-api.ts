import * as t from 'io-ts';
import useBAApi from './use-ba-api';

export const SchoolYearShape = t.array(
  t.strict({
    startDate: t.string,
    endDate: t.string,
    description: t.string,
    isCurrentCalendar: t.boolean,
    schoolYear: t.number
  })
);

export type SchoolYear = t.TypeOf<typeof SchoolYearShape>;

export interface SchoolYearsApiRequestProps {
  orgId: string;
  userId: string;
}

const assessmentType = 'srm';
export const useSchoolYearsApi = ({ orgId, userId }: SchoolYearsApiRequestProps): SchoolYear =>
  useBAApi({
    path: `/api/v1/demographics/organization/${orgId}/staff/${userId}/assessmentType/${assessmentType}`,
    shape: SchoolYearShape
  });

export const useAdminSchoolYearsApi = ({ orgId, userId }: SchoolYearsApiRequestProps): SchoolYear =>
  useBAApi({
    path: `/api/v1/demographics/organization/${orgId}/admin/${userId}/assessmentType/${assessmentType}`,
    shape: SchoolYearShape
  });
