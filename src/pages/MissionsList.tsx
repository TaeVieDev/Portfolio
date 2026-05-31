import { Link, Navigate, useParams } from "react-router-dom";
import {
  type Mission,
  type MissionBlock,
  type MissionCategory,
  missions,
  missionsByBlock,
  missionsByCategory,
} from "../data/missions";
import MissionCard from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page liste complète d'une catégorie : /missions/categorie/:category
// Accessible via le bouton "Afficher plus" sur la home quand une catégorie a
// plus de 3 missions.
//
// Cas particulier : la catégorie "formation" est segmentée en 3 sous-sections
// correspondant aux blocs du référentiel BTS SIO (support / cyber / SLAM).
// Les autres catégories utilisent une grille flat unique.

// Table de routage : un slug d'URL → un titre humain + la fonction qui retourne
// les missions correspondantes. Centralisé ici pour éviter du if/else épars.
const categories: Record<string, { title: string; list: () => Mission[] }> = {
  formation: {
    title: "Projets en formation",
    list: () => missionsByCategory("formation" as MissionCategory),
  },
  entreprise: {
    title: "Projets en entreprise",
    list: () => missionsByCategory("entreprise" as MissionCategory),
  },
  personnel: {
    title: "Projets personnels",
    list: () => missionsByCategory("personnel" as MissionCategory),
  },
  e6: {
    // E6 = filtrage par épreuve, pas par catégorie → cas spécial.
    title: "Projets E6",
    list: () => missions.filter((m) => m.epreuve === "E6"),
  },
};

// Blocs BTS SIO affichés sur la page formation, dans l'ordre du référentiel.
const formationBlocks: { key: MissionBlock; title: string }[] = [
  { key: "support", title: "Support et mise à disposition de services informatiques" },
  { key: "cyber", title: "Cybersécurité des services informatiques" },
  { key: "slam", title: "Solution Logiciel et Application Métier" },
];

// Petit composant grille : factorisé pour rester DRY entre les 2 modes de rendu.
function CardsGrid({ list }: { list: Mission[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {list.map((m) => (
        <MissionCard key={m.slug} mission={m} />
      ))}
    </div>
  );
}

export default function MissionsList() {
  const { category } = useParams<{ category: string }>();
  // Catégorie inconnue ou absente → on redirige vers la section missions de la home.
  // replace = pas de nouvelle entrée dans l'historique (évite la boucle au retour arrière).
  const entry = category ? categories[category] : undefined;
  if (!entry) return <Navigate to="/#missions" replace />;

  // Rendu spécifique formation : 3 sous-sections (support / cyber / SLAM).
  if (category === "formation") {
    return (
      <section className="missions_E5_section">
        <div className="missions_E5_container">
          <Link to="/#missions" className="list-back">
            <i className="fa-solid fa-arrow-left" /> Retour aux missions
          </Link>

          <SectionTitle>{entry.title}</SectionTitle>

          {formationBlocks.map((b) => {
            // On récupère les missions du bloc à chaque itération.
            // Coût négligeable (8 missions au total) et garde le code lisible.
            const list = missionsByBlock(b.key);
            return (
              <div key={b.key}>
                <h3 className="subsection_title">
                  <span>{b.title}</span>
                </h3>
                {list.length > 0 ? (
                  <CardsGrid list={list} />
                ) : (
                  // Placeholder "À venir" pour les blocs encore vides.
                  // Pédagogique : montre la structure complète des 3 blocs même si l'un est encore vide.
                  <p className="empty-block-message">À venir</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Rendu par défaut : une seule grille flat (entreprise / personnel / e6).
  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <Link to="/#missions" className="list-back">
          <i className="fa-solid fa-arrow-left" /> Retour aux missions
        </Link>

        <SectionTitle>{entry.title}</SectionTitle>

        <CardsGrid list={entry.list()} />
      </div>
    </section>
  );
}
