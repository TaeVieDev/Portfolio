import { useRef } from "react";

// CUSTOM HOOK : fonction qui commence par "use" + qui utilise d'autres hooks.
// Permet de factoriser une logique réactive et de la réutiliser sur plusieurs composants.
// Ici on encapsule l'effet "spotlight au curseur" : un halo lumineux qui suit la souris.
//
// IDÉE TECHNIQUE :
// - On écoute mousemove sur l'élément
// - On calcule la position relative à la carte avec getBoundingClientRect()
// - On écrit la position dans 2 custom properties CSS (--mouse-x, --mouse-y)
// - Le CSS lit ces variables pour positionner un radial-gradient
// → Aucune state React, aucun rerender : c'est ultra performant.
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  // useRef : référence vers le DOM. Pas de rerender quand on touche ref.current.
  // <T> = générique TS : par défaut HTMLDivElement, mais on peut typer autrement
  //  si on l'applique à un <article>, <section>, etc.
  const ref = useRef<T>(null);

  // Le handler reçoit l'event React, on calcule x/y dans le repère de la carte.
  const onMouseMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // setProperty écrit une CSS variable directement sur l'élément.
    // C'est ce que le CSS va lire dans le radial-gradient.
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // On retourne { ref, onMouseMove } : il suffit de les brancher sur l'élément cible.
  return { ref, onMouseMove };
}
