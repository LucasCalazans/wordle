import { initialState, reducer } from '../src/state/reducer';
import { makeConfig } from '../src/config';
import type { GameState } from '../src/state/types';

const baseConfig = makeConfig({ wordLength: 5, maxAttempts: 6 });

function setup(target = 'CASAS', config = baseConfig): GameState {
  return initialState(target, config);
}

describe('initialState', () => {
  it('creates a playing state with the normalized target', () => {
    const s = setup('CAFÉS'); // 5 chars, normalized to CAFES (still length 5)
    expect(s.phase).toBe('playing');
    expect(s.targetNormalized).toBe('CAFES');
    expect(s.guesses).toEqual([]);
    expect(s.currentGuess).toBe('');
    expect(s.lastRejection).toBeNull();
  });

  it('rejects a target whose normalized length differs from config', () => {
    expect(() => initialState('AB', baseConfig)).toThrow(/length/);
  });
});

describe('reducer — typing', () => {
  it('ADD_LETTER appends uppercased letter', () => {
    const s = reducer(setup(), { type: 'ADD_LETTER', letter: 'a' });
    expect(s.currentGuess).toBe('A');
  });

  it('ADD_LETTER normalizes accented input', () => {
    const s = reducer(setup(), { type: 'ADD_LETTER', letter: 'é' });
    expect(s.currentGuess).toBe('E');
  });

  it('ADD_LETTER ignores non-letters', () => {
    const before = setup();
    expect(reducer(before, { type: 'ADD_LETTER', letter: '1' })).toBe(before);
    expect(reducer(before, { type: 'ADD_LETTER', letter: '!' })).toBe(before);
  });

  it('ADD_LETTER ignores multi-char input', () => {
    const before = setup();
    expect(reducer(before, { type: 'ADD_LETTER', letter: 'ab' })).toBe(before);
  });

  it('ADD_LETTER ignores past wordLength', () => {
    let s = setup();
    for (const ch of 'ABCDE') {
      s = reducer(s, { type: 'ADD_LETTER', letter: ch });
    }
    expect(s.currentGuess).toBe('ABCDE');
    const after = reducer(s, { type: 'ADD_LETTER', letter: 'F' });
    expect(after.currentGuess).toBe('ABCDE');
  });

  it('REMOVE_LETTER removes last char', () => {
    let s = setup();
    s = reducer(s, { type: 'ADD_LETTER', letter: 'A' });
    s = reducer(s, { type: 'ADD_LETTER', letter: 'B' });
    s = reducer(s, { type: 'REMOVE_LETTER' });
    expect(s.currentGuess).toBe('A');
  });

  it('REMOVE_LETTER on empty is a noop', () => {
    const before = setup();
    expect(reducer(before, { type: 'REMOVE_LETTER' })).toBe(before);
  });
});

describe('reducer — submit', () => {
  function typeWord(state: GameState, word: string): GameState {
    let s = state;
    for (const ch of word) {
      s = reducer(s, { type: 'ADD_LETTER', letter: ch });
    }
    return s;
  }

  it('rejects submit when guess is too short', () => {
    let s = typeWord(setup(), 'AB');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.lastRejection).toBe('too_short');
    expect(s.guesses).toHaveLength(0);
    expect(s.currentGuess).toBe('AB');
  });

  it('accepts valid submit and clears currentGuess', () => {
    let s = typeWord(setup('CASAS'), 'BARCO');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.guesses).toHaveLength(1);
    expect(s.currentGuess).toBe('');
    expect(s.phase).toBe('playing');
    expect(s.lastRejection).toBeNull();
  });

  it('declares win when all letters correct', () => {
    let s = typeWord(setup('CASAS'), 'CASAS');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.phase).toBe('won');
  });

  it('declares loss after maxAttempts incorrect guesses', () => {
    let s = setup('CASAS');
    for (let i = 0; i < 6; i++) {
      s = typeWord(s, 'BARCO');
      s = reducer(s, { type: 'SUBMIT' });
    }
    expect(s.phase).toBe('lost');
    expect(s.guesses).toHaveLength(6);
  });

  it('ignores further actions when phase != playing', () => {
    let s = typeWord(setup('CASAS'), 'CASAS');
    s = reducer(s, { type: 'SUBMIT' });
    const after = reducer(s, { type: 'ADD_LETTER', letter: 'A' });
    expect(after).toBe(s);
  });

  it('rejects submit when isValidGuess returns false', () => {
    const config = makeConfig({
      wordLength: 5,
      maxAttempts: 6,
      isValidGuess: (g) => g === 'CASAS',
    });
    let s = typeWord(initialState('PERTO', config), 'BARCO');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.lastRejection).toBe('invalid_word');
    expect(s.guesses).toHaveLength(0);
  });

  it('updates letterStates with best-priority state', () => {
    let s = setup('CASAS');
    // First guess CACAU: C correct, A correct, C absent (one C in target), A correct, U absent
    s = typeWord(s, 'CACAU');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.letterStates['C']).toBe('correct');
    expect(s.letterStates['A']).toBe('correct');
    expect(s.letterStates['U']).toBe('absent');

    // Second guess: SUSSA: S present somewhere, but a 'correct' should not be downgraded.
    s = typeWord(s, 'SUSSA');
    s = reducer(s, { type: 'SUBMIT' });
    expect(s.letterStates['A']).toBe('correct'); // not downgraded
  });
});

describe('reducer — reset', () => {
  it('RESET creates fresh state with new target', () => {
    let s = setup('CASAS');
    s = reducer(s, { type: 'ADD_LETTER', letter: 'A' });
    s = reducer(s, { type: 'RESET', target: 'BARCO' });
    expect(s.target).toBe('BARCO');
    expect(s.currentGuess).toBe('');
    expect(s.guesses).toEqual([]);
    expect(s.phase).toBe('playing');
  });

  it('RESET works even after game ended', () => {
    let s = setup('CASAS');
    let typed = s;
    for (const ch of 'CASAS') {
      typed = reducer(typed, { type: 'ADD_LETTER', letter: ch });
    }
    typed = reducer(typed, { type: 'SUBMIT' });
    expect(typed.phase).toBe('won');
    const reset = reducer(typed, { type: 'RESET', target: 'PERTO' });
    expect(reset.phase).toBe('playing');
    expect(reset.target).toBe('PERTO');
  });
});
