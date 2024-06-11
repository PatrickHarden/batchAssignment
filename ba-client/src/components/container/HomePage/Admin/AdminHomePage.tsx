import React, { FunctionComponent, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useAtom } from 'jotai';
import cx from 'classix';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import Drawer from '../../../pure/Drawer/Drawer';
import styles from './AdminHomePage.module.scss';
import { ReactComponent as FilterIcon } from '../../../../assets/icons/filter.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/icons/deleteTrashcan.svg';
import {
  AdminApiFilters,
  adminEditAssessmentAtom,
  adminOpenDialog,
  currentSchoolYearDetailsAtom,
  initialOrgAndGradesAtom
} from '../../../../atoms/atoms';
import { sdmInfoAtom } from '../../../../atoms/sdmInfoAtom';
import { useAdminSchoolYearsApi } from '../../../../hooks/apis/use-school-years-api';
import { useOrgsApi } from '../../../../hooks/apis/use-org-api';
import AdminTableContainer from './AdminTableContainer';
import type { GradeInfo } from '../FiltersDrawer/FiltersDrawer';
import BannerMessage from '../../../pure/BannerMessage/BannerMessage';
import Dialog from '../../../pure/Dialog/Dialog';
import AlertDialog from '../../../pure/Dialog/AlertDialog/AlertDialog';
import {
  AdminAssessmentDataWithRequiredStartAndEnd,
  AdminEditAssessmentContent
} from '../../../pure/Dialog/EditAssessment/AdminEditAssessmentContent';
import { AdminAssessmentData } from './TableColumnDefinitions';
import { createModifyingRequest } from '../../../../hooks/apis/use-swr-mutation-fetcher';
import appendWithQueryParams from '../../../../utils/append-with-query-params';
import { useToast } from '../../ToastOutlet/ToastOutlet';

const FiltersDrawer = lazy(() => import('../FiltersDrawer/FiltersDrawer'));
const DeleteDrawer = lazy(() => import('../DeleteDrawer/DeleteDrawer'));

function hasStartDateAndEndDate(
  data: AdminAssessmentData
): data is AdminAssessmentDataWithRequiredStartAndEnd {
  return data.startDate !== null && data.endDate !== null;
}

const AdminHomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const schoolYears = useAdminSchoolYearsApi({
    orgId: sdmInfo.orgId,
    userId: sdmInfo.user_id
  });
  const [editAssessmentDialog, setEditAssessmentDialog] = useAtom(adminOpenDialog);
  const [canEditAssessment, setCanEditAssessment] = useState(false);
  const [disableActionDialogButton, setDisableActionDialogButton] = useState(false);
  const [adminEditAssessmentData, setAdminEditAssessmentData] = useAtom(adminEditAssessmentAtom);
  const schoolYearsLabels = schoolYears.map((year) => {
    return {
      label: `${year.schoolYear}-${String(year.schoolYear + 1).slice(2)}`,
      value: `${year.schoolYear}`,
      startDate: year.startDate,
      endDate: year.endDate
    };
  });

  const [schoolYear, setSchoolYear] = useState('');

  const [currentSchoolYearDetails, setCurrentSchoolYearDetails] = useAtom(
    currentSchoolYearDetailsAtom
  );

  const orgsAndGrades = useOrgsApi({
    orgId: sdmInfo.orgId,
    adminId: sdmInfo.user_id,
    schoolYear: schoolYear || currentSchoolYearDetails.schoolYear
  });

  const [initialData, setInitialData] = useAtom(initialOrgAndGradesAtom);
  const hasStudents = initialData.organizations.length > 0;
  const grades = initialData.availableGrades.map((grade) => grade.code);

  const mappedSitesAndIds = orgsAndGrades.organizations.reduce<Record<string, number>>((a, b) => {
    a[b.name] = b.id;
    return a;
  }, {});
  mappedSitesAndIds.year = +schoolYear || +currentSchoolYearDetails.schoolYear;

  const mappedGrades = [
    ...orgsAndGrades.availableGrades.map((grade) => ({
      title: grade.name,
      id: grade.code
    }))
  ];

  const gradesInfo = orgsAndGrades.organizations as GradeInfo[];

  const siteListContent = [
    ...orgsAndGrades.organizations.map((org) => ({
      title: org.name,
      id: org.name
    }))
  ];

  useEffect(() => {
    const { startDate, endDate, description, schoolYear } = schoolYears.find(
      (year) => year.isCurrentCalendar
    ) as {
      startDate: string;
      endDate: string;
      description: string;
      isCurrentCalendar: boolean;
      schoolYear: number;
    };

    setCurrentSchoolYearDetails({
      startDate: startDate,
      endDate: endDate,
      fullDescription: description,
      schoolYear: String(schoolYear),
      shortDescription: `${schoolYear}-${String(schoolYear + 1).slice(2)}`
    });
    setInitialData({ ...orgsAndGrades, schoolYear, startDate, endDate });
  }, [schoolYears]);

  const editAssessmentData = useMemo(() => {
    return editAssessmentDialog;
  }, [editAssessmentDialog]);

  const handleClick = useCallback(() => {
    navigate('/admin/assign');
  }, [navigate]);

  const onDialogChange = useCallback(() => {
    setCanEditAssessment(false);
    setEditAssessmentDialog(null);
    setAdminEditAssessmentData({
      assessmentId: null,
      startDate: undefined,
      endDate: undefined,
      benchmark: undefined,
      site: undefined,
      grade: undefined
    });
  }, [setAdminEditAssessmentData, setEditAssessmentDialog]);

  const { mutate } = useSWRConfig();
  const { trigger } = useSWRMutation(
    `/api/v1/admin-assessments/${
      adminEditAssessmentData.assessmentId ?? editAssessmentDialog?.data.assessmentId
    }/admin/${sdmInfo.user_id}/org/${sdmInfo.orgId}?assessmentType=srm`,
    createModifyingRequest()
  );

  const adminApiKeyBase = `/api/v1/admin-assessments/admin/${sdmInfo.user_id}/org/${sdmInfo.orgId}`;
  const adminApiKey = useMemo(() => {
    const apiFilters: AdminApiFilters = {
      grade: orgsAndGrades.availableGrades.map((grade) => grade.code),
      startDateBegin: [currentSchoolYearDetails.startDate.substring(0, 10)],
      startDateEnd: [currentSchoolYearDetails.endDate.substring(0, 10)],
      benchmark: ['BEGINNING_ALL', 'MIDDLE_ALL', 'END_ALL'],
      orgId: orgsAndGrades.organizations.map((org) => org.id),
      status: [
        'COMPLETED',
        'IN_PROGRESS',
        'SCHEDULED',
        'NOT_STARTED',
        'NO_TEST_SCHEDULED',
        'CANCELED',
        'IN_PROGRESS'
      ]
    };

    return appendWithQueryParams(adminApiKeyBase, {
      ...apiFilters,
      schoolYear: currentSchoolYearDetails.schoolYear,
      assessmentType: 'srm'
    });
  }, [
    adminApiKeyBase,
    currentSchoolYearDetails.endDate,
    currentSchoolYearDetails.schoolYear,
    currentSchoolYearDetails.startDate,
    orgsAndGrades.availableGrades,
    orgsAndGrades.organizations
  ]);
  const toast = useToast();

  const handleDialogAction = useCallback(() => {
    const requestBody = (({ assessmentId, grade, site, ...object }) => object)(
      adminEditAssessmentData
    );
    setCanEditAssessment(false);

    trigger(requestBody)
      .then(() => {
        mutate(adminApiKey);
        toast.success('The Scholastic Reading Measure was successfully edited.');
        onDialogChange();
      })
      .catch(() => {
        setCanEditAssessment(true);
        toast.error('An error occurred with the assignment process. Please try again.');
      });
  }, [adminApiKey, adminEditAssessmentData, mutate, onDialogChange, toast, trigger]);

  const data = editAssessmentData?.data;

  const handeCancelAction = () => {
    const requestBody = {
      active: false
    };
    setDisableActionDialogButton(true);
    trigger(requestBody)
      .then(() => {
        mutate(adminApiKey);
        toast.success('The Scholastic Reading Measure was successfully canceled.');
        setEditAssessmentDialog(null);
        setDisableActionDialogButton(false);
      })
      .catch(() => {
        setDisableActionDialogButton(false);
        toast.error('An error occurred with the assignment process. Please try again.');
      });
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.heading}>
        <h1 className={styles.header} id="main-header">
          Scholastic Reading Measure
        </h1>
        <button
          disabled={!hasStudents}
          className={cx('button--black', styles.btnHeader)}
          data-testid="admin_batchAssignButton"
          onClick={handleClick}
        >
          New Assignment
        </button>
      </div>
      <div className={styles.subHeading}>
        <section>Current Assignments</section>
        <section>
          <Drawer
            className={styles.adminDeleteAssessmentButton}
            headerIcon={<DeleteIcon />}
            title="Delete Score"
            triggerTitle="Need to delete a score?"
            controlled
          >
            <DeleteDrawer />
          </Drawer>
        </section>
      </div>
      <div className={styles.filtersContainer}>
        <div className={styles.adminFilter}>
          <Drawer
            className={styles.filterButton}
            triggerIcon={<FilterIcon />}
            headerIcon={<FilterIcon />}
            title="Select Filters"
            triggerTitle="Filters"
            controlled
          >
            <FiltersDrawer
              setHomePageSchoolYear={setSchoolYear}
              schoolYearsLabels={schoolYearsLabels}
              mappedGrades={mappedGrades}
              gradesInfo={gradesInfo}
              siteListContent={siteListContent}
            />
          </Drawer>
        </div>
      </div>
      {!!editAssessmentData &&
      data &&
      hasStartDateAndEndDate(data) &&
      editAssessmentData.dialogType === 'edit' ? (
        <Dialog
          title="Edit SRM Assessment"
          content={
            <AdminEditAssessmentContent
              editAssessmentData={data}
              disableActionButton={(value) => setCanEditAssessment(!value)}
            />
          }
          onAction={handleDialogAction}
          onDialogChange={onDialogChange}
          isOpen
          disableActionButton={!canEditAssessment}
        />
      ) : null}
      {!!editAssessmentDialog && data && editAssessmentDialog.dialogType === 'cancel' ? (
        <AlertDialog
          header="Cancel Assessment"
          cancelButtonText="Keep Assessment"
          actionButtonText="Cancel Assessment"
          content="Are you sure you'd like to cancel this assessment?"
          onAction={handeCancelAction}
          onCancel={() => setEditAssessmentDialog(null)}
          disableActionButton={disableActionDialogButton}
          onDialogChange={() => null}
          isOpen
        />
      ) : null}
      {hasStudents ? (
        <AdminTableContainer
          orgIds={initialData.organizations.map((org) => org.id)}
          grades={grades}
          mappedSitesAndIds={mappedSitesAndIds}
        />
      ) : (
        <BannerMessage>
          <span className="banner-message-wrapper__text">No Organizations Available</span>
        </BannerMessage>
      )}
    </div>
  );
};

export default AdminHomePage;
