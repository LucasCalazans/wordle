import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../services/storage';

const KEY_PREFIX = '@wordle/used';

/**
 * Track targets already shown to the player, per `themeId+locale`.
 * Hidratado do AsyncStorage no boot; persistido em cada mark/reset.
 *
 * O picker em `GameScreen` usa esses dados para evitar repetir palavras
 * até esgotar o tier primário; depois cai pro secundário; depois
 * `reset()` zera tudo e o ciclo recomeça.
 */
export function usePersistedUsedWords(themeId: string, locale: string) {
  const key = `${KEY_PREFIX}/${themeId}/${locale}`;
  const [used, setUsed] = useState<readonly string[]>([]);
  const [loaded, setLoaded] = useState(false);
  // ref evita stale closures em markUsed/reset
  const usedRef = useRef(used);
  usedRef.current = used;

  useEffect(() => {
    let active = true;
    setLoaded(false);
    (async () => {
      const raw = await storage.get(key);
      if (!active) return;
      let parsed: readonly string[] = [];
      if (raw) {
        try {
          const j: unknown = JSON.parse(raw);
          if (Array.isArray(j)) {
            parsed = j.filter((x): x is string => typeof x === 'string');
          }
        } catch {
          // corrupted entry → ignore, start fresh
        }
      }
      setUsed(parsed);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [key]);

  const markUsed = useCallback(
    (word: string) => {
      if (usedRef.current.includes(word)) return;
      const next = [...usedRef.current, word];
      usedRef.current = next;
      setUsed(next);
      void storage.set(key, JSON.stringify(next));
    },
    [key],
  );

  const reset = useCallback(() => {
    usedRef.current = [];
    setUsed([]);
    void storage.remove(key);
  }, [key]);

  return { used, loaded, markUsed, reset };
}
