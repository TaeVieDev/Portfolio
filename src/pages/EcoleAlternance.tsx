import { useSpotlight } from "../hooks/useSpotlight";

// Page École & Alternance.
// À RETENIR pour le JSX :
// - Les attributs HTML deviennent camelCase : autoplay → autoPlay, playsinline → playsInline.
// - "class" est un mot-clé JS → en JSX on écrit "className".
// - Les booléens d'attribut HTML (autoplay="autoplay") sont juste écrits sans valeur en JSX.
export default function EcoleAlternance() {
  // Un hook par carte : chacune a son propre halo lumineux qui suit le curseur.
  const ynov = useSpotlight();
  const coface = useSpotlight();

  return (
    <section className="ecole_alternance_section">
      <div className="ecole_alternance_container">
        <div className="section_title">
          <h2>
            <strong>École et Alternance</strong>
          </h2>
          <p>Mon parcours de formation et mon expérience professionnelle</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {/* ECOLE */}
          <div
            ref={ynov.ref}
            onMouseMove={ynov.onMouseMove}
            className="info-card ynov-card spotlight"
          >
            <img
              src="/img/photos/Ynov accueil.avif"
              alt="Accueil Ynov Campus"
              className="ynov-accueil-img"
            />
            <div className="info-badge">MON ÉCOLE</div>
            <h3>Paris Ynov Campus</h3>
            <p className="info-subtitle">L'école digitale dédiée aux métiers de demain</p>
            <p className="text-ynov">
              Ynov Campus est un établissement d'enseignement supérieur spécialisé dans les
              formations aux métiers du numérique, de l'informatique, de la création et de
              l'innovation. Il propose des parcours professionnalisants du BTS au Mastère, en
              initial ou en alternance. Sa pédagogie est axée sur la pratique, les compétences
              concrètes et l'employabilité.
            </p>
          </div>

          {/* ALTERNANCE */}
          <div
            ref={coface.ref}
            onMouseMove={coface.onMouseMove}
            className="info-card coface-card spotlight"
          >
            {/* Vidéo en boucle muette : autoPlay/loop/muted/playsInline sont des booléens JSX.
                playsInline est crucial sur iOS (sinon la vidéo passe en fullscreen).
                muted est indispensable pour que autoPlay fonctionne sur la plupart des navigateurs. */}
            <video className="coface-video" autoPlay loop muted playsInline>
              <source src="/media/videos/coface.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
            <div className="info-badge coface-badge">MON ALTERNANCE</div>
            <h3>Coface - Administrateur Systèmes IT</h3>
            <p className="info-subtitle">
              Compagnie Française d'Assurance pour le Commerce Extérieur
            </p>
            <p className="department-info">
              <strong>Département :</strong> Business Technology / Global Service Desk
            </p>
            <p className="poste-info">
              <strong>Poste :</strong> Alternant support applicatif
            </p>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="mini-card">
                <h4>Contexte</h4>
                <p>
                  Leader mondial de l'assurance-crédit présent dans 100 pays, Coface sécurise les
                  échanges commerciaux des entreprises en les protégeant contre le risque
                  d'impayés. Au sein du pôle Global Service Desk, mon rôle est de garantir aux
                  collaborateurs un accès sécurisé aux applications métiers du groupe tout en
                  pilotant la gouvernance des identités numériques des utilisateurs.
                </p>
              </div>

              <div className="mini-card">
                <h4>Traitement</h4>
                <p>
                  Ma journée débute par la revue du backlog, principalement composé de demandes
                  d'accès aux applications métiers. Je traite ces requêtes en veillant à leur
                  légitimité, dans le strict respect de notre documentation interne et des
                  politiques de sécurité. J'accompagne quotidiennement des collaborateurs du monde
                  entier car mon périmètre est international.
                </p>
              </div>

              <div className="mini-card">
                <h4>Suivi</h4>
                <p>
                  Je garantis une traçabilité rigoureuse des accès en consignant chaque création de
                  compte dans un tableau de suivi dédié. Ce dispositif est la pierre angulaire de
                  notre conformité, facilitant les audits et la détection d'anomalies.
                  Parallèlement, je maintiens la documentation opérationnelle à jour : cette
                  capitalisation des connaissances assure la continuité de service et facilite
                  l'intégration des futurs collaborateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
