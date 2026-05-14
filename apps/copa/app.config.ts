import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Termo Copa',
  slug: 'wordle-copa',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  platforms: ['android', 'ios'],
  assetBundlePatterns: ['**/*'],
  plugins: ['expo-font', 'expo-localization'],
  android: {
    package: 'com.prism.wordlecopa',
  },
  ios: {
    bundleIdentifier: 'com.prism.wordlecopa',
    supportsTablet: true,
  },
};

export default config;
