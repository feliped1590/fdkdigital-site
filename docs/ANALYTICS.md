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
