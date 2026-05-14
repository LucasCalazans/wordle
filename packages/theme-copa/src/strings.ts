import type { UiStrings } from 'theme-base';

/**
 * Sobrescritas de strings PT-BR para o clima de Copa do Mundo.
 * Apenas chaves que mudam em relação ao tema base (resto cai pro default
 * via shallow-merge no `resolveStrings`).
 */
export const copaStringsPt: Partial<UiStrings> = {
  appTitle: 'Termo Copa',
  newGame: 'Próxima partida',
  win: {
    title: 'GOOOOOL!',
    message: 'Show de bola — em {attempts} chute(s)',
  },
  lose: {
    title: 'Bola fora',
    message: 'A palavra era {word}',
  },
};

export const copaStringsEn: Partial<UiStrings> = {
  appTitle: 'Wordle Cup',
  newGame: 'Next match',
  win: {
    title: 'GOOOOOAL!',
    message: 'Top form — solved in {attempts} kick(s)',
  },
  lose: {
    title: 'Off target',
    message: 'The word was {word}',
  },
};
