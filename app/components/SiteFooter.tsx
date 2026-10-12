import { EVENTO_ABRIR, analyticsConfigurado } from "../analytics";
import { assinaturaLegal, company, paginasLegais } from "../company";
import { Brand } from "./Brand";

/**
 * Reabre o banner para rever a escolha — a LGPD exige que o consentimento seja
 * revogável. Só aparece quando há analytics configurado; caso contrário não há
 * escolha a rever.
 */
function PreferenciasCookies() {
  if (!analyticsConfigurado()) return null;
  return (
    <a
      href="#preferencias-cookies"
      onClick={(evento) => {
        evento.preventDefault();
        window.dispatchEvent(new Event(EVENTO_ABRIR));
      }}
    >
      Preferências de cookies
    </a>
  );
}

/** Rodapé da Home. As páginas legais têm rodapé próprio, mais enxuto. */
export function SiteFooter() {
  return (
    <footer>
      <div>
        <Brand href="/#inicio" />
        <p>{assinaturaLegal}</p>
        <p>{company.endereco}</p>
        {/* Mantido em uma linha: quebrar aqui cria nós de texto adjacentes e o
            React passa a emitir um separador <!-- --> no HTML. */}
        <p>
          <a href={company.telefoneHref}>{company.telefone}</a> · <span>{company.social}</span> · <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
      </div>
      <div className="footer-links">
        {paginasLegais.map((pagina) => (
          <a key={pagina.href} href={pagina.href}>
            {pagina.titulo}
          </a>
        ))}
        <PreferenciasCookies />
      </div>
      {/* Uma expressão só por nó de texto: separar em várias faz o React
          emitir marcadores <!-- --> no HTML. */}
      <small>
        FDK Digital é a marca de tecnologia da FDK Empreendimentos
        <br />
        {`© ${new Date().getFullYear()} ${company.razaoSocial}`}
      </small>
    </footer>
  );
}
