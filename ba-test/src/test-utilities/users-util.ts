import path from 'path';
import { testEnv } from './test-env';
import { Users } from './users-config';

export const getUserData = async (): Promise<Users> => {
  const usersPath = path.resolve('./src/test-data', testEnv, 'users.ts');
  return (await import(usersPath)).default;
};

/* eslint-disable no-shadow */
export enum ErrorType {
  API_RETURN_ERROR = 'Api Return Error',
}

export default getUserData();
