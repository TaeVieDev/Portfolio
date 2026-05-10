import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown-nav")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header id="header" className="fixed top-0 left-0 right-0 z-[1000]">
      <button
        className="menu-burger"
        aria-label="Menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
      </button>

      <nav
        ref={navRef}
        className={`links ${mobileOpen ? "open" : ""}`}
        style={{ "--items": 5 } as React.CSSProperties}
      >
        <div className={`dropdown-nav ${openDropdown === "home" ? "active" : ""}`}>
          <a href="#" className="dropdown-trigger" onClick={(e) => toggleDropdown(e, "home")}>
            Home
          </a>
          <div className="dropdown-content">
            <Link to="/" onClick={closeMobile}>
              Accueil
            </Link>
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
