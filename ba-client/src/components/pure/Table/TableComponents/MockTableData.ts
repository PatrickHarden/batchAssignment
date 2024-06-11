import type { TableData } from '../../../../hooks/useTable/useTable';
import { formatDate } from '../../../../utils/format-date';
import type { Appraisal, Period, StudentsResponse } from '../../../../hooks/apis/use-students-api';
import { AdminAssessmentData } from '../../../container/HomePage/Admin/TableColumnDefinitions';

const mockStartDate = formatDate('2023-01-29T20:00:00.000-05:00');
const mockEndDate = formatDate('2023-02-27T20:00:00.000-05:00');
const mockDaysSinceLastAssessment = 33;
const mockStatus = 'IN_PROGRESS';
const mockAssignedBy = 'Roderick, Jeff';
const mockInitialTeacherAppraisal: Appraisal = 'ABOVE_LEVEL';
const mockAssessmentPeriod: Period = 'END';
const mockResult = '600L';
const mockTimeSpent = null;
const mockBenchmark: Period = 'END';
const middlePeriod: Period = 'MIDDLE';

export const mockNewAssessmentApiData: StudentsResponse = {
  results: [
    {
      studentId: '34567',
      firstName: 'Jesse',
      lastName: 'Pinkman',
      daysSinceLastAssessment: null,
      completedSrm: false,
      benchmarks: [
        {
          period: 'BEGINNING',
          isNoTestScheduled: false,
          assessments: [
            {
              assessmentId: 49575,
              benchmark: 'BEGINNING',
              startDate: '2022-09-30T01:00:00.000Z',
              endDate: '2022-10-01T01:00:00.000Z',
              lexileValue: -100.0,
              status: 'COMPLETED',
              currentQuestion: 3,
              proficiency: null,
              timeSpent: 5494950,
              assignedByFirstName: 'Walter',
              assignedByLastName: 'White',
              assignedById: 485789,
              teacherAppraisal: null
            }
          ]
        },
        {
          period: middlePeriod,
          isNoTestScheduled: true,
          assessments: [
            {
              assessmentId: 49576,
              benchmark: middlePeriod,
              startDate: '2022-12-29T01:00:00.000Z',
              endDate: '2023-01-09T01:00:00.000Z',
              lexileValue: 200.0,
              status: 'COMPLETED',
              currentQuestion: 3,
              proficiency: null,
              timeSpent: 5494950,
              assignedByFirstName: 'Walter',
              assignedByLastName: 'White',
              assignedById: 485789,
              teacherAppraisal: null
            },
            {
              assessmentId: 49577,
              benchmark: middlePeriod,
              startDate: '2022-02-12T01:00:00.000Z',
              endDate: '2023-02-26T01:00:00.000Z',
              lexileValue: 200.0,
              status: 'IN_PROGRESS',
              currentQuestion: 3,
              proficiency: null,
              timeSpent: 5494950,
              assignedByFirstName: 'Walter',
              assignedByLastName: 'White',
              assignedById: 485789,
              teacherAppraisal: null
            }
          ]
        },
        {
          period: 'END',
          isNoTestScheduled: false,
          assessments: []
        }
      ]
    },
    {
      studentId: '509385',
      firstName: 'Alice',
      lastName: 'Wonderland',
      daysSinceLastAssessment: null,
      completedSrm: false,
      benchmarks: [
        {
          period: 'BEGINNING',
          isNoTestScheduled: true,
          assessments: [
            {
              assessmentId: 49578,
              benchmark: 'BEGINNING',
              startDate: '2022-02-12T01:00:00.000Z',
              endDate: '2023-02-26T01:00:00.000Z',
              lexileValue: 200.0,
              status: 'NOT_STARTED',
              currentQuestion: 3,
              proficiency: null,
              timeSpent: 5494950,
              assignedByFirstName: 'Walter',
              assignedByLastName: 'White',
              assignedById: 485789,
              teacherAppraisal: null
            }
          ]
        },
        {
          period: middlePeriod,
          isNoTestScheduled: true,
          assessments: []
        },
        {
          period: 'END',
          isNoTestScheduled: false,
          assessments: []
        }
      ]
    }
  ]
};

