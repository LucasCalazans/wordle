import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Locale } from 'theme-base';
import { useTheme } from '../ThemeProvider';

export interface HeaderProps {
  title: string;
  locale: Locale;
  onLanguagePress: () => void;
}

const FLAG: Record<Locale, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
};

export function Header({ title, locale, onLanguagePress }: HeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.padding,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.spacer} />
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          fontWeight: '800',
          color: theme.colors.text,
          fontFamily: theme.typography.fontFamily.title,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Idioma: ${locale}`}
        onPress={onLanguagePress}
        style={({ pressed }) => [styles.langButton, { opacity: pressed ? 0.6 : 1 }]}
        hitSlop={12}
      >
        <Text style={{ fontSize: 24 }}>{FLAG[locale]}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  spacer: {
    width: 32,
  },
  langButton: {
    width: 32,
    alignItems: 'center',
  },
});
