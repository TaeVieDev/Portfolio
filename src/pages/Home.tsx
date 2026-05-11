import BentoHero from "../components/BentoHero";
import BtsSio from "./BtsSio";
import Competence from "./Competence";
import EcoleAlternance from "./EcoleAlternance";
import MissionsE5 from "./MissionsE5";
import Contact from "./Contact";

// Home en single-page : toutes les sections du portfolio sont rendues à la suite.
// Chaque section a un id → le header pill scrolle dessus, et l'IntersectionObserver
// du header détecte laquelle est visible pour highlighter le lien actif.
//
// On réutilise les composants de page existants (BtsSio, Competence, etc.) en tant
// que sections. Aucune duplication de code : un seul endroit définit chaque section.
export default function Home() {
  return (
    <>
      {/* Hero en bento grid (id="hero" par défaut) */}
      <BentoHero />

      {/* About : section spécifique à la home, donc inline ici */}
      <section id="about" className="about_me_section">
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
            <a href="/pdf/CV-Montout Thomas.pdf" className="btn-cv" download>
              <i className="fa-solid fa-download" />
              Télécharger mon CV
            </a>
          </div>
        </div>
      </section>

      {/* Les autres sections : composants standalone réutilisés en tant que sections.
          Chacun a un id par défaut → cohérence avec le header pill. */}
      <BtsSio />
      <Competence />
      <EcoleAlternance />
      <MissionsE5 />
      <Contact />
    </>
  );
}
