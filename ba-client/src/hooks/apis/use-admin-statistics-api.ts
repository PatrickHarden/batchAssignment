import * as t from 'io-ts';
import useBAApi from './use-ba-api';
import type { SDMNavCtx } from '../../utils/cookie-util';
import { PeriodShape } from './use-students-api';
import { GradeCodeShape } from './use-org-api';

const StatisticsOrganizationFilterShape = t.strict({
  id: t.number,
  grades: t.array(GradeCodeShape)
});

export type StatisticsOrganizationFilter = t.TypeOf<typeof StatisticsOrganizationFilterShape>;

const StatisticsFilterShape = t.strict({
  benchmark: PeriodShape,
  organizations: t.array(StatisticsOrganizationFilterShape)
});

export type StatisticsFilter = t.TypeOf<typeof StatisticsFilterShape>;

const StatisticsShape = t.strict({
  notAssigned: t.number,
  assigned: t.number,
  inProgress: t.number,
  completed: t.number
});

export type Statistics = t.TypeOf<typeof StatisticsShape>;

export interface AssessmentsApiRequestProps {
  sdmInfo: Pick<SDMNavCtx, 'user_id' | 'orgId'>;
  filters: StatisticsFilter;
}

export const useAdminStatisticsApi = ({
  sdmInfo: { orgId, user_id: userId },
  filters
}: AssessmentsApiRequestProps): Statistics => {
  return useBAApi({
    path: `/api/v1/admin-assessments/staff/${userId}/org/${orgId}/stats`,
    shape: StatisticsShape,
    query: { assessmentType: 'srm' },
    requestOptions: {
      method: 'POST',
      body: JSON.stringify(filters)
    }
  });
};
