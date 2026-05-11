// Source unique de vérité pour les missions.
// Avant : les missions étaient écrites en dur dans MissionsE5.tsx → impossible
// de les réutiliser ailleurs sans copier-coller. Maintenant on importe ce fichier
// depuis la section Missions sur Home ET depuis la page détail /missions/:slug.
//
// NOTION : "Single source of truth" — une donnée n'est définie qu'à UN seul endroit.
// Tout changement se répercute partout.

export type TechIcon = {
  label: string;
  icon?: string; // classe Devicon, ex: "devicon-react-plain colored"
  customIcon?: string; // ou chemin d'image custom (logo non couvert par Devicon)
};

export type MissionCategory = "formation" | "entreprise" | "personnel";

export type Mission = {
  slug: string; // identifiant URL-friendly, sert dans /missions/:slug
  title: string;
  description: string; // résumé affiché sur la carte
  longDescription?: string; // texte long pour la page détail (case study)
  context?: string; // contexte / problématique
  result?: string; // ce que j'ai appris ou produit
  image: string;
  badge: string;
  badgeClass?: string;
  techs: TechIcon[];
  links: { label: string; href: string }[];
  category: MissionCategory;
};

export const missions: Mission[] = [
  {
    slug: "portfolio",
    title: "Portfolio",
    description:
      "Création d'un portfolio pour présenter mon parcours, mes expériences et mes projets en vue de ma soutenance pour l'épreuve E5 du BTS SIO.",
    longDescription:
      "Ce portfolio a été refondu de zéro en React + TypeScript + Tailwind. L'objectif : démontrer mes compétences techniques tout en présentant mon parcours de manière vivante. La v1 était en HTML/CSS/Bootstrap, la v2 est un single-page app moderne avec composants réutilisables, hooks personnalisés et routing client.",
    context:
      "Besoin d'un support oral pour la soutenance E5 et la défense devant le jury. Le code lui-même devait pouvoir être expliqué ligne par ligne.",
    result:
      "Migration complète vers React/TS, refactor en composants, custom hooks (useSpotlight), animations CSS modernes, dark theme bordeaux.",
    image: "/img/photos/minia-portfolio.png",
    badge: "FORMATION",
    badgeClass: "atelier-badge",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "Tailwind", icon: "devicon-tailwindcss-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/portfolio" }],
    category: "formation",
  },
  {
    slug: "serveur-apache",
    title: "Serveur Apache",
    description:
      "Configuration et déploiement d'un serveur Apache pour héberger des applications web.",
    longDescription:
      "Installation et configuration d'un serveur Apache sous Linux pour servir une application web. Travail sur les VirtualHosts, les permissions, les logs et l'optimisation des performances.",
    context: "Atelier formation pour comprendre l'envers du décor d'un hébergement web.",
    image: "/img/photos/minia-apache.jpg",
    badge: "FORMATION",
    badgeClass: "atel-badge",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-apache.pdf" }],
    category: "formation",
  },
  {
    slug: "symfony-biblios",
    title: 'Projet Symfony "Biblios"',
    description: "Développement d'une application web avec le framework Symfony.",
    longDescription:
      "Application de gestion de bibliothèque développée avec Symfony : entités Doctrine, formulaires, contrôleurs, templates Twig, et système d'authentification. Premier vrai contact avec un framework MVC backend.",
    context: "Découverte de la POO appliquée au web et des patterns d'un framework moderne.",
    image: "/img/photos/minia-symfony.jpg",
    badge: "FORMATION",
    badgeClass: "atelier-badge",
    techs: [{ label: "Symfony", icon: "devicon-symfony-plain colored" }],
    links: [{ label: "Documentation", href: "/pdf/doc-symfony.pdf" }],
    category: "formation",
  },
  {
    slug: "gestion-parc-informatique",
    title: "Gestion de parc informatique",
    description:
      "Mise en place d'une solution de gestion de parc informatique pour assurer la maintenance et la sécurité des systèmes.",
    longDescription:
      "Déploiement d'OCS Inventory et GLPI sur un environnement Linux/VMware. OCS collecte automatiquement l'inventaire des postes, GLPI gère les tickets et les CMDB. Configuration réseau, base MySQL, agents clients.",
    context: "Atelier infrastructure pour comprendre la gestion d'un SI d'entreprise.",
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
    links: [{ label: "Documentation", href: "/pdf/doc-OCS-GLPI.pdf" }],
    category: "formation",
  },
  {
    slug: "in-the-cave",
    title: "In the cave",
    description:
      "Développement d'un jeu web interactif et immersif utilisant React, TypeScript et Vite.",
    longDescription:
      "Jeu d'aventure narrative en React + TypeScript. Projet personnel pour explorer les hooks avancés, la gestion d'état complexe et les animations. Cadre : une caverne, des choix, plusieurs fins.",
    context: "Envie d'apprendre React en construisant quelque chose de fun plutôt qu'un énième todo.",
    image: "/img/photos/minia-inthecave.jpg",
    badge: "PERSONNEL",
    badgeClass: "perso-badge",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
    ],
    links: [
      { label: "Documentation", href: "/pdf/doc-inthecave.pdf" },
      { label: "Github", href: "https://github.com/thomas-montout/In-the-cave" },
    ],
    category: "personnel",
  },
  {
    slug: "absolute-stream",
    title: "Absolute Stream",
    description:
      "Développement en collaboration d'une plateforme sociale autour des films et séries intégrant l'API de TMDb.",
    longDescription:
      "Plateforme sociale type Letterboxd développée en collaboration. Catalogue alimenté par l'API TMDb, profils utilisateurs, listes personnalisées, notations. Stack Next.js + TypeScript + Tailwind.",
    context: "Premier projet collaboratif avec Git/GitHub en mode équipe.",
    image: "/img/photos/minia-absolutestream.png",
    badge: "PERSONNEL",
    badgeClass: "perso-badge",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/Absolute-Stream" }],
    category: "personnel",
  },
];

// Helpers pour filtrer/trouver. Permet d'éviter de répéter ces filtres dans les composants.
export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);

export const findMission = (slug: string): Mission | undefined =>
  missions.find((m) => m.slug === slug);
