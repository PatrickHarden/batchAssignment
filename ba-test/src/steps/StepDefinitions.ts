import { Given, Then, When } from '@cucumber/cucumber';
import { volumeTestWorld } from '../hooks';
import { SDMPage } from '../pages';
import { getTestEnv } from '../test-utilities';
import LoginPage from '../pages/LoginPage';

/** ***************************************************************************************
 * PAGE DEFINITIONS
 **************************************************************************************** */
// eslint-disable-next-line
let world: any = null;
// eslint-disable-next-line
let page: any = null;
// eslint-disable-next-line
let loginPage: any = null;
// eslint-disable-next-line
let sdmPage: any = null;
// eslint-disable-next-line
let landingPage: any = null;
// eslint-disable-next-line
let landingPageWidget: any = null;

/** ***************************************************************************************
 * CONSTANT VARIABLES
 **************************************************************************************** */

const DURING_SCHOOL_TOOLTIP_MESSAGE = `During School Day: Monday through Friday, 8:30 a.m. to 3:00 p.m. in your time zone.`;
const OUT_OF_SCHOOL_TOOLTIP_MESSAGE = `Out of School: Any time other than Monday through Friday, 8:30 a.m. to 3:00 p.m. in your time zone.`;

const AFTER_TITLE_TOOLTIP_MESSAGE: { [index: string]: any } = {
  FIRST: `Total minutes students in this class worked on F.I.R.S.T activities this week. (Minutes spent browsing and using rewards are not included.)`,
  WORD: `Total minutes students in this class worked on W.O.R.D. activities this week. (Minutes spent browsing and using rewards are not included.)`,
};

const FINGER_ICON_CURSOR = 'pointer';
const CHOSEN_CLASS_INDEX = 'CHOSEN_CLASS';

/** ****************************************************************************************
 * AUXILIARY VARIABLES
 ****************************************************************************************** */

/** ****************************************************************************************
 * AUXILIARY METHODS
 * The following methods must be outside the page class because they instantiate them.
 ****************************************************************************************** */

/** ****************************************************************
 * BDD METHODS
 ***************************************************************** */

/** **************************************************************
 * Select school
 ************************************************************** */

/** **************************************************************
 * APP Choice
 ************************************************************** */

/**
 *  ##############################################################################
 *     # Login
 *  ##############################################################################
 */

/**
 * Given
 */

Given(/^User logins to SDM as a (.+)$/, async function given(account: string) {
  world = volumeTestWorld(this);
  page = world.page(LoginPage);
  loginPage = page;
  await loginPage.navigateToSDM(account);
  await loginPage.enterUserCredsAndSignIn(account);
});

/**
 * Then
 */

Then(/^Verifies SDM Products page is displayed$/, async () => {
  await loginPage.verifySdmProductsPageIsDisplayed();
});

Then(/^Verifies SDM SignIn page is displayed$/, async () => {
  await loginPage.verifySdmSignInPageIsDisplayed();
});
