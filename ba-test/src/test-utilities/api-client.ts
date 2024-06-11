/* eslint max-classes-per-file: ["error", 4] */
import axios from 'axios';
import { getTestEnv } from './test-env';

let STAFF_ID = 0;

// eslint-disable-next-line
export enum HttpMethods {
  GET = 'get',
}

/**
 * The staff id is a number which changes in the api calls depending on environment and
 * user used for login.
 * @param accountRole
 * @param env
 */
export function getStaffId(accountRole: string, env?: string) {
  const environment = env || getTestEnv();
  const staffId: { [index: string]: any } = {
    stage: {
      teacher1: 227188,
    },
    qa: {
      teacher1: 242288,
    },
    perf: {
      teacher1: 18619190,
    },
  };
  const staffIdNumber = staffId[environment.toLowerCase()][accountRole.toLowerCase()];
  console.debug(`StaffId = ${staffIdNumber}`);
  return staffIdNumber;
}

export function defineStaffId(accountRole: string, env?: string) {
  if (!STAFF_ID) STAFF_ID = getStaffId(accountRole, env);
  console.debug(`Staff id defined in login: ${STAFF_ID}`);
}

export function getTokenByEnv(env: string): string {
  const tokens: { [index: string]: string } = {
    stage: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMjcxODgiLCJVSUQiOiIyMjcxODgiLCJhcGlCYXNlVVJMIjoiaHR0cHM6Ly9jcGQtc2VydmljZS5kZXYuYXBwcy5zY2hvbGFzdGljLnRlY2giLCJTX0lEIjo0NDQ3NiwiaWF0IjoxNjYzMjUyMDI3LCJleHAiOjE5NjMyNTIzMjd9.kOXFmTy2i6ezSoeC3HRTIq5Evbp-olJ5SU-qn_66rXc`,
    qa: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNDIyODgiLCJVSUQiOiIyNDIyODgiLCJhcGlCYXNlVVJMIjoiaHR0cHM6Ly9jcGQtc2VydmljZS5xYS5hcHBzLnNjaG9sYXN0aWMudGVjaCIsIlNfSUQiOjI0MzAsImlhdCI6MTY3MTA0Mjk0NCwiZXhwIjoxOTcxMDQzMjQ0fQ.3U7QqwaKHVEXEMcvp6aTxgLYIdkBRdRGSTVn5DfeiWU`,
    perf: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODYxOTE5MCIsIlVJRCI6IjE4NjE5MTkwIiwiYXBpQmFzZVVSTCI6Imh0dHBzOi8vY3BkLXNlcnZpY2UucGVyZi5taWNyby5zY2hvbGFzdGljLmNvbSIsIlNfSUQiOjk2MTkyLCJpYXQiOjE2NzEwNDI2NDIsImV4cCI6MTk3MTA0Mjk0Mn0.cUUue9GwMl8r-Mnvf_Gxn7dqB4RcqGNyKvhV5w7loC0`,
  };
  return tokens[env.toLowerCase()];
}

export function getBaseUrlByEnv(environment: string): string {
  let env = environment.toLowerCase();
  if (env === 'stage') env = 'dev';
  return `https://cpd-service.${env.toLowerCase()}.apps.scholastic.tech`;
}
