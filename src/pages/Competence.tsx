import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";

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

// Découpe un tableau en plusieurs sous-tableaux selon un pattern de tailles.
// Ex: chunkByPattern([a,b,c,d,e,f,g], [4,3]) → [[a,b,c,d], [e,f,g]]
// Utilisé pour rendre les skills en pyramide descendante (rangées de tailles décroissantes).
function chunkByPattern<T>(items: T[], pattern: number[]): T[][] {
  const rows: T[][] = [];
  let cursor = 0;
  for (const size of pattern) {
    rows.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  // S'il reste des items au-delà du pattern, on les met dans une dernière rangée
  // pour ne perdre aucune donnée si le pattern est mal dimensionné.
  if (cursor < items.length) rows.push(items.slice(cursor));
  return rows;
}

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

// Sous-composant SkillCard : on isole le rendu d'UNE carte pour pouvoir y appeler
// useSpotlight (le hook doit être au top d'un composant, pas dans une boucle .map()).
function SkillCard({ skill }: { skill: Skill }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="skill-card spotlight">
      {/* Rendu conditionnel via ternaire : si customIcon existe, on rend une <img>,
          sinon un <i> avec la classe Devicon. */}
      {skill.customIcon ? (
        <img src={skill.customIcon} alt={skill.label} className="custom-tech-icon" />
      ) : (
        <i className={skill.icon} />
      )}
      <p>{skill.label}</p>
    </div>
  );
}

// Grille en pyramide descendante.
// Chaque rangée est un flex row centré, taille = nombre d'items voulus par étage.
// La prop "pattern" décrit l'agencement : [4,3] = 4 puis 3.
function SkillPyramid({ skills, pattern }: { skills: Skill[]; pattern: number[] }) {
  const rows = chunkByPattern(skills, pattern);
  return (
    <div className="skills-pyramid">
      {rows.map((row, i) => (
        // key sur l'index de rangée : stable car les rangées ne sont jamais réordonnées.
        <div key={i} className="skills-pyramid__row">
          {row.map((s) => (
            <SkillCard key={s.label} skill={s} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Competence({ id = "competences" }: { id?: string }) {
  return (
    <section id={id} className="competences_section">
      <div className="competences_container">
        <SectionTitle>Compétences</SectionTitle>

        <div className="category">
          <h3>Frontend</h3>
          {/* 7 items → pyramide 4/3 */}
          <SkillPyramid skills={frontend} pattern={[4, 3]} />
        </div>

        <div className="category">
          <h3>Backend</h3>
          {/* 3 items → pyramide 2/1 */}
          <SkillPyramid skills={backend} pattern={[2, 1]} />
        </div>

        <div className="category">
          <h3>Outils</h3>
          {/* 4 items → pyramide 3/1 */}
          <SkillPyramid skills={tools} pattern={[3, 1]} />
        </div>

        {/* Bouton téléchargement du tableau de synthèse SLAM (Excel).
            Réutilise les classes .cv-download / .btn-cv déjà stylées. */}
        <div className="cv-download">
          <a
            href="/excel/tableau-de-synthese.xlsx"
            className="btn-cv"
            download
          >
            <i className="fa-solid fa-file-excel" />
            Tableau de synthèse
          </a>
        </div>
      </div>
    </section>
  );
}
