# Auditoria do site FDK Digital

Data: 2026-10-11 · Commit auditado: `04eebf5` (Update FDK favicon assets, 03/10/2026)
Branch: `docs/auditoria` · **Nada publicado. `main` intacta.**

Esta auditoria descreve o código que gera `https://fdkdigital.com.br`. O build local reproduz a produção byte a byte — `npm run build` gera `assets/main-b25m39Sh.js`, exatamente o bundle que o site serve.

---

## 1. Stack

| Item | Situação |
|---|---|
| Build | **Vite 8.0.13** + `@vitejs/plugin-react` 6.0.2 |
| UI | React 19.2.6 / React DOM 19.2.6 |
| Linguagem | TypeScript 5.9.3, `strict: true`, `noEmit` |
| Estilo | CSS autoral em três arquivos + **Tailwind v4 importado mas quase não usado** |
| Dependências de produção | **duas** — `react` e `react-dom`. Nada além disso. |
| Framework de aplicação | nenhum (sem Next, sem roteador) |

Enxuto e sem excesso de camadas. É um ponto forte.

## 2. Arquitetura

```
index.html                     entrada da Home
main.tsx                       monta React e escolhe a página pelo pathname
vite.config.ts                 4 entradas de build
app/
  page.tsx        15 KB        Home inteira, 8 seções + contato + rodapé
  legal.tsx        9,7 KB      as 3 páginas legais, com um Shell compartilhado
  experience.tsx   1,4 KB      IntersectionObserver + estado de rolagem
  globals.css      5,9 KB      tokens, cabeçalho, hero
  story.css       12 KB        seções narrativas
  refinements.css 17,9 KB      camada posterior de refinamento
politica-de-privacidade/index.html
termos-de-uso/index.html
exclusao-de-dados/index.html
.github/workflows/pages.yml    build e deploy
public/                        CNAME, favicons, vídeo do hero
```

Roteamento, em `main.tsx`:

```ts
const path = window.location.pathname.replace(/\/$/, "");
const Page = path === "/politica-de-privacidade" ? PrivacyPolicy : ... : Home;
```

Cada rota tem seu próprio `index.html` declarado em `rollupOptions.input`. **É uma arquitetura multipágina real** — cada URL é um documento com título e descrição próprios.

Observação de manutenção: `app/page.tsx` tem 15 KB em 62 linhas, ou seja, **linhas muito longas**. Dificulta diff e revisão.

## 3. Rotas

| Rota | Título | Conteúdo |
|---|---|---|
| `/` | FDK Empreendimentos — Transformação Digital e AI First | Home, 8 seções numeradas |
| `/politica-de-privacidade/` | Política de Privacidade — FDK Empreendimentos | LGPD |
| `/termos-de-uso/` | Termos de Uso — FDK Empreendimentos | — |
| `/exclusao-de-dados/` | Exclusão de Dados — FDK Empreendimentos | Requisito de integração com a Meta |

Verificado no servidor estático: as quatro respondem 200, rota inexistente responde 404, e `/exclusao-de-dados` sem barra final redireciona 301 corretamente.

## 4. Conteúdo da Home

| # | Seção | Âncora |
|---|---|---|
| — | Hero — "Seu processo não precisa de mais um software" + vídeo | `#inicio` |
| 01 | O ponto de partida | `#problema` |
| 02 | A mudança de perspectiva | — |
| 03 | Metodologia FDK (7 etapas) | `#metodologia` |
| 04 | A transformação (antes/depois) | — |
| 05 | Inteligência aplicada (4 aplicações) | `#aplicacoes` |
| 06 | **CRM integrado ao WhatsApp** | `#crm-whatsapp` |
| 07 | O jeito FDK (4 princípios) | — |
| 08 | O novo estado | — |
| — | Contato (CTA para WhatsApp) | `#contato` |

Bom sinal de maturidade: o painel de números ilustrativos (143 / 38h / 27%) **já traz o rótulo "CENÁRIO ILUSTRATIVO"**. A preocupação de não passar número inventado como resultado próprio já está endereçada.

Dados institucionais presentes no rodapé: razão social, CNPJ 61.580.034/0001-97, endereço completo, telefone, perfil social e e-mail. Isso sustenta credibilidade B2B.

