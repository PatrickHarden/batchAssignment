import React from 'react';
import { TableColumn, getTextAlignment } from '../../../hooks/useTable/useTable';
import styles from './AccordionTable.module.scss';
import TableHeaderCell from './TableComponents/TableHeaderCell';
import cx from 'classix';
import Accordion, { AccordionItem } from '../Accordion/Accordion';
import type {
  AccordionTableData,
  AdminAssessmentData
} from '../../container/HomePage/Admin/TableColumnDefinitions';
import { renderCustomTableCell } from './Table';

export interface TableProps<Row> {
  data: AccordionTableData[];
  columnDefs: TableColumn<Row>[];
  enableCheckbox?: boolean;
  stickyHeader?: boolean;
  ariaLabel?: string;
}

const AccordionTable = <Row extends object>({
  data,
  columnDefs,
  enableCheckbox,
  ariaLabel = 'Scholastic Table'
}: TableProps<Row>) => {
  const getBorderStyling = (rowIndex: number, assessmentIndex: number, value: any) => {
    if (rowIndex === 0 && !value) {
      return styles.hideBorderBottom;
    } else if (rowIndex === 0 && value && assessmentIndex !== 0) {
      return `${styles.borderTop} ${styles.hideBorderBottom}`;
    } else if (rowIndex === 0 && assessmentIndex === 0 && value) {
      return styles.hideBorderBottom;
    }
    return '';
  };

  const getAriaLabel = (row: AdminAssessmentData, column: string) => {
    return `row: ${row.grade} column: ${column}`;
  };

  if (data.length === 0) {
    return (
      <div className={styles.noMatch}>
        No matches found. Please adjust your choices in the filters or choose Batch Assign to assign
        the assessment to your students.
      </div>
    );
  }

  return (
    <div className={styles.accordionTableContainer}>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <table className={cx(styles.table, styles.accordionTableHead)} aria-label={ariaLabel}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableHeaderRow} key="tableHeader">
                {columnDefs.map((column, index) => (
                  <TableHeaderCell
                    column={column}
                    index={index}
                    isAlphabetical={false}
                    enableCheckbox={enableCheckbox}
                    className={styles.tableCell}
                    key={`${index}-${String(column.id)}`}
                  />
                ))}
              </tr>
            </thead>
          </table>
          <div className={cx(styles.table, styles.accordionTable)}>
            {data.map((school) => (
              <Accordion
                key={`dataAccordion-${school.organizationName}`}
                values={[data[0].organizationName]}
                className={styles.accordionContainer}
              >
                <AccordionItem
                  key={school.organizationName}
                  title={school.organizationName}
                  classNames={{
                    header: styles.accordionHeader,
                    trigger: styles.accordionButton,
                    triggerTitle: styles.accordionTitle,
                    container: styles.accordionItemContainer,
                    triggerSVG: styles.accordionSVG
                  }}
                >
                  <table className={styles.tableInAccordion}>
                    <tbody className={styles.tableBody}>
                      {school.assessments.map((row, index: number) => {
                        return (
                          <tr className={styles.tableRow} key={`dataRow-${index}`}>
                            {Object.keys(row)
                              .filter((val, z) => val === columnDefs[z]?.id)
                              .map((val, i) => {
                                const key = val as keyof AdminAssessmentData;

                                return (
                                  <td
                                    key={`${row[key]?.toString()}-${i}-${index}`}
                                    style={{ width: `${Number(columnDefs[i].width)}px` }}
                                    className={cx(
                                      styles.tableCell,
                                      getTextAlignment(columnDefs[i]?.textAlign),
                                      getBorderStyling(i, index, row[key]),
                                      i === 0 && styles.sticky
                                    )}
                                    aria-label={getAriaLabel(
                                      school.assessments[0],
                                      columnDefs[i]?.title
                                    )}
                                  >
                                    {renderCustomTableCell(
                                      row as Row,
                                      key as any,
                                      i,
                                      columnDefs,
                                      index
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionTable;
