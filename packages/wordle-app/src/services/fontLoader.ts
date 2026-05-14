import { useFonts } from 'expo-font';
import type { WordleTheme } from 'theme-base';

/**
 * Loads any custom fonts declared by the theme. Returns true once ready
 * (or immediately when the theme has no custom fonts).
 */
export function useThemeFonts(theme: WordleTheme): boolean {
  const [loaded] = useFonts(theme.fonts ?? {});
  return loaded;
}
