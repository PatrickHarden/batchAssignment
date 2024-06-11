import { atom } from 'jotai';
import { getSDMNavCTXCookie } from '../utils/cookie-util';

export const sdmInfoAtom = atom(getSDMNavCTXCookie());
