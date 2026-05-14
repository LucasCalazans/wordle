# Wordle Monorepo

Jogo estilo Wordle com **engine reutilizável** e **shell de app compartilhado**, projetado para ser clonado em variantes temáticas (Copa do Mundo, Brasileirão, qualquer tema futuro) com mudança mínima de código.

## Arquitetura

```
wordle/
├── packages/
│   ├── wordle-engine     # TS puro, lógica do jogo
│   ├── wordle-ui         # componentes RN theme-aware
│   ├── wordle-app        # shell completo (screens + i18n + persist)
│   └── theme-base        # tema neutro padrão + word lists PT/EN
└── apps/
    └── classic           # Wordle MVP shippable, usa theme-base
```

Cada Wordle temático é um **app em `apps/X`** com ~10 linhas de código, mais um **pacote em `packages/theme-X`** que customiza cores, fontes, ícones e word list. Tudo o que é compartilhado (lógica do jogo, screens, animações, i18n, persistência) fica em `packages/wordle-*`.

## Stack

- **Toolchain:** Expo SDK 51 (managed) + TypeScript strict
- **Monorepo:** npm workspaces (`.npmrc legacy-peer-deps=true` para RN)
- **State:** `useReducer` + Context (sem Redux)
- **Persistência:** AsyncStorage (idioma do usuário)
- **i18n:** auto-detect via `expo-localization`, override por tema
- **Animações:** RN Animated nativo (flip, shake, pop)
- **Test:** Jest no `wordle-engine` (38 testes, lógica pura)
- **Dev env:** Docker + docker-compose

## Setup

Tudo via container — não precisa Node/npm na máquina.

```bash
docker compose run --rm install     # primeira instalação
```

## Comandos do dia-a-dia

```bash
docker compose run --rm test           # testes do engine
docker compose run --rm typecheck      # tsc --noEmit em todos os workspaces
docker compose run --rm dev            # shell interativo no container
docker compose up dev                  # sobe Metro/Expo (portas 8081, 19000-19002)
```

Para o emulador Android conectar no Metro do container:

```bash
docker compose up -d dev
docker compose exec dev bash -lc "cd apps/classic && npx expo start"
```

Em outro terminal, abra Android Studio com emulador rodando OU pareie Expo Go no celular Android (mesma rede). O Metro está exposto em `localhost:8081`.

## Validar o pipeline sem device

Para confirmar que tudo compila e bundla:

```bash
docker compose run --rm dev bash -lc "cd apps/classic && npx expo export --platform android --output-dir /tmp/out"
```

Saída esperada: `Android Bundled ... index.ts (570+ modules)` e `App exported to: /tmp/out`.

## Criar um Wordle temático novo em 5 passos

Suponha que você quer criar um Wordle Copa do Mundo 2026:

**1. Clone o tema base:**

```bash
cp -r packages/theme-base packages/theme-copa
```

**2. Edite `packages/theme-copa/package.json`:**

```json
{
  "name": "theme-copa",
  "version": "0.1.0",
  ...
}
```

**3. Em `packages/theme-copa/src/`, edite:**

- `base.ts` — renomeie `baseTheme` para `copaTheme`, ajuste `id`, `name`, **paleta de cores** (verde/amarelo, ouro), `assets`, opcionalmente `gameConfig: { wordLength: 6 }` se quiser palavras mais longas
- `words.pt.ts` e `words.en.ts` — substitua por termos temáticos (PELES, COPAS, GOLEX, etc.). Se mudar `wordLength`, garanta o tamanho correto.
- `strings.ts` — opcional: overrides como `appTitle: 'Termo Copa'`, `win.title: 'GOOOOOOL!'`
- `index.ts` — exporte `copaTheme` em vez de `baseTheme`

Rode `npm run validate --workspace=theme-copa` para garantir que as palavras estão no tamanho certo, em maiúscula, sem duplicatas.

**4. Clone o app classic:**

```bash
cp -r apps/classic apps/copa
```

**5. Em `apps/copa/`, edite:**

- `package.json` — `"name": "wordle-copa"`, troca `"theme-base"` por `"theme-copa"` nas dependencies
- `App.tsx`:
  ```tsx
  import { copaTheme } from 'theme-copa';
  import { WordleApp } from 'wordle-app';

  export default function App() {
    return <WordleApp theme={copaTheme} />;
  }
  ```
- `app.config.ts` — `name: 'Termo Copa 2026'`, `slug: 'wordle-copa'`, `android.package: 'com.prism.wordlecopa'`, `ios.bundleIdentifier: 'com.prism.wordlecopa'`
- Coloque `assets/icon.png`, `assets/splash.png`, `assets/adaptive-icon.png` próprios do tema Copa

Pronto. `docker compose run --rm install` re-linka os workspaces, e:

```bash
docker compose run --rm dev bash -lc "cd apps/copa && npx expo start"
```

Sobe o novo Wordle temático.

## O que o tema pode customizar

Veja [`packages/theme-base/src/types.ts`](./packages/theme-base/src/types.ts) para o contrato completo. Em resumo:

- **Cores** — paleta completa (tile, key, modal, background)
- **Tipografia** — fontFamily + sizes
- **Spacing** — gaps e padding
- **Assets** — logo, ícone interno, splash, padrão de fundo
- **Fontes customizadas** — `theme.fonts` é carregado via `expo-font` no boot
- **Word list** — PT e EN
- **Strings** — overrides parciais (deep merge com base)
- **Game config** — `wordLength` e `maxAttempts` (default 5 / 6)
- **Animations** — `flipDuration` e `shakeIntensity`

App-level (nome do app na home, ícone do Android, package id) vai em `apps/<x>/app.config.ts` — não no tema.

## Documentação técnica

- [CLAUDE.md](./CLAUDE.md) — contexto de arquitetura e convenções
- [PLAN.md](./PLAN.md) — plano de execução e rastreio de decisões

## Status do MVP

Concluído:

- [x] Monorepo + workspaces
- [x] `wordle-engine` v0.1.0 com 38 testes verdes
- [x] `theme-base` v0.1.0 com 273 PT + 599 EN palavras validadas
- [x] `wordle-ui` v0.1.0 com componentes theme-aware + animações
- [x] `wordle-app` v0.1.0 com i18n (PT/EN auto-detect), AsyncStorage, font loader
- [x] `apps/classic` empacota tudo em ~10 linhas
- [x] Docker dev env com install/test/typecheck/dev
- [x] Metro bundle valida resolução de todos os imports (570+ módulos)

Próximos passos (fora do MVP):

- [ ] Rodar visualmente em emulador Android — exige Android Studio ou device físico local
- [ ] Replace ícone/splash placeholder da Expo por arte real
- [ ] Adicionar `theme-copa` + `apps/copa`
- [ ] Daily mode, share emoji grid, hard mode, dark mode (post-MVP roadmap)
