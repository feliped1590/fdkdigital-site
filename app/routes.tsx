import type { ComponentType } from "react";
import Home from "./page";
import { DataDeletion, PrivacyPolicy, Terms } from "./legal";
import Industrial360 from "./industrial-360";

export type RouteDefinition = {
  /** Caminho servido, sem barra final. "/" é a Home. */
  path: string;
  /** Diretório correspondente dentro de dist/. */
  dir: string;
  Component: ComponentType;
};

/** Fonte única das rotas: usada pelo cliente, pelo SSR e pela pré-renderização. */
export const routes: RouteDefinition[] = [
  { path: "/", dir: ".", Component: Home },
  { path: "/politica-de-privacidade", dir: "politica-de-privacidade", Component: PrivacyPolicy },
  { path: "/termos-de-uso", dir: "termos-de-uso", Component: Terms },
  { path: "/exclusao-de-dados", dir: "exclusao-de-dados", Component: DataDeletion },
  { path: "/industrial-360", dir: "industrial-360", Component: Industrial360 },
];

export function findRoute(pathname: string): RouteDefinition {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return routes.find((route) => route.path === normalized) ?? routes[0];
}
