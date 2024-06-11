import React, { type FunctionComponent, useMemo, useState, useCallback, useEffect } from 'react';
import styles from './FiltersHeader.module.scss';
import Dropdown, { type MenuProps } from '../../pure/Dropdown/Dropdown';
import { Container } from '@material-ui/core';
import { useSectionsApi } from '../../../hooks/apis/use-class-sections-api';
import DropdownCheckbox, { type DropdownCheckboxProps } from '../../pure/Dropdown/DropdownCheckbox';
import DropdownCheckboxRadio, {
  type DropdownCheckboxRadioProps
} from '../../pure/Dropdown/DropdownCheckboxRadio';
import InfoPopover from '../../pure/Popover/InfoPopover';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedTeacherHomepageFiltersAtom,
  currentSchoolYearDetailsAtom,
  type TeacherApiFilters,
  type PeriodSelection
} from '../../../atoms/atoms';
import tip from '../../pure/Popover/PopoverContent/HomePageStatusTip';
import { sdmInfoAtom } from '../../../atoms/sdmInfoAtom';
import type { SchoolYear } from '../../../hooks/apis/use-school-years-api';
import DateRangePicker, { type DateRangePickerProps } from '../../pure/DatePicker/DateRangePicker';
import type { DateRange } from 'react-day-picker';
import { isValid, parseISO } from 'date-fns';

const notAvailable = 'Not Available';
const showAll = 'Show All';
const onlyShowMostRecent = 'Only Show Most Recent';
const benchmarks: PeriodSelection[] = [
  'BEGINNING_ALL',
  'BEGINNING_LATEST',
  'MIDDLE_ALL',
  'MIDDLE_LATEST',
  'END_ALL',
  'END_LATEST'
];

export enum FilterKeys {
  SchoolYear = 'School Year',
  Class = 'Class',
  StartDateBetween = 'Start Date Between',
  AssessmentPeriod = 'Assessment Period',
  Status = 'Status'
}

export enum SelectedFilterValues {
  SchoolYear = 'schoolYear',
  Class = 'classIds',
  StartDateBegin = 'startDateBegin',
  StartDateEnd = 'startDateEnd',
  AssessmentPeriod = 'benchmark',
  Status = 'status'
}

interface FilterHeaderProps {
  schoolYears: SchoolYear;
  selectedFilters: TeacherApiFilters | Record<string, never>;
}

export function safeParseDate(maybeDate: string): Date | undefined {
  const date = parseISO(maybeDate);
  if (!isValid(date)) {
    return undefined;
  }
  return date;
}

