import { useState, SetStateAction, useCallback, useRef } from 'react';

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
  const lastTimeoutId = useRef(0);

  const setState = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (value, _delay) => {
      if (typeof value !== 'function') {
        window.clearTimeout(lastTimeoutId.current);
      }
      const actualDelay = _delay || delay;

      setLoading(true);
      setEndState(value);
      lastTimeoutId.current = window.setTimeout(() => {
        _setState(value);
        setLoading(false);
        window.clearTimeout(lastTimeoutId.current);
      }, actualDelay);
    },
    [delay]
  );

  return [state, setState, loading, endState] as const;
}

export default useDelayedState;
