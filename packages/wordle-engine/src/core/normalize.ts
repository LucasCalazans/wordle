const DIACRITICS = /[̀-ͯ]/g;

/**
 * Normalize a string for comparison: uppercase + strip diacritics.
 * CAFÉ → CAFE, açúcar → ACUCAR, ñoño → NONO, ção → CAO.
 */
export function normalize(input: string): string {
  return input.normalize('NFD').replace(DIACRITICS, '').toUpperCase();
}
