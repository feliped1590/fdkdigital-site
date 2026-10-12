import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Build auxiliar: gera o bundle que scripts/prerender.mjs executa em Node
// para escrever o HTML de cada rota. Não é publicado.
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    ssr: "entry-server.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
  },
});
