import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Composant "effet pur" : ne rend rien à l'écran (return null), il existe juste
// pour exécuter du code quand l'URL change.
// ScrollToTop : à chaque changement de route, scroll en haut de la page.
export default function ScrollToTop() {
  // Déstructuration de l'objet location en pathname + hash.
  // pathname = "/contact", hash = "#about" (vide si pas d'ancre).
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si y'a un hash dans l'URL → on scrolle vers l'élément correspondant.
    if (hash) {
      const el = document.getElementById(hash.slice(1)); // slice(1) enlève le "#"
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return; // early return : on quitte l'effet, pas besoin du scrollTo
      }
    }
    // Sinon scroll en haut de la page à chaque changement de route.
    window.scrollTo(0, 0);
  }, [pathname, hash]); // EO useEffect, on met pathname et hash en dépendances pour que l'effet se déclenche à chaque changement de route et d'ancre).

  // Retourner null = "ne rend rien". Ce composant n'a pas de rendu visuel, il sert juste à exécuter du code (side effect) quand l'URL change.
  return null;
}
