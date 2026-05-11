import { useSpotlight } from "../hooks/useSpotlight";

// Sous-composant carte avec spotlight. Idem MissionsE5 : on extrait pour pouvoir
// appeler useSpotlight par instance (un ref par carte).
function VeilleCard({ title, body }: { title: string; body: string }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="veille_technologique_card spotlight"
    >
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

// Page Veille techno. Données séparées du JSX : pratique pour ajouter une carte,
// je n'ai qu'à pousser un objet dans le tableau, pas à toucher le rendu.
const veilles = [
  {
    title: "Rust",
    body: "Un langage de programmation système axé sur la sécurité et la performance, idéal pour les applications nécessitant une gestion fine de la mémoire.",
  },
  {
    title: "GO",
    body: "Un langage de programmation open-source développé par Google, connu pour sa simplicité, sa performance et sa gestion efficace de la concurrence.",
  },
  {
    title: "Svelte",
    body: "Un framework JavaScript moderne qui compile les composants en code optimisé, offrant des performances élevées et une expérience de développement fluide.",
  },
  {
    title: "Kubernetes",
    body: "Un système open-source pour automatiser le déploiement, la mise à l'échelle et la gestion des applications conteneurisées.",
  },
];

export default function VeilleTechnologique() {
  return (
    <section className="veille_technologique_section">
      <div className="veille_technologique_container">
        <div className="section_title">
          <h2>
            <strong>Ma veille technologique</strong>
          </h2>
          <p>Les nouveaux langages de programmation et technologies émergentes que je surveille.</p>
        </div>
        <div className="veille_technologique_cards">
          {/* Le mapping bonne pratique : on tape sur une donnée stable et unique (title)
              pour la key, plutôt que sur l'index qui peut changer si on réordonne. */}
          {veilles.map((v) => (
            <VeilleCard key={v.title} title={v.title} body={v.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
