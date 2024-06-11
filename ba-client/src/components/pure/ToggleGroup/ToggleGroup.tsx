import React from 'react';
import styles from './ToggleGroup.module.scss';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { uniqueId } from 'lodash-es';
import { RadioButtonOptions } from '../RadioGroup/RadioGroup';

export interface ToggleGroupProps<Value extends string>
  extends RadixToggleGroup.ToggleGroupImplSingleProps {
  value?: Value;
  onValueChange?: (value: Value) => void;
  toggleButtonInfo: RadioButtonOptions<Value>[];
  toggleGroupLabel?: string;
}
export default function ToggleGroup<Value extends string>({
  toggleButtonInfo,
  toggleGroupLabel = 'Toggle Buttons Group',
  ...rest
}: ToggleGroupProps<Value>) {
  return (
    <form>
      <RadixToggleGroup.Root
        className={styles.ToggleGroupRoot}
        type="single"
        aria-label={toggleGroupLabel}
        {...rest}
      >
        {toggleButtonInfo.map(({ label, value }, index) => {
          const randomId = uniqueId(`${index.toString()}-`);
          return (
            <div key={index} className={styles.ToggleItemContainer}>
              <RadixToggleGroup.Item
                className={styles.ToggleGroupItem}
                value={value}
                id={randomId}
                aria-label={label}
              >
                <label className={styles.Label} htmlFor={randomId}>
                  {label}
                </label>
              </RadixToggleGroup.Item>
            </div>
          );
        })}
      </RadixToggleGroup.Root>
    </form>
  );
}
