/**
 * Escreve o HTML de cada rota dentro do index.html já gerado pelo Vite.
 *
 * Roda depois dos dois builds:
 *   1. vite build                             -> dist/ (assets + um index.html por rota)
 *   2. vite build --config vite.ssr.config.ts -> dist-ssr/entry-server.js
 *
 * Só o corpo é substituído. O <head> de cada página — título, descrição,
 * favicon — continua sendo o do arquivo-fonte, que já é próprio por rota.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectRoot, "dist");
const serverEntry = join(projectRoot, "dist-ssr", "entry-server.js");

const { render, routes } = await import(pathToFileURL(serverEntry).href);

const PLACEHOLDER = '<div id="root"></div>';
const resultados = [];

for (const route of routes) {
  const arquivo = join(distDir, route.dir, "index.html");
  const template = await readFile(arquivo, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(
      `${route.dir}/index.html não contém ${PLACEHOLDER}. ` +
        "A pré-renderização não pode continuar sem alterar o HTML de origem.",
    );
  }

  const markup = render(route.path);

  if (!markup.trim()) {
    throw new Error(`A rota ${route.path} renderizou vazia no servidor.`);
  }

  const html = template.replace(PLACEHOLDER, `<div id="root">${markup}</div>`);
  await writeFile(arquivo, html, "utf8");

  resultados.push({
    rota: route.path,
    "HTML antes": `${(Buffer.byteLength(template) / 1024).toFixed(1)} KB`,
    "HTML depois": `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`,
  });
}

console.table(resultados);
