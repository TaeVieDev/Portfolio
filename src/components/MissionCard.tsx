import { useSpotlight } from "../hooks/useSpotlight";
import type { Mission } from "../data/missions";

// Carte d'une mission, partagée entre la section Missions de la home (MissionsE5)
// et la page liste complète (MissionsList).
// useSpotlight DANS ce composant (pas dans un .map() parent) → chaque carte a son
// propre ref + handler, sinon ça casserait les Rules of Hooks.
export default function MissionCard({ mission }: { mission: Mission }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="card-E5 spotlight">
      <img className="card-E5-img" src={mission.image} alt={mission.title} />
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
        {/* Boutons : uniquement les liens fournis par la donnée (Documentation PDF, Github…).*/}
        {mission.links.length > 0 && (
          <div className="card-actions">
            {mission.links.map((a) => (
              <a key={a.label} href={a.href} className="btn-mission">
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
