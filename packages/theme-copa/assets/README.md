# theme-copa assets

## `grass-portrait.jpg`

Textura de gramado top-down do estádio (mowing stripes alternados).
Resolução: **555×1480** (portrait, otimizado pra tela de celular).
Tamanho: ~220 KB.

### Origem

```
https://img.magnific.com/vetores-gratis/vista-superior-da-textura-do-estadio-de-grama-verde-de-futebol_107791-20406.jpg
```

A imagem original é landscape (1480×555). Rotacionada 90° em build-time
para ficar em pé na tela do celular.

### Reproduzir

```bash
docker run --rm -v "$PWD:/work" alpine sh -c '
  apk add --no-cache imagemagick imagemagick-jpeg curl >/dev/null
  cd /work
  curl -sL "URL" -o grass-raw.jpg
  convert grass-raw.jpg -rotate 90 -strip -quality 85 grass-portrait.jpg
'
```

### Licença / atribuição

Imagem de estoque do magnific.com (vetores-gratis). Para uso em produção
verificar termos de licença e atribuição requerida.
