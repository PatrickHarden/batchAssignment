import React, { useEffect, useState } from 'react';
import styles from './FiltersDrawer.module.scss';
import { useAtomValue, useAtom } from 'jotai';
import {
  currentSchoolYearAtom,
  adminFilterSchoolYearAtom,
  sitesAtom,
  gradesAtom,
  statusAtom,
  toDateAtom,
  fromDateAtom,
  assessmentAtom
} from '../../../../atoms/atoms';
import Accordion, { AccordionItem } from '../../../pure/Accordion/Accordion';
import RadioGroup from '../../../pure/RadioGroup/RadioGroup';
import { addYears, format } from 'date-fns';
import Checkboxes, { AssessmentCheckbox } from './FilterCheckbox';
import { startCase, toLower } from 'lodash-es';
import { GradeCode } from '../../../../hooks/apis/use-org-api';
import DateRangePicker from '../../../pure/DatePicker/DateRangePicker';
import { Period, Status } from '../../../../hooks/apis/use-students-api';

const formatDateString = (yearString: string) => {
  const date = new Date(yearString);
  return `${format(addYears(date, 1), 'yyyy')}-${format(addYears(date, 2), 'yy')}`;
};

interface SchoolYear {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

interface Grade {
  title: string;
  id: GradeCode;
}

interface SiteListContent {
  title: string;
  id: string;
}

export interface GradeInfo {
  id: number;
  name: string;
  grades: GradeCode[];
}

export type StatusLabel =
  | 'Completed'
  | 'In Progress'
  | 'Scheduled'
  | 'No Test Scheduled'
  | 'Canceled'
  | 'Not Started';

interface StatusItem {
  id: Status;
  title: StatusLabel;
}

const statuses: StatusItem[] = [
  { id: 'COMPLETED', title: 'Completed' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'NOT_STARTED', title: 'Not Started' },
  { id: 'SCHEDULED', title: 'Scheduled' },
  { id: 'NO_TEST_SCHEDULED', title: 'No Test Scheduled' },
  { id: 'CANCELED', title: 'Canceled' }
];

const statusesMap = new Map();
for (let i = 0; i < statuses.length; i++) {
  statusesMap.set(statuses[i].id, i);
}

const gradeMap = new Map<GradeCode, number>([
  ['it', 0],
  ['ps', 1],
  ['tk', 2],
  ['pk', 3],
  ['k', 4],
  ['1', 5],
  ['2', 6],
  ['3', 7],
  ['4', 8],
  ['5', 9],
  ['6', 10],
  ['7', 11],
  ['8', 12],
  ['9', 13],
  ['10', 14],
  ['11', 15],
  ['12', 16],
  ['pg', 17],
  ['ug', 18],
  ['o', 19]
]);

export type AssessmentLabel = 'Beginning of Year' | 'Middle of Year' | 'End of Year';
export type AssessmentStatus = 'all' | 'recent';
export type AssessmentItem = {
  id: Period;
  label: AssessmentLabel;
  subvalue: AssessmentStatus;
  disabled: boolean;
};

export const initialAssessmentState: AssessmentItem[] = [
  { id: 'BEGINNING', label: 'Beginning of Year', subvalue: 'all', disabled: false },
  { id: 'MIDDLE', label: 'Middle of Year', subvalue: 'all', disabled: true },
  { id: 'END', label: 'End of Year', subvalue: 'all', disabled: true }
];

export interface DrawerAccordionProps {
  setHomePageSchoolYear: (schoolYear: string) => void;
  setOpen?: (state: boolean) => void;
  schoolYearsLabels: SchoolYear[];
  mappedGrades: Grade[];
  siteListContent: SiteListContent[];
  gradesInfo: GradeInfo[];
}

const toTitleCase = (str: string) => startCase(toLower(str));

export const sortByMap = <Item extends string>(arr: Item[], map: Map<Item, number>) => {
  return arr
    .filter((code) => map.has(code))
    .sort((a, b) => {
      const indexA = map.get(a) as number;
      const indexB = map.get(b) as number;
      return indexA - indexB;
    });
};

const FiltersDrawer = ({
  setHomePageSchoolYear,
  setOpen,
  schoolYearsLabels,
  siteListContent,
  mappedGrades,
  gradesInfo
}: // eslint-disable-next-line sonarjs/cognitive-complexity
DrawerAccordionProps) => {
  const firstTitle = 'School Year';
  const secondTitle = 'Sites';
  const thirdTitle = 'Grades';

  const sitesMap = new Map<string, number>();
  for (let i = 0; i < siteListContent.length; i++) {
    sitesMap.set(siteListContent[i].id, i);
  }

  const hasValidOrgs = siteListContent.length > 0;
  const [accordionOpenStates, setAccordionOpenStates] = useState<string[]>([
    firstTitle,
    secondTitle,
    thirdTitle
  ]);

  // School Year
  const currentSchoolYear = useAtomValue(currentSchoolYearAtom);
  const [schoolYearChosen, setSchoolYearChosen] = useState(false);
  const [adminFilterSchoolYear, setAdminFilterSchoolYear] = useAtom(adminFilterSchoolYearAtom);
  const [schoolYear, setSchoolYear] = useState(adminFilterSchoolYear || currentSchoolYear);

  // Sites
  const [sitesAndUsersAtom, setSitesAndUsersAtom] = useAtom(sitesAtom);
  const [selectedSites, setSelectedIds] = React.useState<string[]>([]);

  // Grades
  const [gradesSelectionAtom, setGradesSelectionAtom] = useAtom(gradesAtom);
  const [selectedGrades, setSelectedGrades] = useState<GradeCode[]>([]);
  const [disabledGrades, setDisabledGrades] = useState<GradeCode[]>([]);

  // Dates
  const schoolYearLabel = schoolYearsLabels.find((s) => s.value === schoolYear) as SchoolYear;
  const [fromDateSelectionAtom, setFromDateSelectionAtom] = useAtom(fromDateAtom);
  const [toDateSelectionAtom, setToDateSelectionAtom] = useAtom(toDateAtom);
  const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
  const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);

