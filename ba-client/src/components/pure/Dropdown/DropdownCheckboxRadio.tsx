import React, {
  type ChangeEvent,
  type FunctionComponent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo
} from 'react';
import styles from './DropdownCheckboxRadio.module.scss';
import { ReactComponent as CaretDown } from '../../../assets/icons/caretDown.svg';
import { ReactComponent as CaretUp } from '../../../assets/icons/caretUp.svg';
import { Button, Menu } from '@material-ui/core';
import Checkbox from '../checkbox/Checkbox';
import type { MenuContent, MenuProps } from './Dropdown';
import { intersection, uniqueId } from 'lodash-es';

interface CheckboxMenuContent extends MenuContent {
  id: string;
}

export interface RadioType {
  title: string;
  defaultValue?: boolean;
  id: string;
}

export interface DropdownCheckboxRadioProps extends Omit<MenuProps, 'preSelectedValue'> {
  content: CheckboxMenuContent[];
  preSelectedValues?: string[];
}

const getSelectedCheckboxNames = (content: CheckboxMenuContent[], preSelectedValues: string[]) => {
  return content.reduce<string[]>(
    (acc, { title, radio }) =>
      radio?.find(({ id }) => preSelectedValues.includes(id)) ? [...acc, title] : acc,
    []
  );
};

