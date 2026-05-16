import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Liste centralisée des items de nav : ajouter une entrée = ajouter ici, pas dans le JSX.
const navItems = [
  { id: "hero", label: "Accueil" },
  { id: "bts", label: "BTS" },
  { id: "competences", label: "Compétences" },
  { id: "ecole", label: "École" },
  { id: "missions", label: "Missions" },
  { id: "contact", label: "Contact" },
];

// Header flottant
// - Centré en haut, fond semi-transparent + backdrop-blur (effet de flou sur le fond)
// - Liens ancres qui scrollent vers les sections de Home
// - Détection auto de la section active via IntersectionObserver
//   → le lien actif change tout seul quand on scrolle.
export default function Header() {
  // active = id de la section actuellement active
  const [active, setActive] = useState<string>("hero"); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation(); // useLocation = info sur l'URL actuelle (pathname, hash, etc.)
  const navigate = useNavigate(); // useNavigate = fonction pour naviguer vers une autre URL (ex : navigate("/#contact") pour aller à la section contact)

  // Les ancres ne sont valides que sur la home : sur une page détail, on doit
  // d'abord revenir à "/" avant de scroller.
  const onHome = location.pathname === "/";

  // IntersectionObserver : observe chaque <section id="..."> et nous prévient
  // quand elle entre/sort du viewport.
  // rootMargin "-40% 0px -50% 0px" → la zone active est dans la moitié haute
  // du viewport, ce qui donne un effet "le lien change un peu avant que la
  // section atteigne le haut", plus naturel.

  useEffect(() => {
    // On utilise useEffect quand on veut faire du DOM pur ou des opérations qui interagissent avec le monde extérieur à React (ex : API, timer, DOM).
    // Ici, on fait du DOM pur : on observe les sections pour détecter laquelle est visible.
    if (!onHome) return; // Si on n'est pas sur la home, on ne monte pas l'observer (pas de sections à observer).

    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (sections.length === 0) return; // Si aucune section n'a d'id, on ne fait rien (sécurité pour éviter des erreurs plus bas).

    //IntersectionObserver = API du navigateur qui permet de détecter quand un élément entre/sort d'une zone définie (ex: le viewport).
    // callback de l'observer, appelée à chaque fois qu'une section entre/sort du viewport
    // entries = liste des sections observées qui ont changé de visibilité (peuvent être plusieurs à la fois)
    // entry.isIntersecting = true → la section est visible dans la zone définie par rootMargin
    // Si une section devient visible, on met à jour active avec son id, ce qui met à jour le lien actif dans le header.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    ); //EO observer

    // On dit à l'observer d'observer chaque section. À partir de là, il nous préviendra via la callback quand une section entrera/sortira de la zone définie par rootMargin.
    sections.forEach((s) => observer.observe(s));
    // Cleanup : déconnecte l'observer au démontage (sinon fuite mémoire).
    return () => observer.disconnect();
  }, [onHome]); // EO useEffect, onHome en dépendance parce que si on change de page, on doit arrêter d'observer les sections.

  // Clic sur un lien : empêche le saut brutal, navigue smooth.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien (saut brutal à l'ancre). On gère le scroll nous-mêmes pour pouvoir faire du smooth scrolling et fermer le menu mobile.
    setMobileOpen(false);

    // Si on n'est pas sur la home, on y va d'abord. Le useEffect de ScrollToTop
    // se chargera ensuite de scroller vers l'ancre.
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    // scrollIntoView({ behavior: "smooth" }) = scroll jusqu'à l'élément de manière fluide au lieu de sauter brutalement.
    el?.scrollIntoView({ behavior: "smooth" });
    // Met à jour l'URL sans recharger la page (l'utilisateur peut copier le lien).
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="pill-header">
      {/* Burger mobile : caché sur desktop via CSS */}
      <button className="pill-burger" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
        <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
      </button>

      <nav className={`pill-nav ${mobileOpen ? "open" : ""}`}>
        {/* map = méthode pour faire une boucle dans le JSX, cela va créer un lien pour chaque item de la liste navItems. */}
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={active === item.id ? "active" : ""}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
