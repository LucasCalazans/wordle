import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import type { WordleTheme } from 'theme-base';
import { ThemeProvider } from 'wordle-ui';
import { usePersistedLanguage } from './hooks/usePersistedLanguage';
import { GameScreen } from './screens/GameScreen';
import { useThemeFonts } from './services/fontLoader';

export interface WordleAppProps {
  theme: WordleTheme;
}

/**
 * Entry component for a Wordle app variant. Themed apps in `apps/X` only
 * need to do `<WordleApp theme={someTheme} />` to get the full game.
 */
export function WordleApp({ theme }: WordleAppProps) {
  const fontsLoaded = useThemeFonts(theme);
  const { locale, loaded: localeLoaded, setLocale } = usePersistedLanguage();

  if (!fontsLoaded || !localeLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <GameScreen
        key={locale}
        locale={locale}
        onChangeLocale={setLocale}
      />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
