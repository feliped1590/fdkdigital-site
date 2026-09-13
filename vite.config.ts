import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", rollupOptions: { input: { main: resolve(__dirname, "index.html"), privacy: resolve(__dirname, "politica-de-privacidade/index.html"), terms: resolve(__dirname, "termos-de-uso/index.html"), deletion: resolve(__dirname, "exclusao-de-dados/index.html") } } },
});
