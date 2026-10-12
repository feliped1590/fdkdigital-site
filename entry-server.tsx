import { renderToString } from "react-dom/server";
import { App } from "./app/App";

export { routes } from "./app/routes";

/** Executado em Node pelo scripts/prerender.mjs, durante o build. */
export function render(path: string): string {
  return renderToString(<App path={path} />);
}
