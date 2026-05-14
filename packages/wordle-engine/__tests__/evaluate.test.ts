import { evaluate } from '../src/core/evaluate';

const states = (guess: string, target: string) =>
  evaluate(guess, target).map((e) => e.state);

describe('evaluate', () => {
  it('marks all correct on exact match', () => {
    expect(states('CASAS', 'CASAS')).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ]);
  });

  it('marks all absent on no overlap', () => {
    expect(states('ABCDE', 'FGHIJ')).toEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'absent',
    ]);
  });

  it('handles repeated guess letters with single target match (one present, one absent)', () => {
    // target has a single E; guess has E twice → first stays absent, last is present at pos 4
    expect(states('EAGLE', 'PLATE')).toEqual([
      'present',
      'absent',
      'absent',
      'present',
      'correct',
    ]);
  });

  it('repeated letters: target PESCA vs guess PASSA', () => {
    expect(states('PASSA', 'PESCA')).toEqual([
      'correct',
      'absent',
      'correct',
      'absent',
      'correct',
    ]);
  });

  it('repeated letters: target CASAS vs guess SASSA', () => {
    // C A S A S vs S A S S A
    // pos0 S/C: not equal, target stock C++
    // pos1 A/A: correct
    // pos2 S/S: correct
    // pos3 S/A: not equal, target stock A++
    // pos4 A/S: not equal, target stock S++ (one S already used as correct at pos2)
    // After pass1 remaining: { C:1, A:1, S:1 } (started 2A, 2S, 1C; used 1A correct, 1S correct)
    // wait: target is CASAS = [C,A,S,A,S] = 1C, 2A, 2S
    // greens: pos1 A, pos2 S → consumed 1A, 1S → remaining: 1C, 1A, 1S
    // pos0 guess S → S available → present, remaining S=0
    // pos3 guess S → S not available → absent
    // pos4 guess A → A available → present
    expect(states('SASSA', 'CASAS')).toEqual([
      'present',
      'correct',
      'correct',
      'absent',
      'present',
    ]);
  });

  it('lowercase guess is normalized', () => {
    expect(states('casas', 'CASAS')).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ]);
  });

  it('accented guess matches normalized target', () => {
    expect(states('café', 'CAFE')).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
    ]);
  });

  it('throws when guess length differs from target length', () => {
    expect(() => evaluate('ABCD', 'ABCDE')).toThrow(/length/);
  });

  it('preserves letter in output (normalized)', () => {
    const result = evaluate('ç', 'C');
    expect(result[0]).toEqual({ letter: 'C', state: 'correct' });
  });
});
