import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";

// Page Compétences. Idée principale : sortir les données dans des tableaux typés,
// et laisser le JSX faire UNIQUEMENT du rendu. Beaucoup plus lisible que de copier-coller
// chaque <div class="skill-card"> à la main.
//
// RANGEMENT : on regroupe par NATURE technique.
//   1) Langages         — ce qu'on écrit soi-même (markup, code, requêtes BDD)
//   2) Frameworks & technologies — les couches déjà construites qu'on assemble
//   3) Logiciels & outils — software, OS, outils CLI utilisés autour du code
// Toutes les techs présentes dans les cards de missions sont reprises ici.

// "type" = alias TS pour décrire la forme d'un objet.
// "icon" = classe CSS pour l'icône. Devicon (ex: "devicon-react-plain colored")
// ou FontAwesome (ex: "fa-solid fa-cube") — les deux marchent via le même <i>.
type Skill = {
  label: string;
  icon?: string;
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

// ─── Langages ───
// Tout ce qu'on tape soi-même : du markup web aux langages serveur, en passant
// par le SQL des bases de données.
const langages: Skill[] = [
  { label: "HTML5", icon: "devicon-html5-plain colored" },
  { label: "CSS3", icon: "devicon-css3-plain colored" },
  { label: "JavaScript", icon: "devicon-javascript-plain colored" },
  { label: "TypeScript", icon: "devicon-typescript-plain colored" },
  { label: "PHP", icon: "devicon-php-plain colored" },
  { label: "Python", icon: "devicon-python-plain colored" },
  { label: "MySQL", icon: "devicon-mysql-plain colored" },
  { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
];

// ─── Frameworks & technologies ───
// Les couches "déjà construites" sur lesquelles on assemble : frameworks
// front/back, libs Python, lib de jeu, ORM, services de données.
const frameworks: Skill[] = [
  { label: "React", icon: "devicon-react-plain colored" },
  { label: "Symfony", icon: "devicon-symfony-plain colored" },
  { label: "Next.js", icon: "devicon-nextjs-plain colored" },
  { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
  { label: "Vite", icon: "devicon-vite-plain colored" },
  { label: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
  { label: "Twig", customIcon: "/img/icons/logo-twig.png" },
  { label: "FastAPI", icon: "devicon-fastapi-plain colored" },
  // Quand customIcon est défini, on rend une <img> au lieu d'un <i>.
  { label: "Phaser", icon: "", customIcon: "/img/icons/phaser-logo.png" },
  { label: "Pandas", icon: "devicon-pandas-plain colored" },
  { label: "Numpy", icon: "devicon-numpy-plain colored" },
  { label: "Prisma", icon: "devicon-prisma-plain colored" },
  { label: "NeonDB", icon: "", customIcon: "/img/icons/neondb-logo.png" },
];

// ─── Logiciels & outils ───
// OS, outils de dev, virtualisation, design, et outils CLI security.
// Pour ce qui n'a pas de devicon (Burp Suite, GPG, OpenSSL, Arpspoof, DVWA,
// VirtualBox), on fallback sur FontAwesome déjà chargé via index.html.
const outils: Skill[] = [
  { label: "Git", icon: "devicon-git-plain colored" },
  { label: "GitHub", icon: "devicon-github-original" },
  { label: "Linux", icon: "devicon-linux-plain colored" },
  { label: "Apache", icon: "devicon-apache-plain colored" },
  { label: "Figma", icon: "devicon-figma-plain colored" },
  { label: "Ubuntu", icon: "devicon-ubuntu-plain colored" },
  { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
  { label: "Windows Server", icon: "devicon-windows8-plain colored" },
  { label: "VMware", icon: "", customIcon: "/img/icons/vmware-logo.svg" },
  { label: "OCS Inventory", icon: "", customIcon: "/img/icons/ocs-logo.png" },
  { label: "GLPI", icon: "", customIcon: "/img/icons/glpi-logo.svg" },
];

// Sous-composant SkillCard : on isole le rendu d'UNE carte pour pouvoir y appeler
// useSpotlight (le hook doit être au top d'un composant, pas dans une boucle .map()).
function SkillCard({ skill }: { skill: Skill }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="skill-card spotlight">
      {/* Rendu conditionnel via ternaire : si customIcon existe, on rend une <img>,
          sinon un <i> avec la classe Devicon ou FontAwesome. */}
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
          <h3>Langages</h3>
          {/* 8 items → pyramide 4/3/1 */}
          <SkillPyramid skills={langages} pattern={[4, 3, 1]} />
        </div>

        <div className="category">
          <h3>Frameworks & technologies</h3>
          {/* 13 items → pyramide 5/4/3/1 */}
          <SkillPyramid skills={frameworks} pattern={[5, 4, 3, 1]} />
        </div>

        <div className="category">
          <h3>Logiciels & outils</h3>
          {/* 17 items → pyramide 5/4/4/3/1 */}
          <SkillPyramid skills={outils} pattern={[5, 4, 4, 3, 1]} />
        </div>

        {/* Bouton téléchargement du tableau de synthèse SLAM (Excel).
            Réutilise les classes .cv-download / .btn-cv déjà stylées. */}
        <div className="cv-download">
          <a href="/excel/tableau-de-synthese.xlsx" className="btn-cv" download>
            <i className="fa-solid fa-file-excel" />
            Tableau de synthèse
          </a>
        </div>
      </div>
    </section>
  );
}
