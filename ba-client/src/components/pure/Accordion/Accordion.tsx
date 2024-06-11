import React, { ReactNode, useEffect, useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import styles from './Accordion.module.scss';
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevronDown.svg';
import { cx } from 'classix';

type AccordionPart =
  | 'header'
  | 'container'
  | 'trigger'
  | 'triggerSubContainer'
  | 'triggerTitle'
  | 'triggerSVG';

interface AccordionProps {
  values?: string[];
  onValuesChange?: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export interface AccordionItemProps {
  /**
   * Unique id
   */
  title: string;

  /**
   * Dynamic subtitle
   */
  subtitle?: string;

  /**
   * Dyanmic helper text
   */
  helperInfo?: string;

  /**
   * Hide when disabled
   */
  disabled?: boolean;

  /**
   * Data to be stored by handler
   */
  data?: unknown;

  /**
   * Item.content
   */
  children: ReactNode;

  /**
   * Accordion custom classNames for styling
   */
  classNames?: Partial<Record<AccordionPart, string>>;
}

const Accordion = ({ values, children, onValuesChange, className }: AccordionProps) => {
  const [value, setValue] = useState(values);

  useEffect(() => {
    setValue(values);
  }, [values]);

  const handleValueChange = (changes: string[]) => {
    setValue(changes);
    onValuesChange?.(changes);
  };

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={handleValueChange}
      className={cx(styles.root, className)}
    >
      {children}
    </AccordionPrimitive.Root>
  );
};

export const AccordionItem = ({
  title,
  subtitle,
  helperInfo,
  classNames,
  children
}: AccordionItemProps) => {
  return (
    <AccordionPrimitive.Item value={title} className={cx(styles.item, classNames?.container)}>
      <AccordionPrimitive.Header className={cx(styles.header, classNames?.header)}>
        <AccordionPrimitive.Trigger className={cx(styles.trigger, classNames?.trigger)}>
          <div className={cx(styles.titleRow, classNames?.triggerSubContainer)}>
            <span className={cx(styles.title, classNames?.triggerTitle)}>{title}</span>
            {subtitle ? <span className={styles.subTitle}>{subtitle}</span> : null}
          </div>
          {helperInfo ? <span className={styles.helperInfo}>{helperInfo}</span> : null}
          <ChevronDown className={cx(styles.chevron, classNames?.triggerSVG)} aria-hidden />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className={styles.content}>{children}</AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};

export default Accordion;
