# Plano do MVP — Wordle Engine

> Plano vivo. Atualizado conforme ondas completam.

## Contexto

Projeto iniciado em 2026-05-14, no contexto da Copa do Mundo 2026 (11/jun–19/jul). O objetivo do MVP é entregar a **infraestrutura** completa de um Wordle reutilizável; o tema da Copa entra pós-MVP, herdando do `theme-base`.

Localização: `~/projects/mobile/wordle/`.

## Arquitetura

```
wordle/
├── package.json                          # workspaces
├── tsconfig.base.json
├── packages/
│   ├── wordle-engine/        # TS puro, lógica do jogo
│   ├── wordle-ui/            # RN componentes theme-aware
│   ├── wordle-app/           # Shell completo
│   └── theme-base/           # Tema padrão + word lists
└── apps/
    └── classic/              # MVP shippable
```

## Decisões (rastreio de áreas cinzas resolvidas)

| # | Pergunta | Decisão | Quando |
|---|---|---|---|
| 1 | Toolchain | **Expo managed** | round 1 |
| 2 | Idiomas | **PT + EN** com auto-detect | round 1 |
| 3 | Escopo i18n | UI inteira traduzida + auto-detect | round 2 |
| 4 | Acentos PT | Ignorados na comparação | round 2 |
| 5 | Modo de jogo | Free play infinito | round 1 |
| 6 | Repo layout | Monorepo com workspaces | round 1 |
| 7 | Troca de idioma | Confirma antes de descartar partida | round 3 |
| 8 | Game config override por tema | Sim, opcional via `theme.gameConfig` | round 4 |
| 9 | Fontes customizadas | Estrutura pronta, mas só sistema no MVP | round 4 |
| 10 | Localização | `~/projects/mobile/wordle/` | round 5 |

## Contrato do tema (resumo)

```ts
interface WordleTheme {
  id: string;
  name: { pt: string; en: string };
  colors: { background, surface, text, textMuted, primary,
            tile: { empty, correct, present, absent, borderIdle, borderActive },
            key:  { default, correct, present, absent, text, textOnFilled },
            modal: { backdrop, surface } };
  typography: { fontFamily: { regular, bold, title },
                sizes:      { title, body, tile, key } };
  spacing?: Partial<{ tileGap, rowGap, padding }>;
  assets: { logoHeader, icon, splash?, backgroundPattern? };
  fonts?: Record<string, FontSource>;
  wordList: { pt: string[]; en: string[] };
  strings?: { pt?: Partial<UiStrings>; en?: Partial<UiStrings> };
  gameConfig?: { wordLength?: number; maxAttempts?: number };
  animations?: { flipDuration?: number; shakeIntensity?: number };
}
```

## Ondas de execução

### Onda 1 — Bootstrap monorepo (30min)
- `package.json` com workspaces (`packages/*`, `apps/*`)
- `tsconfig.base.json` strict, paths para resolver workspaces
- `.gitignore` (node_modules, .expo, dist, etc.)
- `.editorconfig`
- README inicial mínimo
- Inicializar git repo

### Onda 2 — wordle-engine v0.1.0 (1h30)
- `src/core/normalize.ts` — uppercase + strip acentos
- `src/core/evaluate.ts` — palpite vs alvo → array de `{letter, state}` com lógica correta de letras repetidas
- `src/core/selectWord.ts` — sorteio com PRNG injetável (testável)
- `src/state/types.ts` — `GameState`, `GuessResult`, `LetterState`
- `src/state/reducer.ts` — state machine (idle/playing/won/lost)
- `src/config.ts` — defaults `{ wordLength: 5, maxAttempts: 6 }`
- `src/index.ts` — API pública
- `__tests__/` — cobertura mínima 80% no core

### Onda 3 — theme-base v0.1.0 (1h30)
- `src/types.ts` — `WordleTheme`, `UiStrings`, `LetterState`, etc.
- `src/base.ts` — tema padrão completo (light, neutro)
- `src/words.pt.ts` — ~400 palavras PT (5 letras, curadas)
- `src/words.en.ts` — ~400 palavras EN (5 letras, curadas)
- `src/strings.ts` — strings UI base PT/EN
- `src/index.ts` — exports

### Onda 4 — wordle-ui v0.1.0 (2h)
- `src/ThemeProvider.tsx` — Context + `useTheme()`
- `src/components/Tile.tsx`
- `src/components/Row.tsx`
- `src/components/Board.tsx`
- `src/components/Key.tsx`
- `src/components/Keyboard.tsx`
- `src/components/EndGameModal.tsx`
- `src/components/Header.tsx` (logo + language toggle)
- Animação flip básica (RN Animated)

### Onda 5 — wordle-app v0.1.0 (2h)
- `src/App.tsx` — `WordleApp` component que aceita `theme` prop
- `src/screens/GameScreen.tsx`
- `src/hooks/useGame.ts` — bridge engine ↔ RN
- `src/hooks/usePersistedLanguage.ts`
- `src/hooks/usePersistedGame.ts`
- `src/i18n/index.ts` — setup + auto-detect (expo-localization)
- `src/i18n/loader.ts` — merge de strings base + tema
- `src/services/storage.ts` — wrapper de AsyncStorage
- `src/services/fontLoader.ts` — `useFonts(theme.fonts)` se houver

### Onda 6 — apps/classic (45min)
- `App.tsx` — `<WordleApp theme={baseTheme} />`
- `app.config.ts` — Expo config (name, slug, package, icone)
- `assets/` — icon.png, splash.png, adaptive-icon.png placeholder
- `package.json` — deps
- `babel.config.js`, `metro.config.js` se necessário pra workspaces

### Onda 7 — Smoke test no Android (1h)
- `npx expo run:android` ou `eas build --profile development`
- Verificar: digitar, submeter, ganhar, perder, recomeçar, trocar idioma
- Ajustar bugs de pixel/animação

### Onda 8 — README "criar Wordle temático em 5 passos" (30min)
- Tutorial completo para clonar `theme-base` → `theme-X`
- Tutorial para clonar `apps/classic` → `apps/X`
- Documentar override de `gameConfig`, fontes, strings

## Itens explicitamente FORA do MVP

- Daily mode com seed global
- Estatísticas persistentes / streak
- Tela de configurações, Sobre, Tutorial
- Share emoji grid
- Hard mode
- Dark mode (tokens preparados, mas não cabe no MVP)
- Sons, hápticos
- Analytics / telemetria
- Tema da Copa (entra em milestone seguinte)
- Publicação na Play Store (decisão separada)
- CI/CD (avaliar depois)

## Critério de "MVP pronto"

- [ ] `apps/classic` builda e roda no emulador Android
- [ ] Jogador consegue jogar uma partida completa em PT
- [ ] Jogador consegue jogar uma partida completa em EN
- [ ] Idioma auto-detectado na primeira abertura
- [ ] Troca de idioma confirma antes de descartar partida
- [ ] Engine tem testes passando com cobertura ≥ 80%
- [ ] README documenta como criar um Wordle temático novo
- [ ] Estrutura de tema permite override de cores + word list sem tocar em `wordle-app`
