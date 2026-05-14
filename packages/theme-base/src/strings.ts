import type { UiStrings } from './types';

export const baseStringsPt: UiStrings = {
  appTitle: 'Termo',
  newGame: 'Jogar de novo',
  win: {
    title: 'Você venceu!',
    message: 'Acertou em {attempts} tentativa(s)',
  },
  lose: {
    title: 'Não foi dessa vez',
    message: 'A palavra era {word}',
  },
  errors: {
    tooShort: 'Faltam letras',
    invalidWord: 'Palavra não encontrada',
  },
  language: {
    label: 'Idioma',
    pt: 'Português',
    en: 'Inglês',
    switchConfirm: {
      title: 'Trocar idioma?',
      message: 'A partida atual será descartada.',
      keep: 'Manter idioma',
      discard: 'Trocar mesmo assim',
    },
  },
};

export const baseStringsEn: UiStrings = {
  appTitle: 'Wordle',
  newGame: 'Play again',
  win: {
    title: 'You won!',
    message: 'Solved in {attempts} attempt(s)',
  },
  lose: {
    title: 'Better luck next time',
    message: 'The word was {word}',
  },
  errors: {
    tooShort: 'Not enough letters',
    invalidWord: 'Word not in list',
  },
  language: {
    label: 'Language',
    pt: 'Portuguese',
    en: 'English',
    switchConfirm: {
      title: 'Switch language?',
      message: 'Your current game will be discarded.',
      keep: 'Keep language',
      discard: 'Switch anyway',
    },
  },
};
