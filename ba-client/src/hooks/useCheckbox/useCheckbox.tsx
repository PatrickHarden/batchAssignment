import { useCallback, useState, useEffect } from 'react';
import { CheckboxContent, CheckboxStateObject } from '../../components/pure/checkbox/CheckboxList';

type UseCheckboxes = {
  initialCheckboxState: Record<string, boolean>; // default is {0: false}
  initialAllCheckboxState: Record<string, boolean>; // default is {} but then changes to {123: true, 124: false, 125: false}
  content: CheckboxContent[];
};

export function useCheckbox({
  initialCheckboxState,
  initialAllCheckboxState,
  content
}: UseCheckboxes) {
  const [allCheckboxState, setAllCheckboxState] = useState(initialAllCheckboxState);
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState);
  const [originalCheckboxState, setOriginalCheckboxState] = useState(initialCheckboxState);

  const handleCheck = useCallback(
    (value: string, checked: boolean) => {
      setCheckboxState({ ...checkboxState, [value]: checked });
    },
    [checkboxState]
  );

  const handleAllCheck = useCallback(
    (checked: boolean) => {
      const tempState: CheckboxStateObject = {};
      // set all checkboxes to checked or unchecked
      for (const checkbox of content) {
        const id = checkbox.id || '';
        tempState[id] = checked;
      }

      setCheckboxState(tempState);
      setAllCheckboxState({ 0: checked });
    },
    [content]
  );

  const handleCheckboxesStatusCheck = useCallback(() => {
    const allCheckboxValues = Object.values(checkboxState);
    const selectedCheckboxes = allCheckboxValues.filter((checkbox) => checkbox === true);

    if (selectedCheckboxes.length === allCheckboxValues.length) {
      setAllCheckboxState({ 0: true });
    } else {
      setAllCheckboxState({ 0: false });
    }
  }, [checkboxState]);

  useEffect(() => {
    handleCheckboxesStatusCheck();
  }, [checkboxState, handleCheckboxesStatusCheck]);

  const handleClear = useCallback(() => {
    setCheckboxState(originalCheckboxState);
  }, [originalCheckboxState]);

  const handleApply = useCallback(() => {
    setOriginalCheckboxState(checkboxState);
  }, [checkboxState]);

  return {
    allCheckboxState,
    checkboxState,
    originalCheckboxState,
    handleCheck,
    handleAllCheck,
    handleCheckboxesStatusCheck,
    handleClear,
    handleApply
  };
}
