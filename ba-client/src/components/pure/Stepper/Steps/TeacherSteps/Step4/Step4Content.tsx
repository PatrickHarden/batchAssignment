import React, { useCallback, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import styles from './Step4Content.module.scss';
import Table from '../../../../Table/Table';
import { useStudentsApi } from '../../../../../../hooks/apis/use-students-api';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import { transformStudentResponseIntoTableData } from '../../../../../container/HomePage/Teacher/TableContainer';
import { selectSchoolYear } from '../../../../../container/HomePage/Teacher/TeacherHomePage';
import { TableColumn, type TableData } from '../../../../../../hooks/useTable/useTable';
import { useSchoolYearsApi } from '../../../../../../hooks/apis/use-school-years-api';
import {
  type TeacherApiFilters,
  currentSchoolYearDetailsAtom,
  isNextDisabledAtom,
  teacherStepperFormDataAtom
} from '../../../../../../atoms/atoms';
import StartEndDate from '../../../../Table/TableComponents/StartEndDate';
import TimeSpent from '../../../../Table/TableComponents/TimeSpent';
import Status from '../../../../Table/TableComponents/Status';
import { TruncateText } from '../../../../../container/HomePage/Teacher/TableContainerColumnDefinitions';
import Appraisal from '../../../../Table/TableComponents/Appraisal';
import Period from '../../../../Table/TableComponents/Period';

export const stepperColumnDefs: TableColumn<TableData>[] = [
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
    width: 155,
    textAlign: 'right',
    hideDupes: true
  },
  {
    title: 'STATUS',
    id: 'status',
    width: 115,
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
    render: () => <></>
  },
  {
    title: 'TIME SPENT',
    id: 'timeSpent',
    textAlign: 'right',
    render: ({ timeSpent }) => <TimeSpent time={timeSpent} />
  },
  {
    title: 'ASSIGNED BY',
    id: 'assignedBy'
  },
  {
    title: 'INITIAL TEACHER APPRAISAL',
    id: 'initialTeacherAppraisal',
    width: 160,
    wrapText: true,
    render: ({ initialTeacherAppraisal }) => <Appraisal appraisal={initialTeacherAppraisal} />
  },
  {
    title: 'ACTION',
    id: 'action',
    textAlign: 'left',
    render: () => <></>
  }
];

const Step4Content = () => {
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const schoolYears = useSchoolYearsApi({
    orgId: sdmInfo.orgId,
    userId: sdmInfo.user_id
  });

  const [stepperFormData, setStepperFormData] = useAtom(teacherStepperFormDataAtom);
  const { schoolYear: currentSchoolYear } = useAtomValue(currentSchoolYearDetailsAtom);
  const currentSchoolYearDetails = useMemo(
    () => selectSchoolYear(schoolYears, currentSchoolYear),
    [currentSchoolYear, schoolYears]
  );
  const setIsNextDisabled = useSetAtom(isNextDisabledAtom);

  if (stepperFormData.assessmentPeriod === '') {
    throw new TypeError('assessment period must be valid');
  }

  const apiParameters: TeacherApiFilters = {
    schoolYear: [currentSchoolYearDetails.initialYear],
    classIds: stepperFormData.classes,
    startDateBegin: [currentSchoolYearDetails.startDate],
    startDateEnd: [currentSchoolYearDetails.endDate],
    benchmark: [`${stepperFormData.assessmentPeriod}_LATEST`],
    status: [
      'COMPLETED',
      'IN_PROGRESS',
      'SCHEDULED',
      'NOT_STARTED',
      'NO_TEST_SCHEDULED',
      'CANCELED'
    ]
  };

  const response = useStudentsApi({
    userId: sdmInfo.user_id,
    orgId: sdmInfo.orgId,
    ...apiParameters
  });

  // for students with multiple assessments, reduce to one, via most recent start date DESC
  const studentsFiltered = useMemo(() => {
    return response.results.map((result) => {
      result.benchmarks.forEach((benchmark) => {
        if (benchmark.assessments.length > 1) {
          const selectedAssessment = benchmark.assessments.reduce((prev, current) =>
            prev.startDate &&
            current.startDate &&
            new Date(prev.startDate) < new Date(current.startDate)
              ? prev
              : current
          );
          benchmark.assessments = [selectedAssessment];
          return benchmark;
        } else {
          return benchmark;
        }
      });
      return result;
    });
  }, [response]);

  const students = useMemo(
    () => transformStudentResponseIntoTableData({ results: studentsFiltered }),
    [studentsFiltered]
  );

  const handleCallback = useCallback(
    (students: TableData[]) => {
      // update students property and reset teacherAppraisal prop
      setStepperFormData({ ...stepperFormData, students: students, teacherAppraisal: {} });
    },
    [setStepperFormData, stepperFormData]
  );

  const tableMemo = useMemo(
    () => (
      <Table
        stickyHeader={true}
        data={students}
        columnDefs={stepperColumnDefs}
        onChange={handleCallback}
        enableCheckbox
        stepperContainerStyles
        dataKey="studentId"
        selectedStudents={stepperFormData.students}
      />
    ),
    [handleCallback, stepperFormData.students, students]
  );

  useEffect(() => {
    setIsNextDisabled(stepperFormData.students.length < 1);
  }, [setIsNextDisabled, stepperFormData.students]);

  return (
    <div className={styles.container} key="tableStep">
      {students.length > 0 ? tableMemo : null}
    </div>
  );
};

export default Step4Content;
