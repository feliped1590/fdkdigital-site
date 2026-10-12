import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/globals.css";
import "./app/story.css";
import "./app/refinements.css";
import "./app/consent.css";

const container = document.getElementById("root")!;
const tree = (
  <React.StrictMode>
    <App path={window.location.pathname} />
  </React.StrictMode>
);

// O HTML de cada rota é gerado no build. Hidrata quando há marcação;
// monta do zero se por algum motivo não houver.
if (container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
