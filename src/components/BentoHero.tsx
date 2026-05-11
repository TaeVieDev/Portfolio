import { Link } from "react-router-dom";
import FlipCard from "./FlipCard";

// Hero version "bento grid" — style Apple : grille asymétrique où chaque cellule
// porte une info clé. On voit en un coup d'œil : photo, formation, alternance,
// stack, présentation, contact.
//
// CONCEPT PRINCIPAL : CSS Grid avec grid-template-areas.
// Au lieu de penser en col-span / row-span, on dessine la grille en ASCII :
//   "photo photo bts coface"
//   "photo photo stack stack"
//   "intro intro intro social"
// Chaque mot = un nom de zone. Les cellules ont juste grid-area: photo,
// la grille les place automatiquement. Hyper lisible.
export default function BentoHero() {
  return (
    <section className="bento">
      {/* Cellule 1 : photo (FlipCard récupéré tel quel) */}
      <div className="bento__cell bento__photo">
        <FlipCard
          frontSrc="/img/photos/herophoto2.jpg"
          frontAlt="Photo de profil - Recto"
          backSrc="/img/photos/luffy.png"
          backAlt="Photo de profil - Verso"
        />
      </div>

      {/* Cellule 2 : BTS SIO */}
      <div className="bento__cell bento__bts">
        <span className="bento__icon">
          <i className="fa-solid fa-graduation-cap" />
        </span>
        <span className="bento__label">Formation</span>
        <h3>BTS SIO SLAM</h3>
        <p>Ynov Campus</p>
      </div>

      {/* Cellule 3 : Alternance Coface */}
      <div className="bento__cell bento__coface">
        <span className="bento__icon">
          <i className="fa-solid fa-briefcase" />
        </span>
        <span className="bento__label">Alternance</span>
        <h3>Coface</h3>
        <p>Administrateur Systèmes IT</p>
      </div>

      {/* Cellule 4 : Stack technique */}
      <div className="bento__cell bento__stack">
        <span className="bento__label">Ma stack</span>
        <div className="bento__stack-icons">
          <i className="devicon-html5-plain colored" title="HTML5" />
          <i className="devicon-css3-plain colored" title="CSS3" />
          <i className="devicon-javascript-plain colored" title="JavaScript" />
          <i className="devicon-typescript-plain colored" title="TypeScript" />
          <i className="devicon-react-plain colored" title="React" />
          <i className="devicon-php-plain colored" title="PHP" />
          <i className="devicon-symfony-original colored" title="Symfony" />
        </div>
      </div>

      {/* Cellule 5 : Présentation + CTA */}
      <div className="bento__cell bento__intro">
        <h1>
          Je m'appelle <strong>Thomas</strong>
        </h1>
        <p>
          Étudiant en BTS SIO, j'étudie le développement de{" "}
          <strong>solutions logicielles et d'applications métiers</strong>.
        </p>
        <Link to="/missions-e5" className="bento__cta">
          Voir mes projets <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>

      {/* Cellule 6 : Réseaux */}
      <div className="bento__cell bento__social">
        <a
          href="https://github.com/thomas-montout"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <i className="fa-brands fa-square-github" />
        </a>
        <a
          href="https://www.linkedin.com/in/thomas-montout"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="fa-brands fa-square-linkedin" />
        </a>
        <a href="mailto:montout-thomas@hotmail.fr" aria-label="Email">
          <i className="fa-solid fa-envelope" />
        </a>
      </div>
    </section>
  );
}
