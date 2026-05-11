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

// Header "pill" flottant — style portfolio moderne.
// - Centré en haut, fond semi-transparent + backdrop-blur (effet verre)
// - Liens ancres qui scrollent vers les sections de Home
// - Détection auto de la section active via IntersectionObserver
//   → le lien actif change tout seul quand on scrolle.
export default function Header() {
  const [active, setActive] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Les ancres ne sont valides que sur la home : sur une page détail, on doit
  // d'abord revenir à "/" avant de scroller.
  const onHome = location.pathname === "/";

  // IntersectionObserver : observe chaque <section id="..."> et nous prévient
  // quand elle entre/sort du viewport.
  // rootMargin "-40% 0px -50% 0px" → la zone active est dans la moitié haute
  // du viewport, ce qui donne un effet "le lien change un peu avant que la
  // section atteigne le haut", plus naturel.
  useEffect(() => {
    if (!onHome) return;
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    // Cleanup : déconnecte l'observer au démontage (sinon fuite mémoire).
    return () => observer.disconnect();
  }, [onHome]);

  // Clic sur un lien : empêche le saut brutal, navigue smooth.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);

    // Si on n'est pas sur la home, on y va d'abord. Le useEffect de ScrollToTop
    // se chargera ensuite de scroller vers l'ancre.
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    // Met à jour l'URL sans recharger la page (l'utilisateur peut copier le lien).
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="pill-header">
      {/* Burger mobile : caché sur desktop via CSS */}
      <button
        className="pill-burger"
        aria-label="Menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
      </button>

      <nav className={`pill-nav ${mobileOpen ? "open" : ""}`}>
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
