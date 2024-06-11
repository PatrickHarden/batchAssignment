import { By, until } from 'selenium-webdriver';
import { getUserData } from '../test-utilities/users-util';
import { pageConfig } from '../test-configuration/test-configuration';
import BasePage from './BasePage';

export interface LoginPageConfig {
  studentUrl: string;
  educatorUrl: string;
}

export default class LoginPage extends BasePage {
  // Class interface

  public async navigateToSDM(role: string) {
    if ((await getUserData())[role].role === 'student') {
      await this.browser.driver.get(pageConfig.SignInPage.studentUrl);
    } else if ((await getUserData())[role].role === 'educator') {
      await this.browser.driver.get(pageConfig.SignInPage.educatorUrl);
    }
  }

  public async enterUserCredsAndSignIn(role: string) {
    if ((await getUserData())[role].role === 'student') {
      await this.enterStudentCredsAndSignIn(role);
    } else if ((await getUserData())[role].role === 'educator') {
      await this.enterEducatorCredsAndSignIn(role);
    }
  }

  public async enterStudentCredsAndSignIn(role: string) {
    const { username } = (await getUserData())[role];
    const { password } = (await getUserData())[role];
    console.debug(`Login with the role: ${role}`);
    const usernameInput = await this.findElementBy(this.locators.studentLoginForm.username);
    const passwordInput = await this.findElementBy(this.locators.studentLoginForm.password);
    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(password);
    const signInButton = await this.findElementBy(this.locators.studentLoginForm.sigInButton);
    await this.waitCondition(until.elementIsEnabled(signInButton));
    if (await signInButton.isEnabled()) await signInButton.click();
  }

  public async enterEducatorCredsAndSignIn(role: string) {
    const { username } = (await getUserData())[role];
    const { password } = (await getUserData())[role];
    await this.clickOnMyScholasticButton();
    await this.enterEducatorEmail(username);
    await this.enterEducatorPassword(password);
    await this.clickEducatorSignIn();
    await this.waitDashboardMinimumLoad();
  }

  private async waitDashboardMinimumLoad() {
    // The timeout below is a workaround for
    // InvalidArgumentError: invalid argument: uniqueContextId not found
    await this.waitTimeout(3000);
    await this.waitCondition(until.elementLocated(this.locators.dataAndGroupsLink));
  }

  private async clickOnMyScholasticButton() {
    await this.click(this.locators.myScholasticButton);
  }

  private async enterEducatorPassword(password: string) {
    await this.switchToLoginIframe();
    await this.waitCondition(
      until.elementLocated(this.locators.loginModalIframe.passwordContainer),
    );
    const passwordField = await this.findElementBy(this.locators.loginModalIframe.passwordInput);
    await passwordField.sendKeys(password);
  }

  private async clickEducatorSignIn() {
    const signInButton = await this.findElementBy(this.locators.loginModalIframe.signInButton);
    await signInButton.click();
  }

  private async enterEducatorEmail(email: string) {
    // Switch to login
    await this.switchToLoginIframe();

    // Set e-mail
    const emailInput = await this.findElementBy(this.locators.loginModalIframe.emailInput);
    await emailInput.sendKeys(email);
    await this.waitCondition(until.elementLocated(this.locators.loginModalIframe.continueButton));
    const continueElement = await this.findElementBy(this.locators.loginModalIframe.continueButton);
    await this.waitCondition(until.elementIsEnabled(continueElement));
    if (await continueElement.isEnabled()) await continueElement.click();

    // Switch to default
    await this.switchOutOfIframe();
  }

  private async switchToLoginIframe() {
    const iframe = await this.findElementBy(this.locators.loginModalIframe.self);
    await this.driver.switchTo().frame(iframe);
  }

  // Locators
  private locators = {
    loginModalIframe: {
      self: By.xpath(`//*[@data-testid="vol-modal-dialog"]//child::iframe`),
      emailInput: By.id('user-text-field'),
      continueButton: By.id('signin-email-submit-button'),
      passwordContainer: By.xpath(`//*[contains(@class, 'SubmitPassword_container')]`),
      passwordInput: By.id(`password-text-field`),
      signInButton: By.id(`password`),
    },
    myScholasticButton: By.xpath(
      `//*[@data-testid="myScholasticLogin" and contains(@class, 'vol-button')]`,
    ),
    signInAsStudent: By.xpath(`//*[@data-testid="signInFormToggle"]`),
    studentLoginForm: {
      self: By.xpath(`//*[@data-testid="loginForm"]`),
      username: By.xpath(`//*[@data-testid="usernameInput"]`),
      password: By.xpath(`//*[@data-testid="passwordInput"]`),
      sigInButton: By.xpath(`//*[@data-testid="submitButton"]`),
    },
    dataAndGroupsLink: By.xpath(`//*[@class='vol-global-nav-tab vol-global-nav-tab--data']`),
  };
}
