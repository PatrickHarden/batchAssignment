import React, { ChangeEvent } from 'react';
import styles from './FilterCheckbox.module.scss';
import stylesCheckbox from '../../../pure/checkbox/Checkbox.module.scss';
import { AssessmentLabel, AssessmentItem, initialAssessmentState } from './FiltersDrawer';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import radioStyles from '../../../pure/RadioGroup/RadioGroup.module.scss';
import cx from 'classix';

interface Checkbox {
  title: string;
  id: string;
}

interface CheckboxesProps<Id extends string> {
  checkboxItems: Checkbox[];
  onCheckboxChange: (selectedIds: Id[]) => void;
  selectedIds: Id[];
  identifier?: 'Sites' | 'Grades';
  hideCheckAllCheckbox?: boolean;
  disabledIds?: Id[];
}

const Checkboxes = <Id extends string>({
  checkboxItems,
  onCheckboxChange,
  selectedIds,
  identifier,
  hideCheckAllCheckbox,
  disabledIds
}: CheckboxesProps<Id>) => {
  const handleSelectAllCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      const allIds = checkboxItems
        .filter((c) => !disabledIds?.includes(c.id as Id))
        .map((school) => school.id as Id);
      onCheckboxChange(allIds);
    } else {
      onCheckboxChange([]);
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      onCheckboxChange([...selectedIds, value as Id]);
    } else {
      const updatedSelectedIds = selectedIds.filter((id) => id !== value);
      onCheckboxChange(updatedSelectedIds);
    }
  };

  const allCheckboxId = identifier === 'Sites' ? 'all sites' : 'all grades';
  const isAllSelected = selectedIds.length === checkboxItems.length;
  const selectAllIdentifier = identifier === 'Sites' ? 'All sites' : 'All Grades';

  const nonDisabledItems = checkboxItems.filter((c) => !disabledIds?.includes(c.id as Id));
  const isAllGradesSelected =
    nonDisabledItems.length < 1 ? false : selectedIds.length === nonDisabledItems.length;

  return (
    <div className={styles.container}>
      {!hideCheckAllCheckbox && (
        <div className={identifier === 'Sites' ? styles.rowSite : styles.row}>
          <input
            type="checkbox"
            id={allCheckboxId}
            checked={identifier === 'Sites' ? isAllSelected : isAllGradesSelected}
            onChange={handleSelectAllCheckboxChange}
            disabled={identifier === 'Grades' ? nonDisabledItems.length === 0 : false}
            className={stylesCheckbox.checkbox}
          />
          <label htmlFor={allCheckboxId}>{selectAllIdentifier}</label>
        </div>
      )}
      {checkboxItems.map(({ title, id }) => (
        <div className={identifier === 'Sites' ? styles.rowSite : styles.row} key={id}>
          <input
            type="checkbox"
            id={id}
            value={id}
            checked={selectedIds.includes(id as Id)}
            onChange={handleCheckboxChange}
            disabled={disabledIds?.includes(id as Id)}
            className={stylesCheckbox.checkbox}
          />
          <label htmlFor={id}>{title}</label>
        </div>
      ))}
    </div>
  );
};

interface AssessmentCheckboxProps {
  onCheckboxChange: (selectedIds: AssessmentItem[]) => void;
  selectedAssessments: AssessmentItem[];
}

const assessmentLabels: AssessmentLabel[] = ['Beginning of Year', 'Middle of Year', 'End of Year'];

interface RadioItemProps {
  value: string;
  id: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
}

const RadioItem = ({ value, id, label, disabled, checked }: RadioItemProps) => {
  return (
    <div className={styles.radioItem}>
      <RadixRadioGroup.Item
        disabled={disabled}
        className={cx(radioStyles.RadioGroupItem, disabled && radioStyles.disabled)}
        value={value}
        id={id}
        checked={!disabled && checked}
        aria-label={label}
      >
        <RadixRadioGroup.Indicator className={radioStyles.RadioGroupIndicator} />
      </RadixRadioGroup.Item>
      <label className={cx(radioStyles.Label, disabled && radioStyles.disabledLabel)} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const AssessmentCheckbox: React.FC<AssessmentCheckboxProps> = ({
  onCheckboxChange,
  selectedAssessments: selectedAssessmentsProp
}) => {
  const selectedAssessmentIds =
    selectedAssessmentsProp.length === 0
      ? initialAssessmentState.map((assessment) => assessment.id)
      : selectedAssessmentsProp.map((assessment) => assessment.id);

  const selectedAssessments =
    selectedAssessmentsProp.length === 0
      ? initialAssessmentState.map((assessment) => {
          assessment.disabled = true;
          return assessment;
        })
      : selectedAssessmentsProp;

  const handleAssessmentCheckboxChange = (labelIndex: number) => {
    const updatedAssessment = selectedAssessments.map((item, itemIndex) => {
      if (itemIndex === labelIndex) {
        return { ...item, disabled: !item.disabled };
      }
      return item;
    });

    onCheckboxChange(updatedAssessment);
  };

  type RadioValue = 'all' | 'recent';
  const handleRadioChange = (e: RadioValue, labelIndex: number) => {
    const updatedSubvalue = selectedAssessments.map((item, assessmentIndex) => {
      if (assessmentIndex === labelIndex) {
        return { ...item, subvalue: e };
      }
      return item;
    });
    onCheckboxChange(updatedSubvalue);
  };

  return (
    <div className={styles.rootContainer}>
      {assessmentLabels.map((label, labelIndex) => {
        const exists = !!selectedAssessmentIds[labelIndex];

        return (
          <div className={styles.checkboxContainer} key={label}>
            <div className={styles.rowAssessment}>
              <input
                type="checkbox"
                id={label}
                value={selectedAssessmentIds[labelIndex]}
                checked={exists ? !selectedAssessments[labelIndex].disabled : false}
                onChange={() => handleAssessmentCheckboxChange(labelIndex)}
                className={stylesCheckbox.checkbox}
              />
              <label className={styles.label} htmlFor={label}>
                {label}
              </label>
            </div>
            <div className={styles.radioContainer}>
              <form>
                <RadixRadioGroup.Root
                  className={radioStyles.RadioGroupRoot}
                  onValueChange={(e: RadioValue) => handleRadioChange(e, labelIndex)}
                  aria-label="Assessments"
                >
                  <RadioItem
                    disabled={exists ? selectedAssessments[labelIndex].disabled : true}
                    value="all"
                    id={`${label}-all`}
                    label="Show All"
                    checked={exists ? selectedAssessments[labelIndex].subvalue === 'all' : false}
                  />
                  <RadioItem
                    disabled={exists ? selectedAssessments[labelIndex].disabled : true}
                    value="recent"
                    id={`${label}-recent`}
                    label="Only Show Most Recent"
                    checked={exists ? selectedAssessments[labelIndex].subvalue === 'recent' : false}
                  />
                </RadixRadioGroup.Root>
              </form>
            </div>
            {labelIndex < 2 ? <div className={styles.divider} /> : null}
          </div>
        );
      })}
    </div>
  );
};

export default Checkboxes;
