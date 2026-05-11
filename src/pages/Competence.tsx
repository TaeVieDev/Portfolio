// Page Compétences. Idée principale : sortir les données dans des tableaux typés,
// et laisser le JSX faire UNIQUEMENT du rendu. Beaucoup plus lisible que de copier-coller
// chaque <div class="skill-card"> à la main.

// "type" = alias TS pour décrire la forme d'un objet.
// "icon?: string" = optionnel : la prop peut être absente sans erreur TS.
type Skill = {
  label: string;
  icon: string;
  customIcon?: string;
};

// Les ":" précisent le type du tableau. Si je rajoute un skill mal formé, TS hurle.
const frontend: Skill[] = [
  { label: "HTML5", icon: "devicon-html5-plain colored" },
  { label: "CSS3", icon: "devicon-css3-plain colored" },
  { label: "JavaScript", icon: "devicon-javascript-plain colored" },
  { label: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
  // Quand customIcon est défini, on rend une <img> au lieu d'un <i>.
  { label: "Phaser", icon: "", customIcon: "/img/icons/phaser-logo.png" },
  { label: "TypeScript", icon: "devicon-typescript-plain colored" },
  { label: "React", icon: "devicon-react-plain colored" },
];

const backend: Skill[] = [
  { label: "PHP", icon: "devicon-php-plain colored" },
  { label: "MySQL", icon: "devicon-mysql-plain colored" },
  { label: "Symfony", icon: "devicon-symfony-original colored" },
];

const tools: Skill[] = [
  { label: "Git", icon: "devicon-git-plain colored" },
  { label: "GitHub", icon: "devicon-github-original" },
  { label: "Apache", icon: "devicon-apache-plain colored" },
  { label: "Windows Server", icon: "devicon-windows8-plain colored" },
];

// Sous-composant local : factorise le rendu de la grille pour ne pas le réécrire 3x.
// Quand on découpe en petits composants comme ça, on évite la répétition.
function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="skills grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mx-auto">
      {/* .map() = produit un tableau de JSX à partir d'un tableau de données.
          La key doit être UNIQUE et STABLE → on utilise le label (pas l'index si possible). */}
      {skills.map((s) => (
        <div key={s.label} className="skill-card">
          {/* Rendu conditionnel via ternaire : si customIcon existe, on rend une <img>,
              sinon un <i> avec la classe Devicon. */}
          {s.customIcon ? (
            <img src={s.customIcon} alt={s.label} className="custom-tech-icon" />
          ) : (
            <i className={s.icon} />
          )}
          <p>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Competence() {
  return (
    <section className="competences_section">
      <div className="competences_container">
        <div className="category">
          <h3>Frontend</h3>
          <SkillGrid skills={frontend} />
        </div>

        <div className="category">
          <h3>Backend</h3>
          <SkillGrid skills={backend} />
        </div>

        <div className="category">
          <h3>Outils</h3>
          <SkillGrid skills={tools} />
        </div>
      </div>
    </section>
  );
}
