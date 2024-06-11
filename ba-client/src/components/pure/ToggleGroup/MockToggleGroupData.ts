import { RadioButtonOptions, RadioGroupProps } from '../RadioGroup/RadioGroup';
import type { Appraisal, Period, Status } from '../../../hooks/apis/use-students-api';
import { appraisalDisplayText } from '../Table/TableComponents/Appraisal';

const belowLevel: Appraisal = 'BELOW_LEVEL';
const onLevel: Appraisal = 'ON_LEVEL';
const aboveLevel: Appraisal = 'ABOVE_LEVEL';
const assignedBy = 'Roderick, Jeff';

export const teacherAppraisalToggleDetails: RadioButtonOptions<Appraisal>[] = [
  { label: appraisalDisplayText[belowLevel], value: belowLevel },
  { label: appraisalDisplayText[onLevel], value: onLevel },
  { label: appraisalDisplayText[aboveLevel], value: aboveLevel }
];

export interface StudentAssessmentData {
  firstName: string;
  lastName: string;
  studentId: string;
  daysSinceLastAssessment: string;
  status: Status;
  assessmentPeriod: Period;
  startDate: string;
  endDate: string;
  result: string;
  assignedBy: string;
  initialTeacherAppraisal: Appraisal | null;
  action: boolean;
}
export const mockStudentDataArray: StudentAssessmentData[] = [
  {
    firstName: 'Dudley',
    lastName: 'Dursley',
    studentId: '123',
    daysSinceLastAssessment: '33',
    status: 'IN_PROGRESS',
    assessmentPeriod: 'END',
    startDate: '01/06/2022 at 9:00 AM',
    endDate: '05/16/2022 at 9:00 AM',
    result: '',
    assignedBy: assignedBy,
    initialTeacherAppraisal: belowLevel,
    action: true
  },
  {
    firstName: 'Hermione',
    lastName: 'Granger',
    studentId: '1234567',
    daysSinceLastAssessment: '33',
    status: 'ASSIGNED',
    assessmentPeriod: 'BEGINNING',
    startDate: '04/06/2022 at 9:00 AM',
    endDate: '05/06/2022 at 9:00 AM',
    result: '',
    assignedBy: assignedBy,
    action: true,
    initialTeacherAppraisal: null
  },
  {
    firstName: 'Harry',
    lastName: 'Potter',
    studentId: '1234',
    daysSinceLastAssessment: '33',
    status: 'COMPLETED',
    assessmentPeriod: 'END',
    startDate: '04/26/2022 at 9:00 AM',
    endDate: '05/26/2022 at 9:00 AM',
    result: '',
    assignedBy: assignedBy,
    initialTeacherAppraisal: onLevel,
    action: true
  },
  {
    firstName: 'Ron',
    lastName: 'Weasley',
    studentId: '123456',
    daysSinceLastAssessment: '33',
    status: 'DELETED',
    assessmentPeriod: 'MIDDLE',
    startDate: '07/06/2022 at 11:00 AM',
    endDate: '08/06/2022 at 10:00 AM',
    result: '',
    assignedBy: assignedBy,
    action: true,
    initialTeacherAppraisal: null
  }
];

interface StudentData {
  id: string;
  name: string;
  teacherAppraisal: Appraisal | null;
}

export interface ToggleGroupStudentList extends RadioGroupProps<Appraisal> {
  student: StudentData;
}

export const mockRadioGroupData: ToggleGroupStudentList[] = [
  {
    buttonInfo: teacherAppraisalToggleDetails,
    groupLabel: `${mockStudentDataArray[0].firstName} ${mockStudentDataArray[0].lastName} Teacher Appraisal`,
    student: {
      id: mockStudentDataArray[0].studentId,
      name: `${mockStudentDataArray[0].lastName}, ${mockStudentDataArray[0].firstName}`,
      teacherAppraisal: aboveLevel
    }
  },
  {
    buttonInfo: teacherAppraisalToggleDetails,
    groupLabel: `${mockStudentDataArray[1].firstName} ${mockStudentDataArray[1].lastName} Teacher Appraisal`,
    student: {
      id: mockStudentDataArray[1].studentId,
      name: `${mockStudentDataArray[1].lastName}, ${mockStudentDataArray[1].firstName}`,
      teacherAppraisal: null
    }
  },
  {
    buttonInfo: teacherAppraisalToggleDetails,
    groupLabel: `${mockStudentDataArray[2].firstName} ${mockStudentDataArray[2].lastName} Teacher Appraisal`,
    student: {
      id: mockStudentDataArray[2].studentId,
      name: `${mockStudentDataArray[2].lastName}, ${mockStudentDataArray[2].firstName}`,
      teacherAppraisal: onLevel
    }
  },
  {
    buttonInfo: teacherAppraisalToggleDetails,
    groupLabel: `${mockStudentDataArray[3].firstName} ${mockStudentDataArray[3].lastName} Teacher Appraisal`,
    student: {
      id: mockStudentDataArray[3].studentId,
      name: `${mockStudentDataArray[3].lastName}, ${mockStudentDataArray[3].firstName} `,
      teacherAppraisal: null
    }
  }
];
