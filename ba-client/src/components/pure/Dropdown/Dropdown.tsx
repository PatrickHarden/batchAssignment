import React, {
  type FunctionComponent,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo
} from 'react';
import styles from './Dropdown.module.scss';
import { ReactComponent as CaretDown } from '../../../assets/icons/caretDown.svg';
import { ReactComponent as CaretUp } from '../../../assets/icons/caretUp.svg';

import { Button, Menu, MenuItem } from '@material-ui/core';
import type { RadioType } from './DropdownCheckboxRadio';
import { cx } from 'classix';
import { camelCase, isArray, uniqueId } from 'lodash-es';

interface MenuItemType {
  name?: string;
  value?: string;
  applyButton?: boolean; // has an apply button in the dropdown
  hasAllCheckbox?: boolean; // e.g. contains an 'All Classes' or 'All Students' checkbox
  allCheckboxName?: string;
  checkAll?: boolean; // sets all checkboxes to checked
  openDropdown?: boolean; // disables the dropdown from opening
  width?: string;
}

export interface MenuContent {
  title: string;
  id?: string | number;
  radio?: RadioType[];
  defaultValue?: boolean;
}

type DropdownState = (filter: string, values: string[]) => void;

export interface MenuProps extends MenuItemType {
  content: MenuContent[];
  header: string;
  subHeader?: string;
  maxHeight?: string;
  placeholder?: string;
  hasSelectedValues?: boolean;
  preSelectedValue?: [string] | [];
  onChange?: DropdownState; // passes selected dropdown values to parent
  disablePortal?: boolean;
  tableStyling?: boolean;
}

const Dropdown: FunctionComponent<MenuProps> = ({
  content,
  header,
  subHeader,
  maxHeight = '',
  openDropdown,
  placeholder,
  hasSelectedValues = true,
  preSelectedValue = [],
  onChange,
  value,
  disablePortal,
  tableStyling
}: MenuProps) => {
  const uniqueClassId = uniqueId();
  const toggleButton = useRef(null);
  const [open, setOpen] = useState(false);
  // subHeaders are for filters without their own label like 'end date'
  const filterType = subHeader ? subHeader : header;

  const defaultDropdownValue = useMemo(() => {
    let dropdownValue = '';
    if (!hasSelectedValues) {
      dropdownValue = placeholder ?? '';
    } else if (preSelectedValue.length === 1) {
      dropdownValue = preSelectedValue[0];
    } else if (placeholder) {
      dropdownValue = placeholder;
    } else if (content && (content[0]['title'] !== ' ' || content[0])) {
      dropdownValue = content[0]['title'];
    }

    return isArray(dropdownValue) ? dropdownValue[0] : dropdownValue;
  }, [hasSelectedValues, preSelectedValue, placeholder, content]);

  const camelCasedHeader = camelCase(header);

  const createLiClassName = useCallback(() => {
    return `${camelCasedHeader}-li-${uniqueClassId}`;
  }, [camelCasedHeader, uniqueClassId]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const className = createLiClassName();
        const querySelector: HTMLLIElement[] = Array.from(
          document.querySelectorAll(`li.${className}`)
        );
        querySelector
          .find(
            (elem) =>
              elem.innerHTML ===
              (isArray(defaultDropdownValue) ? defaultDropdownValue[0] : defaultDropdownValue)
          )
          ?.focus();
      });
    }
  }, [content, defaultDropdownValue, open, header, createLiClassName]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      const selectedValue = (event.target as HTMLElement).innerText;
      handleClose();

      // used to pass selected value back up to filtersHeader component
      if (selectedValue) {
        onChange?.(value ? value : filterType, [selectedValue]);
      }
    },
    [filterType, onChange, value]
  );

  return (
    <div
      className={cx(styles.dropdown, tableStyling && styles.tableDropdownStyling)}
      id={camelCasedHeader}
    >
      <Button
        id={`${camelCasedHeader}-toggle`}
        title={`${camelCasedHeader}-toggle`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        ref={toggleButton}
        className={cx(styles.toggle, open && styles.open)}
        onClick={() => setOpen((prev: boolean) => !prev)}
        disableRipple={true}
        focusRipple={false}
        disabled={openDropdown === false}
      >
        <span className={styles.header} data-testid="dropdown-title">
          {defaultDropdownValue}
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
        id={`select-${camelCasedHeader}`}
        anchorEl={toggleButton.current}
        open={open}
        onClose={(event: KeyboardEvent) => {
          setOpen(false);
          event.preventDefault();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        getContentAnchorEl={null}
        className={cx(styles.menu, disablePortal && styles.disablePortal)}
        style={{
          maxHeight
        }}
        disablePortal={disablePortal}
      >
        {content.map((filter: { title: string; id?: string | number }, index: number) => (
          <MenuItem
            key={index}
            onClick={handleChange}
            className={cx(
              filter['title'] === defaultDropdownValue ? styles.selected : null,
              createLiClassName()
            )}
            disableRipple={true}
            tabIndex={-1}
          >
            {filter['title']}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Dropdown;
