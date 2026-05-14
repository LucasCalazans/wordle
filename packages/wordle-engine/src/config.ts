import type { EngineConfig } from './state/types';

export const DEFAULT_WORD_LENGTH = 5;
export const DEFAULT_MAX_ATTEMPTS = 6;

export function makeConfig(overrides?: Partial<EngineConfig>): EngineConfig {
  return {
    wordLength: overrides?.wordLength ?? DEFAULT_WORD_LENGTH,
    maxAttempts: overrides?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    isValidGuess: overrides?.isValidGuess,
  };
}