## 5. Design system

```
--ink:#05090f   --paper:#eff5f2   --lime:#b8ff5c   --cyan:#5ce1e6   --muted:#9eaaa7
--font-geist-sans: "Segoe UI", Arial, sans-serif
--font-geist-mono: "Cascadia Mono", "SFMono-Regular", Consolas, monospace
```

Cinco tokens de cor e dois de tipografia. Não há escala tipográfica nem de espaçamento formalizada — valores são literais ao longo de ~36 KB de CSS, muitos em hex com alfa embutido (`#b8ff5c70`, `#0a1116e8`).

**Os nomes `--font-geist-*` são herança de um starter; os valores não têm relação com a fonte Geist.** Ver §10.

`refinements.css` é a camada mais recente e a única escrita em formato legível, com comentários. É o melhor ponto de partida para evoluções de estilo.

## 6. Componentes

- `legal.tsx` define um `Shell` reutilizado pelas três páginas legais. **Boa prática, já presente.**
- `ApplicationVisual` encapsula os quatro visuais dos cards.
- `ExperienceEnhancer` isola o comportamento de rolagem.
- **Não há Header nem Footer compartilhados.** A marca é remarcada à mão em `page.tsx` e em `legal.tsx`, com rodapés diferentes. Qualquer mudança de marca precisa ser feita em dois lugares.

## 7. Integrações e contato

| Canal | Onde | Valor |
|---|---|---|
| WhatsApp | CTA principal da Home | `wa.me/554396966462` |
| Telefone | rodapé da Home | `tel:+554396966462` — "+55 43 9696-6462" |
| Telefone | **páginas legais** | `tel:+5543998435878` — **"(43) 99843-5878"** |
| E-mail | rodapé e páginas legais | `contato@fdkdigital.com.br` |
| Social | rodapé | `@fdkdigital1`, como texto, **sem link** |

**Há dois números de telefone diferentes publicados no site.** Ver §14, risco 1.

Não existem formulários. Não há analytics, pixel, GTM ou banner de consentimento.

## 8. SEO

| Item | Estado |
|---|---|
| `<title>` por rota | **presente e distinto** |
| `description` por rota | **presente e distinta** |
| `lang="pt-BR"` | presente |
| H1 único por página | presente |
| Hierarquia de títulos | correta (h1 → h2 → h3, sem saltos) |
| Favicon da marca | presente na Home (`fdk-favicon.png` + apple-touch-icon) |
| Open Graph | **ausente** |
| Twitter Card | **ausente** |
| `canonical` | **ausente** |
| `robots.txt` | **ausente** (404) |
| `sitemap.xml` | **ausente** (404) |
| JSON-LD | **ausente** |
| Favicon nas páginas legais | **inconsistente** — apontam para `/favicon.svg`, não para o PNG da marca; sem `theme-color` nem apple-touch-icon |

### O ponto crítico: renderização no cliente

O HTML servido não contém o conteúdo. Medido:

| Rota | HTML servido |
|---|---|
| `/` | **798 bytes** |
| `/exclusao-de-dados/` | **562 bytes** |

O corpo é `<div id="root"></div>`. Todo o texto só existe depois que o JavaScript executa. Título e descrição estão no HTML — mas nenhum parágrafo, nenhum título de seção, nenhum item da política de privacidade.

Consequências: buscadores que não executam JavaScript não indexam conteúdo; links compartilhados em WhatsApp e LinkedIn não geram preview (sem OG); e o LCP depende de baixar e executar 224 KB de JS.

## 9. Performance

| Asset | Tamanho | Observação |
|---|---|---|
| `main-b25m39Sh.js` | 224,57 KB (**69,1 KB** gzip) | — |
| `main-DzeMPK27.css` | 37,37 KB (**9,0 KB** gzip) | — |
| `fdk-hero-motion-silent.mp4` | **1,51 MB** | `autoplay loop muted` + **`preload="auto"`** |
| Total do deploy | **1,8 MB** | — |

JS e CSS estão em patamar saudável. **O vídeo é 84% do peso do site** e é baixado integralmente, inclusive em 375 px — confirmado na aba de rede com viewport mobile. Não há `poster`, nem versão reduzida, nem condicional por largura ou por `prefers-reduced-data`.

