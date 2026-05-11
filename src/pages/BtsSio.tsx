import { useSpotlight } from "../hooks/useSpotlight";

// Page Le BTS : deux cartes côte à côte (SLAM / SISR) qui passent en colonne sur mobile.
// La grille est en Tailwind : grid-cols-1 par défaut, md:grid-cols-2 à partir de 768px.
// md: est un préfixe responsive Tailwind, équivalent à @media (min-width: 768px).
export default function BtsSio() {
  // Deux appels indépendants au hook : chacun a son propre ref.
  // Hooks appelés au TOP du composant → conforme aux Rules of Hooks.
  const slam = useSpotlight();
  const sisr = useSpotlight();

  return (
    <section className="bts_sio_section">
      <div className="bts_sio_container">
        <div className="section_title">
          <h2>
            <strong>Le BTS SIO</strong>
          </h2>
        </div>
        <p>
          Le <strong>BTS Services Informatiques aux Organisations</strong> forme des techniciens
          supérieurs capables de gérer et développer des solutions informatiques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div
            ref={slam.ref}
            onMouseMove={slam.onMouseMove}
            className="option-card slam-card spotlight"
          >
            <div className="option-badge slam-badge">SLAM</div>
            <h3>Solutions Logicielles</h3>
            <p className="option-subtitle">L'art de concevoir des applications</p>
            <p>
              Cette spécialité forme les créateurs du numérique. Le but est de traduire les besoins
              des utilisateurs en solutions concrètes : applications mobiles, sites web ou logiciels
              d'entreprise. Au-delà du simple codage, il s'agit de maîtriser le cycle de vie complet
              d'une application, de sa conception à sa maintenance, tout en intégrant rigoureusement
              la sécurité des données au cœur du développement.
            </p>
            <div className="debouches-section">
              <h4>Débouchés professionnels</h4>
              <ul className="debouches-list">
                <li>Développeur d'applications web/mobile</li>
                <li>Développeur back-end/front-end</li>
                <li>Analyste-programmeur</li>
                <li>Testeur/Technicien de maintenance applicative</li>
                <li>Gestionnaire de Bases de Données</li>
              </ul>
            </div>
          </div>

          <div
            ref={sisr.ref}
            onMouseMove={sisr.onMouseMove}
            className="option-card sisr-card spotlight"
          >
            <div className="option-badge">SISR</div>
            <h3>Solutions d'Infrastructure</h3>
            <p className="option-subtitle">L'architecture et la maîtrise des réseaux</p>
            <p>
              Cette voie se concentre sur les fondations de l'informatique. L'objectif est de
              garantir qu'une entreprise reste connectée et opérationnelle en permanence. Le
              spécialiste SISR installe, administre et supervise les serveurs et les réseaux. Il
              joue un rôle crucial de protection en assurant la cybersécurité de l'infrastructure
              contre les intrusions et les pannes.
            </p>
            <div className="debouches-section">
              <h4>Débouchés professionnels</h4>
              <ul className="debouches-list">
                <li>Administrateur systèmes et réseaux</li>
                <li>Technicien d'infrastructure</li>
                <li>Technicien support et déploiement</li>
                <li>Administrateur Cloud</li>
                <li>Technicien Sécurité Informatique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
