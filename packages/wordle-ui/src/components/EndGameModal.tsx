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
  onClose: () => void;
  onPlayAgain: () => void;
}

export function EndGameModal({
  visible,
  title,
  message,
  ctaLabel,
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
            { backgroundColor: theme.colors.modal.surface, padding: theme.spacing.padding * 2 },
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
              marginBottom: 24,
            }}
          >
            {message}
          </Text>
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
  cta: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});
