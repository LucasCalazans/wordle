# Wordle Engine — Monorepo

Jogo estilo Wordle com **engine reutilizável e versionada** + **shell de app compartilhado** entre múltiplos Wordles temáticos. Cada Wordle temático é um app Expo fino que injeta um tema (cores, fontes, palavras, ícones).

O primeiro tema concreto pós-MVP será **Copa do Mundo 2026** — mas o MVP entrega o `classic` (tema neutro) já com toda a infraestrutura pronta pra clonar.

## Status atual

- **Stage:** MVP em construção
- **Onda atual:** veja `TODO` no chat / PLAN.md
- **Plano completo:** [PLAN.md](./PLAN.md)

## Arquitetura (resumo)

Monorepo com workspaces. App shell (`wordle-app`) é package reutilizável; cada Wordle temático é um app fino em `apps/` que injeta um tema.

```
packages/
  wordle-engine     — TS puro, lógica do jogo (evaluate, normalize, reducer)
  wordle-ui         — Componentes RN theme-aware (Tile, Board, Keyboard)
  wordle-app        — Shell completo (screens, i18n, AsyncStorage, font loader)
  theme-base        — Tema neutro padrão + word lists PT/EN
apps/
  classic           — Wordle MVP shippable, usa theme-base
```

Pós-MVP: `packages/theme-copa` + `apps/copa` (~10 linhas cada).

## Stack

- **Toolchain:** Expo managed (TypeScript)
- **UI:** React Native + RN Animated nativo (sem Reanimated/Skia no MVP)
- **State:** useReducer + Context (sem Redux/Zustand)
- **Persistência:** AsyncStorage
- **i18n:** auto-detect do sistema + override manual; merge de strings do tema
- **Build:** EAS Build (futuro), `npx expo` localmente
- **Test:** Jest no `wordle-engine` (lógica pura tem cobertura forte)

## Decisões travadas

| Item | Decisão |
|---|---|
| Tamanho da palavra | 5 (configurável via `theme.gameConfig`) |
| Tentativas | 6 (configurável via `theme.gameConfig`) |
| Idiomas no MVP | PT + EN com auto-detect de sistema |
| Acentos PT | Ignorados na comparação (alvo pode ter acento, palpite sem acento acerta) |
| Modo | Free play infinito (sem daily mode) |
| Tema visual | Light only no MVP; tokens preparados pra dark |
| Fontes | Apenas do sistema no MVP; estrutura `theme.fonts` pronta |
| Troca de idioma | Confirma antes de descartar partida em andamento |
| Word list | ~400 palavras curadas por idioma no JSON do `theme-base` |

## Contrato do tema

Cada tema é um objeto `WordleTheme` exportado por um package. Customizável:

- `colors` — paleta completa (background, tiles, teclado, modais)
- `typography` — fontFamily + sizes
- `assets` — logo header, ícone, splash, padrão de fundo
- `wordList` — `{ pt: [...], en: [...] }`
- `strings` — sobrescritas de UI strings por idioma (opcional)
- `gameConfig` — override de `wordLength` / `maxAttempts` (opcional)
- `fonts` — fontes customizadas a carregar (opcional, pós-MVP)
- `animations` — durações/intensidades (opcional)

App-level (ícone Android, nome, package id, splash nativa) vai em `apps/<x>/app.config.ts` de cada app.

## Como criar um Wordle temático novo (depois de pronto)

1. `cp -r packages/theme-base packages/theme-X`
2. Editar `packages/theme-X/src/index.ts` (cores, palavras, assets)
3. `cp -r apps/classic apps/X`
4. Em `apps/X/App.tsx`: trocar import do tema
5. Em `apps/X/app.config.ts`: editar `name`, `slug`, `android.package`, ícones
6. `cd apps/X && npx expo start`

Detalhado em README da raiz quando finalizado.

## Convenções de código

- **TypeScript strict** em todos os packages
- **Comentários:** apenas para explicar "por quê" não-óbvio; nunca "o quê"
- **`wordle-engine`** é package puro — **proibido** importar RN, React, ou qualquer coisa de runtime mobile
- **Componentes UI** nunca importam cor/fonte hardcoded — sempre via `useTheme()`
- **i18n keys** organizadas por tela/escopo, não flat
- **Word lists** sempre normalizadas em maiúsculas, sem acentos para comparação (mas display pode ter acento)
- **Commits atômicos por onda** — uma onda quebra fácil de reverter
