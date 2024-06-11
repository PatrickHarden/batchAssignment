import React from 'react';
import type { TableColumn } from '../../../../hooks/useTable/useTable';
import Period from '../../../pure/Table/TableComponents/Period';
import AdminTableDropdown from '../../../pure/Table/TableComponents/AdminTableDropdown';
import StartEndDate from '../../../pure/Table/TableComponents/StartEndDate';
import type {
  Period as PeriodType,
  Status as StatusType
} from '../../../../hooks/apis/use-students-api';
import Status from '../../../pure/Table/TableComponents/Status';
import { formatDate } from '../../../../utils/format-date';
import { type AssessmentsResponse } from '../../../../hooks/apis/use-admin-assessments-api';
import { type GradeName, type AvailableGrade } from '../../../../hooks/apis/use-org-api';
import { modifyStatus } from '../../../../utils/format-table-data';
import { startCase } from 'lodash-es';

export interface AdminAssessmentData {
  grade: GradeName | null;
  status: StatusType;
  completed: string | null;
  period: PeriodType;
  startDate: string | null;
  endDate: string | null;
  assignedBy: string | null;
  action: boolean;
  assessmentId: number | null;
  site: string;
  rowGrade: GradeName | null;
}

export interface AccordionTableData {
  organizationName: string;
  assessments: AdminAssessmentData[];
}

export const accordionColumnDefs: TableColumn<AdminAssessmentData>[] = [
  {
    title: 'SITES AND USERS',
    id: 'grade',
    sort: false,
    width: 340,
    hideDupes: true
  },
  {
    title: 'STATUS',
    id: 'status',
    width: 145,
    wrapText: true,
    render: ({ status }) => <Status status={status} />
  },
  {
    title: '% COMPLETED',
    id: 'completed',
    textAlign: 'right',
    width: 133
  },
  {
    title: 'ASSESSMENT PERIOD',
    id: 'period',
    wrapText: true,
    width: 143,
    render: ({ period }) => <Period period={period} />
  },
  {
    title: 'START DATE/TIME ',
    id: 'startDate',
    wrapText: true,
    width: 120,
    render: ({ status, startDate }) => <StartEndDate status={status} time={startDate} />
  },
  {
    title: 'END DATE/TIME',
    id: 'endDate',
    wrapText: true,
    width: 120,
    render: ({ status, endDate }) => <StartEndDate status={status} time={endDate} />
  },
  {
    title: 'ASSIGNED BY',
    id: 'assignedBy',
    width: 130,
    wrapText: true
  },
  {
    title: 'ACTION',
    id: 'action',
    textAlign: 'center',
    width: 153,
    render: (row, index) => (
      <AdminTableDropdown index={index} tableData={row} placeholder="Select" />
    )
  }
];

const getGradeName = (gradeCode: string | null, allGrades: AvailableGrade[]) => {
  const grade = allGrades.find(({ code }) => code === gradeCode);
  if (grade === null) {
    return null;
  }
  return grade ? grade.name : null;
};

const getTeacherName = (lastName: string | null, firstName: string | null) => {
  if (lastName && firstName) {
    return `${lastName}, ${firstName}`;
  }
  return null;
};

const getFormattedDate = (date: string | null) => {
  if (date) {
    return formatDate(date);
  }
  return date;
};

const getCompletedPercent = (percent: string | null) => {
  if (percent) {
    return `${percent}%`;
  }
  return percent;
};

const getModifiedStatus = (status: StatusType | null, startDate: string | null) => {
  const returnStatus = (stat: StatusType | null) => {
    return stat ? stat : 'NO_TEST_SCHEDULED';
  };
  return status && startDate ? modifyStatus(status, startDate) : returnStatus(status);
};

export const parseResponse = (response: AssessmentsResponse, allGrades: AvailableGrade[]) => {
  const tableData: AccordionTableData[] = response.results.flatMap((result) => {
    const orgName = startCase(result.organizationName.toLocaleLowerCase());
    const assessments: AdminAssessmentData[] = result.grades.flatMap((grade) => {
      return grade.assessments.map((assessment, index) => ({
        grade: index === 0 ? getGradeName(grade.grade, allGrades) : null,
        status: getModifiedStatus(assessment.status, assessment.startDate),
        completed: getCompletedPercent(assessment.percentCompleted),
        period: assessment.period,
        startDate: getFormattedDate(assessment.startDate),
        endDate: getFormattedDate(assessment.endDate),
        assignedBy: getTeacherName(assessment.assignedByLastName, assessment.assignedByFirstName),
        action: true,
        assessmentId: assessment.assignmentId,
        site: orgName,
        rowGrade: getGradeName(grade.grade, allGrades)
      }));
    });
    return {
      organizationName: orgName,
      assessments: assessments
    };
  });
  return tableData;
};
