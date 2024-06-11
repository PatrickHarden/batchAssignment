import {
  elementIsVisible,
  findBy,
  Page,
  WaitCondition,
  WebComponent,
} from '@scholastic/volume-test';
import {
  By,
  error,
  ThenableWebDriver,
  until,
  WebElement,
  WebElementCondition,
  WebElementPromise,
} from 'selenium-webdriver';
import chai from 'chai';
import StaleElementReferenceError = error.StaleElementReferenceError;

export default class BasePage extends Page {
  public static readonly DEFAULT_SELECTOR = 'iframe';

  @findBy('.vol-container')
  public pageContainer: WebComponent;

  protected element: WebElement;

  protected get driver(): ThenableWebDriver {
    return this.browser.driver;
  }

  public async waitCondition(
    condition: WebElementCondition,
    timeout = 10000,
    msg = 'Failed on wait condition.',
  ): Promise<WebElementPromise> {
    return this.driver.wait(condition, timeout, msg);
  }

  public async waitForElementVisible(element: WebElement): Promise<WebElementPromise> {
    return this.driver.wait(until.elementIsVisible(element));
  }

  public loadCondition(): WaitCondition {
    return elementIsVisible(() => this.pageContainer);
  }

  public async switchOutOfIframe(): Promise<BasePage> {
    await this.driver.switchTo().defaultContent();
    this.element = await this.driver.findElement(By.css('body'));
    return this;
  }

  public async hoverElement(elementToHover: WebElement): Promise<void> {
    const actions = this.driver.actions({ bridge: true });
    await actions.move({ duration: 2000, origin: elementToHover, x: 0, y: 0 }).perform();
  }

  public findElementBy(locator: By): Promise<WebElement> {
    return this.driver.findElement(locator);
  }

  public findElementsBy(locator: By): Promise<WebElement[]> {
    return this.driver.findElements(locator);
  }

  public async click(locator: By, attempts = 3): Promise<void> {
    let bid = attempts;
    if (bid <= 0) throw new StaleElementReferenceError(`Element located by ${locator} is staled.`);
    const clickOnElement = async () => {
      await this.driver.wait(until.elementLocated(locator));
      const element = await this.findElementBy(locator);
      await element.click();
    };
    await clickOnElement()
      .then(() => `-> Clicking on element located by => ${locator}`)
      .catch((err) => {
        if (!(err instanceof StaleElementReferenceError)) throw err;
        bid -= 1;
        if (err instanceof StaleElementReferenceError && bid <= 0) throw err;

        // eslint-disable-next-line
                return this.click(locator, --bid).then((e) => (bid = 0));
      });
  }

  public async expectForError(locator: By, errorName: string) {
    try {
      await this.findElementBy(locator);
    } catch (e) {
      // This forced passing is due to we expect to receive a NoSuchElementError
      /* eslint-disable babel/no-unused-expressions */
      if (e.message.includes(errorName)) chai.expect(true).is.true;
    }
  }

  public async waitTimeout(time: number) {
    try {
      await this.driver.wait((driver) => driver.findElement(By.id('null')), time);
    } catch (timeoutError) {
      console.log(`Wait: ${time}`);
    }
  }

  // Useful methods
  protected async validateFingerIconOnHoverElement(element: WebElement) {
    await this.hoverElement(element);
    await this.validateIfCursorIs(element, 'pointer');
  }

  // eslint-disable-next-line class-methods-use-this
  protected async validateIfCursorIs(element: WebElement, cursor: string) {
    chai.expect(await element.getCssValue('cursor')).to.be.equal(cursor);
  }
}
