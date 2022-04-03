import { createContext, FC, useCallback, useContext, useState } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { expect, it } from 'vitest';

const CounterStepContext = createContext(1);

export const CounterStepProvider: FC<{ step: number }> = ({ step, children }) => (
  <CounterStepContext.Provider value={step}>{children}</CounterStepContext.Provider>
);

export function useCounter(initialValue = 0): {
  count: number;
  increment: () => void;
  reset: () => void;
} {
  const [count, setCount] = useState(initialValue);
  const step = useContext(CounterStepContext);
  const increment = useCallback(() => setCount((x) => x + step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  return { count, increment, reset };
}

it('should use custom step when incrementing', () => {
  const { result } = renderHook(() => useCounter(), {
    wrapper: ({ children }) => <CounterStepProvider step={2}>{children}</CounterStepProvider>
  });

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
});
