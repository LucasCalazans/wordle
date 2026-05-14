import type { EvaluatedLetter } from '../state/types';
import { normalize } from './normalize';

/**
 * Two-pass evaluation handling repeated letters correctly:
 * - Pass 1: mark exact-position matches as 'correct' and count remaining target letters.
 * - Pass 2: mark remaining guess letters as 'present' only while target stock lasts.
 *
 * Examples (target → guess → result states):
 *   PESCA  → PASSA  → correct, absent, correct, absent, correct
 *   CASAS  → SASSA  → absent, correct, present, absent, correct
 */
export function evaluate(
  guessRaw: string,
  targetNormalized: string,
): EvaluatedLetter[] {
  const guess = normalize(guessRaw);
  if (guess.length !== targetNormalized.length) {
    throw new Error(
      `Guess length ${guess.length} does not match target length ${targetNormalized.length}`,
    );
  }

  const result: (EvaluatedLetter | undefined)[] = new Array(guess.length);
  const remaining: Record<string, number> = {};

  for (let i = 0; i < guess.length; i++) {
    const g = guess.charAt(i);
    const t = targetNormalized.charAt(i);
    if (g === t) {
      result[i] = { letter: g, state: 'correct' };
    } else {
      remaining[t] = (remaining[t] ?? 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;
    const g = guess.charAt(i);
    if ((remaining[g] ?? 0) > 0) {
      result[i] = { letter: g, state: 'present' };
      remaining[g] = (remaining[g] ?? 0) - 1;
    } else {
      result[i] = { letter: g, state: 'absent' };
    }
  }

  return result as EvaluatedLetter[];
}
