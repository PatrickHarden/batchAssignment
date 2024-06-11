import { findBy, HtmlButton } from '@scholastic/volume-test';
import { By, until } from 'selenium-webdriver';
import BasePage from './BasePage';
import { getTestEnv } from '../test-utilities';

// eslint-disable-next-line
const getAppLocator = (logoImageName: string): string =>
  `.applicationImage[ng-src*=${logoImageName}]`;

// eslint-disable-next-line
export class SDMPage extends BasePage {
  @findBy(getAppLocator('first'))
  private firstAppLogo: HtmlButton;

  @findBy(getAppLocator('word'))
  private wordAppLogo: HtmlButton;

  @findBy(getAppLocator('litpro'))
  private liproAppLogo: HtmlButton;

  @findBy(getAppLocator('lba'))
  private bookroomAppLogo: HtmlButton;

  private async getAccessCodeInputElement() {
    return this.findElementBy(By.id('accessCodeInput'));
  }

  private async getCloseButtonWelcomePopup() {
    return this.findElementBy(By.xpath(`//*[contains(@id, 'close-button')]`));
  }

  private async isAccessCodeInputVisible() {
    let response = false;
    try {
      response = await (await this.getAccessCodeInputElement()).isDisplayed();
    } catch (e) {
      console.debug(`Not clear school.`);
    }
    return response;
  }

  private async getSchoolDropdownElement() {
    const dropdownLocator = By.xpath(`//div[contains(@class, 'dropdown-indicator')]`);
    await this.waitCondition(until.elementLocated(dropdownLocator));
    return this.findElementBy(dropdownLocator);
  }

  private async getSchoolNameOptionsElement(schoolName: string) {
    const schoolOptionLocator = By.xpath(
      `//*[contains(@id, 'react-select') and contains(text(), '${schoolName}')]`,
    );
    await this.waitCondition(until.elementLocated(schoolOptionLocator));
    return this.findElementBy(schoolOptionLocator);
  }

  /**
   * Page Actions
   */
  public clickOnCpd = async () => {
    const cpdLocator = By.xpath(`//span[normalize-space()='DATA & GROUPS']`);
    const exploreLink = By.xpath(`(//*[@class='cpd-explore-button-link'])[1]`);
    const classSelector = By.xpath(`//*[@class='cpd-class-selector']`);
    await this.waitTimeout(3000);
    await this.waitCondition(until.elementLocated(cpdLocator));
    const dataAndGroupsLink = await this.findElementBy(cpdLocator);
    await this.waitCondition(until.elementIsVisible(dataAndGroupsLink));
    await dataAndGroupsLink.click();
    await this.waitTimeout(1000);
    await this.waitCondition(until.elementLocated(exploreLink));
    await this.waitCondition(until.elementLocated(classSelector));
  };

  public async closeWelcomePopupWhenVisible() {
    if (await this.isAccessCodeInputVisible())
      await (await this.getCloseButtonWelcomePopup()).click();
    else console.debug(`Welcome popup not visible. Nothing to do`);
  }

  public async selectCorrectSchool(schoolName: string) {
    const env = getTestEnv();

    await (await this.getSchoolDropdownElement()).click();
    await (await this.getSchoolNameOptionsElement(schoolName)).click();
  }
}
