import { After, Before, Status } from '@cucumber/cucumber';
import { Browser } from '@scholastic/volume-test';
import { driverConfig, lambdaConfig, pageConfig, testConfig } from '../test-configuration';

Before(async function before() {
  this.config = pageConfig;
  this.browser = new Browser(driverConfig, testConfig, lambdaConfig);
  await this.browser.maximizeWindow();
});

After(async function after(scenario) {
  const scenarioResult = scenario.result?.status;
  switch (scenarioResult) {
    case Status.PASSED:
      console.log(`Scenario Passed : ${scenario.pickle.name}`);
      if (testConfig.runOnLambda) {
        await this.browser.getDriver().executeScript('lambda-status=passed');
      }
      break;
    case Status.FAILED:
      console.warn(`Scenario Failed : ${scenario.pickle.name}`);

      if (testConfig.runOnLambda) {
        await this.browser.getDriver().executeScript('lambda-status=failed');
      }

      // Ignoring type definition requirement for this
      // eslint-disable-next-line
      await this.browser.takeScreenshot().then((screenShot: any) => {
        return this.attach(screenShot, 'base64:image/png');
      });
      break;
    default:
  }

  await this.browser.driver.quit();
});
