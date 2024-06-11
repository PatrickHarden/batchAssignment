import Cookies from 'js-cookie';
import * as t from 'io-ts';
import { validateDataShape } from '../hooks/use-fetch/use-fetch';

const EnvShape = t.union([
  t.literal('stage'),
  t.literal('qa'),
  t.literal('perf'),
  t.literal('prod')
]);
export type Env = t.TypeOf<typeof EnvShape>;

const SDMNavCtxShape = t.strict({
  admin: t.boolean,
  appCode: t.string,
  appCodes: t.array(t.string),
  appId: t.string,
  env: EnvShape,
  extSessionEndpoint: t.string,
  extSessionId: t.string,
  firstName: t.string,
  iamUserId: t.string,
  name: t.string,
  orgId: t.string,
  orgName: t.string,
  orgType: t.string,
  parentOrgId: t.union([t.string, t.undefined]),
  portalBaseUrl: t.string,
  role: t.string,
  staff: t.boolean,
  user_id: t.string
});

export type SDMNavCtx = t.TypeOf<typeof SDMNavCtxShape>;

export const getSDMNavCTXCookie = (): SDMNavCtx => {
  const sdmNavCtxString = Cookies.get('sdm_nav_ctx');
  if (sdmNavCtxString) {
    return validateDataShape(JSON.parse(sdmNavCtxString), SDMNavCtxShape);
  }
  throw Error('sdm_nav_ctx cookie not found');
};
