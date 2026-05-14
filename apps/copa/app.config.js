/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: 'Copa Letras',
  slug: 'copa-letras',
  version: '1.0.0',
  owner: 'skab',
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
  extra: {
    eas: {
      projectId: 'fd18d319-2657-4f61-9bfe-f95e17b00f5c',
    },
  },
};
