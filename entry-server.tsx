import { renderToString } from "react-dom/server";
import { findRoute } from "./app/routes";

export { routes } from "./app/routes";

/** Executado em Node pelo scripts/prerender.mjs, durante o build. */
export function render(path: string): string {
  const { Component } = findRoute(path);
  return renderToString(<Component />);
}
