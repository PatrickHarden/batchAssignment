import * as t from 'io-ts';
import type { TeacherApiFilters } from '../../atoms/atoms';
import useBAApi from './use-ba-api';
import { StringCodec } from '../../utils/string-from-number';

const ProficiencyShape = t.union([
  t.literal('Advanced'),
  t.literal('Proficient'),
  t.literal('Basic'),
  t.literal('Below Basic')
]);

export type Proficiency = t.TypeOf<typeof ProficiencyShape>;

const AppraisalShape = t.union([
  t.literal('BELOW_LEVEL'),
  t.literal('ON_LEVEL'),
  t.literal('ABOVE_LEVEL')
]);

export type Appraisal = t.TypeOf<typeof AppraisalShape>;

export const StatusShape = t.union([
  t.literal('COMPLETED'),
  t.literal('IN_PROGRESS'),
  t.literal('NOT_STARTED'),
  t.literal('SCHEDULED'),
  t.literal('NO_TEST_SCHEDULED'),
  t.literal('CANCELED'),
  t.literal('DELETED'),
  t.literal('ASSIGNED')
]);
export type Status = t.TypeOf<typeof StatusShape>;

export const PeriodShape = t.union([t.literal('BEGINNING'), t.literal('MIDDLE'), t.literal('END')]);
export type Period = t.TypeOf<typeof PeriodShape>;

const AssessmentShape = t.strict({
  assessmentId: t.union([t.number, t.null]),
  benchmark: PeriodShape,
  startDate: t.string,
  endDate: t.string,
  lexileValue: t.union([t.number, t.null]),
  status: t.union([StatusShape, t.null]),
  currentQuestion: t.number,
  proficiency: t.union([ProficiencyShape, t.null]),
  timeSpent: t.union([t.number, t.null]),
  assignedByFirstName: t.string,
  assignedByLastName: t.string,
  assignedById: t.number,
  teacherAppraisal: t.union([AppraisalShape, t.null])
});

export type Assessment = t.TypeOf<typeof AssessmentShape>;

const AssessmentsShape = t.array(AssessmentShape);

export type Assessments = t.TypeOf<typeof AssessmentsShape>;

export const BenchmarkShape = t.array(
  t.strict({
    period: PeriodShape,
    isNoTestScheduled: t.boolean,
    assessments: AssessmentsShape
  })
);

const StudentShape = t.strict({
  studentId: t.number.pipe(StringCodec, 'StringFromNumber'),
  firstName: t.string,
  lastName: t.string,
  daysSinceLastAssessment: t.union([t.number, t.null]),
  completedSrm: t.boolean,
  benchmarks: BenchmarkShape
});
export type Student = t.TypeOf<typeof StudentShape>;

export const StudentsResponseShape = t.strict({
  results: t.array(StudentShape)
});

export type StudentsResponse = t.TypeOf<typeof StudentsResponseShape>;

export interface StudentsApiRequestProps extends TeacherApiFilters {
  orgId: string;
  userId: string;
}

export const useStudentsApi = ({
  orgId,
  userId,
  ...filters
}: StudentsApiRequestProps): StudentsResponse =>
  useBAApi({
    path: `/api/v1/assessments/staff/${userId}/organization/${orgId}`,
    shape: StudentsResponseShape,
    query: { ...filters, assessmentType: 'srm' }
  });
