import React, {
  type ChangeEventHandler,
  type ComponentPropsWithoutRef,
  useEffect,
  useRef
} from 'react';
import styles from './Checkbox.module.scss';
import { cx } from 'classix';

export interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  isChecked: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  value: string | undefined;
  ariaLabel?: string;
  id?: string;
  indeterminate?: boolean;
}
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      isChecked,
      handleChange,
      value,
      ariaLabel,
      className,
      indeterminate = false,
      ...rest
    }: CheckboxProps,
    ref
  ) => {
    const checkboxRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [checkboxRef, indeterminate]);

    return (
      <input
        type="checkbox"
        className={cx(styles.checkbox, className)}
        onChange={handleChange}
        value={value}
        aria-label={ariaLabel}
        checked={isChecked}
        ref={ref ?? checkboxRef}
        {...rest}
      ></input>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
