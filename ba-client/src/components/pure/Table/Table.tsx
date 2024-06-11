import {
  useTable,
  TableColumn,
  getTextAlignment,
  TableData,
  getSelectableTableData,
  notSelectableStatuses
} from '../../../hooks/useTable/useTable';
import React, { useMemo } from 'react';
import styles from './Table.module.scss';
import TableHeaderCell from './TableComponents/TableHeaderCell';
import Checkbox, { CheckboxProps } from '../../pure/checkbox/Checkbox';
import cx from 'classix';
import Tooltip from '../Tooltip/Tooltip';

export interface TableProps<Row, RowKey extends keyof Row> {
  data: Row[];
  columnDefs: TableColumn<Row>[];
  enableCheckbox?: boolean;
  maxHeight?: string;
  stickyHeader?: boolean;
  dataKey: RowKey;
  ariaLabel?: string;
  hideDuplicateNameCells?: boolean;
  stepperContainerStyles?: boolean;
  onChange?: (rows: Row[]) => void;
  selectedStudents?: TableData[];
}

interface TableCheckboxProps extends CheckboxProps {
  disabled: boolean;
  isChecked: boolean;
}

const TableCheckbox = ({ disabled, isChecked, ...rest }: TableCheckboxProps) => {
  return disabled ? (
    <Tooltip
      className={cx(styles.notAllowed)}
      content="This student already has an assessment assigned.
If you want to override this assessment, you can cancel it from the Action column."
      side="top"
    >
      <Checkbox className={styles.tableCheckbox} isChecked={false} disabled {...rest} />
    </Tooltip>
  ) : (
    <Checkbox isChecked={isChecked} {...rest} />
  );
};

// e.g. determine whether to render the value provided in the data, or the render function in columnDefs
export const renderCustomTableCell = <Row, RowKey extends keyof Row>(
  row: Row,
  key: RowKey,
  columnIndex: number,
  columns: TableColumn<Row>[],
  rowIndex: number
) => {
  const render = columns[columnIndex]?.render;

  if (render && !!row[key]) {
    return render(row, rowIndex);
  } else if (row[key] != null) {
    return (
      <span className={styles.tableSpan}>
        <>{row[key]}</>
      </span>
    );
  } else {
    return <span className="sr-only">No Data</span>;
  }
};

const Table = <Row extends TableData, RowKey extends keyof Row>({
  data,
  columnDefs,
  enableCheckbox,
  ariaLabel = 'Scholastic Table',
  maxHeight,
  stickyHeader,
  dataKey,
  stepperContainerStyles,
  onChange,
  selectedStudents
}: TableProps<Row, RowKey>) => {
  const {
    tableData,
    columns,
    sortAlphabetically,
    isAlphabetical,
    handleCheck,
    handleCheckAll,
    checkboxState
  } = useTable({
    dataKey,
    columnDefs,
    data,
    onChange,
    selectedStudents
  });

  const numberSelectable = useMemo(() => getSelectableTableData(tableData).length, [tableData]);
  const isChecked = checkboxState.length === numberSelectable;
  const disabled = numberSelectable === 0;
  return (
    <div
      className={cx(styles.container, stepperContainerStyles && styles.tableContainer)}
      style={maxHeight && tableData.length > 8 ? { height: maxHeight } : undefined}
    >
      <div className={styles.TableContainer}>
        <table className={styles.Table} aria-label={ariaLabel}>
          <thead className={styles.TableHead}>
            <tr
              key="tableHeader"
              style={stickyHeader ? { position: 'sticky', top: '-1px' } : undefined}
            >
              {enableCheckbox && (
                <th className={styles.stickyCheckbox}>
                  <Checkbox
                    isChecked={isChecked && !disabled}
                    handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCheckAll(e.target.checked)
                    }
                    value="rowCheckbox"
                    data-testid="checkAll"
                    id="checkAll"
                    ariaLabel={`${checkboxState.length !== numberSelectable ? '' : 'un'}select all`}
                    disabled={disabled}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <TableHeaderCell
                  column={column}
                  index={index}
                  isAlphabetical={isAlphabetical.current}
                  onSortAlphabetically={sortAlphabetically}
                  enableCheckbox={enableCheckbox}
                  key={`${index}-${column.id.toString()}`}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index: number) => {
              const duplicateClassName = row['duplicated' as keyof Row] as unknown as string;
              const status = row['status'];
              const disabled = notSelectableStatuses.includes(status);
              const isChecked = checkboxState.includes(`${row[dataKey]}`);
              return (
                <tr key={`dataRow-${index}`} className={cx(duplicateClassName)}>
                  {enableCheckbox && (
                    <td className={styles.stickyCheckbox}>
                      <TableCheckbox
                        isChecked={isChecked}
                        handleChange={() => handleCheck(`${row[dataKey]}`)}
                        value="tableCheckbox"
                        data-testid={`checkbox-${index}`}
                        id={`checkbox-${row[dataKey]}`}
                        ariaLabel={`row ${index + 2}`}
                        disabled={disabled}
                      />
                    </td>
                  )}
                  {Object.keys(row).map((val, i) => {
                    const key = val as keyof Row;

                    if (columns[i] && columns[i].id === key) {
                      return (
                        <td
                          key={`${key.toString()}-${i}-${index}`}
                          data-testid={`${key.toString()}-${i}-${index}`}
                          role={i === 0 ? 'rowheader' : undefined}
                          className={cx(
                            columns[i].hideDupes && styles.hideDupes,
                            i === 0
                              ? cx(
                                  enableCheckbox ? styles.stickyWithCheckbox : styles.sticky,
                                  styles.TableCell,
                                  getTextAlignment(columns[i]?.textAlign)
                                )
                              : cx(styles.TableCell, getTextAlignment(columns[i]?.textAlign))
                          )}
                        >
                          {renderCustomTableCell(row, key, i, columnDefs, index)}
                        </td>
                      );
                    } else {
                      return null;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
