import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Locale } from 'theme-base';
import {
  Board,
  EndGameModal,
  Header,
  Keyboard,
  Toast,
  useTheme,
  type KeyValue,
} from 'wordle-ui';
import { useGame } from '../hooks/useGame';
import { interpolate, resolveStrings } from '../i18n';

export interface GameScreenProps {
  locale: Locale;
  onChangeLocale: (next: Locale) => void;
}

export function GameScreen({ locale, onChangeLocale }: GameScreenProps) {
  const theme = useTheme();
  const strings = useMemo(() => resolveStrings(theme, locale), [theme, locale]);

  const wordList = theme.wordList[locale];

  const validSet = useMemo(() => {
    const extra = theme.wordList.validGuesses?.[locale] ?? [];
    return new Set<string>([...wordList, ...extra]);
  }, [wordList, theme.wordList.validGuesses, locale]);

  const config = useMemo(
    () => ({
      wordLength: theme.gameConfig?.wordLength,
      maxAttempts: theme.gameConfig?.maxAttempts,
      isValidGuess: (g: string) => validSet.has(g),
    }),
    [theme.gameConfig?.wordLength, theme.gameConfig?.maxAttempts, validSet],
  );

  const { state, shakeKey, addLetter, removeLetter, submit, reset } = useGame({
    wordList,
    config,
  });

  const errorMessage = useMemo(() => {
    if (state.lastRejection === 'too_short') return strings.errors.tooShort;
    if (state.lastRejection === 'invalid_word') return strings.errors.invalidWord;
    return '';
  }, [state.lastRejection, strings.errors]);

  const handleKey = (k: KeyValue) => {
    if (k === 'ENTER') submit();
    else if (k === 'BACK') removeLetter();
    else addLetter(k);
  };

  const handleLanguagePress = () => {
    const next: Locale = locale === 'pt' ? 'en' : 'pt';
    const hasProgress =
      state.guesses.length > 0 || state.currentGuess.length > 0;
    if (state.phase === 'playing' && hasProgress) {
      Alert.alert(
        strings.language.switchConfirm.title,
        strings.language.switchConfirm.message,
        [
          { text: strings.language.switchConfirm.keep, style: 'cancel' },
          {
            text: strings.language.switchConfirm.discard,
            style: 'destructive',
            onPress: () => onChangeLocale(next),
          },
        ],
      );
    } else {
      onChangeLocale(next);
    }
  };

  const isEnd = state.phase === 'won' || state.phase === 'lost';

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={strings.appTitle}
        locale={locale}
        onLanguagePress={handleLanguagePress}
      />
      <Toast showKey={shakeKey} message={errorMessage} />
      <View style={styles.boardArea}>
        <Board
          guesses={state.guesses}
          currentGuess={state.currentGuess}
          wordLength={state.config.wordLength}
          maxAttempts={state.config.maxAttempts}
          shakeKey={shakeKey}
        />
      </View>
      <View style={[styles.keyboardArea, { paddingBottom: theme.spacing.padding }]}>
        <Keyboard letterStates={state.letterStates} onPress={handleKey} />
      </View>

      {isEnd ? (
        <EndGameModal
          visible
          phase={state.phase === 'won' ? 'won' : 'lost'}
          attempts={state.guesses.length}
          targetWord={state.target}
          title={state.phase === 'won' ? strings.win.title : strings.lose.title}
          message={
            state.phase === 'won'
              ? interpolate(strings.win.message, { attempts: state.guesses.length })
              : interpolate(strings.lose.message, { word: state.target.toUpperCase() })
          }
          ctaLabel={strings.newGame}
          onClose={reset}
          onPlayAgain={reset}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boardArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  keyboardArea: {
    paddingHorizontal: 4,
  },
});
