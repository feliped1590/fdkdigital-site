# Pré-renderização estática

O build passa a gravar o HTML de cada rota dentro do `index.html` correspondente. O site deixa de ser servido como casca vazia.

## Por que

Antes, toda rota servia `<div id="root"></div>` e nada mais:

| Rota | HTML antes | HTML depois |
|---|---|---|
| `/` | 0,79 KB | **15,4 KB** |
| `/politica-de-privacidade/` | 0,53 KB | **6,3 KB** |
| `/exclusao-de-dados/` | 0,56 KB | **3,0 KB** |
| `/termos-de-uso/` | 0,51 KB | **2,7 KB** |

Isso resolve dois problemas de uma vez:

1. **As páginas legais agora têm conteúdo no HTML.** `/exclusao-de-dados/` é a URL tipicamente submetida à Meta na revisão de app do WhatsApp Business; antes, um verificador que não executasse JavaScript via uma página em branco.
2. **O conteúdo da Home passa a ser indexável** sem depender da execução de JavaScript, e o primeiro render não espera o download de 225 KB de bundle.

## Como funciona

`npm run build` virou três etapas encadeadas:

```
1. vite build                              -> dist/ (assets + um index.html por rota)
2. vite build --config vite.ssr.config.ts  -> dist-ssr/entry-server.js
3. node scripts/prerender.mjs              -> injeta o HTML em cada index.html
```

O workflow `.github/workflows/pages.yml` não mudou: ele chama `npm run build` e publica `dist/`.

### Arquivos

| Arquivo | Papel |
|---|---|
| `app/routes.tsx` | **Fonte única das rotas.** Usada pelo cliente, pelo SSR e pela pré-renderização. |
| `entry-server.tsx` | Exporta `render(path)`, executado em Node durante o build. |
| `vite.ssr.config.ts` | Build auxiliar que gera `dist-ssr/`. Não é publicado. |
| `scripts/prerender.mjs` | Lê cada `dist/<rota>/index.html` e substitui `<div id="root"></div>`. |
| `main.tsx` | Passou a **hidratar** a marcação existente em vez de montar do zero. |

O script **só troca o corpo**. O `<head>` de cada página — título, descrição, favicon — continua sendo o do arquivo-fonte, que já era próprio por rota. Nada de metadado foi alterado nesta mudança.

Se o `index.html` de origem deixar de conter `<div id="root"></div>`, o script falha com erro explícito em vez de publicar uma página vazia silenciosamente.

## Custo

| | Antes | Depois |
|---|---|---|
| JS | 224.571 B | 225.430 B (+859 B, a hidratação) |
| CSS | 37.379 B | 37.651 B (+272 B) |
| HTML | 0,79 KB | 15,4 KB (o conteúdo) |
| Total do deploy | 1,8 MB | 1,8 MB |

O vídeo do hero (1,51 MB) continua dominando o peso — ver `AUDITORIA.md`, §9.

## Verificação

| Checagem | Resultado |
|---|---|
| `npm run build` | OK, 4 rotas geradas |
| `npx tsc --noEmit` | **os mesmos 6 erros anteriores, nenhum novo** |
| Conteúdo no HTML servido | presente nas 4 rotas |
| Hidratação | OK nas 4 rotas, **sem nenhuma mensagem no console** |
| Animações `.reveal` | funcionando (7 de 31 ativadas ao rolar) |
| Códigos HTTP | `/` 200 · `/exclusao-de-dados` 301 → `/exclusao-de-dados/` 200 · inexistente 404 |
| Responsividade | sem overflow horizontal em 1440×900 e 375×812 |

Verificado com um servidor estático que imita o GitHub Pages: índice de diretório, redirecionamento 301 e 404 real, sem fallback de SPA.

## Limitação conhecida

A pré-renderização gera o HTML, mas o site **ainda não tem Open Graph, canonical, `robots.txt` nem `sitemap.xml`** — são itens separados, listados em `AUDITORIA.md`.
