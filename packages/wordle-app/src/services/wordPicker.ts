import { selectRandomWord } from 'wordle-engine';

/**
 * Sorteio com dois tiers:
 *  - Se houver `primary` (subconjunto de `all`), prefere sortear dele.
 *  - Quando todas as palavras de `primary` estiverem em `used`, cai
 *    pro complemento (`all - primary`) — o "tier 2".
 *  - Se tudo estiver em `used`, chama `onResetUsed()` (pra zerar) e
 *    re-sorteia de primary (ou de all se não há primary).
 *
 * Garante:
 *  - Jamais repete palavra enquanto houver inéditas disponíveis (no
 *    tier corrente).
 *  - Primary esgota completamente antes de tocar em secondary.
 *  - Quando tudo esgota, faz "rotação": reset + re-início no tier 1.
 */
export function pickNext(args: {
  all: readonly string[];
  primary?: readonly string[];
  used: readonly string[];
  onResetUsed: () => void;
}): string {
  const { all, primary, used, onResetUsed } = args;
  const usedSet = new Set(used);

  if (primary && primary.length > 0) {
    const availPrimary = primary.filter((w) => !usedSet.has(w));
    if (availPrimary.length > 0) return selectRandomWord(availPrimary);

    // Primary esgotado → tenta secundário (= all - primary - used)
    const primarySet = new Set(primary);
    const availSecondary = all.filter(
      (w) => !primarySet.has(w) && !usedSet.has(w),
    );
    if (availSecondary.length > 0) return selectRandomWord(availSecondary);

    // Tudo esgotado — reseta usedWords e começa de novo pelo primary
    onResetUsed();
    return selectRandomWord(primary);
  }

  // Sem tier — apenas evita already-used
  const avail = all.filter((w) => !usedSet.has(w));
  if (avail.length > 0) return selectRandomWord(avail);

  onResetUsed();
  return selectRandomWord(all);
}
