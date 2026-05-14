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

Tudo roda em container — não precisa Node/npm na máquina.

```bash
docker compose run --rm install     # primeira instalação dos workspaces
```

## Desenvolvimento

```bash
# Testes do engine (e demais packages com test)
docker compose run --rm test

# Typecheck em todos os workspaces
docker compose run --rm typecheck

# Shell interativo no container (debug, comandos ad-hoc)
docker compose run --rm dev

# Sobe servidor Metro/Expo (porta 8081 + 19000-19002)
docker compose up dev
```

Para rodar o app classic no emulador Android, com `dev` em pé:

```bash
docker compose exec dev bash -lc "cd apps/classic && npx expo start --android"
```

(o emulador Android conecta ao Metro do container via portas expostas)

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
