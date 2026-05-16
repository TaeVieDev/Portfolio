// useEffect = side effects, c'est à dire des opérations qui interagissent avec le monde extérieur à React (ex : API, timer, DOM).
// Ici, on l'utilise pour faire du DOM pur : suivre les mouvements de la souris et mettre à jour des variables CSS en conséquence.
// useRef sert à garder une référence vers un élément DOM, c'est dire "je veux pouvoir accéder à cet élément pour le manipuler directement"
import { useEffect, useRef } from "react";

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
    // Monte un side effect, un side effect c'est une opération qui interagit avec le monde extérieur à React (ex : API, timer, DOM).
    let frame = 0; // un frame  c'est une image affichée à l'écran. 60fps = 60 frames par seconde. On utilise cette variable pour s'assurer de ne pas faire plus d'une mise à jour par frame, ce qui est crucial pour les performances lors du suivi du mouvement de la souris.

    // Ici je cherche j'initialise deux variables pour stocker les dernières coordonnées X et Y du curseur.
    // Ces variables sont mises à jour à chaque mouvement de souris.
    let lastX = 0;
    let lastY = 0;

    // La fonction onMove est appelée à chaque fois que la souris bouge.
    // On passe e en paramètre de onMove, c'est un objet qui contient des informations sur l'événement de souris, comme les coordonnées du curseur.
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX; // clientX et clientY donnent les coordonnées du curseur par rapport à la fenêtre d'affichage (viewport).
      lastY = e.clientY;

      // Si une frame est déjà planifiée, on ne replanifie pas.
      // → on n'écrit dans le DOM qu'une fois par rafraîchissement écran.
      if (frame) return; // Ici je verifie si une mise à jour est déjà en attente (frame !== 0). Si c'est le cas, on sort de la fonction pour éviter de planifier une nouvelle mise à jour avant que la précédente ne soit exécutée.

      // requestAnimationFrame est une fonction qui dit au navigateur "exécute cette fonction avant le prochain rafraîchissement de l'écran". C'est idéal pour les animations, car cela permet de synchroniser les mises à jour avec le taux de rafraîchissement du navigateur, assurant ainsi des animations fluides et performantes.
      frame = requestAnimationFrame(() => {
        // el pour "element". Ici je récupère la référence à l'élément DOM du halo lumineux grâce à glowRef.current. C'est cet élément que je vais manipuler pour faire suivre le halo au curseur.
        const el = glowRef.current;
        if (el) {
          // Je mets à jour les variables CSS --cursor-x et --cursor-y de l'élément du halo lumineux avec les dernières coordonnées du curseur. Ces variables sont utilisées dans le CSS pour positionner le halo.
          // setProperty = méthode qui permet de définir une nouvelle valeur pour une propriété CSS.
          el.style.setProperty("--cursor-x", `${lastX}px`);
          el.style.setProperty("--cursor-y", `${lastY}px`);
        }
        // Après la mise à jour, on remet frame à 0 pour indiquer qu'on est prêt à planifier une nouvelle mise à jour lors du prochain mouvement de souris.
        frame = 0;
      }); // EO requestAnimationFrame
    }; // EO onMove

    // On ajoute un écouteur d'événement pour les mouvements de souris. Chaque fois que la souris bouge, la fonction onMove est appelée.
    window.addEventListener("mousemove", onMove, { passive: true }); // passive: true indique au navigateur que la fonction onMove ne va pas appeler preventDefault(), ce qui permet au navigateur d'optimiser le défilement et les performances.
    // Cleanup : on retire le listener au démontage pour éviter une fuite mémoire.
    return () => {
      // On retire l'écouteur d'événement pour les mouvements de souris lorsque le composant est démonté. C'est important pour éviter les fuites de mémoire et les comportements inattendus si le composant est réutilisé ou si l'utilisateur navigue vers une autre page.
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []); // EO useEffect, Le tableau de dépendances vide [] signifie que ce useEffect ne s'exécutera qu'une seule fois, au montage du composant. C'est parfait pour notre cas, car nous voulons juste configurer l'écouteur d'événements une fois et le nettoyer au démontage.

  return (
    // Le composant retourne une div qui contient les éléments de décoration de fond. La classe "bg-decor" est utilisée pour appliquer les styles CSS, et la référence glowRef est attachée à cette div pour permettre la manipulation du halo lumineux.
    <div className="bg-decor" ref={glowRef}>
      {/* Couche 1 : grille de dots (CSS pur, voir index.css) */}
      <div className="bg-decor__dots" />
      {/* Couche 2 : halo curseur (radial-gradient positionné via --cursor-x/y) */}
      <div className="bg-decor__glow" />
    </div>
  );
}