Verificado: **não há duplicação de CSS** no bundle, embora `story.css` seja importado tanto por `globals.css` quanto por `main.tsx` — o Vite deduplica corretamente.

## 10. Tipografia

Não há `@font-face` nem fonte embarcada. As variáveis resolvem para pilhas do sistema:

- `"Segoe UI"` → existe no **Windows**. Em macOS e iOS cai para **Arial**; em Android, para a fonte padrão do sistema.
- `"Cascadia Mono"` → existe no **Windows** com o Terminal instalado. Fora disso cai para `SFMono-Regular` (Apple) ou `Consolas` ou monoespaçada genérica.

Ou seja: **a tipografia do site muda conforme o sistema do visitante**, e a referência vista em um PC Windows não é a que um visitante de iPhone enxerga. Não é um defeito — é uma escolha com um efeito colateral que vale conhecer. Se a consistência importar, a correção é self-host de uma fonte própria.

## 11. Acessibilidade

**O que está bem feito** — e é mais do que o habitual:

- `@media (prefers-reduced-motion: reduce)` **esconde o vídeo do hero** e neutraliza as animações de revelação. Tratamento correto e raro.
- `aria-hidden` consistente nos elementos decorativos; `aria-label` descritivo nos painéis ilustrativos e nos links de aplicação.
- Um `h1` por página, hierarquia de títulos sem saltos, `lang="pt-BR"`.
- **Nenhum link sem nome acessível** (21 links verificados).
- Navegação inferior fixa no mobile, com os quatro destinos sempre visíveis.
- O foco por teclado **é visível** — usa o anel padrão do navegador.

**O que precisa de atenção:**

1. **14 elementos de texto reprovam no contraste AA.** Exemplos medidos sobre o fundo real:

   | Contraste | Tamanho | Texto |
   |---|---|---|
   | 3,05:1 | 8 px | "PROCESSO → TECNOLOGIA → INTELIGÊNCIA → IMPACTO" |
   | 3,89:1 | 8 px | "Explore a jornada" |
   | 3,89:1 | 9 px | "Versão_27_final.xlsx", "+38h / mês", "Desconectados" |
   | 3,89:1 | 10 px | "FLUXOS ORQUESTRADOS" |
   | 4,10:1 | 8 px | "ATENDIMENTO CONECTADO" |
   | 4,17:1 | 7 px | "Histórico sincronizado" |

2. **91 nós de texto abaixo de 11 px**, muitos em 7 e 8 px — incluindo "EMPREENDIMENTOS" na assinatura da marca e "CENÁRIO ILUSTRATIVO". Em 7 px, o rótulo que protege a empresa de uma leitura errada é o texto menos legível da página.

3. **Anel de foco padrão do navegador** (laranja `rgb(229,151,0)`). Funciona, mas destoa da paleta e tem contraste baixo sobre `--ink`. Só `.application-link` tem regra própria de `:focus-visible`.

4. **Sem skip-link** para o conteúdo principal.

5. O vídeo não tem `poster`; em conexão lenta o hero fica sem fundo até o download começar.

## 12. Responsividade

- Breakpoints: 600 px, 850 px, 900 px e uma faixa `701–900 px`. **Quatro pontos de corte em três arquivos** — inconsistente, mas funcional.
- **Sem overflow horizontal** em 375 px nem em 1440 px (verificado).
- `.mobile-nav` fixa no rodapé resolve a navegação em telas pequenas.
- `body{overflow-x:hidden}` segue presente, mascarando eventuais estouros em vez de corrigi-los.

## 13. Build, deploy e qualidade

```yaml
on: push: branches: [main]
→ npm ci → npm run build → upload-pages-artifact → deploy-pages
```

| Item | Estado |
|---|---|
| `npm run build` | **OK**, 1,98 s, 4 páginas |
| `npx tsc --noEmit` | **6 erros** (detalhe abaixo) |
| Lint | **não existe** — sem ESLint, sem configuração |
| Testes | **não existem** |
| CI | roda **apenas o build** |
| Staging / preview | **não existe** |
| Publicação | **automática a cada push na `main`** |

Os 6 erros de TypeScript:

