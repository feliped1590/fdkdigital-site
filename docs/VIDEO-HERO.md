# Vídeo do hero: poster e carregamento condicional

O `fdk-hero-motion-silent.mp4` tem **1,51 MB** e era **84% do peso do site**. Era baixado por todo visitante, em qualquer tela, com `preload="auto"` e sem `poster` — então em conexão lenta o hero ficava sem fundo até o download avançar.

## O que mudou

```html
<video class="hero-motion" aria-hidden="true" autoplay muted loop playsinline
       preload="metadata" poster="/fdk-hero-poster.jpg">
  <source src="/fdk-hero-motion-silent.mp4" type="video/mp4"
          media="(min-width: 901px) and (prefers-reduced-motion: no-preference)"/>
</video>
```

Três coisas:

1. **`poster`** — imagem estática exibida antes do vídeo estar pronto.
2. **`media` no `<source>`** — quando a consulta não casa, o navegador **não seleciona fonte nenhuma** e não baixa nada. Mostra só o poster.
3. **`preload="metadata"`** em vez de `auto`, uma dica menos agressiva.

O corte em 901px acompanha o breakpoint de 900px que o CSS já usava.

## O poster

Extraído do **próprio vídeo**, no segundo 5, com `ffmpeg`. Não é uma imagem inventada: é um quadro real da animação.

```bash
ffmpeg -ss 5 -i public/fdk-hero-motion-silent.mp4 -frames:v 1 \
       -vf scale=1280:720 -q:v 4 public/fdk-hero-poster.jpg
```

1280×720, JPEG, **14,5 KB**. Escolhi JPEG em vez de WebP (que daria 5,4 KB) porque `poster` com JPEG não tem nenhum risco de compatibilidade, e a diferença de 9 KB não justifica.

## Resultado medido

Medições reais com `performance.getEntriesByType('resource')`, isolando os recursos de cada carga.

| Viewport | Antes | Depois |
|---|---|---|
| **375 px** | 1.514.933 B | **14.785 B** — só o poster |
| **1440 px** | 1.514.933 B | 1.529.718 B (vídeo + poster) |

No mobile, **99% a menos**. O estado do elemento em 375px confirma que nada de vídeo foi pedido:

```
currentSrc:    (nenhuma fonte selecionada)
networkState:  NO_SOURCE
```

No desktop o vídeo carrega e toca normalmente (`readyState: 4`, `paused: false`).

## Por que a condição de movimento reduzido

Quem usa `prefers-reduced-motion: reduce` já não via o vídeo — o CSS o esconde com `display:none`. Mas **baixava os 1,51 MB mesmo assim**, para um elemento invisível. Incluir a condição no `media` elimina esse desperdício.

**A regra `display:none` do CSS foi mantida de propósito.** Se algum navegador ignorar o atributo `media`, o vídeo ainda é baixado — porém continua escondido, exatamente como antes. Não existe cenário em que alguém com movimento reduzido passe a ver animação.

## Limitações

- **A condição de movimento reduzido não foi verificada empiricamente** — não consegui emular `prefers-reduced-motion` no ambiente de teste. O que foi conferido é que a consulta é sintaticamente válida (`matchMedia(...).media !== 'not all'`) e que a regra de CSS que esconde o elemento continua no lugar.
- O `media` do `<source>` é avaliado **no carregamento**, não ao redimensionar. Quem abrir em janela estreita e depois alargar não verá o vídeo até recarregar. Para um fundo decorativo, é aceitável.
- Entre 768 e 900 px (tablets) o vídeo também não carrega. É intencional: mesma economia, e o poster cobre bem.

## Verificação

| Checagem | Resultado |
|---|---|
| Mobile 375px | **só o poster**, 14,8 KB, `NO_SOURCE` |
| Desktop 1440px | vídeo carrega e toca, `readyState: 4` |
| Consulta de mídia | válida e casando corretamente |
| Erros no console | **nenhum**, nos dois viewports |
| `npx tsc --noEmit` | **6 erros, os mesmos de antes** |
| Visual | inalterado no desktop; no mobile, quadro estático no lugar da animação |
