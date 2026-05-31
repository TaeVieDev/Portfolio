import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// CUSTOM HOOK : applique un fade-in fluide à toutes les <section> visibles à l'écran.
//
// IDÉE :
// - Au montage (et à chaque changement de route), on parcourt toutes les <section> du DOM.
// - Celles déjà visibles dans le viewport reçoivent direct la classe ".is-revealed"
//   (pas d'animation au load → évite le flash blanc le temps que le JS s'attache).
// - Celles hors-écran reçoivent seulement ".reveal-section" (état initial caché)
//   et un IntersectionObserver les révélera quand elles entreront dans le viewport.
// - "one-shot" : une fois révélée, la section n'est plus observée → on libère le navigateur.
//
// L'hook est appelé une fois dans <App />. La dépendance [pathname] re-déclenche
// l'effet quand on change de page (ex: Home → /missions/:slug) pour ré-observer
// les sections de la nouvelle page.
export function useRevealOnScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section");
    if (sections.length === 0) return;

    // Respect des préférences utilisateur : si l'OS demande "réduire les animations",
    // on affiche tout d'emblée sans transition (accessibilité, RGAA).
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sections.forEach((s) => s.classList.add("reveal-section", "is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // One-shot : on arrête d'observer après la première révélation.
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold:0 = la section est "vue" dès qu'un seul pixel croise le viewport.
      // Pourquoi 0 et pas 0.1 ? Pour les sections plus hautes que ~10x le viewport (mobile,
      // missions qui empilent toutes les cartes en 1 colonne), intersectionRatio max =
      // viewport_height / section_height < 0.1 → l'observer ne se déclencherait JAMAIS.
      // rootMargin négatif en bas = on déclenche un peu avant que le bas du viewport l'atteigne.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      // "Déjà visible au load" = le haut de la section est au-dessus de 90% du viewport.
      const alreadyVisible = rect.top < window.innerHeight * 0.9;
      if (alreadyVisible) {
        // Pas d'animation pour ces sections : on les passe direct à "révélé".
        section.classList.add("reveal-section", "is-revealed");
      } else {
        // État initial caché + observation.
        section.classList.add("reveal-section");
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);
}
