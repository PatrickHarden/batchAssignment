import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from '../../components/pure/Table/Table.module.scss';
import type { Appraisal, Period, Proficiency, Status } from '../apis/use-students-api';

interface UseTableProps<Row extends TableData, RowKey extends keyof Row> {
  data: Row[];
  dataKey: RowKey;
  columnDefs: TableColumn<Row>[];
  onChange?: (rows: Row[]) => void;
  selectedStudents?: TableData[] | undefined;
}

export interface TableData {
  name: string;
  daysSinceLastAssessment: number | null;
  status: Status | null;
  assessmentPeriod: Period | '';
  startDate: string;
  endDate: string;
  result: string | null;
  proficiency: Proficiency | null;
  timeSpent: number | null;
  assignedBy: string;
  initialTeacherAppraisal: Appraisal | null;
  action: boolean;
  assessmentId: number | null;
  studentId: string;
  daysSinceLastAssessmentOriginal: number | null;
  benchmark: Period | '';
  firstName: string;
  lastName: string;
}

export type TextAlignment = 'left' | 'center' | 'right' | undefined;

export interface TableColumn<Row> {
  title: string;
  id: keyof Row;
  wrapText?: boolean;
  width?: number;
  textAlign?: TextAlignment;
  popover?: boolean;
  popoverMessage?: string;
  sort?: boolean;
  render?: (row: Row, index?: number) => React.ReactNode;
  hideDupes?: boolean;
}

const alphabeticalSort = <T, K extends keyof T>(values: T[], key: K, sortAscending: boolean) => {
  const parity = sortAscending ? -1 : 1;
  return values.sort((a, b) => {
    if (String(a[key]).toLocaleLowerCase() === String(b[key]).toLocaleLowerCase()) {
      return 0;
    }
    return String(a[key]).toLocaleLowerCase() < String(b[key]).toLocaleLowerCase()
      ? parity
      : -parity;
  });
};

export const getTextAlignment = (textAlignment: TextAlignment = 'left') => {
  switch (textAlignment) {
    case 'right':
      return styles.AlignRight;
    case 'center':
      return styles.AlignCenter;
    case 'left':
    default:
      return styles.AlignLeft;
  }
};

export const notSelectableStatuses: (Status | null)[] = ['IN_PROGRESS', 'NOT_STARTED', 'SCHEDULED'];
export const getSelectableTableData = <Row extends TableData>(tableData: Row[]) => {
  return tableData.filter(({ status }) => status && !notSelectableStatuses.includes(status));
};

export function useTable<Row extends TableData, RowKey extends keyof Row>({
  data,
  dataKey,
  columnDefs,
  onChange,
  selectedStudents
}: UseTableProps<Row, RowKey>) {
  const isAlphabetical = useRef(true);
  const [tableData, setTableData] = useState(data);
  const [checkboxState, setCheckboxState] = useState<string[]>(
    selectedStudents ? selectedStudents.map((stud) => stud.studentId) : []
  );

  const sortAlphabetically = useCallback((key: keyof Row, alphabetical: boolean) => {
    isAlphabetical.current = alphabetical;
    setTableData((data) => [...alphabeticalSort(data, key, alphabetical)]);
    setCheckboxState((state) => [...state].reverse());
  }, []);

  const handleCheck = useCallback(
    (value: string) => {
      setCheckboxState((checkboxState) => {
        // TODO: fix bug where checkboxState doesn't exist first time handleCheck runs;
        // after fixing bug double check tests still cancel and rerender on DOM on homepage
        const index = checkboxState.indexOf(value);
        if (index > -1) {
          checkboxState.splice(index, 1);
        } else {
          checkboxState.push(value);
        }

        onChange?.(tableData.filter((row) => checkboxState.includes(String(row[dataKey]))));
        return checkboxState;
      });
    },
    [dataKey, onChange, tableData]
  );

  useEffect(() => {
    setTableData(data);
    sortAlphabetically('name', true);
  }, [data, sortAlphabetically]);

  const handleCheckAll = useCallback(
    (checked: boolean) => {
      setCheckboxState(() => {
        if (checked) {
          const filteredData = getSelectableTableData(data);
          onChange?.(filteredData);
          return filteredData.map((student) => String(student[dataKey]));
        } else {
          onChange?.([]);
          return [];
        }
      });
    },
    [data, dataKey, onChange]
  );

  return {
    tableData,
    sortAlphabetically,
    isAlphabetical,
    columns: columnDefs,
    handleCheck,
    handleCheckAll,
    checkboxState
  };
}
