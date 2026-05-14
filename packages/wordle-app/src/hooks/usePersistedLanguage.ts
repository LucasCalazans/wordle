import * as Localization from 'expo-localization';
import { useCallback, useEffect, useState } from 'react';
import type { Locale } from 'theme-base';
import { storage } from '../services/storage';

const STORAGE_KEY = '@wordle/language';

function detectSystemLocale(): Locale {
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageCode;
  return primary === 'pt' ? 'pt' : 'en';
}

export function usePersistedLanguage() {
  const [locale, setLocaleState] = useState<Locale>(detectSystemLocale);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await storage.get(STORAGE_KEY);
      if (active && (saved === 'pt' || saved === 'en')) {
        setLocaleState(saved);
      }
      if (active) setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    await storage.set(STORAGE_KEY, next);
  }, []);

  return { locale, loaded, setLocale };
}
