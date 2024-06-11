import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import styles from './GradeSelector.module.scss';
import Tooltip from '../Tooltip/Tooltip';
import { type GradeCode } from '../../../hooks/apis/use-org-api';
import cx from 'classix';

interface GradeSelectorProps {
  /**
   * The controlled value of the selected grades
   */
  grades: string[];
  /**
   * Event handler called when the selected grades changes
   * @param grades updated selected grades
   */
  onGradeChange: (grades: GradeCode[]) => void;
  /**
   * Accessible label for the grade selector grouping
   * @default 'grade selector'
   */
  label?: string;
}

interface GradeItemProps {
  /**
   * Value of the selected grade
   */
  value: string;
  /**
   * When `true`, prevents user from selecting the grade item
   */
  disabled?: boolean;
}

const GradeSelector = ({
  grades,
  onGradeChange,
  children,
  label = 'grade selector'
}: React.PropsWithChildren<GradeSelectorProps>) => {
  return (
    <ToggleGroupPrimitive.Root
      className={styles.gradeSelector}
      type="multiple"
      value={grades}
      onValueChange={onGradeChange}
      aria-label={label}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
};

export const GradeItem = ({
  value,
  disabled,
  children
}: React.PropsWithChildren<GradeItemProps>) => {
  return disabled ? (
    <Tooltip
      className={cx(styles.itemGap, styles.notAllowed)}
      content="There are no students entitled to the SRM at this grade level."
    >
      <ToggleGroupPrimitive.Item className={styles.gradeItem} value={value} disabled={disabled}>
        {children}
      </ToggleGroupPrimitive.Item>
    </Tooltip>
  ) : (
    <ToggleGroupPrimitive.Item
      className={cx(styles.gradeItem, styles.itemGap)}
      value={value}
      disabled={disabled}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
};

export default GradeSelector;
