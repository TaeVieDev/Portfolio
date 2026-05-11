import FlipCard from "../components/FlipCard";

// Page d'accueil. Composée de deux sections : Hero + About.
// Le React Fragment <>…</> permet de retourner plusieurs éléments sans wrapper
// inutile dans le DOM (sinon il faudrait une <div> parente).
export default function Home() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="hero_section">
        <div className="hero_container">
          {/* Le composant FlipCard reçoit ses images en props : il est totalement
              indépendant. Si demain je veux le réutiliser ailleurs, je change juste
              les props. */}
          <FlipCard
            frontSrc="/img/photos/herophoto2.jpg"
            frontAlt="Photo de profil - Recto"
            backSrc="/img/photos/luffy.png"
            backAlt="Photo de profil - Verso"
          />

          {/* En JSX, le texte entre balises est libre. Les espaces autour des <strong>
              doivent souvent être ajoutés avec {" "} sinon ils sont mangés par le parser. */}
          <h1>
            Je m'appelle Thomas et j'étudie le développement de{" "}
            <strong>solutions logicielles et</strong>{" "}
            <strong>d'applications métiers</strong>
          </h1>

          <div className="social_links">
            <a
              href="https://github.com/thomas-montout"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-square-github" />
            </a>
            <a
              href="https://www.linkedin.com/in/thomas-montout"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-square-linkedin" />
            </a>
            <a href="mailto:montout-thomas@hotmail.fr">
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
        </div>
      </section>

      {/* id="about" → cible pour l'ancre #about depuis la nav.
          ScrollToTop le détecte et scrolle dessus. */}
      <section className="about_me_section" id="about">
        <div className="about_me_container">
          <div className="section_title">
            <h2>
              <strong>En quelques mots</strong>
            </h2>
          </div>
          <p>
            Tout a commencé par une <strong>curiosité</strong>.
            <br />
            Puis un premier tutoriel. Puis des heures à <strong>comprendre</strong>,{" "}
            <strong>tester, casser… et recommencer</strong>.
            <br />
            C'est comme ça que le <strong>développement informatique</strong> est devenu une vraie{" "}
            <strong>passion</strong>. En <strong>autodidacte</strong>, j'ai découvert ce que j'aimais
            vraiment : résoudre des problèmes, structurer des idées et leur donner vie grâce au code.
            <br />
            Aujourd'hui, je poursuis ce chemin en BTS SIO SLAM en alternance, avec une envie claire :
            monter en compétences, gagner de l'expérience terrain et construire des bases solides.
            <br />
            Objectif : devenir <strong>Software Engineer</strong>.
          </p>
        </div>

        <div className="about_me_container">
          <div className="section_title">
            <h2>
              <strong>Mon parcours académique</strong>
            </h2>
          </div>

          <div className="education-timeline">
            <div className="education-item">
              <span className="year">2025</span>
              <div className="education-details">
                <strong>BTS Services Informatiques aux Organisations</strong>
                <span className="school">Ynov Campus</span>
              </div>
            </div>

            <div className="education-item">
              <span className="year">2019</span>
              <div className="education-details">
                <strong>Licence Sociologie</strong>
                <span className="school">UVSQ Yvelines</span>
              </div>
            </div>

            <div className="education-item">
              <span className="year">2018</span>
              <div className="education-details">
                <strong>Licence d'Anglais</strong>
                <span className="school">UAG Schoelcher</span>
              </div>
            </div>

            <div className="education-item">
              <span className="year">2017</span>
              <div className="education-details">
                <strong>Baccalauréat STMG option mercatique</strong>
                <span className="school">Lycée de l'Union</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about_me_container">
          <div className="section_title">
            <h2>
              <strong>Mon parcours professionnel</strong>
            </h2>
          </div>
          <div className="education-timeline">
            <div className="education-item">
              <span className="year">2019-2025</span>
              <span className="separator" />
              <div className="education-details">
                <strong>Assistant d'Éducation</strong>
                <span className="school">
                  Collège J-P Rameau, EIB de la Jonchère, Lycée Hoche, Lycée Jules Ferry
                </span>
                <span className="job-location">Versailles, La Celle-Saint-Cloud CDD</span>
                <ul className="job-tasks">
                  <li>Assistance aux personnels pour la résolution de problèmes informatiques</li>
                  <li>Collaboration avec les équipes pour améliorer les outils numériques existants</li>
                  <li>
                    Gestion administrative : suivi des absences et retards, saisie des données sur les
                    logiciels de gestion scolaire
                  </li>
                  <li>
                    Médiation et discipline : gestion des conflits entre élèves, application du
                    règlement intérieur
                  </li>
                  <li>
                    Organisation d'événements : participation à la mise en place de projets éducatifs
                    et culturels
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cv-download">
            {/* L'attribut "download" force le téléchargement plutôt que l'ouverture en onglet.
                Le chemin commence par / car le fichier est dans /public (servi à la racine). */}
            <a href="/pdf/CV-Montout Thomas.pdf" className="btn-cv" download>
              <i className="fa-solid fa-download" />
              Télécharger mon CV
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
