/**
 * Sanity check for theme word lists. Run with `npm run validate` (uses tsx).
 * Verifies: every word is exactly 5 chars, no duplicates, all A-Z uppercase.
 *
 * Re-use this script when forking theme-base to a new theme — it's the cheapest
 * way to catch typos in hand-written word lists before they hit production.
 */
import { wordsEn } from '../src/words.en';
import { wordsPt } from '../src/words.pt';

const EXPECTED_LENGTH = 5;

interface Report {
  total: number;
  notFiveChars: string[];
  duplicates: string[];
  notUppercase: string[];
  nonAZ: string[];
}

function audit(list: readonly string[]): Report {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const w of list) {
    if (seen.has(w)) duplicates.add(w);
    else seen.add(w);
  }
  return {
    total: list.length,
    notFiveChars: list.filter((w) => w.length !== EXPECTED_LENGTH),
    duplicates: [...duplicates],
    notUppercase: list.filter((w) => w !== w.toUpperCase()),
    nonAZ: list.filter((w) => !/^[A-Z]+$/.test(w)),
  };
}

function format(label: string, r: Report): string {
  const issues =
    r.notFiveChars.length +
    r.duplicates.length +
    r.notUppercase.length +
    r.nonAZ.length;
  const head = `[${label}] total=${r.total} issues=${issues}`;
  if (issues === 0) return `${head} OK`;
  const lines = [head];
  if (r.notFiveChars.length) lines.push(`  notFiveChars: ${r.notFiveChars.join(', ')}`);
  if (r.duplicates.length) lines.push(`  duplicates: ${r.duplicates.join(', ')}`);
  if (r.notUppercase.length) lines.push(`  notUppercase: ${r.notUppercase.join(', ')}`);
  if (r.nonAZ.length) lines.push(`  nonAZ: ${r.nonAZ.join(', ')}`);
  return lines.join('\n');
}

const pt = audit(wordsPt);
const en = audit(wordsEn);

console.log(format('PT', pt));
console.log(format('EN', en));

const totalIssues =
  pt.notFiveChars.length +
  pt.duplicates.length +
  pt.notUppercase.length +
  pt.nonAZ.length +
  en.notFiveChars.length +
  en.duplicates.length +
  en.notUppercase.length +
  en.nonAZ.length;

process.exit(totalIssues === 0 ? 0 : 1);
