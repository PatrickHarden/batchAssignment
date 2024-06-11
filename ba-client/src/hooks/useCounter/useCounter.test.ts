import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter hook', () => {
  it('should work with an initial counter', () => {
    const { result } = renderHook(() => useCounter({ initialCounter: 0 }));
    expect(result.current.activeCounter).toBe(0);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter({ initialCounter: 0 }));
    expect(result.current.activeCounter).toBe(0);
    act(() => {
      result.current.nextCounter();
    });
    expect(result.current.activeCounter).toBe(1);
  });

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter({ initialCounter: 0 }));
    expect(result.current.activeCounter).toBe(0);
    act(() => {
      result.current.prevCounter();
    });
    expect(result.current.activeCounter).toBe(-1);
  });

  it('should jump to set value', () => {
    const { result } = renderHook(() => useCounter({ initialCounter: 0 }));
    expect(result.current.activeCounter).toBe(0);
    act(() => {
      result.current.setCounter(100);
    });
    expect(result.current.activeCounter).toBe(100);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter({ initialCounter: 0 }));
    expect(result.current.activeCounter).toBe(0);
    act(() => {
      result.current.setCounter(100);
    });
    expect(result.current.activeCounter).toBe(100);
    act(() => {
      result.current.reset();
    });
    expect(result.current.activeCounter).toBe(0);
  });
});
