import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  // useState : retourne [valeur, setter].
  // Le type <string | null> dit qu'au démarrage, aucun dropdown n'est ouvert (null).
  // Quand un dropdown est ouvert, on stocke sa clé ("home" ou "missions").
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Booléen pour le menu burger mobile : ouvert / fermé.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ref pour cibler le <nav> si besoin d'y accéder en DOM brut.
  const navRef = useRef<HTMLElement>(null);

  // useLocation : hook de React Router. Donne l'URL courante.
  // Utile pour réagir aux changements de route (voir useEffect plus bas).
  const location = useLocation();

  // Ferme les dropdowns quand on clique en dehors.
  // Le useEffect s'attache UNE FOIS au montage (deps = []) et nettoie au démontage.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      // .closest() remonte la chaîne des parents : si le clic ne vient pas
      // d'un .dropdown-nav, on ferme tout.
      if (!(e.target as HTMLElement).closest(".dropdown-nav")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Cet useEffect se relance à CHAQUE changement de pathname → on ferme le menu
  // mobile et les dropdowns quand l'utilisateur navigue.
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Toggle : si on clique sur le dropdown déjà ouvert, on le ferme.
  // Sinon, on l'ouvre (ce qui ferme automatiquement l'autre).
  const toggleDropdown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation(); // empêche la propagation au document → sinon le onDocClick juste après refermerait tout
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header id="header" className="fixed top-0 left-0 right-0 z-1000">
      <button
        className="menu-burger"
        aria-label="Menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        {/* className conditionnel via template string : on change l'icône selon l'état */}
        <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
      </button>

      <nav
        ref={navRef}
        className={`links ${mobileOpen ? "open" : ""}`}
        // Style inline en JS : doit être un objet { propCSS: valeur }.
        // Custom properties (--items) → cast en React.CSSProperties pour que TS accepte.
        style={{ "--items": 5 } as React.CSSProperties}
      >
        <div className={`dropdown-nav ${openDropdown === "home" ? "active" : ""}`}>
          <a href="#" className="dropdown-trigger" onClick={(e) => toggleDropdown(e, "home")}>
            Home
          </a>
          <div className="dropdown-content">
            {/* <Link> = navigation SPA (pas de reload). À utiliser pour les routes internes. */}
            <Link to="/" onClick={closeMobile}>
              Accueil
            </Link>
            {/* <a href="#about"> = ancre HTML classique. Le scroll smooth est dans le CSS. */}
            <a href="#about" onClick={closeMobile}>
              À propos
            </a>
            <Link to="/competence" onClick={closeMobile}>
              Compétences
            </Link>
          </div>
        </div>

        <Link to="/bts-sio" onClick={closeMobile}>
          Le BTS
        </Link>
        <Link to="/ecole-alternance" onClick={closeMobile}>
          École et alternance
        </Link>

        <div className={`dropdown-nav ${openDropdown === "missions" ? "active" : ""}`}>
          <a
            href="#"
            className="dropdown-trigger"
            onClick={(e) => toggleDropdown(e, "missions")}
          >
            Missions et Projets
          </a>
          <div className="dropdown-content">
            <Link to="/missions-e5" onClick={closeMobile}>
              Missions E5
            </Link>
          </div>
        </div>

        <Link to="/contact" onClick={closeMobile}>
          Contact
        </Link>

        <span className="line" />
      </nav>
    </header>
  );
}
