import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Wordle Classic',
  slug: 'wordle-classic',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  platforms: ['android', 'ios'],
  assetBundlePatterns: ['**/*'],
  plugins: ['expo-font', 'expo-localization'],
  android: {
    package: 'com.prism.wordleclassic',
  },
  ios: {
    bundleIdentifier: 'com.prism.wordleclassic',
    supportsTablet: true,
  },
};

export default config;
