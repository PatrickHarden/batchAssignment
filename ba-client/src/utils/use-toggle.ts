import { useState, useCallback } from 'react';

export interface UseToggle {
  /**
   * Whether anything is on or off. An example would
   * be a modal which is either shown or hidden
   */
  isOn: boolean;

  /**
   * Toggle the state of the `isOn` property
   */
  toggle: () => void;
}

const useToggle = (isOnInitial = false): UseToggle => {
  const [isOn, setIsShown] = useState(isOnInitial);

  const toggle = useCallback(() => setIsShown((isOnPrevious) => !isOnPrevious), []);

  return {
    isOn,
    toggle
  };
};

export default useToggle;
