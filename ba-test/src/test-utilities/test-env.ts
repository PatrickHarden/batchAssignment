import { isBlank } from './string-utilities';

const testEnvironments = ['stage', 'qa', 'perf', 'prod'];

let firstExecutionFlag = 0;

export const getTestEnv = (): string => {
  let testEnv = (process.env.ENV as string).trim();
  const threads = (process.env.THREADS as string).trim();
  const tags = (process.env.TAGS as string).trim();
  if (!firstExecutionFlag) {
    console.log('Parameters are:');
    console.log(`ENV=${testEnv}, THREADS=(${threads}), TAGS=(${tags})`);
    firstExecutionFlag = 1;
  }

  if (
    // eslint-disable-next-line
    testEnv == undefined ||
    !testEnv ||
    isBlank(testEnv) ||
    testEnvironments.findIndex((env) => env === testEnv) === -1
  ) {
    testEnv = 'stage';
    console.warn('Invalid environment! Defaulted to stage');
  }

  return testEnv;
};

export const testEnv = getTestEnv();
