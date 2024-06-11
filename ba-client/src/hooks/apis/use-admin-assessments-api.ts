import * as t from 'io-ts';
import useBAApi from './use-ba-api';
import { type SDMNavCtx } from '../../utils/cookie-util';
import { PeriodShape, StatusShape } from './use-students-api';
import { GradeCodeShape } from './use-org-api';

const AssessmentsShape = t.array(
  t.strict({
    assignmentId: t.union([t.number, t.null]),
    period: PeriodShape,
    status: StatusShape,
    percentCompleted: t.union([t.string, t.null]),
    assignedByFirstName: t.union([t.string, t.null]),
    assignedByLastName: t.union([t.string, t.null]),
    startDate: t.union([t.string, t.null]),
    endDate: t.union([t.string, t.null])
  })
);

const AssessmentsResponseShape = t.strict({
  results: t.array(
    t.strict({
      organizationName: t.string,
      grades: t.array(
        t.strict({
          grade: GradeCodeShape,
          assessments: AssessmentsShape
        })
      )
    })
  )
});

export type Assessments = t.TypeOf<typeof AssessmentsShape>;
export type AssessmentsResponse = t.TypeOf<typeof AssessmentsResponseShape>;

export interface AssessmentsApiRequestProps {
  sdmInfo: SDMNavCtx;
  schoolYear: string;
}

export const useAdminAssessmentsApi = ({
  sdmInfo,
  schoolYear,
  ...filters
}: AssessmentsApiRequestProps): AssessmentsResponse => {
  const { orgId, user_id } = sdmInfo;
  return useBAApi({
    path: `/api/v1/admin-assessments/admin/${user_id}/org/${orgId}`,
    shape: AssessmentsResponseShape,
    query: {
      ...filters,
      schoolYear,
      assessmentType: 'srm'
    }
  });
};
