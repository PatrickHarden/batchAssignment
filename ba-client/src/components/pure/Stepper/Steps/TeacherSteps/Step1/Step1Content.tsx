import React, { useMemo, useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  selectedTeacherHomepageFiltersAtom,
  teacherStepperFormDataAtom,
  isNextDisabledAtom,
  currentSchoolYearDetailsAtom
} from '../../../../../../atoms/atoms';
import { useSectionsApi } from '../../../../../../hooks/apis/use-class-sections-api';
import CheckboxList, { CheckboxStateObject } from '../../../../checkbox/CheckboxList';
import styles from './Step1Content.module.scss';
import { SelectedFilterValues } from '../../../../../container/FilterHeader/FiltersHeader';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';

const Step1Content = () => {
  const selectedFilters = useAtomValue(selectedTeacherHomepageFiltersAtom);
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const { schoolYear: currentSchoolYear, shortDescription } = useAtomValue(
    currentSchoolYearDetailsAtom
  );
  const teacherSections = useSectionsApi({
    userId: sdmInfo.user_id,
    orgId: sdmInfo.orgId,
    schoolYear: currentSchoolYear
  });
  const [stepperFormData, setStepperFormData] = useAtom(teacherStepperFormDataAtom);
  const setIsNextDisabled = useSetAtom(isNextDisabledAtom);

  // find classes only in the current school year and alphabetize them
  const currentSchoolYearClasses = useMemo(
    () =>
      teacherSections
        .filter((section) => section.hasStudents)
        .map(({ name, id }) => ({ title: name, id }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [teacherSections]
  );

  const selectedValues = useMemo(() => {
    let result = [currentSchoolYearClasses[0].id];
    // populate step1 selections when returning to step1
    if (stepperFormData.classes.length > 0) {
      result = stepperFormData.classes;
    } else if (
      // populate selections from homepage filter
      selectedFilters[SelectedFilterValues.Class] &&
      (selectedFilters[SelectedFilterValues.SchoolYear] === undefined ||
        selectedFilters[SelectedFilterValues.SchoolYear][0] === shortDescription)
    ) {
      result = selectedFilters[SelectedFilterValues.Class];
    }

    // ensure stepperFormData has a class otherwise api will fail
    if (stepperFormData.classes.length === 0) {
      setStepperFormData({ ...stepperFormData, classes: result });
    }
    return result;
  }, [selectedFilters, currentSchoolYear, stepperFormData]);

  const getCheckboxState = useCallback(
    (checkboxListState: CheckboxStateObject, originalCheckboxListState: CheckboxStateObject) => {
      const selectedClasses = Object.entries(checkboxListState).reduce(
        // each entry looks like ['87389', false] where [v[0], v[1]]
        (acc: string[], v) => (v[1] ? [...acc, v[0]] : acc),
        []
      );

      if (selectedClasses.length === 0) {
        // disable next button
        setIsNextDisabled(true);
      } else {
        setIsNextDisabled(false);
      }

      // update stepperFormData to match checkbox state
      setStepperFormData({
        ...stepperFormData,
        classes: selectedClasses,
        students: [],
        teacherAppraisal: {}
      });
    },
    [setIsNextDisabled, setStepperFormData]
  );

  return (
    <div className={styles.contentContainer}>
      <CheckboxList
        listContent={currentSchoolYearClasses}
        hasAllCheckbox
        preSelectedValues={selectedValues}
        onChange={getCheckboxState}
        allCheckboxName="All Classes"
        maxHeight="240px"
        listStyle="column"
      />
    </div>
  );
};
export default Step1Content;