const DropdownCheckboxRadio: FunctionComponent<DropdownCheckboxRadioProps> = ({
  content,
  header,
  subHeader,
  applyButton,
  openDropdown,
  preSelectedValues,
  onChange,
  value
}: DropdownCheckboxRadioProps) => {
  const idUnique = uniqueId();
  const toggleButton = useRef(null);
  const [open, setOpen] = useState(false);
  const [applyBtn, setApplyBtn] = useState(true);
  // subHeaders are for filters without a label like 'end date'
  const filterType = value ?? subHeader ?? header;

  const getCheckboxState = () => {
    const obj: any = {};

    if (preSelectedValues) {
      content.forEach((elem) => {
        // create an array of radio ids (e.g. ['BEGINNING_ALL', 'BEGINNING_LATEST'])
        const elemRadioArray = elem.radio && elem.radio.map((radio) => radio.id);
        // intersection checks for overlap between arrays
        obj[elem.id] = intersection(preSelectedValues, elemRadioArray).length > 0;
      });
    } else {
      if (content && content.length) {
        content.forEach((elem) => {
          if (elem.defaultValue) {
            obj[elem.id] = elem.defaultValue;
          }
        });
      }
    }
    return obj;
  };

  const [checkboxState, setCheckboxState] = useState(getCheckboxState);
  const [originalCheckboxState, setOriginalCheckboxState] = useState(getCheckboxState);

  // update checkboxState if preSelectedValues change - e.g. stepperFormData selects a different assessment period
  useEffect(() => {
    setCheckboxState(getCheckboxState());
    setOriginalCheckboxState(getCheckboxState());
  }, [preSelectedValues]);

  const defaultDropdownValue = useMemo(() => {
    if (preSelectedValues) {
      const selectedCheckboxNames = getSelectedCheckboxNames(content, preSelectedValues);

      return selectedCheckboxNames.length > 1
        ? `${selectedCheckboxNames[0]} & ${selectedCheckboxNames.length - 1} more`
        : selectedCheckboxNames[0];
    } else if (content[0]) {
      let result = content[0].title;
      let others = -1;
      // set dropdown label to the first selected option - append & others text depending on how many other options are selected
      for (let i = content.length - 1; i > -1; --i) {
        if (checkboxState[content[i].id]) {
          result = content[i].title;
          others += 1;
        }
      }

      if (others > 0) {
        result = `${result} & ${others} more`;
      }

      return result;
    }

    return '';
  }, [content, preSelectedValues, checkboxState]);

  const [dropdownValue, setDropdownValue] = useState(defaultDropdownValue);

  useEffect(() => setDropdownValue(defaultDropdownValue), [defaultDropdownValue, setDropdownValue]);

  const handleCheck = useCallback(
    (event: any, index?: number) => {
      setCheckboxState({
        ...checkboxState,
        [event.target.value !== '' ? event.target.value : index]: event.target.checked
      });

      // sets apply button to false if the only 'selected' checkbox is getting unselected
      setApplyBtn(
        Object.values(checkboxState).filter((value) => value === true).length === 1 &&
          checkboxState[event.target.value] === true
      );
    },
    [setCheckboxState, setApplyBtn, checkboxState]
  );

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const allElements = Array.from(document.getElementsByTagName('input'));
      const firstEl = allElements.find((el) => el.type === 'checkbox' && el.checked);

      if (firstEl) {
        firstEl.focus();
      }
    });
  };

  const handleClose = (reason: string) => {
    setOpen(false);

    if (reason !== 'apply') {
      setCheckboxState(originalCheckboxState);
    }
    setApplyBtn(true);
  };

  const handleKeyDown = (e: KeyboardEvent, index?: number) => {
    if (e.key === 'Tab') {
      e.stopPropagation();
    } else if (e.key === ' ') {
      handleCheck(e, index);
    }
  };

  const handleApply = () => {
    const allElements = Array.from(document.getElementsByTagName('input'));
    const selectedRadioIds: string[] = [];

    // finds all enabled and selected radio buttons
    allElements.forEach((el) => {
      if (el.type === 'radio' && el.checked === true && !el.disabled) {
        selectedRadioIds.push(el.value);
      }
    });

    setOriginalCheckboxState(checkboxState);
    handleClose('apply');

    // used to pass all selected values back up to filtersHeader component
    if (selectedRadioIds) {
      onChange?.(filterType, selectedRadioIds);
    }
  };

  return (
    <div className={styles.dropdownCheckbox}>
      <Button
        id={header + '-toggle'}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        ref={toggleButton}
        className={`${styles.toggle} ${open ? styles.open : ''}`}
        onClick={handleOpen}
        disableRipple={true}
        focusRipple={false}
        disabled={openDropdown === false}
      >
        <span className={styles.header} data-testid="dropdownCheckboxRadio">
          {dropdownValue ? dropdownValue : 'Beginning of Year'}
        </span>
        {open && <CaretUp className={styles.caret} data-testid="caretUp" aria-hidden="true" />}
        {!open && (
          <CaretDown
            className={`${styles.caret} ${openDropdown === false ? styles.disabled : ''}`}
            data-testid="caretDown"
            aria-hidden="true"
          />
        )}
      </Button>
      <Menu
        id={'select-' + header}
        anchorEl={toggleButton.current}
        open={open}
        onClose={(_event: object, reason: string) => {
          if (reason !== 'tabKeyDown') {
            handleClose(reason);
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        getContentAnchorEl={null}
        className={`${open ? 'open' : null} ${styles.menu}`}
      >
        {content.map((filter, index: number) => (
          <div className={styles.checkboxRadioContainer} aria-label={filter.title} key={index}>
            <div className={styles.checkboxGroup}>
              <Checkbox
                isChecked={filter.id && checkboxState[filter.id]}
                handleChange={(e: ChangeEvent) => {
                  if (content.length !== 2) {
                    handleCheck(e, index);
                  }
                }}
                onKeyDown={handleKeyDown}
                onClick={(e: MouseEvent) => e.stopPropagation()}
                value={filter.id}
                id={filter.id}
              />
              <label htmlFor={filter.id}>{filter['title']}</label>
            </div>
            {filter.radio && (
              <div className={styles.radioContainer}>
                {filter.radio?.map((radio: RadioType, i: number) => (
                  <div
                    key={i + header + index}
                    className={`${styles.radio} ${!checkboxState[filter.id] && styles.disabled}`}
                  >
                    <input
                      type="radio"
                      id={`${radio.id}-${idUnique}`}
                      value={radio.id}
                      name={header + index}
                      disabled={!checkboxState[filter.id]}
                      defaultChecked={
                        !!preSelectedValues?.find((selectedValue) => selectedValue === radio.id) ||
                        i === 0
                      }
                      onKeyDown={handleKeyDown}
                      onClick={() => {
                        setApplyBtn(false);
                      }}
                    />
                    <label htmlFor={`${radio.id}-${idUnique}`}>{radio.title}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {applyButton && (
          <div className={styles.footerButtons} aria-label="Footer Buttons">
            <button
              className="button--white-black"
              onClick={() => handleClose('cancel')}
              onKeyDown={(e: any) => {
                handleKeyDown(e);
              }}
            >
              Cancel
            </button>
            <button
              className="button--black"
              onClick={handleApply}
              disabled={applyBtn}
              onKeyDown={(e: any) => {
                handleKeyDown(e);
              }}
            >
              Apply
            </button>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default DropdownCheckboxRadio;
