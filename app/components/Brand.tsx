/**
 * Assinatura da marca. Aparecia copiada em três lugares: cabeçalho e rodapé
 * da Home e cabeçalho das páginas legais.
 */
export function Brand({ href, ariaLabel }: { href: string; ariaLabel?: string }) {
  return (
    <a className="brand" href={href} aria-label={ariaLabel}>
      <span className="brand-mark">F</span>
      <span>
        FDK <i>Empreendimentos</i>
      </span>
    </a>
  );
}
