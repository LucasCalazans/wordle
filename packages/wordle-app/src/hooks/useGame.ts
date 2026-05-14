import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  initialState,
  makeConfig,
  reducer,
  type EngineConfig,
  type GameState,
} from 'wordle-engine';

export interface UseGameOptions {
  /**
   * Função que retorna a próxima palavra-alvo. Chamada uma vez na
   * inicialização e a cada `reset`. A implementação fica fora do hook
   * para que estratégias de tiering / "evitar repetir" / persistência
   * possam ser plugadas pela tela.
   */
  pickNextTarget: () => string;
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

export function useGame({
  pickNextTarget,
  config,
}: UseGameOptions): UseGameResult {
  // Ref pra evitar stale closure: garante que SUBMIT/RESET veem a função
  // mais recente passada via props.
  const pickRef = useRef(pickNextTarget);
  pickRef.current = pickNextTarget;

  const [state, dispatch] = useReducer(
    reducer,
    undefined as unknown as GameState,
    () => initialState(pickRef.current(), makeConfig(config)),
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
    () => dispatch({ type: 'RESET', target: pickRef.current() }),
    [],
  );

  return { state, shakeKey, addLetter, removeLetter, submit, reset };
}
