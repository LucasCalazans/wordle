import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { GamePhase } from 'wordle-engine';
import { useTheme } from '../ThemeProvider';

export interface EndGameModalProps {
  visible: boolean;
  phase: Extract<GamePhase, 'won' | 'lost'>;
  attempts: number;
  targetWord: string;
  title: string;
  message: string;
  ctaLabel: string;
  /** Texto curto explicando o que a palavra significa (opcional). */
  explanation?: string | null;
  /** Label "A palavra era:" mostrada acima do reveal. */
  wordRevealLabel?: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

export function EndGameModal({
  visible,
  targetWord,
  title,
  message,
  ctaLabel,
  explanation,
  wordRevealLabel,
  onClose,
  onPlayAgain,
}: EndGameModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        onPress={onClose}
        style={[styles.backdrop, { backgroundColor: theme.colors.modal.backdrop }]}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.surface,
            {
              backgroundColor: theme.colors.modal.surface,
              padding: theme.spacing.padding * 2,
            },
          ]}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.title,
              fontWeight: '700',
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.title,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: theme.typography.sizes.body,
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginBottom: explanation ? 16 : 24,
            }}
          >
            {message}
          </Text>

          {explanation ? (
            <View
              style={[
                styles.explainBox,
                { backgroundColor: theme.colors.surface, marginBottom: 20 },
              ]}
            >
              <Text
                style={{
                  fontSize: theme.typography.sizes.body - 2,
                  color: theme.colors.textMuted,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {wordRevealLabel ?? targetWord.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.body,
                  color: theme.colors.text,
                  textAlign: 'left',
                  lineHeight: theme.typography.sizes.body * 1.4,
                }}
              >
                {explanation}
              </Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={onPlayAgain}
            style={({ pressed }) => [
              styles.cta,
              { backgroundColor: theme.colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: theme.typography.sizes.body,
                fontWeight: '700',
              }}
            >
              {ctaLabel}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  surface: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  explainBox: {
    padding: 12,
    borderRadius: 8,
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});
