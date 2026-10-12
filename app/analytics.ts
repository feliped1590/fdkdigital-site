/**
 * Google Analytics 4 com consentimento prévio (LGPD).
 *
 * Nada de rastreamento é carregado antes do aceite: o script do GA4 só é
 * injetado depois que a pessoa consente. Recusar não carrega nada.
 *
 * A base usa Consent Mode v2, que é o mecanismo que o Google espera para
 * integrações futuras de marketing e conversões — acrescentar Google Ads ou
 * conversões não exige refazer esta camada, só conceder os sinais de anúncio.
 */

/**
 * ID de medição do GA4 da FDK Digital.
 *
 * É a única declaração da tag no projeto — não há script do Google em nenhum
 * HTML. Esvaziar esta constante desliga toda a camada: o banner deixa de
 * aparecer e nada é carregado, mesmo para quem já consentiu.
 */
export const GA4_ID = "G-FLWF2C0Y3T";

const CHAVE = "fdk-consentimento-v1";

export type Decisao = "aceito" | "recusado";

export const analyticsConfigurado = () => GA4_ID.trim().length > 0;

export function lerDecisao(): Decisao | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "aceito" || valor === "recusado" ? valor : null;
  } catch {
    // Modo privado ou armazenamento bloqueado: trata como "ainda não decidiu".
    return null;
  }
}

export function gravarDecisao(decisao: Decisao): void {
  try {
    localStorage.setItem(CHAVE, decisao);
  } catch {
    // Sem armazenamento, a decisão vale só para esta visita.
  }
}

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * O gtag.js distingue o objeto `arguments` de um array comum: ele só interpreta
 * como comando o que foi empurrado como `arguments`. Empurrar um array normal
 * faz os comandos serem ignorados em silêncio — a tag carrega, nada é enviado,
 * e não aparece erro nenhum. Por isso a forma abaixo replica o snippet oficial
 * em vez de usar rest parameters.
 */
const gtag: Gtag = function gtag(): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(arguments);
} as Gtag;

let defaultsDefinidos = false;

/** Declara que tudo começa negado. Roda antes de qualquer script do Google. */
function definirPadroesNegados(): void {
  if (defaultsDefinidos) return;
  defaultsDefinidos = true;
  window.gtag = window.gtag ?? gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}

let scriptInjetado = false;

function injetarGA4(): void {
  if (scriptInjetado || !analyticsConfigurado()) return;
  scriptInjetado = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  // IP anonimizado: reduz o dado pessoal tratado, em linha com a LGPD.
  gtag("config", GA4_ID, { anonymize_ip: true });
}

/**
 * Aplica a decisão. Só injeta o GA4 no caso de aceite — recusar não carrega
 * nada, e nem o script do Google chega a ser baixado.
 */
export function aplicarConsentimento(decisao: Decisao): void {
  if (!analyticsConfigurado()) return;
  definirPadroesNegados();

  if (decisao === "recusado") return;

  gtag("consent", "update", { analytics_storage: "granted" });
  injetarGA4();
}

/** Chamado no carregamento: respeita uma decisão já tomada em visita anterior. */
export function restaurarConsentimento(): void {
  if (!analyticsConfigurado()) return;
  definirPadroesNegados();
  const decisao = lerDecisao();
  if (decisao === "aceito") aplicarConsentimento("aceito");
}

/** Evento que o rodapé dispara para a pessoa rever a escolha. */
export const EVENTO_ABRIR = "fdk:consentimento:abrir";
