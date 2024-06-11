import { Educators, Students, Users } from '../../test-utilities/users-config';

const students: Students = {
  student1: {
    role: 'student',
    name: {
      first: 'SRM',
      last: 'Automation',
    },
    username: 'SrmA2',
    password: 'password1',
  },
  student2: {
    role: 'student',
    name: {
      first: 'NotSrm',
      last: 'Student',
    },
    username: 'NotsrmS1',
    password: 'password1',
  },
};

const educators: Educators = {
  districtAdmin1: {
    role: 'educator',
    name: {
      first: 'SRMAutomation',
      last: 'DistrictAdmin',
    },
    username: 'srmdisadmin01@automation.com',
    password: 'password1',
  },
  schoolAdmin1: {
    role: 'educator',
    name: {
      first: 'SRMAutomation',
      last: 'SchoolAdmin',
    },
    username: 'srmschadmin01@automation.com',
    password: 'password1',
  },
  teacher1: {
    role: 'educator',
    name: {
      first: 'SRMAutomation',
      last: 'Teacher',
    },
    username: 'srmteacher01@automation.com',
    password: 'password1',
  },
  districtAdmin2: {
    role: 'educator',
    name: {
      first: 'NotSrm',
      last: 'DistrictAdmin',
    },
    username: 'notsrmdisadmin01@automation.com',
    password: 'password1',
  },
  schoolAdmin2: {
    role: 'educator',
    name: {
      first: 'NotSrm',
      last: 'SchoolAdmin',
    },
    username: 'notsrmschadmin01@automation.com',
    password: 'password1',
  },
  teacher2: {
    role: 'educator',
    name: {
      first: 'NotSrm',
      last: 'Teacher',
    },
    username: 'notsrmteacher01@automation.com',
    password: 'password1',
  },
};

const users: Users = { ...students, ...educators };
export default users;
