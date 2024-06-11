import { useEffect } from 'react';

/**
 * Timeout hook that utilizes `setTimeout` with cleanup
 * @param callback called when timeout is reached
 * @param ms timeout in milliseconds. When `undefined` is passed timeout is reset.
 */
export const useTimeout = <CallbackArgs extends unknown[]>(
  callback: (...args: CallbackArgs) => void,
  ms?: number
) => {
  useEffect(() => {
    if (ms === undefined) {
      return undefined;
    }

    const timeout = setTimeout(callback, ms);

    return () => clearTimeout(timeout);
  }, [callback, ms]);
};
