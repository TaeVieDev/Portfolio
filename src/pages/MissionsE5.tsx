import { Link } from "react-router-dom";
import { missions, missionsByCategory } from "../data/missions";
import MissionCard from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page Missions E5.
// Les données vivent dans /data/missions.ts → une seule source de vérité partagée
// avec la page détail /missions/:slug et la page liste /missions/categorie/:category.
//
// Sur la home on n'affiche que les 3 premières missions de chaque catégorie pour
// éviter une section géante (surtout en mobile, 1 colonne) ; un bouton "Afficher
// plus" amène vers la page liste complète si la catégorie en compte davantage.

// Petit helper local : entête d'une sous-section avec son titre + le lien "Afficher plus"
// quand il y a plus de 3 missions. Évite de dupliquer la même JSX 4 fois plus bas.
function SubsectionHeader({
  title,
  href,
  showMore,
}: {
  title: string;
  href: string;
  showMore: boolean;
}) {
  return (
    <h3 className="subsection_title">
      <span>{title}</span>
      {showMore && (
        <Link to={href} className="show-more">
          Afficher plus <i className="fa-solid fa-arrow-right" />
        </Link>
      )}
    </h3>
  );
}

export default function MissionsE5({ id = "missions" }: { id?: string }) {
  // Récupération des missions par catégorie via le helper.
  const formation = missionsByCategory("formation");
  const entreprise = missionsByCategory("entreprise");
  const personnels = missionsByCategory("personnel");
  // Projets E6 = filtrage direct sur le tableau missions (l'épreuve est portée par chaque mission).
  // On a fusionné E5 et E6 ici pour éviter un conflit d'id="missions" dupliqué dans le DOM.
  const projetsE6 = missions.filter((m) => m.epreuve === "E6");

  // Limite à 3 par sous-section sur la home. Le reste est accessible via "Afficher plus".
  const LIMIT = 3;

  return (
    <section id={id} className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Missions & Projets</SectionTitle>
        <p>
          Projets réalisés dans le cadre de ma formation en BTS SIO, mettant en avant mes
          compétences techniques et ma capacité à travailler sur des projets variés.
        </p>

        <SubsectionHeader
          title="Projets en formation"
          href="/missions/categorie/formation"
          showMore={formation.length > LIMIT}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {formation.slice(0, LIMIT).map((m) => (
            <MissionCard key={m.slug} mission={m} />
          ))}
        </div>

        <SubsectionHeader
          title="Projets en entreprise"
          href="/missions/categorie/entreprise"
          showMore={entreprise.length > LIMIT}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {entreprise.slice(0, LIMIT).map((m) => (
            <MissionCard key={m.slug} mission={m} />
          ))}
        </div>

        <SubsectionHeader
          title="Projets épreuve E6"
          href="/missions/categorie/e6"
          showMore={projetsE6.length > LIMIT}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {projetsE6.slice(0, LIMIT).map((m) => (
            <MissionCard key={m.slug} mission={m} />
          ))}
        </div>

        <SubsectionHeader
          title="Projets personnels"
          href="/missions/categorie/personnel"
          showMore={personnels.length > LIMIT}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {personnels.slice(0, LIMIT).map((m) => (
            <MissionCard key={m.slug} mission={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
