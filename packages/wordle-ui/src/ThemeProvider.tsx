import { createContext, useContext, type ReactNode } from 'react';
import type { WordleTheme } from 'theme-base';

const ThemeContext = createContext<WordleTheme | null>(null);

export interface ThemeProviderProps {
  theme: WordleTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): WordleTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be called within a <ThemeProvider>');
  }
  return ctx;
}
