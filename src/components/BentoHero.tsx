import FlipCard from "./FlipCard";

// Hero version "bento grid" : grille asymétrique où chaque cellule
// porte une info clé. On voit en un coup d'œil : photo, formation, alternance,
// stack, présentation, contact.
//
// CONCEPT PRINCIPAL : CSS Grid avec grid-template-areas. = on dessine la grille en ASCII dans le CSS, chaque mot = une zone. Ensuite, chaque cellule de la grille dit "je suis dans la zone X" avec grid-area: X. Hyper lisible, facile à maintenir et faire évoluer.
// Au lieu de penser en col-span / row-span, on dessine la grille en ASCII.
// Chaque mot = un nom de zone, c'est à dire une variable qu'on peut réutiliser dans grid-area.
// Si on veut faire évoluer la grille, on modifie juste le dessin ASCII dans le CSS, pas besoin de toucher au JSX.

// id = "hero" par défaut, mais on peut le surcharger en passant une prop id. Utile pour réutiliser ce composant dans d'autres contextes que la home.
export default function BentoHero({ id = "hero" }: { id?: string }) {
  return (
    <section id={id} className="bento">
      {/* Cellule 1 : photo (FlipCard) — non cliquable comme lien, juste le flip interne */}
      <div className="bento__cell bento__photo">
        <FlipCard
          frontSrc="/img/photos/herophoto.png"
          frontAlt="Photo de profil - Recto"
          backSrc="/img/photos/tm-logo.png"
          backAlt="Photo de profil - Verso"
        />
      </div>

      {/* Cellule 2 : BTS SIO — clic = scroll vers #bts.
          On utilise <a href="#id"> et pas <Link to="#id"> : avec scroll-behavior: smooth
          en CSS global, l'ancre HTML native scroll fluide sans React Router. */}
      <a href="#bts" className="bento__cell bento__bts bento__cell--link">
        <span className="bento__icon">
          <i className="fa-solid fa-graduation-cap" />
        </span>
        <span className="bento__label">Formation</span>
        <h3>BTS SIO SLAM</h3>
        <p>Ynov Campus</p>
      </a>

      {/* Cellule 3 : Alternance Coface — clic = scroll vers #ecole */}
      <a href="#ecole" className="bento__cell bento__coface bento__cell--link">
        <span className="bento__icon">
          <i className="fa-solid fa-briefcase" />
        </span>
        <span className="bento__label">Alternance</span>
        <h3>Coface</h3>
        <p>Administrateur Systèmes IT</p>
      </a>

      {/* Cellule 4 : Stack technique — clic = scroll vers #competences.
          Liste plate, flex-wrap centrée. La vraie pyramide est dans la page Compétences. */}
      <a href="#competences" className="bento__cell bento__stack bento__cell--link">
        <span className="bento__label">Ma stack</span>
        <div className="bento__stack-icons">
          <i className="devicon-typescript-plain colored" title="TypeScript" />
          <i className="devicon-javascript-plain colored" title="JavaScript" />
          <i className="devicon-react-plain colored" title="React" />
          <i className="devicon-nextjs-plain colored" title="Next.js" />
          <i className="devicon-symfony-original colored" title="Symfony" />
          <i className="devicon-java-plain colored" title="Java" />
          <i className="devicon-php-plain colored" title="PHP" />
          <i className="devicon-postgresql-plain colored" title="PostgreSQL" />
          <i className="devicon-mysql-plain colored" title="MySQL" />
          <i className="devicon-html5-plain colored" title="HTML5" />
          <i className="devicon-css3-plain colored" title="CSS3" />
        </div>
      </a>

      {/* Cellule 5 : Présentation + CTA.
          Nom et tagline séparés pour une vraie hiérarchie typo (avant : un seul <h1> avec <strong> inline qui rendait bizarre). */}
      <div className="bento__cell bento__intro">
        <h1>Thomas Montout</h1>
        <p className="bento__tagline">Développeur en formation, alternant chez Coface</p>
        <p>
          Étudiant en BTS SIO, j'étudie le développement de{" "}
          <strong>solutions logicielles et d'applications métiers</strong>.
        </p>
        {/* CTA réparé : ancien lien pointait vers un chemin de fichier source (.tsx) qui n'est pas une route. */}
        <a href="#missions" className="bento__cta">
          Voir mes projets <i className="fa-solid fa-arrow-right" />
        </a>
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
