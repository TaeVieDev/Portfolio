import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Composant "effet pur" : ne rend rien à l'écran (return null), il existe juste
// pour exécuter du code quand l'URL change.
// Pattern utile pour : analytics, scroll restoration, sync avec un store externe…
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
    // Deps : on relance à chaque changement de pathname OU de hash.
  }, [pathname, hash]);

  // Retourner null = "ne rend rien". Valide en React et idiomatique pour ce pattern.
  return null;
}
