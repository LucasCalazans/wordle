import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: '5 Letras',
  slug: 'cinco-letras',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  primaryColor: '#2F80ED',
  platforms: ['android', 'ios'],
  assetBundlePatterns: ['**/*'],
  icon: './assets/icon.png',
  plugins: [
    'expo-font',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F6F7F2',
        image: './assets/splash-icon.png',
        imageWidth: 200,
      },
    ],
  ],
  android: {
    package: 'com.prism.cincoletras',
    versionCode: 1,
    permissions: [],
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F6F7F2',
    },
  },
  ios: {
    bundleIdentifier: 'com.prism.cincoletras',
    buildNumber: '1',
    supportsTablet: true,
  },
};

export default config;
