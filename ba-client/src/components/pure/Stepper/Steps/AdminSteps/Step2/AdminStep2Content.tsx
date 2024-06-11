import React, { useEffect } from 'react';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { sdmInfoAtom } from '../../../../../../atoms/sdmInfoAtom';
import { currentSchoolYearDetailsAtom } from '../../../../../../atoms/atoms';
import { isNextDisabledAtom, adminStepperFormDataAtom } from '../../../../../../atoms/atoms';
import GradeSelector, { GradeItem } from '../../../../GradeSelector/GradeSelector';
import { startCase, cloneDeep } from 'lodash-es';
import style from './AdminStep2Content.module.scss';
import Checkbox from '../../../../checkbox/Checkbox';
import {
  useOrgsApi,
  type AvailableGrade,
  type GradeCode,
  type Org,
  type Organization
} from '../../../../../../hooks/apis/use-org-api';

export interface SitesAndGrade {
  orgName: string;
  orgsAndGrades: AvailableGrade[];
  id: number;
  grades: GradeCode[];
}

export const constructInitialState = (orgs: Org) => {
  const sitesAndGrades = orgs.organizations.map((org: Organization) => ({
    orgName: startCase(org.name.toLowerCase()),
    orgsAndGrades: org.grades.map((grade) =>
      orgs.availableGrades.find(({ code }) => code === grade)
    ) as AvailableGrade[],
    id: org.id,
    grades: []
  }));
  // if more than one organization exists add an 'all sites & grades' option
  if (orgs.organizations.length > 1) {
    sitesAndGrades.unshift({
      orgName: 'All Sites & Grades',
      orgsAndGrades: orgs.availableGrades,
      id: -1,
      grades: []
    });
  }
  return sitesAndGrades;
};

const AdminStep2Content = () => {
  const { orgId, user_id: userId } = useAtomValue(sdmInfoAtom);
  const setDisableButton = useSetAtom(isNextDisabledAtom);
  const { schoolYear } = useAtomValue(currentSchoolYearDetailsAtom);
  const [adminStepperFormData, setAdminStepperFormData] = useAtom(adminStepperFormDataAtom);

  const orgs: Org = useOrgsApi({
    orgId: orgId,
    adminId: userId,
    schoolYear: schoolYear
  });

  // function to update the atom's grades for an individual org
  const onGradeChange = (event: GradeCode[], index: number) => {
    setAdminStepperFormData((stepperFormData) => ({
      ...stepperFormData,
      sitesAndGrades: [...updateSiteGrades(index, event, stepperFormData.sitesAndGrades)]
    }));
  };

  // function to update the atom's checkbox for an individual org
  const onCheckBoxChange = (event: boolean, index: number) => {
    setAdminStepperFormData((stepperFormData) => ({
      ...stepperFormData,
      sitesAndGrades: [...updateOrgCheckbox(index, event, stepperFormData.sitesAndGrades)]
    }));
  };

  // function to update a specific orgs's checkbox status and subsequent grades
  const updateOrgCheckbox = (index: number, event: boolean, update: SitesAndGrade[]) => {
    const grades = event ? update[index].orgsAndGrades.map((orgs) => orgs.code) : [];
    return updateSiteGrades(index, grades, update);
  };

  // function to check if a gradeItem button is disabled
  const isGradeItemDisabled = (organizations: AvailableGrade[], code: GradeCode) => {
    const availableGrades = organizations.map((org) => org.code);
    return !availableGrades.includes(code);
  };

  // determine whether to render the checkbox with either a check or a hyphen
  const isCheckboxIndeterminate = (organizations: AvailableGrade[], grades: GradeCode[]) => {
    const availableGrades = organizations.map((org) => org.code);
    return !availableGrades.every((availableGrade) => grades.includes(availableGrade));
  };

  // function to update a specific site's grades
  const updateSiteGrades = (index: number, event: GradeCode[], update: SitesAndGrade[]) => {
    let result = cloneDeep(update);
    const isAllGradeSelector = update[index].id === -1;
    if (isAllGradeSelector) {
      result = result.map((org) => {
        const availableOrgs = org.orgsAndGrades.map((org) => org.code);
        const results = event.filter((grade) => availableOrgs.includes(grade));
        org.grades = results;
        return org;
      });
    } else {
      result[index].grades = event;
    }

    // update nextButton atom
    const hasNoGradeSelected = result.every(({ grades }) => grades.length < 1);
    setDisableButton(hasNoGradeSelected);
    return result;
  };

  // determine whether the next button should be disabled/enabled on load depending on the stepper atom
  useEffect(() => {
    const hasNoGradeSelected = adminStepperFormData.sitesAndGrades.every(
      ({ grades }) => grades.length < 1
    );
    setDisableButton(hasNoGradeSelected);
  }, []);

  return (
    <div className={style.container}>
      {adminStepperFormData.sitesAndGrades.map(({ orgName, orgsAndGrades, grades }, index) => (
        <div className={style.gradeContainer} key={orgName}>
          <div className={style.labelContainer}>
            <span className={style.checkboxContainer}>
              <Checkbox
                isChecked={grades.length === orgsAndGrades.map((org) => org.code).length}
                handleChange={(e) => onCheckBoxChange(e.target.checked, index)}
                value={orgName}
                indeterminate={isCheckboxIndeterminate(orgsAndGrades, grades) && grades.length > 0}
              />
            </span>
            <span className={style.label}>{orgName}</span>
          </div>
          <GradeSelector
            grades={grades}
            onGradeChange={(e) => onGradeChange(e, index)}
            label={`${orgName} grade selector`}
          >
            {orgs.availableGrades.map(({ code, name }) => (
              <GradeItem
                key={code}
                value={code}
                disabled={isGradeItemDisabled(orgsAndGrades, code)}
              >
                <span className={style.grade} aria-label={name}>
                  {code}
                </span>
              </GradeItem>
            ))}
          </GradeSelector>
        </div>
      ))}
    </div>
  );
};
export default AdminStep2Content;
