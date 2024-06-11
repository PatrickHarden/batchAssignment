import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  Suspense,
  useMemo
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSectionsApi } from '../../../../hooks/apis/use-class-sections-api';
import BannerMessage from '../../../pure/BannerMessage/BannerMessage';
import FiltersHeader from '../../FilterHeader/FiltersHeader';
import styles from './TeacherHomePage.module.scss';
import { useAtomValue, useAtom } from 'jotai';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import Dialog from '../../../pure/Dialog/Dialog';
import {
  TeacherApiFilters,
  currentSchoolYearDetailsAtom,
  editAssessmentAtom,
  openDialog,
  schoolYearShortDescriptionPlaceholder,
  teacherStepperFormDataAtom,
  TeacherStepperData,
  selectedTeacherHomepageFiltersAtom,
  type PeriodSelection
} from '../../../../atoms/atoms';
import { EditAssessmentContent } from '../../../pure/Dialog/EditAssessment/EditAssessmentContent';
import AlertDialog from '../../../pure/Dialog/AlertDialog/AlertDialog';
import { mockCancelData } from '../../../pure/Dialog/AlertDialog/mockAlertDialogData';
import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { useSchoolYearsApi, type SchoolYear } from '../../../../hooks/apis/use-school-years-api';
import { createModifyingRequest } from '../../../../hooks/apis/use-swr-mutation-fetcher';
import TableContainer from './TableContainer';
import appendWithQueryParams from '../../../../utils/append-with-query-params';
import cx from 'classix';
import type { Period } from '../../../../hooks/apis/use-students-api';
import { useToast } from '../../ToastOutlet/ToastOutlet';

export function selectSchoolYear(schoolYears: SchoolYear, selectedSchoolYear: string) {
  const schoolYearsDetailed = schoolYears.map((year) => ({
    ...year,
    initialYear: year.description.substring(0, 4)
  }));

  const selectedYear = schoolYearsDetailed.find((year) => {
    return selectedSchoolYear === year.initialYear;
  });

  if (!selectedYear) throw new Error('Selected school year could not be found');

  return selectedYear;
}

export const getClassIds = (stepperFormData: TeacherStepperData, classIds: string[]) => {
  return stepperFormData.classes.length > 0 ? stepperFormData.classes : [classIds[0]];
};

export const getAssessmentPeriod = (stepperFormData: TeacherStepperData): PeriodSelection[] => {
  return stepperFormData.assessmentPeriod
    ? [`${stepperFormData.assessmentPeriod as Period}_ALL`]
    : ['BEGINNING_ALL'];
};

