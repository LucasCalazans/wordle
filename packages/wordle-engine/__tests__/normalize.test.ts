import { normalize } from '../src/core/normalize';

describe('normalize', () => {
  it('uppercases ASCII', () => {
    expect(normalize('casas')).toBe('CASAS');
  });

  it('strips Portuguese accents', () => {
    expect(normalize('café')).toBe('CAFE');
    expect(normalize('açúcar')).toBe('ACUCAR');
    expect(normalize('coração')).toBe('CORACAO');
    expect(normalize('mãe')).toBe('MAE');
  });

  it('strips Spanish accents and tildes', () => {
    expect(normalize('niño')).toBe('NINO');
    expect(normalize('señor')).toBe('SENOR');
  });

  it('handles already-normalized input', () => {
    expect(normalize('HELLO')).toBe('HELLO');
  });

  it('handles empty input', () => {
    expect(normalize('')).toBe('');
  });

  it('preserves non-alphabetic chars if any (current behavior)', () => {
    expect(normalize('a1b')).toBe('A1B');
  });
});
