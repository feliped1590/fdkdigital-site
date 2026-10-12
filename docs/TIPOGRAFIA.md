# Tipografia

O site passa a servir suas próprias fontes. A tipografia deixa de depender do que está instalado no dispositivo do visitante.

## O problema

As variáveis apontavam para fontes que só existem no Windows:

```css
--font-geist-sans: "Segoe UI", Arial, sans-serif;
--font-geist-mono: "Cascadia Mono", "SFMono-Regular", Consolas, monospace;
```

Não havia `@font-face` nenhum. Resultado: no Windows o site aparecia como projetado; em **macOS e iOS caía para Arial**; em Android, para a fonte padrão do sistema. A referência vista em um PC não era a que um visitante de iPhone enxergava.

## Por que não as mesmas fontes

**Segoe UI é proprietária da Microsoft e sua licença não permite incorporação em sites.** Não há como hospedá-la legalmente, nem distribuí-la com o projeto. Isso obriga a usar uma equivalente de licença aberta — foi o que a orientação previa ("se necessário, utilizar fontes equivalentes com carregamento local").

Cascadia é licenciada em OFL e poderia ser hospedada, mas misturar uma monoespaçada de código com uma sans diferente de Segoe não daria um par coerente.

## A escolha

**Geist e Geist Mono**, sob SIL Open Font License, desenhadas para interface e leitura em tela. São exatamente as fontes que os nomes das variáveis (`--font-geist-*`) já indicavam como intenção original do projeto — os nomes eram herança de um starter, e agora voltam a corresponder ao que de fato é carregado.

Os arquivos vieram do próprio ecossistema do projeto, sem download externo.

| | |
|---|---|
| Subsets | `latin` e `latin-ext` — cobrem o português integralmente |
| Peso | **82 KB** no total, carregados sob demanda pelo `unicode-range` |
| Carregamento | `font-display: swap` — o texto aparece imediatamente |
| Fallback | `"Segoe UI"` permanece na pilha: se a fonte falhar, o Windows volta ao que era |

## Regressão visual medida

Mesma máquina, mesmo viewport, comparando com a renderização anterior em Segoe UI.

### Desktop, 1440×900

| Elemento | Antes | Depois | Δ |
|---|---|---|---|
| `h1` | 666×244 | 666×244 | **0** |
| `.hero-body` | 520×51 | 520×51 | **0** |
| `.primary-button` | 250×52 | 250×52 | **0** |
| Navegação | 360×44 | 368×44 | +8 px |
| Rodapé | 1425×138 | 1425×143 | +5 px |
| Altura do documento | 9.583 | 9.589 | **+6 px (0,06%)** |

### Mobile, 375×812

| Elemento | Antes | Depois | Δ |
|---|---|---|---|
| `h1` | 335×191 | 335×191 | **0** |
| Altura do documento | 13.593 | 13.826 | +233 px (1,7%) |
| Estouros internos | 0 | **0** |

Sem overflow horizontal em nenhum dos dois. Sem mensagens no console. O título, o corpo do hero e o botão principal ficaram **idênticos ao pixel** — a identidade visual não foi descaracterizada.

## Como reverter

Comente o `@import "./fonts.css"` em `app/refinements.css` e devolva as variáveis à pilha anterior. Os arquivos em `public/fonts/` podem ficar.
