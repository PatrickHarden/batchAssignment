import React, {
  type FunctionComponent,
  type KeyboardEvent,
  useRef,
  useState,
  useCallback,
  useMemo
} from 'react';
import styles from './DropdownCheckbox.module.scss';
import { ReactComponent as CaretDown } from '../../../assets/icons/caretDown.svg';
import { ReactComponent as CaretUp } from '../../../assets/icons/caretUp.svg';
import { Button, Menu } from '@material-ui/core';
import CheckboxList, { type CheckboxStateObject } from '../checkbox/CheckboxList';
import type { MenuContent, MenuProps } from './Dropdown';
import { isEqual } from 'lodash-es';

interface CheckboxMenuContent extends MenuContent {
  id: string;
}

export interface DropdownCheckboxProps extends Omit<MenuProps, 'preSelectedValue'> {
  content: CheckboxMenuContent[];
  preSelectedValues?: string[];
}

const DropdownCheckbox: FunctionComponent<DropdownCheckboxProps> = ({
  content,
  header,
  subHeader,
  hasAllCheckbox,
  allCheckboxName,
  checkAll,
  applyButton,
  openDropdown,
  width,
  preSelectedValues,
  onChange,
  value
}: DropdownCheckboxProps) => {
  const toggleButton = useRef(null);
  const [open, setOpen] = useState(false);
  const [applyBtn, setApplyBtn] = useState(true);
  const [checkboxState, setCheckboxState] = useState({} as CheckboxStateObject);

  // subHeaders are for filters without a label like 'end date'
  const filterType = useMemo(() => {
    return value ?? subHeader ?? header;
  }, [header, subHeader, value]);

  const selectedIds = useMemo(() => {
    return preSelectedValues ? preSelectedValues : undefined;
  }, [preSelectedValues]);

  const dropdownValue = useMemo(() => {
    if (preSelectedValues && preSelectedValues.length > content.length && allCheckboxName) {
      // this situation happens when the 'all' checkbox is selected
      return allCheckboxName;
    }
    if (preSelectedValues) {
      // go through pre-selected values and add selected values to array
      const selectedCheckboxNames = content.reduce(
        (acc: string[], { id, title }) => (preSelectedValues.includes(id) ? [...acc, title] : acc),
        []
      );

      return selectedCheckboxNames.length > 1
        ? `${selectedCheckboxNames[0]} & ${selectedCheckboxNames.length - 1} more`
        : selectedCheckboxNames[0];
    }
    // non-preselected values
    if (content.length === 1) {
      return content[0].title;
    } else if (checkAll) {
      return content.length > 1
        ? `${content[0].title} & ${content.length - 1} more`
        : content[0].title;
    } else {
      return content[0]['title'];
    }
  }, [preSelectedValues, content, allCheckboxName, checkAll]);

  const handleOpen = useCallback(() => {
    setOpen(true);

    setTimeout(() => {
      const allElements = Array.from(document.getElementsByTagName('input'));
      const firstEl = allElements.find((el) => el.checked);

      if (firstEl) {
        firstEl.focus();
      }
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  }, []);

  const handleApply = useCallback(() => {
    const allElements = Array.from(document.getElementsByTagName('input'));
    const selectedCheckboxIds: string[] = [];
    allElements.forEach((el) => {
      if (el.checked) {
        selectedCheckboxIds.push(el.id);
      }
    });

    const idsSelected =
      hasAllCheckbox && selectedCheckboxIds.length > content.length
        ? selectedCheckboxIds.slice(1)
        : selectedCheckboxIds;

    // used to pass all selected values back up to filtersHeader component
    if (idsSelected) {
      onChange?.(value ? value : filterType, idsSelected);
    }
    handleClose();
  }, [content.length, filterType, handleClose, hasAllCheckbox, onChange, value]);

  const getCheckboxState = useCallback(
    (checkboxListState: CheckboxStateObject, originalCheckboxListState: CheckboxStateObject) => {
      // isEqual is a lodash function comparing if 2 objects have matching content
      if (
        !Object.values(checkboxListState).includes(true) ||
        isEqual(checkboxListState, originalCheckboxListState)
      ) {
        setApplyBtn(true);
      } else if (checkboxListState !== checkboxState) {
        setApplyBtn(false);
      }
      setCheckboxState(checkboxListState);
    },
    [checkboxState]
  );

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
        <span className={styles.header} data-testid="dropdownCheckboxTitle">
          {dropdownValue ? dropdownValue : 'Select Value'}
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
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        getContentAnchorEl={null}
        className={`${open ? 'open' : null} ${styles.menu}`}
      >
        <CheckboxList
          listContent={content}
          hasAllCheckbox={hasAllCheckbox}
          allCheckboxName={allCheckboxName}
          checkAll={checkAll}
          preSelectedValues={selectedIds && selectedIds.length > 0 ? selectedIds : undefined}
          maxHeight="280px"
          width={width}
          listStyle="dropdown"
          onChange={getCheckboxState}
        />
        {applyButton && (
          <div className={styles.footerButtons} aria-label="Footer Buttons">
            <button
              className="button--white-black"
              onClick={() => handleClose()}
              onKeyDown={handleKeyDown}
            >
              Cancel
            </button>
            <button
              className="button--black"
              onClick={handleApply}
              disabled={applyBtn}
              onKeyDown={handleKeyDown}
            >
              Apply
            </button>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default DropdownCheckbox;