  // Status
  const [statusSelectionAtom, setStatusSelectionAtom] = useAtom(statusAtom);
  const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);

  // Assessment
  const [assessmentSelectionAtom, setAssessmentSelectionAtom] = useAtom(assessmentAtom);
  const [selectedAssessment, setSelectedAssessment] = useState(initialAssessmentState);

  const [applyFiltersClicked, setApplyFiltersClicked] = useState(false);

  useEffect(() => {
    const newSiteIds =
      sitesAndUsersAtom.length > 0 ? sitesAndUsersAtom : siteListContent.map((e) => e.id);
    const newGradeIds =
      gradesSelectionAtom.length > 0 ? gradesSelectionAtom : mappedGrades.map((e) => e.id);

    const differentRadioYear = schoolYear !== (adminFilterSchoolYear || currentSchoolYear);
    const newFromDate = differentRadioYear
      ? new Date(schoolYearLabel.startDate)
      : fromDateSelectionAtom ?? new Date(schoolYearLabel ? schoolYearLabel.startDate : new Date());
    const newToDate = differentRadioYear
      ? new Date(schoolYearLabel.endDate)
      : toDateSelectionAtom ?? new Date(schoolYearLabel ? schoolYearLabel.endDate : new Date());

    const newStatusIds =
      statusSelectionAtom.length > 0 ? statusSelectionAtom : statuses.map((e) => e.id);
    setSelectedIds(newSiteIds);
    setSelectedGrades(newGradeIds);
    setSelectedFromDate(newFromDate);
    setSelectedToDate(newToDate);
    setSelectedStatus(newStatusIds);
    if (!applyFiltersClicked) {
      handleDisabledGrades(
        sitesAndUsersAtom.length > 0 ? sitesAndUsersAtom : siteListContent.map((e) => e.id),
        gradesInfo,
        mappedGrades,
        newGradeIds
      );
    }
  }, [applyFiltersClicked, schoolYearLabel, gradesInfo, mappedGrades, siteListContent]);

  useEffect(() => {
    if (!schoolYearChosen) {
      const newAssessments =
        assessmentSelectionAtom.length > 0 ? assessmentSelectionAtom : initialAssessmentState;
      setSelectedAssessment(newAssessments);
    }
  }, [schoolYearChosen, assessmentSelectionAtom]);

  useEffect(() => {
    if (schoolYearChosen) {
      setSelectedAssessment(initialAssessmentState);
    }
  }, [schoolYearChosen, schoolYear]);

  const handleDisabledGrades = (
    sites: string[],
    gradesInfo: {
      id: number;
      name: string;
      grades: string[];
    }[],
    mappedGrades: Grade[],
    currSelectedGrades: GradeCode[]
  ) => {
    const enabledGrades = new Set();

    for (const school of gradesInfo) {
      if (sites.map((s) => s.toUpperCase()).includes(school.name.toUpperCase())) {
        for (const grade of school.grades) {
          enabledGrades.add(grade);
        }
      }
    }

    const disabled = mappedGrades.filter((grade) => !enabledGrades.has(grade.id)).map((e) => e.id);
    const newEnabledGrades = mappedGrades
      .filter((grade) => enabledGrades.has(grade.id))
      .map((e) => e.id);

    const gradesToSet =
      gradesSelectionAtom.length > 0
        ? gradesSelectionAtom.filter((e) => newEnabledGrades.includes(e))
        : currSelectedGrades.length === 0
        ? mappedGrades.map((e) => e.id).filter((e) => newEnabledGrades.includes(e))
        : currSelectedGrades.filter((e) => newEnabledGrades.includes(e));

    setSelectedGrades(gradesToSet);
    setDisabledGrades(disabled);
  };

  interface CheckboxSites {
    target: 'sites';
    updatedSelectedIds: string[];
  }
  interface CheckboxGrades {
    target: 'grades';
    updatedSelectedIds: GradeCode[];
  }
  interface CheckboxStatuses {
    target: 'statuses';
    updatedSelectedIds: Status[];
  }
  interface CheckboxAssessments {
    target: 'assessment';
    updatedSelectedIds: AssessmentItem[];
  }
  type CheckboxProps = CheckboxSites | CheckboxGrades | CheckboxStatuses | CheckboxAssessments;

  function handleCheckboxChange({ target, updatedSelectedIds }: CheckboxProps) {
    if (target === 'sites') {
      setSelectedIds(updatedSelectedIds);

      handleDisabledGrades(updatedSelectedIds, gradesInfo, mappedGrades, selectedGrades);
    }
    if (target === 'grades') {
      setSelectedGrades(updatedSelectedIds);
    }
    if (target === 'statuses') {
      setSelectedStatus(updatedSelectedIds);
    }
    if (target === 'assessment') {
      setSelectedAssessment(updatedSelectedIds);
    }
  }

  const assessmentsChosenLen = selectedAssessment.filter((a) => !a.disabled).length;

  return (
    <div className={styles.drawerAccordion}>
      <div className={styles.contentWrapper}>
        <Accordion values={accordionOpenStates} onValuesChange={setAccordionOpenStates}>
          <AccordionItem
            title={firstTitle}
            subtitle={
              schoolYearChosen
                ? formatDateString(schoolYear)
                : adminFilterSchoolYear
                ? formatDateString(adminFilterSchoolYear)
                : formatDateString(schoolYear)
            }
          >
            <div className={styles.schoolYearAccordion}>
              <RadioGroup
                onValueChange={(year) => {
                  setHomePageSchoolYear(year);
                  setSchoolYearChosen(true);
                  setSchoolYear(year);
                  setSelectedAssessment(initialAssessmentState);
                }}
                defaultValue={
                  schoolYearChosen
                    ? schoolYear
                    : adminFilterSchoolYear
                    ? adminFilterSchoolYear
                    : schoolYear
                }
                buttonInfo={schoolYearsLabels}
              />
            </div>
          </AccordionItem>

          {hasValidOrgs ? (
            <>
              <AccordionItem
                title={secondTitle}
                subtitle={toTitleCase(sortByMap(selectedSites, sitesMap)[0])}
                helperInfo={selectedSites.length > 1 ? `${selectedSites.length - 1} More` : ''}
              >
                <Checkboxes
                  checkboxItems={siteListContent.map((s) => ({
                    title: toTitleCase(s.title),
                    id: s.id
                  }))}
                  onCheckboxChange={(selectedIds) =>
                    handleCheckboxChange({ updatedSelectedIds: selectedIds, target: 'sites' })
                  }
                  selectedIds={selectedSites}
                  identifier={secondTitle}
                />
              </AccordionItem>

              <AccordionItem
                title={thirdTitle}
                subtitle={sortByMap(selectedGrades, gradeMap)[0]?.toUpperCase()}
                helperInfo={selectedGrades.length > 1 ? `${selectedGrades.length - 1} More` : ''}
              >
                <Checkboxes
                  checkboxItems={mappedGrades}
                  onCheckboxChange={(selectedIds) =>
                    handleCheckboxChange({
                      updatedSelectedIds: selectedIds,
                      target: 'grades'
                    })
                  }
                  selectedIds={selectedGrades}
                  identifier={thirdTitle}
                  disabledIds={disabledGrades}
                />
              </AccordionItem>

              <AccordionItem
                title="Start Date Between"
                subtitle={
                  selectedFromDate instanceof Date && selectedToDate instanceof Date
                    ? `${format(selectedFromDate, 'MM/dd/yyyy')} — ${format(
                        selectedToDate,
                        'MM/dd/yyyy'
                      )}`
                    : ''
                }
              >
                <div className={styles.dateRangePicker}>
                  <DateRangePicker
                    sticky
                    label="Start Date:"
                    secondaryLabel="End Date:"
                    selected={{ from: selectedFromDate, to: selectedToDate }}
                    onSelect={({ from, to }) => {
                      if (from instanceof Date) {
                        setSelectedFromDate(from);
                      }
                      if (to instanceof Date) {
                        setSelectedToDate(to);
                      }
                    }}
                  />
                </div>
              </AccordionItem>

              <AccordionItem
                title="Assessment Period"
                subtitle={selectedAssessment.find((a) => !a.disabled)?.label}
                helperInfo={assessmentsChosenLen > 1 ? `${assessmentsChosenLen - 1} More` : ''}
              >
                {hasValidOrgs && (
                  <AssessmentCheckbox
                    selectedAssessments={selectedAssessment}
                    onCheckboxChange={(selectedIds) => {
                      return handleCheckboxChange({
                        updatedSelectedIds: selectedIds,
                        target: 'assessment'
                      });
                    }}
                  />
                )}
              </AccordionItem>

              <AccordionItem
                title="Status"
                subtitle={
                  statuses.find((s) => s.id === sortByMap(selectedStatus, statusesMap)[0])?.title
                }
                helperInfo={selectedStatus.length > 1 ? `${selectedStatus.length - 1} More` : ''}
              >
                <Checkboxes
                  checkboxItems={statuses}
                  onCheckboxChange={(selectedIds) =>
                    handleCheckboxChange({
                      updatedSelectedIds: selectedIds,
                      target: 'statuses'
                    })
                  }
                  selectedIds={selectedStatus}
                  hideCheckAllCheckbox
                />
              </AccordionItem>
            </>
          ) : null}
        </Accordion>
      </div>
      {/* Footer */}
      <div className={styles.buttonRow}>
        <button
          className={styles.clearButton}
          onClick={() => {
            setSelectedIds([]);
            setSelectedGrades([]);
            setDisabledGrades([]);
            setSelectedStatus([]);
            setSelectedAssessment([]);
            setSelectedFromDate(new Date(schoolYearLabel ? schoolYearLabel.startDate : new Date()));
            setSelectedToDate(new Date(schoolYearLabel ? schoolYearLabel.endDate : new Date()));
          }}
        >
          Clear All
        </button>
        <button
          className={styles.applyButton}
          onClick={() => {
            const schoolYearToSave = schoolYearChosen
              ? schoolYear
              : adminFilterSchoolYear
              ? adminFilterSchoolYear
              : schoolYear;
            setAdminFilterSchoolYear(schoolYearToSave);
            setSitesAndUsersAtom(selectedSites);
            setGradesSelectionAtom(selectedGrades);
            setFromDateSelectionAtom(selectedFromDate);
            setToDateSelectionAtom(selectedToDate);
            setStatusSelectionAtom(selectedStatus);
            setAssessmentSelectionAtom(selectedAssessment);
            setOpen?.(false);
            setApplyFiltersClicked(true);
          }}
          disabled={
            !selectedSites.length ||
            !selectedGrades.length ||
            !selectedStatus.length ||
            selectedAssessment.every((a) => a.disabled)
          }
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersDrawer;
