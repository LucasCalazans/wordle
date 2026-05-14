/**
 * Coleta candidatos a target words para o theme-copa.
 *
 * Foco: termos da Copa do Mundo (2026 prioritário, expandindo pras edições
 * passadas — 1930 a 2022 — quando faltam palavras na atual).
 *
 * Entrada: dicionário de categorias com entradas hand-curated.
 * Processo: normaliza (uppercase, sem diacríticos), filtra pra 5 letras A-Z,
 * dedupa, registra origem (qual categoria cada palavra veio).
 * Saída: report no console + arquivo JSON em tmp/copa-candidates.json
 *
 * Iteração: edite as categorias abaixo, re-rode, repita até a curadoria
 * estabilizar.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DIACRITICS = /[̀-ͯ]/g;
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
}

function fiveLetterOnly(words: readonly string[]): string[] {
  const out = new Set<string>();
  for (const raw of words) {
    const n = normalize(raw);
    if (n.length === 5 && /^[A-Z]+$/.test(n)) out.add(n);
  }
  return [...out];
}

// ─────────────────────────────────────────────────────────────────────────────
// PT-BR — categorias com prioridade pra Copa 2026, expandindo às anteriores
// ─────────────────────────────────────────────────────────────────────────────

const PT = {
  // Nações já classificadas/qualifying Copa 2026
  paises2026: [
    'Brasil', 'Argentina', 'Uruguai', 'Colômbia', 'Equador', 'Paraguai',
    'México', 'Estados Unidos', 'Canadá', 'Honduras', 'Panamá', 'Jamaica',
    'Costa Rica',
    'Espanha', 'França', 'Alemanha', 'Inglaterra', 'Itália', 'Portugal',
    'Holanda', 'Bélgica', 'Croácia', 'Dinamarca', 'Suíça', 'Polônia',
    'Sérvia', 'Áustria', 'Tchéquia', 'Eslovênia', 'Hungria', 'Noruega',
    'Suécia', 'Turquia', 'Albânia',
    'Japão', 'Coreia', 'Arábia Saudita', 'Irã', 'Iraque', 'Austrália',
    'Uzbequistão', 'Jordânia',
    'Senegal', 'Marrocos', 'Egito', 'Argélia', 'Tunísia', 'Gana', 'Nigéria',
    'Camarões',
    'Nova Zelândia',
  ],
  // Capitais dos países acima
  capitais2026: [
    'Washington', 'Cidade do México', 'Ottawa',
    'Brasília', 'Buenos Aires', 'Montevidéu', 'Bogotá', 'Quito', 'Assunção',
    'Tegucigalpa', 'Cidade do Panamá', 'Kingston',
    'Madri', 'Paris', 'Berlim', 'Londres', 'Roma', 'Lisboa',
    'Amsterdã', 'Bruxelas', 'Zagreb', 'Copenhague', 'Berna', 'Varsóvia',
    'Belgrado', 'Viena', 'Praga', 'Liubliana', 'Budapeste', 'Oslo',
    'Estocolmo', 'Ancara', 'Tirana',
    'Tóquio', 'Seul', 'Riade', 'Teerã', 'Bagdá', 'Camberra',
    'Tashkent', 'Amã',
    'Dakar', 'Rabat', 'Cairo', 'Argel', 'Túnis', 'Acra', 'Abuja',
    'Yaoundé',
    'Wellington',
  ],
  // Cidades-sede Copa 2026 (EUA, México, Canadá)
  cidadesSede2026: [
    'Atlanta', 'Boston', 'Dallas', 'Houston', 'Kansas', 'Los Angeles',
    'Miami', 'New Jersey', 'Filadélfia', 'San Francisco', 'Seattle',
    'Cidade do México', 'Guadalajara', 'Monterrey',
    'Toronto', 'Vancouver',
  ],
  // Países anfitriões / campeões das Copas passadas (1930-2022)
  paisesPastCopa: [
    'Uruguai', 'Itália', 'Brasil', 'Alemanha', 'Argentina', 'Inglaterra',
    'França', 'Espanha',
    'México', 'Chile', 'Suécia', 'Suíça', 'Rússia', 'Catar',
    'Coreia', 'Japão', 'África do Sul',
  ],

  // Jogadores brasileiros (eternos + atuais)
  jogadoresBR: [
    // Eternos (Copas passadas)
    'Pelé', 'Garrincha', 'Tostão', 'Sócrates', 'Rivellino', 'Jairzinho',
    'Zico', 'Falcão', 'Cerezo', 'Junior', 'Leonardo', 'Müller',
    // 90s/00s (94 / 02 / 06)
    'Romário', 'Bebeto', 'Dunga', 'Taffarel', 'Branco', 'Cafu', 'Roberto',
    'Aldair', 'Mauro Silva', 'Ronaldo', 'Rivaldo', 'Ronaldinho', 'Adriano',
    'Kaká', 'Lúcio', 'Roque Júnior', 'Júlio César', 'Maicon', 'Edmilson',
    'Gilberto', 'David Luiz', 'Marcos', 'Elano', 'Felipe Melo',
    // Atuais
    'Neymar', 'Vinicius', 'Rodrygo', 'Casemiro', 'Marquinhos', 'Thiago Silva',
    'Alisson', 'Ederson', 'Endrick', 'Raphinha', 'Paquetá',
    'Bruno Guimarães', 'Antony', 'Martinelli', 'Richarlison', 'Lucas Paquetá',
    'Lucas', 'César',
  ],

  // Jogadores internacionais (de várias Copas)
  jogadoresIntl: [
    // Argentinos
    'Messi', 'Maradona', 'Suárez', 'Kempes', 'Batistuta', 'Tévez',
    // 1982 Itália
    'Rossi', 'Bergomi', 'Antognoni',
    // 1986 Argentina
    'Maradona', 'Burruchaga',
    // 1990s
    'Klinsmann', 'Matthäus', 'Hagi', 'Stoichkov', 'Roberto Baggio',
    // 1998 França
    'Zidane', 'Henry', 'Trezeguet', 'Petit', 'Blanc', 'Deschamps',
    'Suker', 'Boban', 'Šuker',
    // 2002 / 2006
    'Iniesta', 'Xavi', 'Casillas', 'Modric', 'Buffon', 'Pirlo', 'Totti',
    'Cannavaro', 'Materazzi',
    // 2010 / 2014 Espanha/Alemanha
    'Villa', 'Casillas', 'Klose', 'Neuer', 'Götze', 'Kroos', 'Lahm',
    'Hummels', 'Modric',
    // 2018 / 2022
    'Mbappé', 'Modric', 'Kane', 'Sterling', 'Salah', 'Mané', 'Mahrez',
    'Lewandowski',
    // Outros lendários
    'Cruyff', 'Eusébio', 'Pelé', 'Beckenbauer', 'Müller', 'Vardy',
    'Lampard', 'Gerrard', 'Banks', 'Beckham', 'Owen', 'Vidal', 'Alaba',
    'Coman', 'Dzeko', 'Keane',
  ],

  // Técnicos famosos (Copa-relevantes)
  tecnicos: [
    // Brasileiros
    'Tite', 'Felipão', 'Dunga', 'Mano', 'Parreira', 'Zagallo', 'Telê',
    // Internacionais Copa
    'Joachim Löw', 'Lippi', 'Aragones', 'Del Bosque', 'Scolari',
    'Deschamps', 'Sacchi', 'Bilardo', 'Menotti', 'Capello',
    // Clubes (atuais)
    'Klopp', 'Mourinho', 'Ancelotti', 'Simeone', 'Bielsa', 'Favre',
    'Klose', 'Ten Hag', 'Arteta', 'Tuchel',
  ],

  // Termos técnicos do futebol — FOCO Copa, podados de generic
  termos: [
    // Ações e jogadas (específicas)
    'pênalti', 'penal', 'lance', 'chute', 'passe', 'cruzamento',
    'cabeçada', 'drible', 'cobra', 'cabeçada', 'pegar', 'marcar', 'cobrar',
    'cruzar', 'falta',
    // Posições
    'meia', 'lateral', 'zagueiro', 'atacante', 'goleiro',
    // Resultado/competição
    'goleada', 'final', 'oitavas', 'quartas', 'semis', 'grupo',
    // Lugar
    'campo', 'gramado', 'estádio', 'arena', 'arquibancada',
    // Torcida — específicos da experiência Copa
    'torcida', 'hino', 'hinos', 'grito', 'gritar', 'festa',
    // Equipamento
    'bola', 'bolas', 'rede', 'trave', 'travessão', 'apito',
    'cartão', 'amarelo', 'vermelho',
    // Específico-Copa
    'taça', 'taças', 'troféu', 'medalha', 'pódio',
    'time', 'times', 'copa', 'copas', 'jogo', 'jogos', 'jogar',
    'partida', 'rodada', 'placar',
    // Slang/intensidade
    'craque', 'crack', 'fera', 'feras', 'fenom',
  ],

  // Termos icônicos de Copas específicas
  copaMomentos: [
    'mineiraço', 'maracanaço', 'penalti', 'gols', 'hexa',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EN — categorias paralelas
// ─────────────────────────────────────────────────────────────────────────────

const EN = {
  // Country names + capitals (5-letter)
  countriesAndCapitals: [
    // Nations Copa 2026 ou históricas
    'Chile', 'Japan', 'Spain', 'Egypt', 'Wales', 'Italy', 'Ghana',
    'Qatar', // 2022 host
    // Capitals
    'Tokyo', 'Seoul', 'Paris', 'Cairo', 'Accra', 'Dakar', 'Rabat',
    'Vienna', 'Prague', 'Doha', 'Riyadh', 'Bern',
    // Copa 2026 host cities (US)
    'Miami', 'Boston', 'Dallas',
  ],

  // Players (5-letter common across multiple Copas)
  players: [
    // BR (poucos cabem em EN também)
    'Pelé', 'Dunga', 'Lucio',
    // Argentina/Spain
    'Messi', 'Villa', 'Xavi', 'Modric',
    // France/Germany
    'Mbappé', 'Henry', 'Zidane', 'Kroos', 'Klose', 'Neuer', 'Götze',
    'Beckenbauer', 'Müller',
    // Italy
    'Pirlo', 'Totti', 'Rossi', 'Baggio',
    // England
    'Owen', 'Lampard', 'Gerrard', 'Banks', 'Vardy', 'Kane', 'Rooney',
    // Africa
    'Drogba', 'Salah', 'Mané', 'Mahrez',
    // Other
    'Vidal', 'Alaba', 'Coman', 'Dzeko', 'Keane', 'Suker', 'Blanc',
    'Cruyff',
  ],

  coaches: [
    'Klopp', 'Mourinho', 'Guardiola', 'Ancelotti', 'Simeone',
    'Bielsa', 'Favre', 'Klose', 'Tuchel', 'Lippi', 'Scolari',
  ],

  // Soccer technical terms (Copa-focused)
  terms: [
    // Plays
    'goal', 'goals', 'foul', 'penalty', 'card', 'cards', 'yellow', 'red',
    'kick', 'kicks', 'pass', 'cross', 'header', 'heads', 'dribble',
    'tackle', 'save', 'saves', 'shoot', 'shot', 'shots', 'score',
    // Positions
    'striker', 'keeper', 'wing', 'wings', 'midfield', 'forward',
    // Match
    'match', 'game', 'cup', 'cups', 'world', 'team', 'teams',
    'final', 'semi', 'group', 'round', 'draws',
    // Place
    'pitch', 'field', 'stadium', 'arena', 'posts', 'turf',
    // Fans
    'crowd', 'fans', 'roar', 'chant', 'horn', 'flags',
    // Equipment
    'cleats', 'boots', 'jersey', 'shirt', 'glove', 'ball', 'balls',
    // Trophy
    'title', 'crown', 'trophy', 'medal', 'prize',
    'champ', 'champs', 'rival', 'derby',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Processo
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryReport {
  name: string;
  rawCount: number;
  fiveLetterCount: number;
  fiveLetter: string[];
}

function reportCategory(name: string, raw: readonly string[]): CategoryReport {
  const fl = fiveLetterOnly(raw);
  return {
    name,
    rawCount: raw.length,
    fiveLetterCount: fl.length,
    fiveLetter: fl.sort(),
  };
}

interface LangReport {
  locale: 'pt' | 'en';
  perCategory: CategoryReport[];
  uniqueTotal: string[];
  origins: Record<string, string[]>;
}

function reportLocale(
  locale: 'pt' | 'en',
  cats: Record<string, readonly string[]>,
): LangReport {
  const perCategory: CategoryReport[] = [];
  const origins: Record<string, string[]> = {};
  for (const [name, raw] of Object.entries(cats)) {
    const cr = reportCategory(name, raw);
    perCategory.push(cr);
    for (const w of cr.fiveLetter) {
      origins[w] ??= [];
      origins[w].push(name);
    }
  }
  return {
    locale,
    perCategory,
    uniqueTotal: Object.keys(origins).sort(),
    origins,
  };
}

function print(report: LangReport) {
  console.log(`\n========== ${report.locale.toUpperCase()} ==========`);
  for (const c of report.perCategory) {
    console.log(
      `  ${c.name.padEnd(22)} raw=${String(c.rawCount).padStart(4)}  →  5-letter=${String(c.fiveLetterCount).padStart(4)}`,
    );
  }
  console.log(`  ${'─'.repeat(54)}`);
  console.log(`  TOTAL ÚNICOS:    ${report.uniqueTotal.length}`);
  console.log(`\n  Lista completa (ordenada):`);
  for (let i = 0; i < report.uniqueTotal.length; i += 10) {
    console.log(`    ${report.uniqueTotal.slice(i, i + 10).join(', ')}`);
  }
}

const ptReport = reportLocale('pt', PT);
const enReport = reportLocale('en', EN);
print(ptReport);
print(enReport);

const tmpDir = join(__dirname, '..', 'tmp');
mkdirSync(tmpDir, { recursive: true });
const outPath = join(tmpDir, 'copa-candidates.json');
writeFileSync(
  outPath,
  JSON.stringify({ pt: ptReport, en: enReport }, null, 2),
  'utf-8',
);
console.log(`\nRelatório completo em ${outPath}`);

// ─────────────────────────────────────────────────────────────────────────────
// Emit final TS wordlists
// ─────────────────────────────────────────────────────────────────────────────

function emitWordList(
  outPath: string,
  exportName: string,
  words: readonly string[],
  description: string,
) {
  const header = `/**
 * AUTO-GENERATED por scripts/collect-targets.ts.
 * NÃO editar à mão — re-rode 'npm run collect-targets --workspace=theme-copa'
 * após editar as categorias hand-curated no script.
 *
 * ${description}
 * Total: ${words.length} palavras, 5 letras, normalizadas (uppercase A-Z, sem diacríticos).
 */
`;
  const body =
    `export const ${exportName}: readonly string[] = [\n` +
    words.map((w) => `  '${w}',`).join('\n') +
    `\n];\n`;
  writeFileSync(outPath, header + body, 'utf-8');
  console.log(`  wrote ${outPath}`);
}

const srcDir = join(__dirname, '..', 'src');
mkdirSync(srcDir, { recursive: true });
console.log(`\nGerando wordlists finais em ${srcDir}/:`);
emitWordList(
  join(srcDir, 'words.copa.pt.ts'),
  'wordsCopaPt',
  ptReport.uniqueTotal,
  'Targets da Copa do Mundo em PT-BR. Termos, países, capitais, clubes, jogadores e técnicos icônicos de Copas 1930-2026.',
);
emitWordList(
  join(srcDir, 'words.copa.en.ts'),
  'wordsCopaEn',
  enReport.uniqueTotal,
  'Targets da Copa do Mundo em English. World Cup-themed terms, countries, capitals, players, coaches from 1930-2026.',
);
console.log('\nDone.');
