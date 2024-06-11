import React from 'react';
import cx from 'classix';
import SortButton from './SortButton';
import InfoPopover from '../../Popover/InfoPopover';
import { TableColumn } from '../../../../hooks/useTable/useTable';
import styles from '../Table.module.scss';
import tip from '../../Popover/PopoverContent/HomePageStatusTip';

interface TableHeaderProps<Row> {
  column: TableColumn<Row>;
  index: number;
  isAlphabetical: boolean;
  enableCheckbox?: boolean;
  onSortAlphabetically?: (key: keyof Row, alphabetical: boolean) => void;
  className?: string;
}

// this will determine which actions to render depending on data/route conditions
export default function TableHeaderCell<Row>({
  column: { id, title, sort, width, wrapText, popoverMessage, popover },
  index,
  isAlphabetical,
  enableCheckbox,
  onSortAlphabetically,
  className
}: TableHeaderProps<Row>) {
  const ariaSort = sort ? (isAlphabetical ? 'ascending' : 'descending') : undefined;

  return (
    <th
      key={`${id.toString()}-${index}`}
      style={width ? { width: `${width}px` } : { minWidth: '100px' }}
      className={cx(
        index === 0 && (enableCheckbox ? styles.stickyWithCheckbox : styles.sticky),
        className
      )}
      aria-sort={ariaSort}
    >
      <span style={wrapText ? { whiteSpace: 'normal' } : { whiteSpace: 'nowrap' }}>
        {title}
        {popover && (
          <InfoPopover
            tipMessage={tip}
            stringedTipMessage={popoverMessage || ''}
            placement="bottom"
          />
        )}
        {sort && onSortAlphabetically && (
          <SortButton
            isAlphabetical={isAlphabetical}
            onSortAlphabetically={onSortAlphabetically}
            columnId={id}
          />
        )}
      </span>
    </th>
  );
}
