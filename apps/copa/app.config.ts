import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Copa Letras',
  slug: 'copa-letras',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  primaryColor: '#2E7D32',
  platforms: ['android', 'ios'],
  assetBundlePatterns: ['**/*'],
  icon: './assets/icon.png',
  plugins: [
    'expo-font',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E7D32',
        image: './assets/splash-icon.png',
        imageWidth: 200,
      },
    ],
  ],
  android: {
    package: 'com.prism.copaletras',
    versionCode: 1,
    permissions: [],
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E7D32',
    },
  },
  ios: {
    bundleIdentifier: 'com.prism.copaletras',
    buildNumber: '1',
    supportsTablet: true,
  },
};

export default config;
