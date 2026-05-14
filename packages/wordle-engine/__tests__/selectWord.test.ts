import { selectRandomWord, selectAvoiding } from '../src/core/selectWord';

describe('selectRandomWord', () => {
  it('picks the first word with random=0', () => {
    expect(selectRandomWord(['A', 'B', 'C'], () => 0)).toBe('A');
  });

  it('picks the last word with random just under 1', () => {
    expect(selectRandomWord(['A', 'B', 'C'], () => 0.999)).toBe('C');
  });

  it('throws on empty list', () => {
    expect(() => selectRandomWord([])).toThrow(/empty/);
  });
});

describe('selectAvoiding', () => {
  it('skips recent words when alternatives exist', () => {
    const w = selectAvoiding(['A', 'B', 'C'], ['A', 'B'], () => 0);
    expect(w).toBe('C');
  });

  it('falls back to the full list when everything is recent', () => {
    const w = selectAvoiding(['A', 'B'], ['A', 'B'], () => 0);
    expect(w).toBe('A');
  });
});
