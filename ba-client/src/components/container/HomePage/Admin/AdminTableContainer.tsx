import React, { useMemo, useRef } from 'react';
import { useAdminAssessmentsApi } from '../../../../hooks/apis/use-admin-assessments-api';
import { type GradeCode } from '../../../../hooks/apis/use-org-api';
import {
  AdminApiFilters,
  adminFilterSchoolYearAtom,
  gradesAtom,
  statusAtom,
  fromDateAtom,
  toDateAtom,
  assessmentAtom,
  PeriodSelection,
  initialOrgAndGradesAtom,
  sitesAtom
} from '../../../../atoms/atoms';
import AccordionTable from '../../../pure/Table/AccordionTable';
import { accordionColumnDefs, parseResponse } from './TableColumnDefinitions';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';

interface AdminTableContainerProps {
  orgIds: number[];
  grades: GradeCode[];
  mappedSitesAndIds: Record<string, number>;
}

const AdminTableContainer = ({ orgIds, grades, mappedSitesAndIds }: AdminTableContainerProps) => {
  const initialData = useAtomValue(initialOrgAndGradesAtom);

  const savedSites = useAtomValue(sitesAtom);
  const savedGrades = useAtomValue(gradesAtom);
  const savedStatuses = useAtomValue(statusAtom);
  const savedStartDate = useAtomValue(fromDateAtom);
  const savedEndDate = useAtomValue(toDateAtom);
  const savedAssessments = useAtomValue(assessmentAtom);

  const mapped = savedAssessments
    .filter((a) => !a.disabled)
    .map((a) => `${a.id}_ALL`) as PeriodSelection[];

  const schoolYearAtom = useAtomValue(adminFilterSchoolYearAtom);
  const schoolYearParam = schoolYearAtom ? schoolYearAtom : String(initialData.schoolYear);
  const sdmInfo = useAtomValue(sdmInfoAtom);

  const prevSavedSiteIds = useRef<number[]>([]);
  const yearChanged = Number(schoolYearParam) !== mappedSitesAndIds.year;
  const orgIdArr =
    !yearChanged && savedSites.length > 0
      ? savedSites.map((s) => mappedSitesAndIds[s])
      : prevSavedSiteIds.current.length > 0
      ? prevSavedSiteIds.current
      : orgIds;
  if (!yearChanged) {
    prevSavedSiteIds.current = orgIdArr;
  }

  const apiFilters: AdminApiFilters = {
    grade: savedGrades.length > 0 ? savedGrades : grades.length > 0 ? grades : [],
    startDateBegin: savedStartDate
      ? [format(savedStartDate, 'yyyy-MM-dd')]
      : [initialData.startDate],
    startDateEnd: savedEndDate ? [format(savedEndDate, 'yyyy-MM-dd')] : [initialData.endDate],
    benchmark: mapped.length > 0 ? mapped : ['BEGINNING_ALL'],
    orgId: orgIdArr,
    status:
      savedStatuses.length > 0
        ? savedStatuses
        : [
            'COMPLETED',
            'IN_PROGRESS',
            'SCHEDULED',
            'NOT_STARTED',
            'NO_TEST_SCHEDULED',
            'CANCELED',
            'IN_PROGRESS',
            'ASSIGNED',
            'NOT_STARTED'
          ]
  };

  const response = useAdminAssessmentsApi({
    sdmInfo,
    schoolYear: schoolYearParam,
    ...apiFilters
  });

  const data = useMemo(() => parseResponse(response, initialData.availableGrades), [response]);

  return <AccordionTable data={data} columnDefs={accordionColumnDefs} />;
};

export default AdminTableContainer;
