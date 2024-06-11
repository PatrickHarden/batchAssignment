// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/user-event';
import crypto from 'crypto';

window.crypto = { getRandomValues: (arr: string | any[]) => crypto.randomBytes(arr.length) } as any;

global.ResizeObserver = require('resize-observer-polyfill');

jest.setTimeout(15000);
