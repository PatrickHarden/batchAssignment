import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';
import { ToastItem } from '../components/container/ToastOutlet/ToastOutlet';
import type { TableData } from '../hooks/useTable/useTable';
import type { Appraisal, Period, Status } from '../hooks/apis/use-students-api';
import { AdminAssessmentData } from '../components/container/HomePage/Admin/TableColumnDefinitions';
import type { GradeCode, GradeName, Org } from '../hooks/apis/use-org-api';
import type { SitesAndGrade } from '../components/pure/Stepper/Steps/AdminSteps/Step2/AdminStep2Content';
import type { AssessmentItem } from '../components/container/HomePage/FiltersDrawer/FiltersDrawer';

export interface CurrentSchoolYear {
  fullDescription: string; // '2022-2023 School Year'
  shortDescription: string; // '2022-23'
  startDate: string; // "2022-08-05 00:00:00.0"
  endDate: string; // "2022-08-05 00:00:00.0"
  schoolYear: string; // '2022'
}

export const schoolYearPlaceholder = '0001';
export const schoolYearShortDescriptionPlaceholder = '0001-02';
export const currentSchoolYearDetailsAtom = atomWithStorage<CurrentSchoolYear>(
  'currentSchoolYearDetails',
  {
    fullDescription: '',
    shortDescription: schoolYearShortDescriptionPlaceholder,
    schoolYear: schoolYearPlaceholder,
    startDate: '',
    endDate: ''
  }
);
export const currentSchoolYearAtom = atom((get) => get(currentSchoolYearDetailsAtom).schoolYear);
export interface InitialOrg extends Org {
  schoolYear: number;
  startDate: string;
  endDate: string;
}
export const initialOrgAndGradesAtom = atom<InitialOrg>({
  organizations: [],
  availableGrades: [],
  schoolYear: 0,
  startDate: '',
  endDate: ''
});
export const gradeSitesAndIdsAtom = atom([]);
export const adminFilterSchoolYearAtom = atom('');

export const isNextDisabledAtom = atom(false);
export const sitesAtom = atom<string[]>([]);
export const gradesAtom = atom<GradeCode[]>([]);
export const fromDateAtom = atom<Date | undefined>(undefined);
export const toDateAtom = atom<Date | undefined>(undefined);
export const statusAtom = atom<Status[]>([]);
export const assessmentAtom = atom<AssessmentItem[]>([]);

export const nextButtonAtom = atom(false);

type Selection = 'ALL' | 'LATEST';
export type PeriodSelection = `${Period}_${Selection}`;

export interface TeacherApiFilters {
  schoolYear: string[];
  classIds?: string[];
  startDateBegin: string[];
  startDateEnd: string[];
  benchmark: PeriodSelection[];
  status: Status[];
}

export interface AdminApiFilters {
  grade: GradeCode[];
  startDateBegin: string[];
  startDateEnd: string[];
  benchmark: PeriodSelection[];
  orgId: number[];
  status: Status[];
}

export const selectedTeacherHomepageFiltersAtom = atom({} as TeacherApiFilters);

export type DateTime = {
  startDate: Date | undefined;
  startTime: string | null;
  endDate: Date | undefined;
  endTime: string | null;
};

export type DateTimeRequired = {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
};

export type DialogTypes = 'edit' | 'cancel' | 'new';
// set the selected student from dropdown dialog for the edit assessment
interface OpenEditDialog {
  data: TableData;
  index?: number;
  dialogType: DialogTypes;
}

export const openDialog = atom<OpenEditDialog | null>(null);

export interface AdminOpenEditDialog extends Omit<OpenEditDialog, 'data'> {
  data: AdminAssessmentData;
}

export const adminOpenDialog = atom<AdminOpenEditDialog | null>(null);

export interface EditAssessment {
  assessmentId: string;
  startDate?: string;
  endDate?: string;
  benchmark?: string;
  teacherAppraisal?: string;
}

export const editAssessmentAtom = atom<EditAssessment>({
  assessmentId: '',
  startDate: undefined,
  endDate: undefined,
  benchmark: undefined,
  teacherAppraisal: undefined
});

export interface AdminEditAssessment
  extends Omit<EditAssessment, 'teacherAppraisal' | 'assessmentId'> {
  assessmentId: number | null;
  site: string | undefined;
  grade: GradeName | undefined;
}

export const adminEditAssessmentAtom = atom<AdminEditAssessment>({
  assessmentId: null,
  startDate: undefined,
  endDate: undefined,
  benchmark: undefined,
  site: undefined,
  grade: undefined
});

export type TeacherStepperData = {
  classes: string[];
  assessmentPeriod: Period | '';
  dateTime: DateTime;
  students: TableData[];
  teacherAppraisal: Record<string, Appraisal>;
};

export const teacherStepperFormDataAtom = atomWithReset<TeacherStepperData>({
  classes: [],
  assessmentPeriod: '',
  dateTime: { startDate: undefined, startTime: null, endDate: undefined, endTime: null },
  students: [],
  teacherAppraisal: {}
});

interface Confirmation {
  includeStudentsWithNoExistingOrCompleted: boolean | undefined;
  includedStudentWithAlreadyAssigned: boolean | undefined;
  includeStudentsWithInProgress: boolean | undefined;
  includeStudentsWithCompleted: boolean | undefined;
}

export type AdminStepperData = {
  assessmentPeriod: Period | '';
  sitesAndGrades: SitesAndGrade[];
  dateTime: DateTime;
  students: TableData[];
  autoAssign: boolean | undefined;
  confirmation: Confirmation;
};

export const initialConfirmation = {
  includeStudentsWithNoExistingOrCompleted: undefined,
  includedStudentWithAlreadyAssigned: undefined,
  includeStudentsWithInProgress: undefined,
  includeStudentsWithCompleted: undefined
};

export const adminStepperFormDataAtom = atomWithReset<AdminStepperData>({
  assessmentPeriod: '',
  sitesAndGrades: [],
  dateTime: { startDate: undefined, startTime: null, endDate: undefined, endTime: null },
  students: [],
  autoAssign: undefined,
  confirmation: initialConfirmation
});

export const toastsAtom = atom<ToastItem[]>([]);
