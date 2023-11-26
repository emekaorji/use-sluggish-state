import { useState, SetStateAction, useCallback } from 'react';

export type Dispatch<A> = (value: A, _delay?: number) => void;

function useDelayedState<T>(
  initialState: T | (() => T),
  delay: number
): [T, Dispatch<SetStateAction<T>>, boolean, T];
function useDelayedState<T>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>, boolean, T | undefined];
function useDelayedState<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  boolean,
  T | undefined
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useDelayedState<T = undefined>(
  initialState?: T | (() => T),
  delay = 0
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