const FiltersHeader: FunctionComponent<FilterHeaderProps> = ({
  schoolYears,
  selectedFilters
}: FilterHeaderProps) => {
  const stringedTipMessage = `Completed: These assignments have been completed. 
    In Progress: The student has started the assignment, but has not yet finished it. 
    Not Started: The assignment has been created and is available, but the student has not yet started it. 
    Scheduled: The assignment is set to start on a future date. 
    No Test Scheduled: Nothing has been assigned to this student. 
    Canceled: The assignment has been canceled manually by a teacher or administrator, or the end date has been reached.
    Deleted: The assignment has been deleted manually by an administrator.`;
  const currentSchoolYearDetails = useAtomValue(currentSchoolYearDetailsAtom);
  const setSelectedFilters = useSetAtom(selectedTeacherHomepageFiltersAtom);
  const sdmInfo = useAtomValue(sdmInfoAtom);

  const [selectedSchoolYear, setSelectedSchoolYear] = useState(
    selectedFilters[SelectedFilterValues.SchoolYear]
      ? {
          short: selectedFilters[SelectedFilterValues.SchoolYear][0].slice(0, 4),
          long: selectedFilters[SelectedFilterValues.SchoolYear][0]
        }
      : {
          short: currentSchoolYearDetails.schoolYear,
          long: currentSchoolYearDetails.shortDescription
        }
  );
  useEffect(() => {
    setSelectedSchoolYear(
      selectedFilters[SelectedFilterValues.SchoolYear]
        ? {
            short: selectedFilters[SelectedFilterValues.SchoolYear][0].slice(0, 4),
            long: selectedFilters[SelectedFilterValues.SchoolYear][0]
          }
        : {
            short: currentSchoolYearDetails.schoolYear,
            long: currentSchoolYearDetails.shortDescription
          }
    );
  }, [
    currentSchoolYearDetails.shortDescription,
    currentSchoolYearDetails.schoolYear,
    selectedFilters[SelectedFilterValues.SchoolYear]
  ]);
  // TODO: first time this runs it sets selectedSchoolYear to '0001' which doesn't return legit classes.
  const teacherSections = useSectionsApi({
    userId: sdmInfo.user_id,
    orgId: sdmInfo.orgId,
    schoolYear: selectedSchoolYear.short
  });

  const formattedSchoolYears = useMemo(
    () =>
      schoolYears
        ? schoolYears.map((year) => ({
            title: year.description.substring(0, 5) + year.description.substring(7, 9)
          }))
        : undefined,
    [schoolYears]
  );

  const classes = useMemo(
    () =>
      teacherSections
        .filter(({ schoolYear, hasStudents }) => {
          return selectedSchoolYear.short === String(schoolYear) && hasStudents;
        })
        .map((section) => ({
          title: section.name,
          id: String(section.id)
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [teacherSections, selectedSchoolYear.short]
  );

  const hasClasses = classes.length > 0;

  interface FilterBase {
    type: 'dropdown' | 'dropdownCheckbox' | 'dropdownCheckboxRadio' | 'dateRangePicker';
    header: string;
    headerAlt?: string;
    subHeader?: string;
    hasTooltip?: boolean;
  }

  interface FilterMenuProps extends MenuProps, FilterBase {
    type: 'dropdown';
  }
  interface FilterDropdownCheckboxProps extends DropdownCheckboxProps, FilterBase {
    type: 'dropdownCheckbox';
  }

  interface FilterDropdownCheckboxRadioProps extends DropdownCheckboxRadioProps, FilterBase {
    type: 'dropdownCheckboxRadio';
  }

  interface FilterDateRangePicker extends DateRangePickerProps, FilterBase {
    type: 'dateRangePicker';
  }

  const filtersContentArray = useMemo<
    Array<
      | FilterMenuProps
      | FilterDropdownCheckboxProps
      | FilterDropdownCheckboxRadioProps
      | FilterDateRangePicker
    >
  >(
    () => [
      {
        type: 'dropdown',
        header: FilterKeys.SchoolYear,
        content: formattedSchoolYears ? formattedSchoolYears : [{ title: 'No Years Available' }],
        maxHeight: '312px',
        applyButton: false,
        value: SelectedFilterValues.SchoolYear
      },
      {
        type: 'dropdownCheckbox',
        header: FilterKeys.Class,
        headerAlt: 'Class:',
        value: SelectedFilterValues.Class,
        content: hasClasses ? classes : [{ title: 'No Classes Available', id: '-1' }],
        minWidth: '100px',
        applyButton: true,
        hasAllCheckbox: true,
        allCheckboxName: 'All Classes',
        openDropdown: hasClasses
      },
      {
        type: 'dateRangePicker',
        header: FilterKeys.StartDateBetween,
        selected: {
          from: safeParseDate(currentSchoolYearDetails.startDate),
          to: safeParseDate(currentSchoolYearDetails.endDate)
        },
        onSelect: (dateRange: Partial<DateRange>) => {
          getFilterValues(SelectedFilterValues.StartDateBegin, [
            dateRange.from?.toISOString() ?? ''
          ]);
          getFilterValues(SelectedFilterValues.StartDateEnd, [dateRange.to?.toISOString() ?? '']);
        }
      },
      {
        type: 'dropdownCheckboxRadio',
        header: FilterKeys.AssessmentPeriod,
        content: hasClasses
          ? [
              {
                title: 'Beginning of Year',
                id: 'BEGINNING',
                defaultValue: true,
                radio: [
                  {
                    title: showAll,
                    defaultValue: true,
                    id: 'BEGINNING_ALL'
                  },
                  {
                    title: onlyShowMostRecent,
                    defaultValue: false,
                    id: 'BEGINNING_LATEST'
                  }
                ]
              },
              {
                title: 'Middle of Year',
                id: 'MIDDLE',
                radio: [
                  {
                    title: showAll,
                    defaultValue: true,
                    id: 'MIDDLE_ALL'
                  },
                  {
                    title: onlyShowMostRecent,
                    defaultValue: false,
                    id: 'MIDDLE_LATEST'
                  }
                ]
              },
              {
                title: 'End of Year',
                id: 'END',
                radio: [
                  {
                    title: showAll,
                    defaultValue: true,
                    id: 'END_ALL'
                  },
                  {
                    title: onlyShowMostRecent,
                    defaultValue: false,
                    id: 'END_LATEST'
                  }
                ]
              }
            ]
          : [{ title: notAvailable, id: '-1' }],
        minWidth: '222px',
        applyButton: true,
        openDropdown: hasClasses,
        value: SelectedFilterValues.AssessmentPeriod
      },
      {
        type: 'dropdownCheckbox',
        header: FilterKeys.Status,
        content: hasClasses
          ? [
              { title: 'Completed', id: 'COMPLETED' },
              { title: 'In Progress', id: 'IN_PROGRESS' },
              { title: 'Not Started', id: 'NOT_STARTED' },
              { title: 'Scheduled', id: 'SCHEDULED' },
              { title: 'No Test Scheduled', id: 'NO_TEST_SCHEDULED' },
              { title: 'Canceled', id: 'CANCELED' },
              { title: 'Deleted', id: 'DELETED' }
            ]
          : [{ title: notAvailable, id: '-1' }],
        width: '250px',
        applyButton: true,
        checkAll: true, // sets all checkboxes to checked
        hasTooltip: true,
        openDropdown: hasClasses,
        value: SelectedFilterValues.Status
      }
    ],
    [formattedSchoolYears, hasClasses, classes]
  );

  const updateFilterValues = useCallback(
    (filter: string, values: string[]) => {
      let filterValues = {} as TeacherApiFilters;
      if (filter === SelectedFilterValues.SchoolYear) {
        // delete classes on year change as classes are school year specific
        if (selectedSchoolYear.long !== values[0]) {
          delete filterValues[SelectedFilterValues.Class];
        }
        setSelectedSchoolYear({ short: values[0].slice(0, 4), long: values[0] });
      }
      filterValues = { ...filterValues, [filter]: values };
      if (filterValues.benchmark) {
        filterValues.benchmark = filterValues.benchmark.filter((bench) => {
          return benchmarks.includes(bench);
        });
      }
      return filterValues;
    },
    [selectedSchoolYear.long]
  );

  // updates selected filter values. arguments received from child components
  const getFilterValues = useCallback(
    (filter: string, values: string[]) => {
      const filterValues = updateFilterValues(filter, values);

      setSelectedFilters((selectedFilters) => Object.assign({}, selectedFilters, filterValues));
    },
    [setSelectedFilters, updateFilterValues]
  );

  return (
    <section aria-label="Assessment Table Data Filters">
      <Container className={styles.filtersContainer}>
        <Container className={styles.allFilters}>
          {filtersContentArray.map(({ header, headerAlt, subHeader, hasTooltip, ...props }) => (
            <Container className={styles.filterContainer} key={header}>
              <div className={styles.filterHeader}>
                <span aria-hidden={!!subHeader}>
                  {headerAlt ? headerAlt : header ? header + ':' : ''}
                </span>
                <span className="sr-only">{subHeader ?? subHeader}</span>
                {hasTooltip && (
                  <InfoPopover
                    tipMessage={tip}
                    stringedTipMessage={stringedTipMessage}
                    placement="bottom"
                  ></InfoPopover>
                )}
              </div>
              <div className={styles.filterDropdowns}>
                {props.type === 'dropdown' ? (
                  <Dropdown
                    content={props.content}
                    header={header}
                    subHeader={subHeader}
                    maxHeight={props.maxHeight}
                    openDropdown={props.openDropdown}
                    preSelectedValue={
                      selectedFilters[props.value as keyof TeacherApiFilters] as [string]
                    }
                    onChange={getFilterValues}
                    value={props.value}
                  />
                ) : null}
                {props.type === 'dropdownCheckbox' ? (
                  <>
                    <DropdownCheckbox
                      content={props.content}
                      header={header}
                      subHeader={subHeader}
                      maxHeight={props.maxHeight}
                      applyButton={props.applyButton}
                      hasAllCheckbox={props.hasAllCheckbox}
                      allCheckboxName={props.allCheckboxName}
                      checkAll={props.checkAll}
                      openDropdown={props.openDropdown}
                      width={props.width}
                      preSelectedValues={selectedFilters[props.value as keyof TeacherApiFilters]}
                      onChange={getFilterValues}
                      value={props.value}
                    />
                  </>
                ) : null}
                {props.type === 'dropdownCheckboxRadio' ? (
                  <DropdownCheckboxRadio
                    content={props.content}
                    header={header}
                    subHeader={subHeader}
                    applyButton={props.applyButton}
                    hasAllCheckbox={props.hasAllCheckbox}
                    checkAll={props.checkAll}
                    openDropdown={props.openDropdown}
                    preSelectedValues={selectedFilters[props.value as keyof TeacherApiFilters]}
                    onChange={getFilterValues}
                    value={props.value}
                  />
                ) : null}
                {props.type === 'dateRangePicker' ? (
                  <DateRangePicker
                    label={props.label}
                    selected={props.selected}
                    onSelect={props.onSelect}
                  />
                ) : null}
              </div>
            </Container>
          ))}
        </Container>
      </Container>
    </section>
  );
};

export default FiltersHeader;
