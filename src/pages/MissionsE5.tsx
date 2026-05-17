import { Link } from "react-router-dom";
import { useSpotlight } from "../hooks/useSpotlight";
import { type Mission, missionsByCategory } from "../data/missions";
import SectionTitle from "../components/SectionTitle";

// Page Missions E5.
// Les données vivent dans /data/missions.ts → une seule source de vérité partagée
// avec la page détail /missions/:slug.

// Sous-composant Card : reçoit un Mission via prop.
// useSpotlight DANS ce sous-composant → chaque carte a son propre ref + handler.
// Si on l'appelait dans une boucle .map(), ça casserait les Rules of Hooks.
function Card({ mission }: { mission: Mission }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="card-E5 spotlight">
      <img className="card-E5-img" src={mission.image} alt={mission.title} />
      <div className={`mission-badge ${mission.badgeClass ?? ""}`}>{mission.badge}</div>
      <div className="card-E5-body">
        <h5 className="card-E5-title">{mission.title}</h5>
        <p className="card-E5-text">{mission.description}</p>
        <div className="card-E5-icons">
          {mission.techs.map((t) => (
            <div key={t.label} className="tech-icon">
              {t.customIcon ? (
                <img src={t.customIcon} alt={t.label} className="custom-tech-icon" />
              ) : (
                <i className={t.icon} />
              )}
              <p>{t.label}</p>
            </div>
          ))}
        </div>
        <div className="card-actions">
          {/* Lien vers la page détail de la mission.
              <Link> = navigation client-side React Router, pas de reload. */}
          <Link to={`/missions/${mission.slug}`} className="btn-mission">
            Détails
          </Link>
          {mission.links.map((a) => (
            <a key={a.label} href={a.href} className="btn-mission">
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MissionsE5({ id = "missions" }: { id?: string }) {
  // Récupération des missions par catégorie via le helper.
  const formation = missionsByCategory("formation");
  const personnels = missionsByCategory("personnel");

  return (
    <section id={id} className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Missions E5</SectionTitle>
        <p>
          Projets réalisés dans le cadre de ma formation en BTS SIO, mettant en avant mes
          compétences techniques et ma capacité à travailler sur des projets variés.
        </p>

        <h3 className="subsection_title">Projets en formation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {formation.map((m) => (
            <Card key={m.slug} mission={m} />
          ))}
        </div>

        <h3 className="subsection_title">Projets en entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8" />

        <h3 className="subsection_title">Projets personnels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {personnels.map((m) => (
            <Card key={m.slug} mission={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
