import {
  baseStringsEn,
  baseStringsPt,
  type Locale,
  type UiStrings,
  type WordleTheme,
} from 'theme-base';

const BASE: Record<Locale, UiStrings> = {
  pt: baseStringsPt,
  en: baseStringsEn,
};

/**
 * Merge base strings for a locale with optional theme overrides.
 * Deep merge is limited to one level of nested objects (enough for UiStrings shape).
 */
export function resolveStrings(theme: WordleTheme, locale: Locale): UiStrings {
  const base = BASE[locale];
  const override = theme.strings?.[locale];
  if (!override) return base;
  return {
    appTitle: override.appTitle ?? base.appTitle,
    newGame: override.newGame ?? base.newGame,
    win: { ...base.win, ...override.win },
    lose: { ...base.lose, ...override.lose },
    errors: { ...base.errors, ...override.errors },
    language: {
      ...base.language,
      ...override.language,
      switchConfirm: {
        ...base.language.switchConfirm,
        ...override.language?.switchConfirm,
      },
    },
  };
}

/** Replaces `{key}` placeholders. Safe with missing keys (renders empty). */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    return v === undefined || v === null ? '' : String(v);
  });
}
