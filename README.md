# Wordle Monorepo

Wordle-style game with a reusable, theme-driven engine. Multiple themed Wordles share the same app shell — each theme only customizes colors, fonts, icons, and word lists.

## Estrutura

```
packages/
  wordle-engine     — lógica do jogo (TS puro)
  wordle-ui         — componentes RN theme-aware
  wordle-app        — shell completo (screens, i18n, persist)
  theme-base        — tema padrão + word lists PT/EN
apps/
  classic           — Wordle MVP (usa theme-base)
```

## Setup

```bash
npm install
```

## Desenvolvimento

```bash
# Rodar o app classic no Android
cd apps/classic
npx expo run:android

# Rodar testes do engine
cd packages/wordle-engine
npm test

# Typecheck em todos os workspaces
npm run typecheck
```

## Como criar um Wordle temático novo

Documentação completa será adicionada após o MVP. Visão geral:

1. Clonar `packages/theme-base` → `packages/theme-X`
2. Editar cores, palavras, assets
3. Clonar `apps/classic` → `apps/X`
4. Trocar tema no `App.tsx`
5. Ajustar `app.config.ts` (nome, ícone, package id)

## Documentação técnica

- [CLAUDE.md](./CLAUDE.md) — contexto de arquitetura e convenções
- [PLAN.md](./PLAN.md) — plano de execução e decisões
