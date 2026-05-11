import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Point d'entrée : c'est ICI que React s'accroche au DOM (la div#root dans index.html).
// StrictMode = mode dev qui rend deux fois chaque composant pour repérer les effets
// secondaires foireux. Aucun impact en prod.
// BrowserRouter doit englober tout le composant pour pouvoir utiliser <Link>, useLocation, etc.
// Le "!" après getElementById dit à TS "je te garantis que ce n'est pas null".
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
