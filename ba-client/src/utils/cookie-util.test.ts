import { getSDMNavCTXCookie } from './cookie-util';
import Cookies from 'js-cookie';

const sdmToken =
  '%7B%22user_id%22%3A%2215856652%22%2C%22name%22%3A%22John%20P%22%2C%22portalBaseUrl%22%3A%22https%3A%2F%2Fdigital.scholastic.com%22%2C%22orgId%22%3A%222492%22%2C%22orgName%22%3A%22EDUCATION%20DIGITAL%20ACCOUNT%22%2C%22orgType%22%3A%22school%22%2C%22appCodes%22%3A%5B%22litpro%22%2C%22ooka%22%2C%22word%22%5D%2C%22extSessionId%22%3A%22ed783733-03d0-43d6-8159-4960452585fb%22%2C%22extSessionEndpoint%22%3A%22https%3A%2F%2Ftfphnn9jh6.execute-api.us-east-1.amazonaws.com%2Fprod%2Fextendedsession%22%2C%22appCode%22%3A%22litpro%22%2C%22appId%22%3A%2244%22%2C%22parentOrgId%22%3A%224%22%2C%22env%22%3A%22prod%22%2C%22easyLogin%22%3Afalse%2C%22role%22%3A%22student%22%2C%22classIds%22%3A%5B%223988819%22%5D%2C%22primaryTeacherIds%22%3A%5B%226682861%22%5D%7D';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn()
}));

it('should get valid navCTX cookie when getSRMNavCTXCookie is called', () => {
  const mockToken = { sdm_nav_ctx: decodeURIComponent(sdmToken) };

  expect(JSON.parse(mockToken['sdm_nav_ctx']).env).toBe('prod');
});

it('should throw Error if cannot parse token', () => {
  const mockToken = { sdm_nav_ctx: decodeURIComponent(sdmToken) };
  jest.spyOn(Cookies, 'get').mockReturnValue(mockToken);

  function getCookie() {
    getSDMNavCTXCookie();
  }
  expect(getCookie).toThrowError();
});

it("should get throw error if getSRMNavCTXCookie doesn't return valid navCTX cookie", () => {
  function getCookie() {
    getSDMNavCTXCookie();
  }
  expect(getCookie).toThrowError('sdm_nav_ctx cookie not found');
});
