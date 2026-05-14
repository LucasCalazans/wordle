import { baseStringsEn, baseStringsPt } from './strings';
import type { WordleTheme } from './types';
import { wordsEn } from './words.en';
import { wordsPt } from './words.pt';

export const baseTheme: WordleTheme = {
  id: 'base',
  name: { pt: 'Termo', en: 'Wordle' },
  colors: {
    background: '#FFFFFF',
    surface: '#F7F7F7',
    text: '#1A1A1B',
    textMuted: '#787C7E',
    primary: '#2F80ED',
    border: '#D3D6DA',
    tile: {
      empty: '#FFFFFF',
      correct: '#6AAA64',
      present: '#C9B458',
      absent: '#787C7E',
      borderIdle: '#D3D6DA',
      borderActive: '#878A8C',
      textOnFilled: '#FFFFFF',
      textOnEmpty: '#1A1A1B',
    },
    key: {
      default: '#D3D6DA',
      correct: '#6AAA64',
      present: '#C9B458',
      absent: '#787C7E',
      text: '#1A1A1B',
      textOnFilled: '#FFFFFF',
    },
    modal: {
      backdrop: 'rgba(0, 0, 0, 0.5)',
      surface: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      bold: 'System',
      title: 'System',
    },
    sizes: {
      title: 28,
      body: 16,
      tile: 32,
      key: 18,
    },
  },
  spacing: {
    tileGap: 5,
    rowGap: 5,
    padding: 12,
  },
  assets: {},
  wordList: {
    pt: wordsPt,
    en: wordsEn,
  },
  strings: {
    pt: baseStringsPt,
    en: baseStringsEn,
  },
  animations: {
    flipDuration: 300,
    shakeIntensity: 8,
  },
};
