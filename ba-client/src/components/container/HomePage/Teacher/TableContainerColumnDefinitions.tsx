import React from 'react';
import Proficiency from '../../../pure/Table/TableComponents/Proficiency';
import TimeSpent from '../../../pure/Table/TableComponents/TimeSpent';
import TableDropdown from '../../../pure/Table/TableComponents/TableDropdown';
import Status from '../../../pure/Table/TableComponents/Status';
import styles from '../../../pure/Table/Table.module.scss';
import type { TableColumn, TableData } from '../../../../hooks/useTable/useTable';
import Period from '../../../pure/Table/TableComponents/Period';
import Appraisal from '../../../pure/Table/TableComponents/Appraisal';
import StartEndDate from '../../../pure/Table/TableComponents/StartEndDate';

interface TruncateProps {
  text: string;
}
export function TruncateText({ text }: TruncateProps) {
  return (
    <div className={styles.truncateName} aria-label={text}>
      {text}
    </div>
  );
}

export const popoverMessage = `Leverage agile frameworks to provide a robust synopsis for high level overviews. \
  Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. \
  Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.`;

const width = 190;

export const columnDefs: TableColumn<TableData>[] = [
  {
    title: 'STUDENT NAME',
    id: 'name',
    width: 161,
    sort: true,
    render: ({ name }) => <TruncateText text={name} />,
    hideDupes: true
  },
  {
    title: 'DAYS SINCE LAST COMPLETED ASSESSMENT',
    id: 'daysSinceLastAssessment',
    wrapText: true,
    width: 210,
    textAlign: 'right',
    popover: true,
    popoverMessage: popoverMessage,
    hideDupes: true
  },
  {
    title: 'STATUS',
    id: 'status',
    render: ({ status }) => <Status status={status} />
  },
  {
    title: 'ASSESSMENT PERIOD',
    id: 'assessmentPeriod',
    wrapText: true,
    width: 125,
    render: ({ assessmentPeriod }) => <Period period={assessmentPeriod} />
  },
  {
    title: 'START DATE/TIME',
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
    title: 'RESULT',
    id: 'result',
    textAlign: 'right'
  },
  {
    title: 'PROFICIENCY',
    id: 'proficiency',
    popover: true,
    popoverMessage: popoverMessage,
    render: ({ proficiency }) => <Proficiency proficiency={proficiency} />
  },
  {
    title: 'TIME SPENT',
    id: 'timeSpent',
    textAlign: 'right',
    popover: true,
    popoverMessage: popoverMessage,
    render: ({ timeSpent }) => <TimeSpent time={timeSpent} />
  },
  {
    title: 'ASSIGNED BY',
    id: 'assignedBy'
  },
  {
    title: 'INITIAL TEACHER APPRAISAL',
    id: 'initialTeacherAppraisal',
    width: width,
    wrapText: true,
    popover: true,
    popoverMessage: popoverMessage,
    render: ({ initialTeacherAppraisal }) => <Appraisal appraisal={initialTeacherAppraisal} />
  },
  {
    title: 'ACTION',
    id: 'action',
    textAlign: 'center',
    render: (row, index) => <TableDropdown index={index} tableData={row} placeholder="Select" />
  }
];
