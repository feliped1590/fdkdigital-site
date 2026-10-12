/** Dados institucionais. Fonte única — antes estavam repetidos em page.tsx e legal.tsx. */
export const company = {
  razaoSocial: "FDK EMPREENDIMENTOS LTDA",
  cnpj: "61.580.034/0001-97",
  endereco: "Fazenda Ipomeia, 1210 · Conj. Hab. Antonio E. Casaroto · Cambé/PR · CEP 86181-597",
  enderecoLinha: "Fazenda Ipomeia, 1210, Conj. Hab. Antonio E. Casaroto, Cambé/PR, CEP 86181-597",
  email: "contato@fdkdigital.com.br",
  telefone: "(43) 99696-6462",
  telefoneHref: "tel:+5543996966462",
  whatsapp: "https://wa.me/5543996966462",
  social: "@fdkdigital1",
} as const;

/** Frase usada na abertura dos documentos legais. */
export const identificacaoCompleta = `${company.razaoSocial}, CNPJ ${company.cnpj}, com endereço na ${company.enderecoLinha}`;

/** Linha de identificação usada nos rodapés. */
export const assinaturaLegal = `${company.razaoSocial} · CNPJ ${company.cnpj}`;

export const paginasLegais = [
  { href: "/politica-de-privacidade/", titulo: "Política de Privacidade", curto: "Privacidade" },
  { href: "/termos-de-uso/", titulo: "Termos de Uso", curto: "Termos" },
  { href: "/exclusao-de-dados/", titulo: "Exclusão de Dados", curto: "Exclusão de dados" },
] as const;
