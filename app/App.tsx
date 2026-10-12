import { CookieConsent } from "./components/CookieConsent";
import { findRoute } from "./routes";

/**
 * Raiz compartilhada pelo cliente e pela pré-renderização. Manter uma só
 * árvore nos dois lados é o que garante que a hidratação não divirja.
 */
export function App({ path }: { path: string }) {
  const { Component } = findRoute(path);
  return (
    <>
      <Component />
      <CookieConsent />
    </>
  );
}
