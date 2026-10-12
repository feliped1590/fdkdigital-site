import { Brand } from "./Brand";

/** Cabeçalho da Home: marca, navegação principal e navegação fixa do mobile. */
export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <Brand href="#inicio" ariaLabel="FDK Empreendimentos — início" />
        <nav aria-label="Navegação principal">
          <a href="#metodologia">Metodologia</a>
          <a href="#aplicacoes">Aplicações</a>
          <a className="nav-cta" href="#contato">
            Iniciar transformação <span>↗︎</span>
          </a>
        </nav>
      </header>
      <nav className="mobile-nav" aria-label="Navegação rápida">
        <a href="#inicio">Início</a>
        <a href="#metodologia">Método</a>
        <a href="#aplicacoes">Aplicações</a>
        <a href="#contato">Contato</a>
      </nav>
    </>
  );
}
