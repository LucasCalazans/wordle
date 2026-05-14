/**
 * Sanity check para listas do theme-copa.
 * Valida targets (pt/en) e confirma que validGuesses do theme-base permanece OK.
 */
import { wordsCopaPt } from '../src/words.copa.pt';
import { wordsCopaEn } from '../src/words.copa.en';

interface Report {
  total: number;
  notFiveChars: string[];
  duplicates: string[];
  notUppercase: string[];
  nonAZ: string[];
}

function audit(list: readonly string[]): Report {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const w of list) {
    if (seen.has(w)) dups.add(w);
    else seen.add(w);
  }
  return {
    total: list.length,
    notFiveChars: list.filter((w) => w.length !== 5),
    duplicates: [...dups],
    notUppercase: list.filter((w) => w !== w.toUpperCase()),
    nonAZ: list.filter((w) => !/^[A-Z]+$/.test(w)),
  };
}

function format(label: string, r: Report): string {
  const issues =
    r.notFiveChars.length + r.duplicates.length + r.notUppercase.length + r.nonAZ.length;
  const head = `[${label}] total=${r.total} issues=${issues}`;
  if (issues === 0) return `${head} OK`;
  const lines = [head];
  if (r.notFiveChars.length) lines.push(`  notFiveChars: ${r.notFiveChars.join(', ')}`);
  if (r.duplicates.length) lines.push(`  duplicates: ${r.duplicates.join(', ')}`);
  if (r.notUppercase.length) lines.push(`  notUppercase: ${r.notUppercase.join(', ')}`);
  if (r.nonAZ.length) lines.push(`  nonAZ: ${r.nonAZ.join(', ')}`);
  return lines.join('\n');
}

const pt = audit(wordsCopaPt);
const en = audit(wordsCopaEn);
console.log(format('PT Copa targets', pt));
console.log(format('EN Copa targets', en));

const issues =
  pt.notFiveChars.length + pt.duplicates.length + pt.notUppercase.length + pt.nonAZ.length +
  en.notFiveChars.length + en.duplicates.length + en.notUppercase.length + en.nonAZ.length;
process.exit(issues === 0 ? 0 : 1);