```
app/experience.tsx(11,13): 'io' is possibly 'null'
vite.config.ts(3,25):  Cannot find module 'node:path'
vite.config.ts(7,*):   Cannot find name '__dirname'   (4 ocorrências)
```

O de `experience.tsx` é real, embora inofensivo em execução: a callback referencia `io` antes da atribuição terminar, e em tempo de execução ela só dispara depois. Os de `vite.config.ts` são falta de `@types/node`.

Como o CI não roda `tsc`, **nenhum desses erros impede uma publicação**. O build usa esbuild, que apenas transpila e não verifica tipos.

Código morto: `export const metadata` em `page.tsx` e `"use client"` em `experience.tsx` são resquícios de um starter Next — nenhum dos dois tem efeito aqui.

## 14. Riscos

| # | Risco | Severidade | Detalhe |
|---|---|---|---|
| 1 | **Dois telefones diferentes publicados** | **Alta** | Home: `(43) 9696-6462`. Páginas legais: `(43) 99843-5878`. Em páginas de LGPD, o canal de contato do titular precisa estar correto. |
| 2 | **Páginas legais sem conteúdo no HTML** | **Alta** | `/exclusao-de-dados/` serve 562 bytes com `<div id="root">` vazio. É a URL tipicamente submetida à Meta na revisão de app do WhatsApp Business. Um verificador que não execute JavaScript vê uma página em branco. |
| 3 | **Publicação direta sem revisão** | **Alta** | Todo push na `main` vai ao ar. Sem staging, sem checagem, sem aprovação. |
| 4 | **Sem conteúdo no HTML da Home** | **Alta** | 798 bytes. SEO e LCP comprometidos. |
| 5 | Vídeo de 1,5 MB sem condicional | Média | 84% do peso, baixado também no mobile. |
| 6 | Sem Open Graph | Média | Link compartilhado não gera preview. Para um negócio que prospecta por WhatsApp e LinkedIn, é perda direta. |
| 7 | Sem lint, testes ou typecheck no CI | Média | 6 erros de tipo convivem com deploys verdes. |
| 8 | Sem analytics | Média | Não há como saber se o CTA de WhatsApp converte. |
| 9 | 14 falhas de contraste e 91 textos < 11px | Média | Ver §11. |
| 10 | Marca duplicada em dois arquivos | Baixa | Mudança de marca exige editar `page.tsx` e `legal.tsx`. |
| 11 | Favicon inconsistente nas legais | Baixa | Apontam para `/favicon.svg` genérico. |
| 12 | `page.tsx` em linhas muito longas | Baixa | Dificulta revisão. |

## 15. O que preservar

1. **A arquitetura multipágina com entradas declaradas.** Acrescentar uma rota é adicionar um `index.html` e uma entrada no `vite.config.ts` — simples e já comprovado.
2. **O `Shell` das páginas legais.** É o único componente compartilhado e serve de modelo para extrair Header e Footer.
3. **O tratamento de `prefers-reduced-motion`**, que inclusive esconde o vídeo.
4. **O rótulo "CENÁRIO ILUSTRATIVO"** nos números do painel.
5. **A base institucional completa** no rodapé: razão social, CNPJ, endereço, telefone e e-mail.
6. **O deploy automatizado.** O problema não é a automação — é a falta de um portão antes dela.
7. **O peso enxuto de JS e CSS** e as duas únicas dependências de produção.

---

## Correções recomendadas, por ordem de retorno

| Prioridade | Ação | Esforço |
|---|---|---|
| 1 | Unificar o telefone nas páginas legais e na Home | mínimo |
| 2 | Pré-renderizar o HTML das 4 rotas (resolve riscos 2 e 4 de uma vez) | médio |
| 3 | Open Graph, canonical, `robots.txt`, `sitemap.xml` | baixo |
| 4 | `poster` no vídeo e não carregá-lo no mobile | baixo |
| 5 | Rodar `tsc` no CI e exigir branch + PR para publicar | baixo |
| 6 | Contraste e tamanhos mínimos de texto | baixo |
| 7 | Extrair Header e Footer compartilhados | médio |
| 8 | Analytics e consentimento | baixo |

Nenhuma dessas alterações foi aplicada. Esta branch contém apenas este documento.
