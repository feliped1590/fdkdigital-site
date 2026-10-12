# Analytics e consentimento

Google Analytics 4 com consentimento prévio, conforme a LGPD.

## Falta um passo para ativar

`GA4_ID` em `app/analytics.ts` está **vazio de propósito** — não tenho o ID da propriedade da FDK, e preencher com um valor inventado daria a impressão de que a medição está funcionando.

```ts
export const GA4_ID = "";   // preencher com G-XXXXXXXXXX
```

Enquanto estiver vazio, **toda a camada fica inerte**: o banner não aparece, nenhum script é carregado e nada é medido, mesmo que alguém já tenha consentido antes. Preencher o ID e publicar é o único passo restante.

## Como funciona

**Nada de rastreamento carrega antes do aceite.** Não é só o cookie que fica bloqueado: o próprio script do Google não é baixado até a pessoa consentir. Recusar não dispara requisição nenhuma ao Google.

1. Na primeira visita, o banner pergunta.
2. **Recusar** grava a decisão e não carrega nada.
3. **Aceitar** grava a decisão, emite o `consent update` e só então injeta o `gtag.js`.
4. Em visitas seguintes, a decisão anterior é respeitada sem perguntar de novo.

A decisão fica em `localStorage`, na chave `fdk-consentimento-v1`. Se o armazenamento estiver bloqueado (janela privada), o código trata como "ainda não decidiu" e não quebra.

### Revogação

A LGPD exige que o consentimento seja revogável. O rodapé tem o link **"Preferências de cookies"**, que reabre o banner. O link só aparece quando há analytics configurado.

### Base pronta para marketing

A camada usa **Consent Mode v2**, com todos os sinais negados por padrão:

```js
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
});
```

Hoje só `analytics_storage` é concedido no aceite. Acrescentar Google Ads ou conversões depois **não exige refazer esta camada** — basta conceder os sinais de anúncio e acrescentar a opção correspondente no banner.

O GA4 é configurado com `anonymize_ip: true`, o que reduz o dado pessoal tratado.

## Política de privacidade

A política **não mencionava cookies nem analytics** — ela declarava apenas dados técnicos para segurança e funcionamento. Como a LGPD exige informar, foi acrescentada a seção **"10. Cookies e medição de audiência"**, que descreve a ferramenta, o caráter opcional, a anonimização de IP, a base legal (art. 7º, I) e como revogar. A antiga seção 10 passou a 11.

## Arquivos

| Arquivo | Papel |
|---|---|
| `app/analytics.ts` | ID, armazenamento da decisão, Consent Mode e injeção do GA4 |
| `app/components/CookieConsent.tsx` | O banner |
| `app/consent.css` | Estilo, dentro dos pisos de acessibilidade do site |
| `app/App.tsx` | Raiz compartilhada pelo cliente e pela pré-renderização |

`App.tsx` existe para que cliente e servidor rendam **a mesma árvore** — o banner depende de `localStorage`, então renderiza `null` no servidor e no primeiro render do cliente, e só aparece depois do efeito. É isso que evita divergência de hidratação.

## Verificação

Testado com um ID temporário, depois removido.

| Checagem | Resultado |
|---|---|
| Banner aparece na primeira visita | sim |
| **Recusar** | decisão gravada, **0 scripts do Google**, nenhuma requisição |
| **Aceitar** | decisão gravada, `consent update` emitido, `gtag.js` injetado com o ID correto |
| Link do rodapé | reabre o banner |
| Mobile 375px | banner acima da navegação fixa, **sem sobreposição**, sem overflow |
| Contraste do banner | mínimo **13,8:1** — folga larga sobre o mínimo AA |
| Menor fonte do banner | 12px |
| Com `GA4_ID` vazio | nada no HTML, banner não aparece |
| Hidratação | sem mensagens no console |

---

## Ativação (12/10/2026)

`GA4_ID` preenchido com **`G-FLWF2C0Y3T`**, a propriedade da FDK Digital.

### Um bug foi encontrado na ativação

A primeira verificação, feita com um ID fictício, confirmava apenas que o *script era injetado* — e isso passava. Com o ID real ficou claro que **nenhum hit era enviado**: a tag carregava, o `gtag` ficava definido, e nada chegava ao Google. Sem erro no console.

A causa estava no empurrão para o `dataLayer`:

```diff
-function gtag(...args: unknown[]): void {
-  window.dataLayer.push(args);          // array comum
-}
+const gtag: Gtag = function gtag(): void {
+  window.dataLayer.push(arguments);     // objeto `arguments`
+} as Gtag;
```

O `gtag.js` só interpreta como comando o que foi empurrado como objeto `arguments`. Um array comum é **ignorado em silêncio** — a tag carrega, nada é enviado, e nenhum erro aparece. Por isso a forma agora replica o snippet oficial em vez de usar rest parameters.

### Verificação com o ID real

Interceptando `fetch`, `sendBeacon`, `XMLHttpRequest` e `Image` — os quatro canais que o GA4 pode usar.

| Cenário | Resultado |
|---|---|
| Desktop 1440 — **recusar** | 0 requisições ao Google, 0 scripts no DOM |
| Desktop 1440 — **aceitar** | **1 hit** para `google-analytics.com/g/collect` com `tid=G-FLWF2C0Y3T` |
| Mobile 375 — **recusar** | 0 requisições, 0 scripts |
| Mobile 375 — **aceitar** | **1 hit** com o `tid` correto |
| Tags no DOM após aceitar | **1** — sem duplicação |
| HTML publicado | **0** ocorrências de `gtag`/`googletagmanager` |

O hit carrega `gcs=G101`, que é a assinatura do Consent Mode: analytics concedido, armazenamento de anúncios negado. E `npa=1`, anúncios não personalizados.

No mobile, o hit só apareceu após ~9 segundos — com 5 segundos de espera a medição dava falso negativo. Vale lembrar disso em verificações futuras.

### O que não consegui verificar

**O relatório de tempo real do GA4.** Não tenho acesso ao painel da propriedade. O que confirmei é que os hits saem do navegador com o ID correto e os parâmetros de consentimento certos — a confirmação no painel precisa ser feita por quem tem acesso.

Os testes enviaram hits reais a partir de `http://localhost:4230/`, então devem aparecer no Tempo Real com esse endereço como origem.
