import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useCheckbox } from '../../../hooks/useCheckbox/useCheckbox';
import Checkbox from './Checkbox';
import styles from './CheckboxList.module.scss';
import { uniqueId } from 'lodash-es';

export interface CheckboxContent {
  title: string;
  id: string;
}

export type CheckboxStateObject = { [key: string]: boolean };

type OnChangeProp = (
  checkboxListState: CheckboxStateObject,
  originalCheckboxState: CheckboxStateObject
) => void;

export interface CheckboxListProps {
  hasAllCheckbox?: boolean;
  allCheckboxName?: string;
  checkAll?: boolean;
  listContent: CheckboxContent[];
  preSelectedValues?: string[] | undefined;
  maxHeight?: string;
  width?: string;
  listStyle?: string;
  onChange?: OnChangeProp;
}

const CheckboxList: FunctionComponent<CheckboxListProps> = ({
  hasAllCheckbox,
  allCheckboxName,
  checkAll,
  listContent,
  preSelectedValues,
  maxHeight,
  width,
  listStyle,
  onChange
}: CheckboxListProps) => {
  const styleName = useMemo(() => {
    return listStyle === 'dropdown' ? 'dropdown' : 'column';
  }, [listStyle]);
  const checkAllId = `checkAll-${uniqueId()}`;

  let obj: CheckboxStateObject = {};
  let objAll: CheckboxStateObject = {};

  objAll = useMemo(() => {
    const placeholderObj: CheckboxStateObject = {};
    if (hasAllCheckbox) {
      if (checkAll || (preSelectedValues && preSelectedValues.length === listContent.length)) {
        placeholderObj['0'] = true;
      } else {
        placeholderObj['0'] = false;
      }
    }
    return placeholderObj;
  }, [checkAll, hasAllCheckbox, listContent, preSelectedValues]);

  obj = useMemo(() => {
    const placeholderObject: CheckboxStateObject = {};
    if (preSelectedValues && preSelectedValues.length > 0) {
      // sets the preSelectedValues to true/checked
      listContent.forEach(({ id }) => {
        placeholderObject[id] = preSelectedValues.includes(id) ? true : false;
      });
    } else if (checkAll) {
      // checkAll means all checkboxes should be checked by default
      listContent.forEach((elem) => {
        placeholderObject[elem.id] = true;
      });
    } else {
      listContent.forEach(({ id }, index) => {
        // sets first checkbox in list to true/checked if nothing is pre-selected
        placeholderObject[id] = index === 0 ? true : false;
      });
    }
    return placeholderObject;
  }, [checkAll, listContent, preSelectedValues]);

  const { handleCheck, handleAllCheck, checkboxState, allCheckboxState, originalCheckboxState } =
    useCheckbox({
      initialAllCheckboxState: objAll,
      initialCheckboxState: obj,
      content: listContent
    });

  useEffect(() => {
    onChange?.(checkboxState, originalCheckboxState);
  }, [onChange, checkboxState, originalCheckboxState]);

  return (
    <div
      role="list"
      className={`${styles.checkboxListContainer} ${styles[styleName]}`}
      style={width ? { width: width } : {}}
    >
      {hasAllCheckbox ? (
        <div className={styles.allCheckboxContainer}>
          <div className={styles.checkbox} role="listitem">
            <Checkbox
              isChecked={allCheckboxState['0']}
              handleChange={(e: any) => {
                handleAllCheck(e.target.checked);
              }}
              onKeyDown={(e: any) => {
                if (e.key === 'Tab') {
                  e.stopPropagation();
                } else if (e.key === ' ') {
                  handleAllCheck(e.target.checked);
                }
              }}
              value={allCheckboxName}
              id={checkAllId}
            />
            <label className={styles.checkboxLabel} htmlFor={checkAllId}>
              {allCheckboxName ? allCheckboxName : 'All Checkbox'}
            </label>
          </div>
        </div>
      ) : null}
      <div
        className={styles.checkboxContainer}
        style={{
          maxHeight: maxHeight ?? ''
        }}
      >
        {listContent.map((section) => (
          <div key={section.id} className={styles.checkbox}>
            <Checkbox
              isChecked={!!section.id && checkboxState[section.id]}
              handleChange={(e: any) => {
                handleCheck(e.target.id, e.target.checked);
              }}
              onKeyDown={(e: any) => {
                if (e.key === 'Tab') {
                  e.stopPropagation();
                } else if (e.key === ' ') {
                  handleCheck(e.target.id, e.target.checked);
                }
              }}
              value={section.title}
              id={section.id}
              key={section.id}
            />
            <label className={styles.checkboxLabel} htmlFor={section.id}>
              {section['title']}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CheckboxList;