export const mockStudentData: TableData[] = [
  {
    name: 'Bri Archer',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: 'ASSIGNED',
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Proficient',
    timeSpent: 413222,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '123',
    assessmentId: 23,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Bri',
    lastName: 'Archer'
  },
  {
    name: 'Bri Archer',
    daysSinceLastAssessment: null,
    status: 'SCHEDULED',
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: null,
    proficiency: 'Advanced',
    timeSpent: 790943,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '123',
    assessmentId: 24,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Bri',
    lastName: 'Archer'
  },
  {
    name: 'Collin Meller',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: 'NOT_STARTED',
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Proficient',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '1234',
    assessmentId: 25,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Collin',
    lastName: 'Meller'
  },
  {
    name: 'Debra Audrey',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: 'IN_PROGRESS',
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: null,
    proficiency: 'Basic',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '12345',
    assessmentId: 26,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Debra',
    lastName: 'Audrey'
  },
  {
    name: 'Echo Gonzalez',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: 'DELETED',
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Proficient',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '123456',
    assessmentId: 27,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Echo',
    lastName: 'Gonzalez'
  },
  {
    name: 'Kyle Schultz',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: mockStatus,
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Below Basic',
    timeSpent: 32,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '1234567',
    assessmentId: 28,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Kyle',
    lastName: 'Schultz'
  },
  {
    name: 'Nick Kilzer',
    daysSinceLastAssessment: 11,
    status: mockStatus,
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: null,
    proficiency: 'Advanced',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: 'ON_LEVEL',
    action: true,
    studentId: '12321',
    assessmentId: 29,
    daysSinceLastAssessmentOriginal: 11,
    benchmark: mockBenchmark,
    firstName: 'Nick',
    lastName: 'Kilzer'
  },
  {
    name: 'Sloan Meler',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: mockStatus,
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Basic',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '123321',
    assessmentId: 30,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Sloan',
    lastName: 'Meler'
  },
  {
    name: 'Tom Evans',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: mockStatus,
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Proficient',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '123345',
    assessmentId: 31,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Tom',
    lastName: 'Evans'
  },
  {
    name: 'Wade Adams',
    daysSinceLastAssessment: mockDaysSinceLastAssessment,
    status: mockStatus,
    assessmentPeriod: mockAssessmentPeriod,
    startDate: mockStartDate,
    endDate: mockEndDate,
    result: mockResult,
    proficiency: 'Advanced',
    timeSpent: mockTimeSpent,
    assignedBy: mockAssignedBy,
    initialTeacherAppraisal: 'ON_LEVEL',
    action: true,
    studentId: '123235',
    assessmentId: 31,
    daysSinceLastAssessmentOriginal: mockDaysSinceLastAssessment,
    benchmark: mockBenchmark,
    firstName: 'Wade',
    lastName: 'Adams'
  }
];

export const mockStudentDataNoPreviousLexiles: TableData[] = [
  {
    name: 'Brianne Ercher',
    daysSinceLastAssessment: null,
    status: 'IN_PROGRESS',
    assessmentPeriod: 'BEGINNING',
    startDate: formatDate('2022-04-29T20:00:00.000-07:00'),
    endDate: formatDate('2022-05-29T20:00:00.000-07:00'),
    result: '400L',
    proficiency: 'Basic',
    timeSpent: 417222,
    assignedBy: 'Harry Potter',
    initialTeacherAppraisal: mockInitialTeacherAppraisal,
    action: true,
    studentId: '1235675',
    assessmentId: 34,
    daysSinceLastAssessmentOriginal: null,
    benchmark: 'BEGINNING',
    firstName: 'Brianne',
    lastName: 'Ercher'
  },

  {
    name: 'Colleen Miller',
    daysSinceLastAssessment: null,
    status: 'CANCELED',
    assessmentPeriod: 'MIDDLE',
    startDate: formatDate('2021-06-29T20:00:00.000-09:00'),
    endDate: formatDate('2021-07-29T20:00:00.000-09:00'),
    result: '800L',
    proficiency: 'Advanced',
    timeSpent: null,
    assignedBy: 'Hermione Granger',
    initialTeacherAppraisal: 'BELOW_LEVEL',
    action: true,
    studentId: '123434553',
    assessmentId: 46,
    daysSinceLastAssessmentOriginal: null,
    benchmark: middlePeriod,
    firstName: 'Colleen',
    lastName: 'Miller'
  }
];

const tempDate = '04/06/2022 at 09:00 AM';
const croftonElem = 'Crofton Elementary School';

export const mockTestData: AdminAssessmentData[] = [
  {
    grade: 'Grade 2',
    status: 'COMPLETED',
    completed: '100%',
    period: 'BEGINNING',
    startDate: null,
    endDate: null,
    assignedBy: 'Paul Allen',
    action: true,
    assessmentId: 123,
    site: croftonElem,
    rowGrade: 'Grade 2'
  },
  {
    grade: 'Grade 2',
    status: 'IN_PROGRESS',
    completed: '70%',
    period: 'END',
    startDate: null,
    endDate: null,
    assignedBy: 'George Smith',
    action: true,
    assessmentId: 1234,
    site: croftonElem,
    rowGrade: 'Grade 2'
  },
  {
    grade: 'Grade 3',
    status: 'COMPLETED',
    completed: '60%',
    period: mockAssessmentPeriod,
    startDate: tempDate,
    endDate: tempDate,
    assignedBy: 'Larry Fishbone',
    action: true,
    assessmentId: 12345,
    site: croftonElem,
    rowGrade: 'Grade 3'
  },
  {
    grade: 'Grade 4',
    status: 'NOT_STARTED',
    completed: '40%',
    period: mockAssessmentPeriod,
    startDate: tempDate,
    endDate: tempDate,
    assignedBy: 'Demarcus Ware',
    action: true,
    assessmentId: 123456,
    site: croftonElem,
    rowGrade: 'Grade 3'
  },
  {
    grade: 'Grade 5',
    status: 'COMPLETED',
    completed: '30%',
    period: 'MIDDLE',
    startDate: tempDate,
    endDate: tempDate,
    assignedBy: 'Samwise Gamgee',
    action: true,
    assessmentId: 1234567,
    site: croftonElem,
    rowGrade: 'Grade 5'
  },
  {
    grade: 'Grade 6',
    status: 'NOT_STARTED',
    completed: '0%',
    period: mockAssessmentPeriod,
    startDate: tempDate,
    endDate: tempDate,
    assignedBy: 'Sam Smith',
    action: true,
    assessmentId: 12345678,
    site: croftonElem,
    rowGrade: 'Grade 6'
  },
  {
    grade: 'Grade 8',
    status: 'NO_TEST_SCHEDULED',
    completed: null,
    period: 'BEGINNING',
    startDate: null,
    endDate: null,
    assignedBy: null,
    action: true,
    assessmentId: 123456789,
    site: croftonElem,
    rowGrade: 'Grade 8'
  }
];
