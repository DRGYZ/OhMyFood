import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";

if (window.location.search && (!window.location.hash || window.location.hash === "#/")) {
  const next = window.location.pathname + "#/" + window.location.search;
  window.history.replaceState(null, "", next);
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("The application root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
