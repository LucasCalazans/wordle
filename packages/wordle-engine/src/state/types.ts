export type LetterState = 'empty' | 'edited' | 'correct' | 'present' | 'absent';

export interface EvaluatedLetter {
  letter: string;
  state: 'correct' | 'present' | 'absent';
}

export interface EngineConfig {
  wordLength: number;
  maxAttempts: number;
  /** Optional dictionary check. Receives normalized (uppercase, no accents) guess. */
  isValidGuess?: (normalized: string) => boolean;
}

export type GamePhase = 'playing' | 'won' | 'lost';

export type Rejection = 'too_short' | 'invalid_word';

export interface GameState {
  config: EngineConfig;
  target: string;
  targetNormalized: string;
  guesses: EvaluatedLetter[][];
  currentGuess: string;
  phase: GamePhase;
  /** Best known state per letter for keyboard coloring. */
  letterStates: Record<string, LetterState>;
  /** Set when last SUBMIT was rejected. Cleared on next mutation. */
  lastRejection: Rejection | null;
}

export type Action =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SUBMIT' }
  | { type: 'RESET'; target: string };
