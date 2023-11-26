import { useState, SetStateAction, useCallback } from 'react';

export type Dispatch<A> = (value: A, _delay?: number) => void;

function useDelayedState<T>(
  delay: number,
  initialState: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, boolean, T];
function useDelayedState<T = undefined>(
  delay?: number
): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  boolean,
  T | undefined
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useDelayedState<T = undefined>(
  delay = 0,
  initialState?: T | (() => T)
) {
  const [state, _setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [endState, setEndState] = useState(initialState);

  const setState = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (value, _delay) => {
      const actualDelay = _delay || delay;

      setLoading(true);
      setEndState(value);
      const id = window.setTimeout(() => {
        _setState(value);
        setLoading(false);
        window.clearTimeout(id);
      }, actualDelay);
    },
    [delay]
  );

  return [state, setState, loading, endState] as const;
}

export default useDelayedState;
