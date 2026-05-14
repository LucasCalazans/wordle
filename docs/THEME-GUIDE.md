# Guia de criação de temas

> Este documento foi construído **enquanto criamos o tema `theme-copa`**.
> É o guia canônico para qualquer Wordle temático futuro.
>
> Cada seção tem um status:
> - ✅ **Done** — preenchido e estável
> - 🚧 **In-Progress** — sendo trabalhado agora
> - 📋 **TBD** — placeholder

## Sumário

1. [O que é um tema](#1-o-que-é-um-tema) ✅
2. [Análise de dados — o que coletar e de onde](#2-análise-de-dados--o-que-coletar-e-de-onde) ✅
3. [Identidade visual](#3-identidade-visual) ✅
4. [Estrutura do pacote `theme-X`](#4-estrutura-do-pacote-theme-x) ✅
5. [Estrutura do app `apps/X`](#5-estrutura-do-app-appsx) ✅
6. [Validação e testes](#6-validação-e-testes) ✅
7. [Publicação Android](#7-publicação-android) 📋

---

## 1. O que é um tema

Um Wordle temático no projeto é um **par de artefatos**:

- **`packages/theme-X`** — pacote npm interno que exporta um objeto `WordleTheme` (cores, tipografia, listas de palavras, strings, assets, config opcional)
- **`apps/X`** — app Expo que importa o tema e injeta no `WordleApp`:
  ```tsx
  import { copaTheme } from 'theme-copa';
  import { WordleApp } from 'wordle-app';
  export default function App() {
    return <WordleApp theme={copaTheme} />;
  }
  ```

Nada da lógica do jogo, animações, screens, persistência, i18n ou tooling precisa ser reescrito. Toda customização vive **no tema**.

Contrato completo em [`packages/theme-base/src/types.ts`](../packages/theme-base/src/types.ts) (`interface WordleTheme`).

### Garantia de independência entre temas

O app que usa `theme-copa` **nunca sorteia palavras do `theme-base` como resposta**. O sorteio do alvo (`useGame` → `selectRandomWord`) usa exclusivamente `theme.wordList[locale]`, que vem do tema injetado.

Já a **validação de palpite** pode reutilizar `validGuesses` do `theme-base` (dicionário grande) — permite que o jogador chute qualquer palavra real como exploração, sem comprometer a "tematização" das respostas. Veja §2.2.

---

## 2. Análise de dados — o que coletar e de onde

Antes de escrever uma linha do tema, defina **quais dados** preencher cada slot do contrato `WordleTheme`. A análise é específica ao tema sendo criado. Abaixo, a aplicada ao `theme-copa`.

### 2.1 Lista de targets (palavras-alvo do jogo)

**O que é:** o conjunto do qual o jogo sorteia uma palavra para ser a resposta. **Pequeno e curado**.

**Requisitos** (impostos pelo engine):
- 5 letras quando normalizadas (uppercase, sem acentos, A-Z)
- Sem duplicatas
- Comum o suficiente para o jogador adivinhar

**Estratégia para `theme-copa`** (definida com o usuário):
> Foco **estrito em Copa do Mundo de seleções**. Termos vindos de:
> - Países participantes da Copa 2026
> - Capitais dos países participantes
> - Sobrenomes de jogadores (lendários + atuais)
> - Sobrenomes de técnicos relevantes em Copas
> - Termos técnicos do futebol em contexto Copa
> - Expansão histórica: quando esgotar 2026, vai pras edições passadas (1930–2022)

**Categorias DESCARTADAS** (após análise):
- **Clubes** — Copa do Mundo é torneio de seleções; clubes são de outro escopo (Mundial de Clubes, ligas nacionais). Misturar dilui o tema.

### 2.2 Lista de valid guesses (palpites aceitos)

**O que é:** pool muito maior que `targets`. Aceita como palpite, mas nunca como resposta.

**Decisão para `theme-copa`:** **reutilizar `wordsValidPt` e `wordsValidEn` do `theme-base`** (9979 PT + 15921 EN).

Razões:
1. O usuário não precisa saber só termos de Copa pra fazer um palpite. Pode chutar `CASAS` como exploração.
2. Zero custo de bundle — Metro deduplica imports compartilhados entre `theme-base` e `theme-copa`.
3. Reflete UX do Wordle oficial.

Implementação: `copaTheme.wordList.validGuesses = { pt: wordsValidPt, en: wordsValidEn }` (importados de `theme-base`).

### 2.3 Idiomas

PT e EN, mesmo schema do `theme-base`. Audiência primária é BR, mas EN é grátis (engine e shell já suportam).

### 2.4 UI strings overrides

| Chave | Base PT | `theme-copa` PT |
|---|---|---|
| `appTitle` | "Termo" | **"Termo Copa"** |
| `newGame` | "Jogar de novo" | **"Próxima partida"** |
| `win.title` | "Você venceu!" | **"GOOOOOL!"** |
| `win.message` | "Acertou em {attempts} tentativa(s)" | **"Show de bola — em {attempts} chute(s)"** |
| `lose.title` | "Não foi dessa vez" | **"Bola fora"** |
| `lose.message` | "A palavra era {word}" | **"A palavra era {word}"** (igual ao base) |

EN análogo ("Wordle Cup", "GOOOOAL!", etc.).

`errors` e `language.switchConfirm` ficam herdados do base (shallow merge no `resolveStrings`).

### 2.5 Game config

**Manter 5 letras / 6 tentativas** (padrão). Mudar `wordLength` força refazer toda a wordlist; é decisão de **gênero**, não de tema.

Se quiser variante "Copa Hard" no futuro, vira outro app (`apps/copa-hard`) com `gameConfig: { wordLength: 6, maxAttempts: 5 }`.

### 2.6 Como coletar os dados — script reprodutível

Para temas com listas extraídas de domínio (como Copa), use um script de coleta dentro do tema. Padrão estabelecido em `packages/theme-copa/scripts/collect-targets.ts`:

```ts
const PT = {
  paises2026: ['Brasil', 'Argentina', ...],      // raw, hand-curated
  capitais2026: ['Brasília', 'Buenos Aires', ...],
  jogadoresBR: ['Pelé', 'Garrincha', ...],
  // ...
};

// Para cada categoria:
//   1. Normalize (uppercase, strip diacritics, drop non-A-Z)
//   2. Filtra: length === 5
//   3. Dedupa global, registra origem por palavra
//   4. Emite report no console + grava JSON em tmp/
//   5. Escreve src/words.copa.pt.ts e src/words.copa.en.ts (auto-generated)
```

Run: `docker compose run --rm dev npm run collect-targets --workspace=theme-copa`

Iteração: edite o objeto `PT`/`EN` no script → re-rode → revise resultados. Quando estável, comite tanto o script quanto os `.ts` gerados.

### 2.7 Resultado real da coleta (theme-copa)

| Categoria | Raw | 5-letter útil | Exemplos |
|---|---|---|---|
| paises2026 | 51 | **3** | JAPAO, SUICA, EGITO |
| capitais2026 | 50 | **15** | ABUJA, ARGEL, BAGDA, BERNA, CAIRO, DAKAR, MADRI, PARIS, PRAGA, QUITO, RABAT, RIADE, TEERA, TUNIS, VIENA |
| cidadesSede2026 | 16 | **1** | MIAMI |
| paisesPastCopa | 17 | **4** | CATAR, CHILE, SUICA, JAPAO (overlap) |
| jogadoresBR | 54 | **5** | DUNGA, ELANO, CESAR, LUCAS, LUCIO |
| jogadoresIntl | 67 | **23** | ALABA, BANKS, BLANC, BOBAN, COMAN, DZEKO, GOTZE, HENRY, KEANE, KLOSE, KROOS, MESSI, NEUER, PETIT, PIRLO, ROSSI, SALAH, SUKER, TEVEZ, TOTTI, VARDY, VIDAL, VILLA |
| tecnicos | 27 | **5** | DUNGA, FAVRE, KLOPP, KLOSE, LIPPI |
| termos | 66 | **27** | APITO, ARENA, BOLAS, CHUTE, COBRA, COPAS, FALTA, FINAL, GRITO, HINOS, JOGAR, LANCE, PENAL, TACAS, TRAVE… |

**PT total único: 79.** **EN total único: 76.**

Suficiente para ~30–40 partidas distintas antes de começar a repetir (com `selectAvoiding` evitando recentes).

### 2.8 Visual — alto nível (detalhes em §3)

| Slot | `theme-copa` |
|---|---|
| Paleta | **Gramado verde-mato + branco** (definido pelo usuário) |
| Logo header | Texto estilizado, sem imagem |
| Ícone/splash | Default Expo no MVP |
| Fontes | System (Roboto no Android) |

---

## 3. Identidade visual

### 3.1 Paleta — gramado verde-mato

Tokens completos em `packages/theme-copa/src/base.ts`. Mapeamento principal:

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#2E7D32` | Gramado verde-mato — header, CTA |
| `tile.correct` | `#2E7D32` | Letra na posição certa (verde gramado) |
| `tile.present` | `#FBC02D` | Letra existe em outra posição (amarelo cartão) |
| `tile.absent` | `#6D7C82` | Letra ausente (slate) |
| `tile.borderActive` | `#4CAF50` | Borda do tile sendo editado (verde-claro) |
| `surface` | `#F1F8E9` | Fundo sutil de cards/modais (verde-tinted) |
| `background` | `#FFFFFF` | Fundo principal — branco "linha de campo" |
| `text` | `#1B1B1B` | Texto principal |
| `key.default` | `#ECEFF1` | Tecla idle |

### 3.2 Logo / header

Por enquanto, **só texto** no `Header` (renderizado pelo `wordle-ui`). O componente lê `theme.assets.logoHeader` mas no `theme-copa` MVP o campo fica vazio — caí no fallback de texto estilizado.

**Pós-MVP:** trocar por um SVG/PNG do "Termo Copa" com uma bolinha estilizada. Quando tivermos arte, vira `assets: { logoHeader: require('./logo.png') }` e o `Header` componente já consome.

### 3.3 Ícone Android / splash

`apps/copa/app.config.ts` por enquanto usa **defaults da Expo** — sem `icon`/`splash`/`adaptiveIcon` declarados. Funciona pra dev/Expo Go. Pra produção, precisa:

- `icon.png` 1024×1024
- `adaptive-icon.png` (foreground 1024×1024) + `backgroundColor` (e.g. `#2E7D32` pra match gramado)
- `splash.png` (1080×1920 ou maior)

### 3.4 Modo escuro

Fora do MVP. Os tokens em `colors` ficam preparados (todos os componentes leem do tema), mas não há toggle `useColorScheme()` ligado ainda. Pós-MVP.

---

## 4. Estrutura do pacote `theme-X`

Steps replicáveis para criar um novo tema (`theme-copa` serviu de modelo):

### 4.1 Skeleton

Não é literalmente `cp -r theme-base` — algumas coisas que `theme-base` tem (word lists próprias hand-curated, scripts próprios) não fazem sentido em temas filhos. O que vai:

```
packages/theme-X/
├── package.json
├── tsconfig.json
├── scripts/
│   ├── collect-targets.ts     # se a wordlist for derivada (ver §2.6)
│   └── validate-words.ts      # sanity check
└── src/
    ├── words.X.pt.ts          # AUTO-GERADO pelo script de coleta
    ├── words.X.en.ts          # AUTO-GERADO
    ├── strings.ts             # overrides PT/EN
    ├── base.ts                # exporta o objeto WordleTheme
    └── index.ts               # re-exports
```

### 4.2 `package.json`

```jsonc
{
  "name": "theme-X",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "collect-targets": "tsx scripts/collect-targets.ts",
    "validate": "tsx scripts/validate-words.ts"
  },
  "dependencies": { "theme-base": "*" },
  "devDependencies": { "tsx": "^4.19.0", "typescript": "^5.4.0" }
}
```

### 4.3 `base.ts` — esqueleto

```ts
import type { WordleTheme } from 'theme-base';
import { wordsValidEn, wordsValidPt } from 'theme-base';   // reusa pool de validação
import { copaStringsEn, copaStringsPt } from './strings';
import { wordsCopaEn } from './words.copa.en';             // gerado
import { wordsCopaPt } from './words.copa.pt';             // gerado

export const copaTheme: WordleTheme = {
  id: 'copa',
  name: { pt: 'Termo Copa', en: 'Wordle Cup' },
  colors: { /* §3.1 */ },
  typography: { fontFamily: { /*...*/ }, sizes: { /*...*/ } },
  spacing: { tileGap: 5, rowGap: 5, padding: 12 },
  assets: {},
  wordList: {
    pt: wordsCopaPt,
    en: wordsCopaEn,
    validGuesses: { pt: wordsValidPt, en: wordsValidEn },
  },
  strings: { pt: copaStringsPt, en: copaStringsEn },
  animations: { flipDuration: 300, shakeIntensity: 8 },
};
```

### 4.4 `strings.ts` — overrides

Apenas chaves que mudam (resto cai pro `theme-base`):

```ts
import type { UiStrings } from 'theme-base';

export const copaStringsPt: Partial<UiStrings> = {
  appTitle: 'Termo Copa',
  win: { title: 'GOOOOOL!', message: '…' },
  lose: { title: 'Bola fora', message: '…' },
  newGame: 'Próxima partida',
};
```

**Nota:** `Partial<UiStrings>` torna keys top-level opcionais, mas se você incluir `win`, precisa fornecer `title` E `message` (sub-objetos não são parciais nesse contrato). Veja `resolveStrings` em `wordle-app`.

### 4.5 `index.ts`

```ts
export { copaTheme } from './base';
export { copaStringsPt, copaStringsEn } from './strings';
export { wordsCopaPt } from './words.copa.pt';
export { wordsCopaEn } from './words.copa.en';
```

---

## 5. Estrutura do app `apps/X`

### 5.1 Copy + ajustes

```bash
cp -r apps/classic apps/copa
rm -rf apps/copa/node_modules                 # se houver no source
```

Edite:

- `package.json`: `name`, `description`, troca `"theme-base"` por `"theme-X"` em deps. Mantém todas as outras deps Expo/RN.
- `App.tsx` (3 linhas):
  ```tsx
  import { copaTheme } from 'theme-copa';
  import { WordleApp } from 'wordle-app';
  export default function App() { return <WordleApp theme={copaTheme} />; }
  ```
- `app.config.ts`: `name`, `slug`, `android.package`, `ios.bundleIdentifier` ("com.prism.wordleX").
- `metro.config.js` e `babel.config.js`: idênticos ao classic (já funcionam pra monorepo).
- `index.ts`: idêntico (`registerRootComponent(App)`).

### 5.2 Deps "transparentes" obrigatórias

Mesmo que `wordle-app` declare expo/RN como peer deps, o app final precisa listá-las como **dependencies diretas** pra Expo CLI e Metro encontrarem:

```jsonc
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-font": "~14.0.11",
    "expo-localization": "~17.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "@react-native-async-storage/async-storage": "2.2.0",
    "webidl-conversions": "^7.0.0",          // workaround Metro+monorepo
    "whatwg-url-without-unicode": "^8.0.0-3", // workaround Metro+monorepo
    "theme-copa": "*",
    "wordle-app": "*",
    "wordle-engine": "*",
    "wordle-ui": "*"
  }
}
```

### 5.3 Install + bundle test

```bash
npm install                                                # pelo WSL nativo
docker compose run --rm typecheck
cd apps/copa && npx expo export --platform android --output-dir /tmp/out
```

**Esperado:** bundle compila sem erros, ~600 modules, ~2MB.

---

## 6. Validação e testes

Checklist pra considerar um tema pronto pra smoke test:

- [ ] `npm run validate --workspace=theme-X` — passa (5 chars, A-Z, sem duplicatas)
- [ ] `docker compose run --rm typecheck` — todos workspaces passam
- [ ] `docker compose run --rm test` — engine continua verde (38/38)
- [ ] `npx expo export --platform android` no `apps/X` — bundle compila
- [ ] Smoke visual no Expo Go (via tunnel ou USB/adb):
  - Abre o app, aparece com o nome certo no header
  - Cor primária aparece (gramado verde no Copa)
  - Strings temáticas aparecem (vitória, derrota)
  - Validação de palpite ainda funciona (chuta palavra inventada → toast + shake)
  - Troca de idioma funciona (e mostra strings traduzidas)

---

## 7. Publicação Android

📋 **TBD** — fora do MVP. Esboço:

- `eas init` no app + configurar `eas.json`
- `eas build --profile production --platform android` gera `.aab`
- Upload na Google Play (descrição, screenshots PT/EN, classificação etária, política de privacidade)
- Cada Wordle temático é uma listagem separada na Play (package id diferente)

---

## Apêndice A — Gotchas descobertos no caminho

### Docker container rodando como root cria arquivos com owner errado

**Sintoma:** depois de rodar `docker compose run --rm dev`, o Write/Edit do host dá `EPERM` em arquivos novos criados pelo container.

**Causa:** o container default roda como root → arquivos gerados são owner=root no volume bind-montado.

**Fix:** `user: "1000:1000"` + `HOME: /tmp` no serviço `dev` do `docker-compose.yml`. (UID/GID do usuário da WSL — veja com `id`.)

Se já tem arquivos root-owned no repo, conserte com:
```bash
docker run --rm -v /caminho/do/repo:/w alpine chown -R 1000:1000 /w/<caminho>
```

### Metro com monorepo + `disableHierarchicalLookup` não acha deps aninhadas

**Sintoma:** `Unable to resolve module webidl-conversions` ao bundle.

**Causa:** `disableHierarchicalLookup: true` no metro.config impede Metro de procurar dentro de `node_modules/<pkg>/node_modules/`. Algumas deps transitivas do Expo SDK 54 (whatwg-url-without-unicode → webidl-conversions) ficam aninhadas em vez de hoisted.

**Fix:** declarar essas deps explicitamente no `apps/X/package.json` (força hoist).

### npm install via Docker vs WSL nativo

Quando o volume named `wordle_node_modules` está dessincronizado do node_modules do host (caso houve install diferente em cada lado), workspace symlinks quebram.

**Recomendação:** padronize em **um** caminho. Atualmente o setup roda install pelo WSL nativo (rápido e correto), e Docker só roda comandos read-only (typecheck, test, bundle).

---

## Apêndice B — Decisões pendentes (atual)

- [x] Estratégia de targets PT — **Foco Copa, expandindo Copas passadas**
- [x] Tamanho-alvo da lista PT — **79 (resultado da coleta)**
- [x] Estratégia/escopo de targets EN — **~80 EN paritário (final: 76)**
- [x] Paleta visual — **Gramado verde-mato + branco**
- [x] Strings overrides — **Aprovados conforme tabela §2.4**
- [x] Validação — **Permissiva (reuso de `validGuesses` do theme-base)**
- [ ] Ícone/splash real — pós-MVP
- [ ] Logo header em imagem — pós-MVP
