export type Locale = 'pt' | 'en';

/**
 * Matches what `require('./asset.png')` returns in React Native (a number)
 * or a remote URI object. We avoid depending on react-native here.
 */
export type ImageSource = number | { uri: string };

export type FontAsset = number | { uri: string };

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  border: string;
  tile: {
    empty: string;
    correct: string;
    present: string;
    absent: string;
    borderIdle: string;
    borderActive: string;
    textOnFilled: string;
    textOnEmpty: string;
  };
  key: {
    default: string;
    correct: string;
    present: string;
    absent: string;
    text: string;
    textOnFilled: string;
  };
  modal: {
    backdrop: string;
    surface: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    bold: string;
    title: string;
  };
  sizes: {
    title: number;
    body: number;
    tile: number;
    key: number;
  };
}

export interface ThemeSpacing {
  tileGap: number;
  rowGap: number;
  padding: number;
}

export interface ThemeAssets {
  logoHeader?: ImageSource;
  icon?: ImageSource;
  splash?: ImageSource;
  backgroundPattern?: ImageSource;
}

export interface UiStrings {
  appTitle: string;
  newGame: string;
  win: {
    title: string;
    /** `{attempts}` is replaced at runtime. */
    message: string;
  };
  lose: {
    title: string;
    /** `{word}` is replaced at runtime. */
    message: string;
  };
  errors: {
    tooShort: string;
    invalidWord: string;
  };
  language: {
    label: string;
    pt: string;
    en: string;
    switchConfirm: {
      title: string;
      message: string;
      keep: string;
      discard: string;
    };
  };
}

export interface ThemeWordList {
  pt: readonly string[];
  en: readonly string[];
}

export interface ThemeGameConfig {
  wordLength?: number;
  maxAttempts?: number;
}

export interface ThemeAnimations {
  flipDuration?: number;
  shakeIntensity?: number;
}

export interface WordleTheme {
  id: string;
  name: Record<Locale, string>;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  assets: ThemeAssets;
  fonts?: Record<string, FontAsset>;
  wordList: ThemeWordList;
  /** Optional UI string overrides per locale. Shallow-merged onto base strings at runtime. */
  strings?: Partial<Record<Locale, Partial<UiStrings>>>;
  gameConfig?: ThemeGameConfig;
  animations?: ThemeAnimations;
}
