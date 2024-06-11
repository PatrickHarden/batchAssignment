import {
  DriverCapabilities,
  LambdaTestConfiguration,
  TestConfiguration,
} from '@scholastic/volume-test';
import * as chromedriver from 'chromedriver';

export const driverConfig: DriverCapabilities = {
  browserName: process.env.BROWSER_NAME || 'chrome',
  path: chromedriver.path,
  acceptInsecureCerts: true,
};

export const lambdaConfig: LambdaTestConfiguration = {
  browserName: process.env.BROWSER_NAME || 'chrome',
  browserVersion: process.env.BROWSER_VERSION || '100.0',
  platformName: process.env.OPERATING_SYSTEM || 'macOS Mojave',
  build: 'CrossProductDashboard',
  name: 'CPD Test',
  acceptInsecureCerts: `${process.env.ACCEPT_SSL_CERT}` === 'true',
};

export const testConfig: TestConfiguration = {
  runOnLambda: `${process.env.RUN_ON_LAMBDA}` === 'true',
  serverUrl:
    'https://dpalmer:G3LSC25dEgRODD6Tr1iHq6S8ApkWowl95NGAndzlSvssUF2LV6@hub.lambdatest.com/wd/hub',
  cucumberTimeOut: 350000,
  timeoutImplicitMs: parseInt(`${process.env.VOL_TIMEOUT_IMPLICIT_MS || 10000}`, 10),
  timeoutPageLoadMs: parseInt(`${process.env.VOL_TIMEOUT_PAGE_LOAD_MS || 150000}`, 10),
  timeoutScriptMs: parseInt(`${process.env.VOL_TIMEOUT_SCRIPT_MS || 10000}`, 10),
};
