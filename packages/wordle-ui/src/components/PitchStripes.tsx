import { StyleSheet, View } from 'react-native';
import { useTheme } from '../ThemeProvider';

export interface PitchStripesProps {
  /** Quantidade de stripes horizontais. Default 12. */
  count?: number;
}

/**
 * Padrão lembrando campo de futebol visto de cima — alternância sutil
 * de duas tonalidades muito claras do `colors.primary` do tema.
 *
 * Renderizado em position:absolute (StyleSheet.absoluteFillObject), com
 * pointerEvents desabilitado. Vai como primeiro child de algum container.
 */
export function PitchStripes({ count = 12 }: PitchStripesProps) {
  const theme = useTheme();
  // Mistura primary com branco em proporções altas → tons quase brancos
  // com leve nuance verde. O contraste entre as duas tonalidades é discreto
  // de propósito (o board precisa se destacar).
  const colorA = mix(theme.colors.primary, '#FFFFFF', 0.92);
  const colorB = mix(theme.colors.primary, '#FFFFFF', 0.86);

  return (
    <View pointerEvents="none" style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{ flex: 1, backgroundColor: i % 2 === 0 ? colorA : colorB }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

/**
 * Linear mix entre dois hexadecimais. t ∈ [0,1]: 0 = só hex, 1 = só other.
 * Retorna no formato 'rgb(r, g, b)' (compat com RN style).
 */
function mix(hex: string, other: string, t: number): string {
  const a = parseHex(hex);
  const b = parseHex(other);
  const r = Math.round(a[0] * (1 - t) + b[0] * t);
  const g = Math.round(a[1] * (1 - t) + b[1] * t);
  const bb = Math.round(a[2] * (1 - t) + b[2] * t);
  return `rgb(${r}, ${g}, ${bb})`;
}

function parseHex(hex: string): readonly [number, number, number] {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1]!, 16), parseInt(m[2]!, 16), parseInt(m[3]!, 16)] as const;
}
