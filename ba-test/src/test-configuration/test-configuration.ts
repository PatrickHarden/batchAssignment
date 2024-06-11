import { testEnv } from '../test-utilities';
import { LoginPageConfig } from '../pages';

const studentLoginUrl: Record<string, string> = {
  stage: 'https://digital-stage.scholastic.com/#/signin',
  qa: 'https://digital-qa.scholastic.com/#/signin',
  perf: 'https://digital-perf.scholastic.com/#/signin',
  prod: 'https://digital.scholastic.com/#/signin',
};

const educatorLoginUrl: Record<string, string> = {
  stage: 'https://digital-stage.scholastic.com/#/signin/staff',
  qa: 'https://digital-qa.scholastic.com/#/signin/staff',
  perf: 'https://digital-perf.scholastic.com/#/signin/staff',
  prod: 'https://digital.scholastic.com/#/signin/staff',
};

interface TestConfig {
  SignInPage: LoginPageConfig;
}

export const pageConfig: TestConfig = {
  SignInPage: {
    studentUrl: studentLoginUrl[testEnv],
    educatorUrl: educatorLoginUrl[testEnv],
  },
};

export { pageConfig as default };