const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [canEditAssessment, setCanEditAssessment] = useState(false);
  const {
    header: cancelHeader,
    content: cancelContent,
    cancelText: cancelButtonText,
    actionText: cancelActionText
  } = mockCancelData;

  const { user_id, orgId, portalBaseUrl } = useAtomValue(sdmInfoAtom);
  const [editStudentDialog, setEditStudentDialog] = useAtom(openDialog);
  const stepperFormData = useAtomValue(teacherStepperFormDataAtom);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedTeacherHomepageFiltersAtom);
  const [editAssessmentData, setEditAssessmentData] = useAtom(editAssessmentAtom);
  const schoolYears = useSchoolYearsApi({
    orgId: orgId,
    userId: user_id
  });
  const [currentSchoolYearDetails, setCurrentSchoolYearDetails] = useAtom(
    currentSchoolYearDetailsAtom
  );

  const teacherSectionsAllSections = useSectionsApi({
    userId: user_id,
    orgId: orgId,
    schoolYear: currentSchoolYearDetails.schoolYear
  });

  const teacherSections = useMemo(() => {
    return teacherSectionsAllSections.filter((section) => section.hasStudents);
  }, [teacherSectionsAllSections]);

  const { mutate } = useSWRConfig();
  const { trigger } = useSWRMutation(
    `/api/v1/assessments/${user_id}/assign`,
    createModifyingRequest()
  );
  const filterValuesForApiCall = useMemo<TeacherApiFilters>(() => {
    // changes schoolYear filter from '2022-23' to '2022' for api call use
    if (selectedFilters.schoolYear && selectedFilters.schoolYear[0]) {
      return Object.assign({}, selectedFilters, {
        schoolYear: [selectedFilters.schoolYear[0].slice(0, 4)]
      });
    } else {
      return selectedFilters;
    }
  }, [selectedFilters]);
  const studentsApiKeyBase = `/api/v1/assessments/staff/${user_id}/organization/${orgId}`;
  const studentsApiKey = useMemo(() => {
    return appendWithQueryParams(studentsApiKeyBase, { ...filterValuesForApiCall });
  }, [filterValuesForApiCall, studentsApiKeyBase]);

  const noClasses = teacherSections.length < 1;

  const handleClick = useCallback(() => {
    navigate('/teacher/assign');
  }, [navigate]);

  const onDialogChange = useCallback(
    (e: boolean) => {
      setCanEditAssessment(false);
      if (!e) {
        const focusTarget = document.getElementById(
          `tableDropdown-${editStudentDialog?.index}-toggle`
        );
        if (focusTarget) {
          setTimeout(() => {
            focusTarget.focus();
          }, 0);
        }
        setEditStudentDialog(null);
        setEditAssessmentData({
          assessmentId: '',
          startDate: undefined,
          endDate: undefined,
          benchmark: undefined,
          teacherAppraisal: undefined
        });
      }
    },
    [editStudentDialog?.index, setEditAssessmentData, setEditStudentDialog]
  );

  const handleAlertAction = useCallback(() => {
    trigger(
      [
        {
          id: editStudentDialog?.data.assessmentId,
          status: 'CANCELED'
        }
      ],
      {
        onSuccess() {
          mutate(studentsApiKey);
          setSelectedFilters((selectedFilters) => ({ ...selectedFilters }));
        }
      }
    );
  }, [editStudentDialog?.data.assessmentId, mutate, studentsApiKey, trigger, setSelectedFilters]);

  const toast = useToast();

  const handleDialogAction = useCallback(() => {
    const { assessmentId, ...rest } = editAssessmentData;
    setCanEditAssessment(false);

    trigger([
      {
        id: assessmentId,
        ...rest
      }
    ])
      .then(() => {
        toast.success('The Scholastic Reading Measure was successfully edited.');
        mutate(studentsApiKey);

        onDialogChange(false);
        setSelectedFilters((selectedFilters) => ({ ...selectedFilters }));
      })
      .catch(() => {
        setCanEditAssessment(true);
        toast.error('An error occurred with the assignment process. Please try again.');
      });
  }, [editAssessmentData, mutate, setSelectedFilters, studentsApiKey, trigger]);

  // setup SchoolYearDetails atom
  useEffect(() => {
    const { startDate, endDate, description, schoolYear } = schoolYears.filter(
      (sy) => sy.isCurrentCalendar
    )[0];
    const shortYearDescription = description.slice(0, 5) + description.slice(7, 9);
    setCurrentSchoolYearDetails({
      startDate: startDate,
      endDate: endDate,
      fullDescription: description,
      schoolYear: String(schoolYear),
      shortDescription: shortYearDescription
    });
  }, [schoolYears, setCurrentSchoolYearDetails]);

  // setup selectedFiltersAtom
  useEffect(() => {
    if (
      teacherSections &&
      teacherSections.length > 0 &&
      currentSchoolYearDetails.shortDescription !== schoolYearShortDescriptionPlaceholder
    ) {
      const classIds = teacherSections
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id }) => String(id));

      setSelectedFilters(
        (): TeacherApiFilters => ({
          schoolYear: [currentSchoolYearDetails.shortDescription],
          classIds: getClassIds(stepperFormData, classIds),
          startDateBegin: [currentSchoolYearDetails.startDate],
          startDateEnd: [currentSchoolYearDetails.endDate],
          benchmark: getAssessmentPeriod(stepperFormData),
          status: [
            'COMPLETED',
            'IN_PROGRESS',
            'SCHEDULED',
            'NOT_STARTED',
            'NO_TEST_SCHEDULED',
            'CANCELED',
            'DELETED'
          ]
        })
      );
    }
  }, [setSelectedFilters, teacherSections, schoolYears, currentSchoolYearDetails, stepperFormData]);

  // FIXME: this should be moved into the school year atom, this would require significant refactor
  useEffect(() => {
    if (selectedFilters?.schoolYear?.length > 0) {
      const selectedSchoolYearDetails = selectSchoolYear(
        schoolYears,
        selectedFilters.schoolYear[0].slice(0, 4)
      );
      setSelectedFilters((selectedFilters) => ({
        ...selectedFilters,
        startDateBegin: [selectedSchoolYearDetails.startDate],
        startDateEnd: [selectedSchoolYearDetails.endDate]
      }));
    }
  }, [selectedFilters.schoolYear, setSelectedFilters, schoolYears]);

  return (
    <div className={styles.homePage}>
      <div className={styles.heading}>
        <h1 className={styles.header} id="main-header">
          Scholastic Reading Measure
        </h1>
        <button
          disabled={noClasses}
          className={cx('button--black', styles.btnHeader)}
          data-testid="batchAssignButton"
          onClick={handleClick}
        >
          New Assignment
        </button>
      </div>
      <div className={styles.subHeading}>Current Assignments</div>
      <FiltersHeader schoolYears={schoolYears} selectedFilters={selectedFilters} />
      {noClasses && (
        <BannerMessage>
          <span className="banner-message-wrapper__text">
            It looks like you don&#39;t have any classes set up. Please&nbsp;
          </span>
          <a href={`${portalBaseUrl}/teacher/classes`}>add a new class</a>
          <span className="banner-message-wrapper__text">
            &nbsp;and roster your students or select a different school year from the drop-down
            menu.
          </span>
        </BannerMessage>
      )}
      {!!editStudentDialog && editStudentDialog.dialogType === 'edit' ? (
        <Dialog
          title="Edit SRM Assessment"
          content={
            <EditAssessmentContent
              editStudentData={editStudentDialog.data}
              disableActionButton={(value) => setCanEditAssessment(!value)}
            />
          }
          onAction={handleDialogAction}
          onDialogChange={onDialogChange}
          isOpen
          disableActionButton={!canEditAssessment}
        />
      ) : null}
      {!!editStudentDialog && editStudentDialog.dialogType === 'cancel' ? (
        <AlertDialog
          header={cancelHeader}
          content={cancelContent}
          cancelButtonText={cancelButtonText}
          actionButtonText={cancelActionText}
          onAction={handleAlertAction}
          onDialogChange={onDialogChange}
          isOpen
        />
      ) : null}
      {Object.keys(selectedFilters).length !== 0 ? (
        <Suspense fallback={<></>}>
          <TableContainer />
        </Suspense>
      ) : null}
    </div>
  );
};

export default HomePage;
