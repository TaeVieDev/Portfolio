// On importe ce fichier
// depuis la section Missions sur Home ET depuis la page détail /missions/:slug.
//
// NOTION : "Single source of truth" — une donnée n'est définie qu'à UN seul endroit.
// Tout changement se répercute partout.

export type TechIcon = {
  label: string;
  icon?: string; // classe Devicon, ex: "devicon-react-plain colored"
  customIcon?: string; // ou chemin d'image custom
};

export type MissionCategory = "formation" | "entreprise" | "personnel"; // "|" = union type, permet de restreindre les valeurs possibles.

export type Mission = {
  slug: string; // identifiant URL-friendly, sert dans /missions/:slug
  title: string;
  description: string; // résumé affiché sur la carte
  longDescription?: string; // texte long pour la page détail
  context?: string; // contexte / problématique
  result?: string; // ce que j'ai appris ou produit
  image: string;
  badge: string;
  badgeClass?: string;
  techs: TechIcon[];
  links: { label: string; href: string }[];
  category: MissionCategory;
  epreuve?: string; // "E5" ou "E6", pour filtrer dans les pages dédiées. "?" = champ optionnel, pas forcément présent sur tous les objets Mission.
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
      "Ce projet est un RPG (Role Playing Game) textuel interactif développé avec React. À l’origine, ce projet est un exercice JavaScript issu de freeCodeCamp, réalisé pour comprendre les bases du langage. Plutôt que de le laisser tel quel, j’ai choisi de le transformer en un véritable terrain d’expérimentation afin de monter en compétences sur des technologies modernes utilisées en entreprise",
    context:
      "Envie d'apprendre React en construisant quelque chose de fun plutôt qu'un énième todo.",
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
      { label: "NeonDB", icon: "/img/icons/neondb-logo.png" },
      { label: "Prisma", icon: "devicon-prisma-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/Absolute-Stream" }],
    category: "personnel",
    epreuve: "E6",
  },
  {
    slug: "v-room",
    title: "V.ROOM",
    description:
      "Développement d'un site e-commerce de vente de véhicules avec une architecture headless utilisant React et Symfony.",
    longDescription:
      "Site e-commerce de vente de véhicules basé sur une architecture headless, avec un frontend React/TypeScript et un backend Symfony exposant une API REST. Fonctionnalités : catalogue, panier, paiement fictif et un assisant IA pour aider les utilisateurs à choisir leur voiture idéale.",
    image: "/img/photos/minia-vroom.png",
    badge: "FORMATION",
    badgeClass: "formation-badge",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "Symfony", icon: "devicon-symfony-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "formation",
  },
  {
    slug: "bot-iam",
    title: "Bot IAM",
    description: "Développement d'un bot d'assistance intelligente pour l'entreprise.",
    longDescription:
      "Bot d'assistance intelligente basé sur le retrieval augmented generation (RAG) for the IAM.",
    image: "/img/photos/minia-vroom.png",
    badge: "ENTREPRISE",
    badgeClass: "entreprise-badge",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "Python", icon: "devicon-python-plain colored" },
      { label: "FastAPI", icon: "devicon-fastapi-plain colored" },
      { label: "Pandas", icon: "devicon-pandas-plain colored" },
      { label: "Numpy", icon: "devicon-numpy-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "entreprise",
  },
  {
    slug: "atelier-symfony-twig",
    title: "Atelier - Symfony-Twig",
    description:
      "Travaux pratiques pour maitriser le moteur de templates Twig et son intégration avec Symfony.",
    longDescription:
      "Atelier de découverte du moteur de templates Twig et de son intégration avec Symfony. Création de templates dynamiques, utilisation des blocs, héritage, filtres et fonctions Twig pour construire des vues web efficaces.",
    image: "/img/photos/minia-vroom.png",
    badge: "FORMATION",
    badgeClass: "formation-badge",
    techs: [
      { label: "PHP", icon: "devicon-php-plain colored" },
      { label: "Symfony", icon: "devicon-symfony-plain colored" },
      { label: "Twig", icon: "devicon-twig-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "formation",
  },
  {
    slug: "atelier-mvc",
    title: "Atelier MVC",
    description: "Petit atelier pour comprendre les bases du pattern MVC.",
    longDescription:
      "Atelier de découverte du pattern MVC (Model-View-Controller). Compréhension des rôles de chaque composant et de leur interaction.",
    image: "/img/photos/minia-vroom.png",
    badge: "FORMATION",
    badgeClass: "formation-badge",
    techs: [{ label: "PHP", icon: "devicon-php-plain colored" }],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "formation",
  },
  {
    slug: "gestion-parc-tickets",
    title: "Gestion de parc informatique et centre de services (GLPI & OCS)",
    description:
      "Atelier de mise en œuvre d'une solution complète de gestion de services informatiques en couplant GLPI et OCS Inventory.",
    longDescription:
      "L'objectif de cet atelier est de mettre en œuvre une solution complète de Gestion de Services Informatiques en couplant GLPI (Gestionnaire Libre de Parc Informatique) et OCS Inventory. L'enjeu est de maîtriser le cycle de vie d'un ticket de bout en bout (création, qualification, traitement, clôture) tout en exploitant une base de données de configuration dynamique",
    image: "/img/photos/minia-vroom.png",
    badge: "FORMATION",
    badgeClass: "formation-badge",
    techs: [
      { label: "OCS Inventory", icon: "/img/icons/ocs-logo.svg" },
      { label: "GLPI", icon: "/img/icons/glpi-logo.svg" },
      { label: "VMware", icon: "/img/icons/vmware-logo.svg" },
      { label: "Linux", icon: "devicon-linux-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "formation",
  },
  {
    slug: "pink-monster",
    title: "Pink Monster",
    description:
      "Développement d'un jeu de plateforme 2D en pixel art avec Phaser pour apprendre les bases de la gestion d'états et la programation orientée objet appliquée au jeu vidéo.",
    longDescription:
      "Le joueur incarne un monstre rose qui doit traverser des niveaux remplis d'obstacles et d'ennemis. Projet personnel pour découvrir les fondamentaux du développement de jeux vidéo en JavaScript avec Phaser.",
    image: "/img/photos/minia-vroom.png",
    badge: "PERSONNEL",
    badgeClass: "perso-badge",
    techs: [
      { label: "Phaser", icon: "/img/icons/phaser-logo.svg" },
      { label: "JavaScript", icon: "devicon-javascript-plain colored" },
      { label: "Html", icon: "devicon-html5-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "personnel",
  },
];

// Permet d'éviter de répéter ces filtres dans les composants.
export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);

export const findMission = (slug: string): Mission | undefined =>
  missions.find((m) => m.slug === slug);
