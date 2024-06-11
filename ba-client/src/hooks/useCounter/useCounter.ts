import { useCallback, useState } from 'react';

type UseCounters = {
  initialCounter: number;
};

export function useCounter({ initialCounter }: UseCounters) {
  const [activeCounter, setActiveCounter] = useState(initialCounter);

  const nextCounter = useCallback(() => {
    setActiveCounter((prev: number) => prev + 1);
  }, []);

  const prevCounter = useCallback(() => {
    setActiveCounter((prev: number) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setActiveCounter(initialCounter);
  }, [initialCounter]);

  const setCounter = useCallback((step: number) => {
    setActiveCounter(step);
  }, []);

  return { nextCounter, prevCounter, reset, setCounter, activeCounter };
}
