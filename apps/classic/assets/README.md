# Assets — 5 Letras

Arquivos PNG que precisam existir aqui antes de `eas build`. O `app.config.ts`
já referencia todos com os caminhos abaixo.

| Arquivo | Dimensão | Conteúdo |
|---|---|---|
| `icon.png` | 1024×1024 | Ícone iOS + fallback geral. Sem transparência (iOS rejeita). Pode ter o azul `#2F80ED` no fundo. |
| `adaptive-icon.png` | 1024×1024 | Foreground do Android adaptive icon. **Com transparência.** Centralizar o desenho num círculo seguro de ~660px (margem de 182px em volta) — Android recorta em círculo/squircle/etc. |
| `splash-icon.png` | 1024×1024 | Imagem central da splash screen (Expo SDK 50+). Transparente, centralizada. Fundo da splash é `#FFFFFF` (definido no `app.config.ts`). |

## Assets pra ficha da Play Store (não vão neste repo)

Geram separado quando for criar a listagem na Play Console:

- Ícone alta-res: 512×512 PNG (32-bit, sem transparência)
- Gráfico de destaque: 1024×500 JPG/PNG
- Screenshots de celular: mínimo 2, máximo 8, mín. 320px no lado menor
- (opcional) Screenshots tablet 7" e 10"

## Como gerar rápido

- Figma / Canva exportando 1× a 1024px
- Ou `npx expo-asset-generator` se tiver um SVG base
- Pra adaptive icon, validar o safe zone aqui: https://icon.kitchen
