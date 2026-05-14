import { evaluate } from '../core/evaluate';
import { normalize } from '../core/normalize';
import type {
  Action,
  EngineConfig,
  EvaluatedLetter,
  GameState,
  LetterState,
} from './types';

const STATE_PRIORITY: Record<LetterState, number> = {
  empty: 0,
  edited: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function initialState(target: string, config: EngineConfig): GameState {
  const targetNormalized = normalize(target);
  if (targetNormalized.length !== config.wordLength) {
    throw new Error(
      `Target "${target}" has normalized length ${targetNormalized.length}, expected ${config.wordLength}`,
    );
  }
  return {
    config,
    target,
    targetNormalized,
    guesses: [],
    currentGuess: '',
    phase: 'playing',
    letterStates: {},
    lastRejection: null,
  };
}

export function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'RESET') {
    return initialState(action.target, state.config);
  }

  if (state.phase !== 'playing') {
    return state;
  }

  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.currentGuess.length >= state.config.wordLength) return state;
      const letter = normalize(action.letter);
      if (letter.length !== 1 || !/^[A-Z]$/.test(letter)) return state;
      return {
        ...state,
        currentGuess: state.currentGuess + letter,
        lastRejection: null,
      };
    }
    case 'REMOVE_LETTER': {
      if (state.currentGuess.length === 0) return state;
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
        lastRejection: null,
      };
    }
    case 'SUBMIT': {
      if (state.currentGuess.length !== state.config.wordLength) {
        return { ...state, lastRejection: 'too_short' };
      }
      if (
        state.config.isValidGuess &&
        !state.config.isValidGuess(state.currentGuess)
      ) {
        return { ...state, lastRejection: 'invalid_word' };
      }
      const evaluation = evaluate(state.currentGuess, state.targetNormalized);
      const guesses = [...state.guesses, evaluation];
      const isWin = evaluation.every((e) => e.state === 'correct');
      const isLast = guesses.length >= state.config.maxAttempts;
      return {
        ...state,
        guesses,
        currentGuess: '',
        phase: isWin ? 'won' : isLast ? 'lost' : 'playing',
        letterStates: mergeLetterStates(state.letterStates, evaluation),
        lastRejection: null,
      };
    }
    default: {
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}

function mergeLetterStates(
  prev: Record<string, LetterState>,
  evaluation: readonly EvaluatedLetter[],
): Record<string, LetterState> {
  const next = { ...prev };
  for (const { letter, state } of evaluation) {
    const current = next[letter];
    if (!current || STATE_PRIORITY[state] > STATE_PRIORITY[current]) {
      next[letter] = state;
    }
  }
  return next;
}
