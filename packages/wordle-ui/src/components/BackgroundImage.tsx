import { Image, StyleSheet, View } from 'react-native';
import type { ImageSource } from 'theme-base';

export interface BackgroundImageProps {
  source: ImageSource;
  /** 0..1. Útil para amenizar texturas chamativas. Default 1. */
  opacity?: number;
}

/**
 * Imagem fixa cobrindo todo o pai (StyleSheet.absoluteFillObject),
 * com `resizeMode: cover` (preserva proporção, recorta excedente).
 * pointerEvents disabled — fica atrás sem interceptar gestos.
 *
 * Para o tema Copa, usado com grass-portrait.jpg (textura de gramado
 * rotacionada em build-time para retrato).
 */
export function BackgroundImage({ source, opacity = 1 }: BackgroundImageProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Image
        source={source}
        style={[styles.image, { opacity }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
