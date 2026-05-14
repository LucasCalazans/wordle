import type { WordleTheme } from 'theme-base';
import { wordsValidEn, wordsValidPt } from 'theme-base';
import { copaExplanationsEn, copaExplanationsPt } from './explanations';
import { copaStringsEn, copaStringsPt } from './strings';
import { wordsCopaEn } from './words.copa.en';
import { wordsCopaPrimaryEn } from './words.copa.primary.en';
import { wordsCopaPrimaryPt } from './words.copa.primary.pt';
import { wordsCopaPt } from './words.copa.pt';

/**
 * Tema Copa do Mundo — paleta gramado verde-mato + branco.
 *
 * `wordList.pt`/`en` = lista completa de targets (79 PT / 76 EN). Esses
 * arrays cobrem 6 categorias hand-curated: seleções participantes,
 * capitais dos países das seleções, cidades-sede 2026, jogadores BR/intl
 * icônicos, técnicos relevantes, termos do esporte. Geradas por
 * scripts/collect-targets.ts a partir de dados crus hand-curated.
 *
 * `wordList.primary` = subconjunto Copa-direto (seleções + jogadores +
 * técnicos + termos). O picker sorteia exclusivamente daqui até esgotar;
 * só então cai pra "secondary" (capitais + cidades-sede). Persistência
 * em AsyncStorage (`usePersistedUsedWords`).
 *
 * `wordList.validGuesses` = reuso do theme-base (9979 PT + 15921 EN) —
 * UX permissiva: jogador chuta qualquer palavra real.
 *
 * `explanations` = mapa palavra → frase curta. Exibido no modal de fim
 * de jogo. Função pedagógica: "joguei TUNIS sem saber, aprendi que é a
 * capital da Tunísia".
 */
export const copaTheme: WordleTheme = {
  id: 'copa',
  name: { pt: 'Termo Copa', en: 'Wordle Cup' },

  colors: {
    background: '#FFFFFF',
    surface: '#F1F8E9',
    text: '#1B1B1B',
    textMuted: '#607D8B',
    primary: '#2E7D32',
    border: '#BDBDBD',
    tile: {
      empty: '#FFFFFF',
      correct: '#2E7D32',
      present: '#FBC02D',
      absent: '#6D7C82',
      borderIdle: '#BDBDBD',
      borderActive: '#4CAF50',
      textOnFilled: '#FFFFFF',
      textOnEmpty: '#1B1B1B',
    },
    key: {
      default: '#ECEFF1',
      correct: '#2E7D32',
      present: '#FBC02D',
      absent: '#6D7C82',
      text: '#1B1B1B',
      textOnFilled: '#FFFFFF',
    },
    modal: {
      backdrop: 'rgba(0, 0, 0, 0.55)',
      surface: '#FFFFFF',
    },
  },

  typography: {
    fontFamily: { regular: 'System', bold: 'System', title: 'System' },
    sizes: { title: 28, body: 16, tile: 32, key: 18 },
  },

  spacing: { tileGap: 5, rowGap: 5, padding: 12 },

  assets: {
    backgroundPattern: require('../assets/grass-portrait.jpg'),
  },

  wordList: {
    pt: wordsCopaPt,
    en: wordsCopaEn,
    primary: {
      pt: wordsCopaPrimaryPt,
      en: wordsCopaPrimaryEn,
    },
    validGuesses: {
      pt: wordsValidPt,
      en: wordsValidEn,
    },
  },

  strings: {
    pt: copaStringsPt,
    en: copaStringsEn,
  },

  background: { kind: 'image', opacity: 0.55 },

  explanations: {
    pt: copaExplanationsPt,
    en: copaExplanationsEn,
  },

  animations: {
    flipDuration: 300,
    shakeIntensity: 8,
  },
};
