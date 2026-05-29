import { Link } from "react-router-dom";
import { useSpotlight } from "../hooks/useSpotlight";
import { type Mission } from "../data/missions"; // Type import pour la prop mission.
import { missions } from "../data/missions"; // Import de toutes les missions pour les filtrer par épreuve E6.
import SectionTitle from "../components/SectionTitle";

// Page Projet E6.
// Comme pour MissionsE5, on a un sous-composant Card pour afficher chaque projet.
// On réutilise le même useSpotlight que pour les missions E5 : chaque carte a son propre ref + handler.

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

export default function ProjetsE6({ id = "missions" }: { id?: string }) {
  return (
    <section id={id} className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Projets E6</SectionTitle>
        <p>Projets réalisés dans le cadre de ma spécialité SLAM</p>

        <h3 className="subsection_title">Projets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {missions
            .filter((m) => m.epreuve === "E6") // On filtre les missions pour n'afficher que celles de l'épreuve E6.
            .map((m) => (
              <Card key={m.slug} mission={m} />
            ))}
        </div>
      </div>
    </section>
  );
}
