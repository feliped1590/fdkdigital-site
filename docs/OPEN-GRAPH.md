# Open Graph e canonical

Cada rota passa a declarar `canonical`, Open Graph e Twitter Card. Antes não havia nenhum dos três, e um link do site colado no WhatsApp ou no LinkedIn aparecia como URL crua, sem título, descrição ou imagem.

## Como é gerado

As tags são montadas por `scripts/prerender.mjs`, no mesmo passo que injeta o HTML.

**Título e descrição não são definidos lá.** O script os *lê* do `index.html` de cada rota e deriva o resto. Assim o arquivo de origem continua sendo a fonte única desses dois campos, e não existe a possibilidade de o `<title>` e o `og:title` divergirem com o tempo.

O domínio vem de `public/CNAME` — quem de fato determina o endereço publicado — e não de uma constante repetida no código.

Se faltar `<title>` ou `<meta name="description">` em algum `index.html`, o build **falha com erro nomeando a rota**, em vez de publicar uma página sem metadados.

## O que cada rota recebe

```html
<link rel="canonical" href="https://fdkdigital.com.br/{rota}/"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="FDK Empreendimentos"/>
<meta property="og:locale" content="pt_BR"/>
<meta property="og:url" content="https://fdkdigital.com.br/{rota}/"/>
<meta property="og:title" content="{título da rota}"/>
<meta property="og:description" content="{descrição da rota}"/>
<meta property="og:image" content="https://fdkdigital.com.br/fdk-favicon.png"/>
<meta property="og:image:width" content="256"/>
<meta property="og:image:height" content="256"/>
<meta property="og:image:alt" content="Marca FDK"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="{título da rota}"/>
<meta name="twitter:description" content="{descrição da rota}"/>
<meta name="twitter:image" content="https://fdkdigital.com.br/fdk-favicon.png"/>
```

Canonical e `og:url` por rota:

| Rota | Canonical |
|---|---|
| `/` | `https://fdkdigital.com.br/` |
| `/politica-de-privacidade/` | `https://fdkdigital.com.br/politica-de-privacidade/` |
| `/termos-de-uso/` | `https://fdkdigital.com.br/termos-de-uso/` |
| `/exclusao-de-dados/` | `https://fdkdigital.com.br/exclusao-de-dados/` |

## Limitação conhecida: a imagem

**Não existe uma imagem de compartilhamento dedicada.** O site só tem `fdk-favicon.png` (256×256) e `fdk-apple-touch-icon.png` (180×180) — ambas quadradas e pequenas.

Por isso o `twitter:card` está como **`summary`**, não `summary_large_image`: com imagem quadrada, `summary` é o formato correto e rende uma miniatura limpa. Declarar `summary_large_image` com uma imagem de 256 px produziria um card grande com imagem esticada ou recortada.

O efeito prático hoje:

| Plataforma | Resultado |
|---|---|
| WhatsApp | título, descrição e miniatura quadrada da marca |
| LinkedIn | título, descrição e miniatura pequena (o card grande exige ≥ 1200×627) |
| X / Twitter | card `summary` com miniatura |

**Melhoria pendente:** criar uma imagem de 1200×630 e, junto com ela, trocar `OG_IMAGE` e o `twitter:card` para `summary_large_image` em `scripts/prerender.mjs`. É uma peça de design — por isso não foi inventada aqui.

## robots.txt e sitemap.xml

Também gerados por `scripts/prerender.mjs`, e não mantidos em `public/`, pelo mesmo motivo: a lista de URLs sai das mesmas rotas e o domínio sai do mesmo `CNAME`. **Acrescentar uma rota em `app/routes.tsx` já a coloca no sitemap** — não há uma segunda lista para esquecer de atualizar.

```
User-agent: *
Allow: /

Sitemap: https://fdkdigital.com.br/sitemap.xml
```

O sitemap lista as quatro URLs, idênticas aos `canonical` de cada página.

**Sem `<lastmod>`, de propósito.** O build roda no CI com clone raso, então não há histórico para datar cada rota com honestidade. Publicar uma data que muda a cada deploy, sem o conteúdo ter mudado, é pior que não publicar data nenhuma — e `changefreq` e `priority` são ignorados pelos buscadores.

Conferido: `/robots.txt` responde 200 em `text/plain`, `/sitemap.xml` responde 200 em `application/xml`, e as 4 URLs do sitemap **batem exatamente** com os 4 `canonical` gerados — nenhuma sobrando, nenhuma faltando.

## Verificação

| Checagem | Resultado |
|---|---|
| Tags sociais na Home | **14**, nenhuma duplicada |
| `canonical` e `og:title` | **distintos por rota**, conferidos nas 4 |
| `og:image` em produção | **200**, `image/png`, 18.023 bytes |
| Hidratação | OK, **sem mensagens no console** |
| `npx tsc --noEmit` | **6 erros, os mesmos de antes** |
| Visual | inalterado |

Peso acrescentado: cerca de **1,1 KB por rota**, só de HTML.
