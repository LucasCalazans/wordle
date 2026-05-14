import type { WordleTheme } from 'theme-base';
import { wordsValidEn, wordsValidPt } from 'theme-base';
import { copaStringsEn, copaStringsPt } from './strings';
import { wordsCopaEn } from './words.copa.en';
import { wordsCopaPt } from './words.copa.pt';

/**
 * Tema Copa do Mundo — paleta gramado verde-mato + branco.
 *
 * `wordList.pt` e `wordList.en` são targets EXCLUSIVOS do tema (nenhuma
 * palavra do theme-base aparece como resposta). Já `validGuesses` reusa
 * os arrays do theme-base — o jogador pode chutar qualquer palavra real
 * do PT/EN como exploração, mesmo que nunca seja resposta.
 */
export const copaTheme: WordleTheme = {
  id: 'copa',
  name: { pt: 'Termo Copa', en: 'Wordle Cup' },

  colors: {
    background: '#FFFFFF',
    surface: '#F1F8E9', // gramado claro (BG cards/modais sutil)
    text: '#1B1B1B',
    textMuted: '#607D8B',
    primary: '#2E7D32', // gramado verde-mato (header, CTA)
    border: '#BDBDBD',
    tile: {
      empty: '#FFFFFF',
      correct: '#2E7D32', // gramado para acerto
      present: '#FBC02D', // amarelo cartão para palpite presente
      absent: '#6D7C82', // slate para ausente
      borderIdle: '#BDBDBD',
      borderActive: '#4CAF50', // verde-claro quando digitando
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

  assets: {},

  wordList: {
    pt: wordsCopaPt,
    en: wordsCopaEn,
    validGuesses: {
      pt: wordsValidPt, // 9979 palavras PT como pool de palpites válidos
      en: wordsValidEn, // 15921 palavras EN como pool de palpites válidos
    },
  },

  strings: {
    pt: copaStringsPt,
    en: copaStringsEn,
  },

  animations: {
    flipDuration: 300,
    shakeIntensity: 8,
  },
};
