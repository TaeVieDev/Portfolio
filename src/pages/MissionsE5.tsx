// Page Missions E5. Bon exemple de séparation données / rendu :
// - Tableaux de MissionCard tout en haut → facile à éditer/ajouter
// - Un sous-composant Card qui sait rendre UNE carte
// - La page principale qui mappe les tableaux et délègue à Card

type TechIcon = {
  label: string;
  icon?: string; // "?" = optionnel : soit icon, soit customIcon, mais pas obligé d'avoir les deux
  customIcon?: string;
};

// Type pour une carte de projet. Permet d'avoir l'auto-complétion + erreur TS si je
// rate un champ. Le "?" sur badgeClass dit que c'est optionnel.
type MissionCard = {
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeClass?: string;
  techs: TechIcon[];
  actions: { label: string; href: string }[];
};

const formation: MissionCard[] = [
  {
    title: "Portfolio",
    description:
      "Création d'un portfolio pour présenter mon parcours, mes expériences et mes projets en vue de ma soutenance pour l'épreuve E5 du BTS SIO.",
    image: "/img/photos/minia-portfolio.png",
    badge: "FORMATION",
    badgeClass: "atelier-badge",
    techs: [
      { label: "HTML5", icon: "devicon-html5-plain colored" },
      { label: "CSS3", icon: "devicon-css3-plain colored" },
      { label: "JavaScript", icon: "devicon-javascript-plain colored" },
      { label: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
    ],
    actions: [{ label: "Github", href: "https://github.com/thomas-montout/portfolio" }],
  },
  {
    title: "Serveur Apache",
    description:
      "Configuration et déploiement d'un serveur Apache pour héberger des applications web.",
    image: "/img/photos/minia-apache.jpg",
    badge: "FORMATION",
    badgeClass: "atel-badge",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
    ],
    actions: [{ label: "Documentation", href: "/pdf/doc-apache.pdf" }],
  },
  {
    title: 'Projet Symfony "Biblios"',
    description: "Développement d'une application web avec le framework Symfony.",
    image: "/img/photos/minia-symfony.jpg",
    badge: "FORMATION",
    badgeClass: "atelier-badge",
    techs: [{ label: "Symfony", icon: "devicon-symfony-plain colored" }],
    actions: [{ label: "Documentation", href: "/pdf/doc-symfony.pdf" }],
  },
  {
    title: "Gestion de parc informatique",
    description:
      "Mise en place d'une solution de gestion de parc informatique pour assurer la maintenance et la sécurité des systèmes.",
    image: "/img/photos/minia-ocs-glpi.jpg",
    badge: "FORMATION",
    badgeClass: "atelier-badge",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
      { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
    ],
    actions: [{ label: "Documentation", href: "/pdf/doc-OCS-GLPI.pdf" }],
  },
];

const personnels: MissionCard[] = [
  {
    title: "In the cave",
    description:
      "Développement d'un jeu web interactif et immersif utilisant React, TypeScript et Vite.",
    image: "/img/photos/minia-inthecave.jpg",
    badge: "PERSONNEL",
    badgeClass: "perso-badge",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
    ],
    actions: [
      { label: "Documentation", href: "/pdf/doc-inthecave.pdf" },
      { label: "Github", href: "https://github.com/thomas-montout/In-the-cave" },
    ],
  },
  {
    title: "Absolute Stream",
    description:
      "Développement en collaboration d'une plateforme sociale autour des films et série intégrant l'API de TMDb.",
    image: "/img/photos/minia-absolutestream.png",
    badge: "PERSONNEL",
    badgeClass: "perso-badge",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Tailwind CSS", icon: "devicon-react-plain colored" },
    ],
    actions: [{ label: "Github", href: "https://github.com/thomas-montout/Absolute-Stream" }],
  },
];

// Sous-composant Card : reçoit un MissionCard via prop "mission".
// Le ?? (nullish coalescing) : si badgeClass est null/undefined, on retourne "".
// Différent de || qui se déclencherait aussi pour "", 0, false…
function Card({ mission }: { mission: MissionCard }) {
  return (
    <div className="card-E5">
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
          {mission.actions.map((a) => (
            <a key={a.label} href={a.href} className="btn-mission">
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MissionsE5() {
  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <div className="section_title">
          <h2>
            <strong>Missions E5</strong>
          </h2>
          <p>
            Projets réalisés dans le cadre de ma formation en BTS SIO, mettant en avant mes
            compétences techniques et ma capacité à travailler sur des projets variés.
          </p>
        </div>

        <h3 className="subsection_title">Projets en formation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {formation.map((m) => (
            <Card key={m.title} mission={m} />
          ))}
        </div>

        {/* Section "Projets en entreprise" : grille vide pour l'instant, à remplir plus tard */}
        <h3 className="subsection_title">Projets en entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8" />

        <h3 className="subsection_title">Projets personnels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {personnels.map((m) => (
            <Card key={m.title} mission={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
