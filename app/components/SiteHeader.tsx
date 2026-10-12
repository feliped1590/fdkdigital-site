import { Brand } from "./Brand";

type SiteHeaderProps = {
  /** Caminho da rota atual. "/" mantém o comportamento original da Home. */
  currentPath?: string;
};

/** Navegação inferior fixa do mobile, própria de cada página. */
const NAV_MOBILE: Record<string, { href: string; rotulo: string }[]> = {
  "/": [
    { href: "#inicio", rotulo: "Início" },
    { href: "#metodologia", rotulo: "Método" },
    { href: "#aplicacoes", rotulo: "Aplicações" },
    { href: "#contato", rotulo: "Contato" },
  ],
  "/industrial-360": [
    { href: "#plataforma", rotulo: "Plataforma" },
    { href: "#linhas", rotulo: "Linhas" },
    { href: "#beneficios", rotulo: "Benefícios" },
    { href: "#contato", rotulo: "Contato" },
  ],
};

export function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const naHome = currentPath === "/";

  // Na Home as âncoras seguem relativas, com rolagem suave e sem recarregar.
  // Fora dela apontam para a Home, já que cada rota é um documento próprio.
  const ancora = (id: string) => (naHome ? `#${id}` : `/#${id}`);
  const navMobile = NAV_MOBILE[currentPath] ?? NAV_MOBILE["/"];

  return (
    <>
      <header className="site-header">
        <Brand href={naHome ? "#inicio" : "/"} ariaLabel="FDK Digital — início" />
        <nav aria-label="Navegação principal">
          <a href={ancora("metodologia")}>Metodologia</a>
          <a href={ancora("aplicacoes")}>Aplicações</a>
          {/* Terceiro item de propósito: em telas ≤900px o CSS oculta os dois
              primeiros, então a Industrial 360 continua alcançável no mobile. */}
          <a href="/industrial-360/">Industrial 360</a>
          <a className="nav-cta" href={ancora("contato")}>
            Iniciar transformação <span>↗︎</span>
          </a>
        </nav>
      </header>
      <nav className="mobile-nav" aria-label="Navegação rápida">
        {navMobile.map((item) => (
          <a key={item.href} href={item.href}>
            {item.rotulo}
          </a>
        ))}
      </nav>
    </>
  );
}
