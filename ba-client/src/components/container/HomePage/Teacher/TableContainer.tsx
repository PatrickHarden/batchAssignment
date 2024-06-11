import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import cx from 'classix';
import { getTime, parseISO } from 'date-fns';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import Table from '../../../pure/Table/Table';
import type { TableData } from '../../../../hooks/useTable/useTable';
import styles from '../../../pure/Table/Table.module.scss';
import {
  useStudentsApi,
  type StudentsResponse,
  type Assessments,
  type Student,
  type Assessment
} from '../../../../hooks/apis/use-students-api';
import {
  type TeacherApiFilters,
  selectedTeacherHomepageFiltersAtom
} from '../../../../atoms/atoms';
import { formatDate } from '../../../../utils/format-date';
import { modifyStatus, modifyLexile } from '../../../../utils/format-table-data';
import { columnDefs } from './TableContainerColumnDefinitions';

type TableOptions = {
  duplicated?: string;
};
type TableDataWithOptions = TableData & TableOptions;

const sortBenchmarkAssessmentByDate = (assessments: Assessments) => {
  return assessments.sort(
    (assessmentA, assessmentB) =>
      getTime(parseISO(assessmentA.startDate)) - getTime(parseISO(assessmentB.startDate))
  );
};

export function transformStudentResponseIntoTableData(
  data: StudentsResponse,
  selectedFilters?: TeacherApiFilters
): TableData[] {
  return data.results.flatMap((student): TableData[] => {
    return student.benchmarks.flatMap((benchmark): TableData[] => {
      if (benchmark.assessments.length > 0) {
        const sortedAssessments = sortBenchmarkAssessmentByDate(benchmark.assessments);
        return sortedAssessments.map((assessment, index): TableData => {
          return getStudentData(assessment, student, index);
        });
      } else if (
        benchmark.isNoTestScheduled &&
        (selectedFilters === undefined
          ? true
          : selectedFilters.status.includes('NO_TEST_SCHEDULED'))
      ) {
        return [
          {
            name: `${student.lastName}, ${student.firstName}`,
            daysSinceLastAssessment: student.daysSinceLastAssessment,
            status: 'NO_TEST_SCHEDULED',
            assessmentPeriod: benchmark.period,
            startDate: '',
            endDate: '',
            result: null,
            proficiency: null,
            timeSpent: null,
            assignedBy: '',
            initialTeacherAppraisal: null,
            action: true,
            studentId: student.studentId,
            assessmentId: null,
            daysSinceLastAssessmentOriginal: student.daysSinceLastAssessment,
            benchmark: '',
            firstName: student.firstName,
            lastName: student.lastName
          }
        ];
      }
      return [];
    });
  });
}

const getStudentData = (assessment: Assessment, student: Student, index: number): TableData => {
  return {
    name: `${student.lastName}, ${student.firstName}`,
    daysSinceLastAssessment: index === 0 ? student.daysSinceLastAssessment : null,
    status: assessment.status
      ? modifyStatus(assessment.status, assessment.startDate)
      : assessment.status,
    assessmentPeriod: assessment.benchmark,
    startDate: formatDate(assessment.startDate),
    endDate: formatDate(assessment.endDate),
    result: modifyLexile(assessment.lexileValue),
    proficiency: assessment.proficiency,
    timeSpent: assessment.timeSpent,
    assignedBy: `${assessment.assignedByLastName}, ${assessment.assignedByFirstName}`,
    initialTeacherAppraisal: assessment.teacherAppraisal,
    action: true,
    studentId: student.studentId,
    assessmentId: assessment.assessmentId,
    daysSinceLastAssessmentOriginal: student.daysSinceLastAssessment,
    benchmark: assessment.benchmark,
    firstName: student.firstName,
    lastName: student.lastName
  };
};

// check for duplicate names in the row above and below - tweak styling so that only one is visible
const hideDuplicateNames = <T, K extends keyof T>(
  tableData: T[],
  currentRow: T,
  key: K,
  rowIndex: number
) => {
  const colVal = currentRow[key];
  const aboveRow = tableData[rowIndex - 1];
  const belowRow = tableData[rowIndex + 1];

  return cx(
    aboveRow && aboveRow[key] === colVal && styles.SpanSROnly,
    belowRow && belowRow[key] === colVal && styles.hideBorderBottom
  );
};

const TableContainer = () => {
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const selectedFilters = useAtomValue(selectedTeacherHomepageFiltersAtom);

  const filterValuesForApiCall = Object.assign({}, selectedFilters, {
    schoolYear: [selectedFilters.schoolYear[0].slice(0, 4)]
  });
  const response = useStudentsApi({
    userId: sdmInfo.user_id,
    orgId: sdmInfo.orgId,
    ...filterValuesForApiCall
  });

  const students = useMemo(
    () => transformStudentResponseIntoTableData(response, selectedFilters),
    [response, selectedFilters]
  );

  const tableData = useMemo<TableDataWithOptions[]>(
    () =>
      students.map((student, index) => {
        const hideClassName = hideDuplicateNames(students, student, 'studentId', index);
        return {
          ...student,
          duplicated: hideClassName
        };
      }),
    [students]
  );

  if (students && students.length > 0) {
    return (
      <Table
        maxHeight="580px"
        dataKey="studentId"
        stickyHeader={true}
        data={tableData}
        columnDefs={columnDefs}
      />
    );
  } else {
    return null;
  }
};

export default TableContainer;
