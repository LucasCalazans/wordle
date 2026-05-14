import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LetterState } from 'wordle-engine';
import { useTheme } from '../ThemeProvider';

export type KeyValue = string | 'ENTER' | 'BACK';

export interface KeyProps {
  value: KeyValue;
  state?: LetterState;
  onPress: (value: KeyValue) => void;
  flex?: number;
  label?: string;
}

export function Key({ value, state = 'empty', onPress, flex = 1, label }: KeyProps) {
  const theme = useTheme();

  const isFilledState =
    state === 'correct' || state === 'present' || state === 'absent';
  const bg = isFilledState ? theme.colors.key[state] : theme.colors.key.default;
  const color = isFilledState ? theme.colors.key.textOnFilled : theme.colors.key.text;

  const display = label ?? (value === 'BACK' ? '⌫' : value === 'ENTER' ? '↵' : value);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Key ${value}`}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        styles.key,
        { backgroundColor: bg, flex, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View pointerEvents="none">
        <Text
          style={{
            color,
            fontSize: theme.typography.sizes.key,
            fontFamily: theme.typography.fontFamily.bold,
            fontWeight: '700',
          }}
        >
          {display}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    minHeight: 52,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
});
