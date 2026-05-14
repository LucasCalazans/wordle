import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  initialState,
  makeConfig,
  reducer,
  selectRandomWord,
  type EngineConfig,
  type GameState,
} from 'wordle-engine';

export interface UseGameOptions {
  wordList: readonly string[];
  config?: Partial<EngineConfig>;
}

export interface UseGameResult {
  state: GameState;
  /** Increments whenever a SUBMIT is rejected. UI uses this as shake trigger. */
  shakeKey: number;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submit: () => void;
  reset: () => void;
}

export function useGame({ wordList, config }: UseGameOptions): UseGameResult {
  const [state, dispatch] = useReducer(
    reducer,
    undefined as unknown as GameState,
    () => initialState(selectRandomWord(wordList), makeConfig(config)),
  );

  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (state.lastRejection) {
      setShakeKey((k) => k + 1);
    }
  }, [state.lastRejection]);

  const addLetter = useCallback(
    (letter: string) => dispatch({ type: 'ADD_LETTER', letter }),
    [],
  );
  const removeLetter = useCallback(
    () => dispatch({ type: 'REMOVE_LETTER' }),
    [],
  );
  const submit = useCallback(() => dispatch({ type: 'SUBMIT' }), []);
  const reset = useCallback(
    () => dispatch({ type: 'RESET', target: selectRandomWord(wordList) }),
    [wordList],
  );

  return { state, shakeKey, addLetter, removeLetter, submit, reset };
}
