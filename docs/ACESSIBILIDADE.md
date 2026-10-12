# Acessibilidade — contraste e tamanho de texto

Correção dos dois problemas apontados na auditoria: 14 reprovações de contraste WCAG AA e 91 nós de texto abaixo de 11px.

## Contraste

Oito pares de cor reprovavam, variando de **3,05:1 a 4,41:1** onde o mínimo AA para texto normal é 4,5:1.

O método foi clarear cada cor **o mínimo necessário**, somando igualmente aos três canais para preservar a matiz. Não houve escolha nova de paleta: são as mesmas cores, mais claras.

| Antes | Fundo | Contraste | Depois | Contraste |
|---|---|---|---|---|
| `#53615e` | `#060b10` | 3,05:1 | `#73817e` | 4,86:1 |
| `#667471` | `#0a1116` | 3,89:1 | `#758380` | 4,81:1 |
| `#65706e` | `#05090f` | 3,89:1 | `#747f7d` | 4,82:1 |
| `#64716e` | `#060b0f` | 3,89:1 | `#73807d` | 4,81:1 |
| `#687572` | `#070c0f` | 4,10:1 | `#74817e` | 4,85:1 |
| `#6d7976` | `#070c0f` | 4,35:1 | `#75817e` | 4,86:1 |
| `#6f7c78` | `#081014` | 4,41:1 | `#76837f` | 4,86:1 |

A margem acima de 4,5 é pequena de propósito: o objetivo era passar no critério sem clarear mais do que o necessário, mantendo a leitura discreta que a identidade usa.

## Tamanho de texto

Todas as declarações abaixo de 11px subiram para **11px**. Eram 47 declarações, entre `font-size` e a forma abreviada `font:`, em tamanhos de 6, 7, 8, 9 e 10px.

Isso inclui o **"CENÁRIO ILUSTRATIVO"**, que estava em 7px — o rótulo que protege a empresa de ter números ilustrativos lidos como resultado próprio era o texto menos legível da página.

### Um ajuste de composição que foi necessário

O rótulo `INTELLIGENCE CORE`, dentro do orbe decorativo do hero, passou de 7px para 11px e deixou de caber no círculo (95px de conteúdo em 88px). Em vez de reverter o tamanho, apertei o espaçamento entre letras de `.12em` para `.05em` — a folga ali era grande, e o rótulo voltou a caber com o tamanho legível.

## Resultado medido

| | Antes | Depois |
|---|---|---|
| Reprovações de contraste AA | **14** | **0** |
| Nós de texto abaixo de 11px | **91** | **0** |
| Menor fonte renderizada | 7px | **11px** |
| Altura do documento (desktop) | 9.589 | 9.594 (**+0,05%**) |
| Altura do documento (mobile) | 13.826 | 13.861 (**+0,25%**) |
| Overflow horizontal | nenhum | **nenhum** |
| Estouros internos (mobile) | 0 | **0** |

O crescimento de documento ficou abaixo de 0,3% nos dois viewports — a densidade visual foi preservada.

## Pendência anterior — corrigida em 12/10/2026

No desktop, o `h2` "Metodologia FDK" ultrapassava sua coluna da grade. Era anterior a esta mudança: medido com a fonte antiga e a nova, dava 444px nos dois casos.

Ao investigar para corrigir, o problema mostrou-se **maior do que o relatado**. A palavra "Metodologia" mede sempre `5,14 × tamanho da fonte`, e a coluna é sempre ~27,7% da viewport. Com o título em `6vw`, isso significa que ele excedia **em toda a faixa de duas colunas, de 901px a ~1930px** — não apenas em 1440px, como eu havia registrado.

### A correção

Em vez de reduzir o título, alarguei a coluna:

```diff
-.method{ grid-template-columns: .72fr 1.28fr }
+.method{ grid-template-columns: .85fr 1.15fr }
```

O raciocínio: a escala tipográfica é o que define a identidade visual; a proporção da grade, não. Alargando a coluna, **o tamanho do título fica exatamente igual ao anterior** — 86,4px em 1440px, como antes — e passa a caber.

| Viewport | Coluna | Palavra | Folga |
|---|---|---|---|
| 901 px | 292 | 280 | +12 |
| 1280 px | 418 | 395 | +23 |
| 1440 px | 471 | 444 | +27 |
| 1920 px | 630 | 535 | +95 |

Mobile não é afetado: a consulta de mídia de 900px já colapsa `.method` para coluna única, então a regra alterada nem se aplica. Confirmado — em 375px a grade continua `1fr` e há **0 estouros**.
