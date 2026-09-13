import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./app/page";
import { DataDeletion, PrivacyPolicy, Terms } from "./app/legal";
import "./app/globals.css";
import "./app/story.css";

const path = window.location.pathname.replace(/\/$/, "");
const Page = path === "/politica-de-privacidade" ? PrivacyPolicy : path === "/termos-de-uso" ? Terms : path === "/exclusao-de-dados" ? DataDeletion : Home;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
);
