import { useEffect, useState } from "react";

// Composant qui combine 2 features liées au scroll :
//   1. Une barre fine en haut de page qui montre la progression du scroll.
//   2. Un bouton flottant "retour en haut" qui apparaît après 400px scrollés.
//
// On gère les deux dans un seul composant pour mutualiser l'écouteur scroll
// (un seul handler au lieu de deux → plus performant).
export default function ScrollUI() {
  // progress en pourcentage (0-100), used as width: ${progress}%
  const [progress, setProgress] = useState(0);
  // visible = bouton back-to-top apparaît si true
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      // requestAnimationFrame throttle : on n'écrit dans le state qu'une fois par frame max,
      // sinon React rerender à chaque pixel scrollé = catastrophique en perf.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        // scrollHeight - clientHeight = distance totale "scrollable" (hauteur doc moins hauteur viewport)
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        // Cas limite : page trop courte pour scroller → maxScroll = 0, on évite la division par zéro
        const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        setProgress(pct);
        setVisible(scrollTop > 400);
        frame = 0;
      });
    };

    // passive: true → on prévient le navigateur qu'on n'appellera pas preventDefault,
    // ce qui lui permet d'optimiser le défilement.
    window.addEventListener("scroll", onScroll, { passive: true });
    // Appel initial pour calculer la position au montage (utile si l'utilisateur recharge en plein milieu de page)
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Smooth scroll vers le haut quand on clique sur le bouton.
  // scroll-behavior: smooth est défini globalement en CSS sur <html>, ça marche aussi pour scrollTo.
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Barre de progression : div fine fixée en haut, width = progression */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      {/* Bouton retour en haut : visible/masqué via classe CSS pour bénéficier des transitions */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`scroll-top ${visible ? "is-visible" : ""}`}
        aria-label="Retour en haut"
      >
        <i className="fa-solid fa-arrow-up" />
      </button>
    </>
  );
}
