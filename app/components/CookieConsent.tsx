import { useEffect, useState } from "react";
import {
  EVENTO_ABRIR,
  analyticsConfigurado,
  aplicarConsentimento,
  gravarDecisao,
  lerDecisao,
  restaurarConsentimento,
  type Decisao,
} from "../analytics";

/**
 * Banner de consentimento (LGPD).
 *
 * Renderiza `null` no servidor e no primeiro render do cliente — só aparece
 * depois do efeito, que é quando o localStorage pode ser lido. Isso evita
 * divergência de hidratação.
 */
export function CookieConsent() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!analyticsConfigurado()) return;
    restaurarConsentimento();
    if (lerDecisao() === null) setVisivel(true);

    const abrir = () => setVisivel(true);
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  if (!visivel) return null;

  const decidir = (decisao: Decisao) => {
    gravarDecisao(decisao);
    aplicarConsentimento(decisao);
    setVisivel(false);
  };

  return (
    <aside className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-titulo">
      <div className="consent-texto">
        <strong id="consent-titulo">Cookies e medição de audiência</strong>
        <p>
          Usamos o Google Analytics para entender como o site é usado. A medição só começa se você
          aceitar — recusar não carrega nenhum rastreador. Detalhes na{" "}
          <a href="/politica-de-privacidade/">Política de Privacidade</a>.
        </p>
      </div>
      <div className="consent-acoes">
        <button type="button" className="consent-recusar" onClick={() => decidir("recusado")}>
          Recusar
        </button>
        <button type="button" className="consent-aceitar" onClick={() => decidir("aceito")}>
          Aceitar
        </button>
      </div>
    </aside>
  );
}
