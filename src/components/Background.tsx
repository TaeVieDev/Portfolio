import { useEffect, useRef } from "react";

// Arrière-plan repensé : on retire les particules au profit de deux effets plus subtils :
//   1. Une grille de points fine (radial-gradient répété) — texture "techno" discrète
//   2. Un halo lumineux qui suit le curseur sur TOUTE la page
//
// NOTIONS À RETENIR :
// - Pas de state React → on met à jour des CSS variables (--cursor-x/y) avec
//   ref.current.style.setProperty(). Aucun rerender → ultra performant.
// - requestAnimationFrame "throttle" mousemove : on n'écrit dans le DOM
//   qu'une fois par frame (max 60fps). Sans ça, le navigateur ramerait.
// - { passive: true } sur l'event = on dit au navigateur "je ne préviendrai pas le scroll",
//   ce qui lui permet d'optimiser le défilement.
export default function Background() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      // Si une frame est déjà planifiée, on ne replanifie pas.
      // → on n'écrit dans le DOM qu'une fois par rafraîchissement écran.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const el = glowRef.current;
        if (el) {
          el.style.setProperty("--cursor-x", `${lastX}px`);
          el.style.setProperty("--cursor-y", `${lastY}px`);
        }
        frame = 0;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    // Cleanup : on retire le listener au démontage pour éviter une fuite mémoire.
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bg-decor" ref={glowRef}>
      {/* Couche 1 : grille de dots (CSS pur, voir index.css) */}
      <div className="bg-decor__dots" />
      {/* Couche 2 : halo curseur (radial-gradient positionné via --cursor-x/y) */}
      <div className="bg-decor__glow" />
    </div>
  );
}
