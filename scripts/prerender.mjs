/**
 * Escreve o HTML de cada rota dentro do index.html já gerado pelo Vite e
 * acrescenta os metadados de compartilhamento.
 *
 * Roda depois dos dois builds:
 *   1. vite build                             -> dist/ (assets + um index.html por rota)
 *   2. vite build --config vite.ssr.config.ts -> dist-ssr/entry-server.js
 *
 * Título e descrição NÃO são definidos aqui: são lidos do próprio index.html de
 * cada rota, que continua sendo a fonte única deles. O script apenas deriva as
 * tags Open Graph, Twitter e canonical a partir do que já está lá, para que não
 * exista a possibilidade de divergirem.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, "dist");
const serverEntry = join(projectRoot, "dist-ssr", "entry-server.js");

const { render, routes } = await import(pathToFileURL(serverEntry).href);

// O domínio vem do CNAME, que é quem de fato determina o endereço publicado.
const dominio = (await readFile(join(projectRoot, "public", "CNAME"), "utf8")).trim();
const SITE_URL = `https://${dominio}`;
const SITE_NAME = "FDK Empreendimentos";

/** Imagem de compartilhamento. Ver docs/OPEN-GRAPH.md sobre a limitação atual. */
const OG_IMAGE = { caminho: "/fdk-favicon.png", largura: 256, altura: 256 };

const PLACEHOLDER = '<div id="root"></div>';
const resultados = [];

function extrair(html, regex, campo, rota) {
  const achado = html.match(regex);
  if (!achado) {
    throw new Error(`Não encontrei ${campo} no index.html da rota ${rota}.`);
  }
  return achado[1];
}

function montarMetadados({ titulo, descricao, canonical }) {
  // titulo e descricao vêm de atributos HTML já escapados no arquivo de origem,
  // então podem ser reaproveitados como atributos sem novo escape.
  return [
    `<link rel="canonical" href="${canonical}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${SITE_NAME}"/>`,
    `<meta property="og:locale" content="pt_BR"/>`,
    `<meta property="og:url" content="${canonical}"/>`,
    `<meta property="og:title" content="${titulo}"/>`,
    `<meta property="og:description" content="${descricao}"/>`,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE.caminho}"/>`,
    `<meta property="og:image:width" content="${OG_IMAGE.largura}"/>`,
    `<meta property="og:image:height" content="${OG_IMAGE.altura}"/>`,
    `<meta property="og:image:alt" content="Marca FDK"/>`,
    // "summary" é o formato certo para imagem quadrada. Com uma imagem
    // dedicada de 1200x630, passa a ser "summary_large_image".
    `<meta name="twitter:card" content="summary"/>`,
    `<meta name="twitter:title" content="${titulo}"/>`,
    `<meta name="twitter:description" content="${descricao}"/>`,
    `<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE.caminho}"/>`,
  ].join("");
}

for (const route of routes) {
  const arquivo = join(distDir, route.dir, "index.html");
  const template = await readFile(arquivo, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(
      `${route.dir}/index.html não contém ${PLACEHOLDER}. ` +
        "A pré-renderização não pode continuar sem alterar o HTML de origem.",
    );
  }
  if (!template.includes("</head>")) {
    throw new Error(`${route.dir}/index.html não contém </head>.`);
  }

  const titulo = extrair(template, /<title>([^<]*)<\/title>/, "<title>", route.path);
  const descricao = extrair(
    template,
    /<meta\s+name="description"\s+content="([^"]*)"/,
    '<meta name="description">',
    route.path,
  );
  const canonical = `${SITE_URL}${route.path === "/" ? "/" : `${route.path}/`}`;

  const markup = render(route.path);
  if (!markup.trim()) {
    throw new Error(`A rota ${route.path} renderizou vazia no servidor.`);
  }

  const html = template
    .replace("</head>", `${montarMetadados({ titulo, descricao, canonical })}</head>`)
    .replace(PLACEHOLDER, `<div id="root">${markup}</div>`);

  await writeFile(arquivo, html, "utf8");

  resultados.push({
    rota: route.path,
    canonical,
    "HTML": `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`,
  });
}

console.table(resultados);
