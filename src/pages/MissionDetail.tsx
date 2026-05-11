import { Link, Navigate, useParams } from "react-router-dom";
import { useSpotlight } from "../hooks/useSpotlight";
import { findMission } from "../data/missions";

// Page détail d'une mission (case study).
// L'URL est /missions/:slug — React Router extrait :slug via useParams().
// Si le slug n'existe pas dans nos données → on redirige vers la home.
export default function MissionDetail() {
  // useParams typé : on lui dit que :slug est un string optionnel.
  // L'API renvoie toujours un objet, mais les valeurs peuvent être undefined.
  const { slug } = useParams<{ slug: string }>();
  const mission = slug ? findMission(slug) : undefined;
  const { ref, onMouseMove } = useSpotlight();

  // Mission introuvable → on redirige proprement.
  // <Navigate replace> remplace l'entrée dans l'historique (pas de boucle sur retour arrière).
  if (!mission) return <Navigate to="/#missions" replace />;

  return (
    <section className="mission-detail">
      <div className="mission-detail__container">
        {/* Bouton retour */}
        <Link to="/#missions" className="mission-detail__back">
          <i className="fa-solid fa-arrow-left" /> Retour aux missions
        </Link>

        {/* En-tête avec image + titre + badge */}
        <div ref={ref} onMouseMove={onMouseMove} className="mission-detail__hero spotlight">
          <img
            className="mission-detail__image"
            src={mission.image}
            alt={mission.title}
          />
          <div className="mission-detail__heading">
            <span className={`mission-badge ${mission.badgeClass ?? ""}`}>{mission.badge}</span>
            <h1>{mission.title}</h1>
            <p className="mission-detail__lead">{mission.description}</p>
          </div>
        </div>

        {/* Stack technique */}
        <div className="mission-detail__techs">
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

        {/* Sections détaillées : rendu conditionnel.
            Le && JSX = "si à gauche est truthy, on rend à droite, sinon rien".
            Permet d'éviter d'afficher une carte vide quand context/result n'est pas défini. */}
        {mission.context && (
          <div className="mission-detail__block">
            <h2>Contexte</h2>
            <p>{mission.context}</p>
          </div>
        )}

        {mission.longDescription && (
          <div className="mission-detail__block">
            <h2>Détails</h2>
            <p>{mission.longDescription}</p>
          </div>
        )}

        {mission.result && (
          <div className="mission-detail__block">
            <h2>Ce que j'en retire</h2>
            <p>{mission.result}</p>
          </div>
        )}

        {/* Liens externes */}
        {mission.links.length > 0 && (
          <div className="mission-detail__links">
            {mission.links.map((a) => (
              <a
                key={a.label}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mission"
              >
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
