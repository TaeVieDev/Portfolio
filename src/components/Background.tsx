import { useEffect, useRef } from "react";

// Composant d'arrière-plan animé : 11 carrés qui flottent du bas vers le haut.
// L'animation principale est faite en CSS (keyframes). Ici, le JS sert juste à
// randomiser la position de départ + le décalage horizontal à chaque cycle.
export default function Background() {
  // useRef : pointe vers un nœud du DOM. Persiste entre les renders SANS provoquer
  // de re-render quand on le modifie. Parfait pour accéder à du DOM brut.
  // Le type <HTMLDivElement> dit à TS que current sera une div (ou null).
  const containerRef = useRef<HTMLDivElement>(null);

  // useEffect : code qui tourne APRÈS le rendu.
  // Le tableau de dépendances [] (vide) = exécuté une seule fois au montage.
  // Si on mettait [varX], ça relancerait à chaque changement de varX.
  useEffect(() => {
    // ? = optional chaining : si containerRef.current est null, retourne undefined
    // au lieu de planter. Très utile avec les refs au montage.
    const squares = containerRef.current?.querySelectorAll<HTMLDivElement>(".square");
    if (!squares) return;

    // On garde la liste des handlers pour pouvoir les retirer dans le cleanup.
    const handlers: Array<{ el: HTMLDivElement; fn: () => void }> = [];
    squares.forEach((square) => {
      const startY = Math.random() * 100;
      square.style.bottom = startY + "vh";

      const onIter = () => {
        const randomX = (Math.random() - 0.5) * 100;
        square.style.transform = `translateX(${randomX}px)`;
      };
      square.addEventListener("animationiteration", onIter);
      handlers.push({ el: square, fn: onIter });
    });

    // Le return d'un useEffect = fonction de CLEANUP, appelée au démontage
    // (ou avant la prochaine exécution de l'effet). Ici on évite les fuites
    // mémoire en retirant les listeners.
    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("animationiteration", fn));
    };
  }, []);

  return (
    <div className="bg-decor" ref={containerRef}>
      <div className="particles">
        <div className="squares">
          {/* Array.from({length: 11}) crée un tableau de 11 cases vides.
              .map((_, i) => …) → on ignore la valeur (_) et on utilise l'index.
              La prop "key" est OBLIGATOIRE quand on rend une liste : elle aide
              React à savoir quel élément a bougé / a été ajouté / supprimé. */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="square" />
          ))}
        </div>
      </div>
      <div className="back" />
    </div>
  );
}
