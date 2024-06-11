import React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styles from './RadioGroup.module.scss';
import { uniqueId } from 'lodash-es';

export interface RadioButtonOptions<Value extends string> {
  label: string;
  value: Value;
}
export interface RadioGroupProps<Value extends string> extends RadixRadioGroup.RadioGroupProps {
  buttonInfo: RadioButtonOptions<Value>[];
  groupLabel?: string;
  value?: Value;
  onValueChange?(value: Value): void;
}
const RadioGroup = <Value extends string>({
  buttonInfo,
  groupLabel = 'Radio Buttons',
  ...rest
}: RadioGroupProps<Value>) => {
  return (
    <form>
      <RadixRadioGroup.Root className={styles.RadioGroupRoot} aria-label={groupLabel} {...rest}>
        {buttonInfo.map(({ label, value }, index) => {
          const randomId = uniqueId(`${index.toString()}-`);
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <RadixRadioGroup.Item
                className={styles.RadioGroupItem}
                value={value}
                id={randomId}
                aria-label={label}
              >
                <RadixRadioGroup.Indicator className={styles.RadioGroupIndicator} />
              </RadixRadioGroup.Item>
              <label className={styles.Label} htmlFor={randomId}>
                {label}
              </label>
            </div>
          );
        })}
      </RadixRadioGroup.Root>
    </form>
  );
};

export default RadioGroup;
