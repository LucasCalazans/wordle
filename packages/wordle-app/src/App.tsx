import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <GameScreen
          key={locale}
          locale={locale}
          onChangeLocale={setLocale}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
