export type RandomSource = () => number;

/**
 * Pick a random word. Random source is injectable for deterministic tests.
 */
export function selectRandomWord(
  words: readonly string[],
  random: RandomSource = Math.random,
): string {
  if (words.length === 0) {
    throw new Error('Word list is empty');
  }
  const index = Math.floor(random() * words.length);
  return words[index]!;
}

/**
 * Pick a word avoiding the most-recent ones. Useful to prevent immediate repeats.
 */
export function selectAvoiding(
  words: readonly string[],
  recent: readonly string[],
  random: RandomSource = Math.random,
): string {
  const available = words.filter((w) => !recent.includes(w));
  const pool = available.length > 0 ? available : words;
  return selectRandomWord(pool, random);
}
