// Source unique des missions affichées sur le portfolio.
// Importé par la section Missions sur Home (MissionsE5) ET par la page liste
// /missions/categorie/:category (MissionsList).
//
// NOTION : "Single source of truth" — une donnée n'est définie qu'à UN seul endroit.
// Tout changement se répercute partout.
//
// ORDRE DU TABLEAU `missions` ci-dessous :
// Le tableau est rangé pour refléter l'ordre d'affichage du site.
// 1) FORMATION → sous-groupes par bloc BTS SIO : Support, Cyber, SLAM
// 2) ENTREPRISE
// 3) PERSONNEL (les missions taggées `epreuve: "E6"` apparaissent aussi
//    dans la liste E6 sur la home, sans duplication d'entrée).
//
// CONVENTION DE TITRE : « <Type> — <Nom> », pour que toutes les cartes
// affichent la même forme visuelle. Types utilisés :
//   - "Atelier" pour les ateliers de formation (support + SLAM ateliers)
//   - "Labo"    pour les labs cybersécurité
//   - "TP"      pour les travaux pratiques (MySQL, PHP)
//   - "Projet"  pour les projets entreprise et personnels
//
// Cet ordre et ces conventions n'ont PAS d'incidence fonctionnelle (les
// pages re-filtrent via missionsByCategory / missionsByBlock) — c'est de
// la lisibilité pure pour faciliter la maintenance.

export type TechIcon = {
  label: string;
  icon?: string; // classe Devicon, ex: "devicon-react-plain colored"
  customIcon?: string; // ou chemin d'image custom
};

export type MissionCategory = "formation" | "entreprise" | "personnel"; // "|" = union type, permet de restreindre les valeurs possibles.

// Blocs BTS SIO (référentiel pédagogique). Utilisés uniquement pour les missions
// de catégorie "formation" sur la page liste /missions/categorie/formation.
// "support" = Support et mise à disposition de services informatiques.
// "cyber"   = Cybersécurité des services informatiques.
// "slam"    = Solution logiciel et application métier (l'option du BTS).
export type MissionBlock = "support" | "cyber" | "slam";

export type Mission = {
  slug: string; // identifiant URL-friendly
  title: string;
  description: string; // résumé affiché sur la carte
  image: string;
  techs: TechIcon[];
  links: { label: string; href: string }[];
  category: MissionCategory;
  epreuve?: string; // "E5" ou "E6", pour filtrer dans les pages dédiées.
  block?: MissionBlock; // pour les missions "formation" : bloc BTS SIO de rattachement.
};

export const missions: Mission[] = [
  // ════════════════════════════════════════════════════════════════════
  // FORMATION
  // ════════════════════════════════════════════════════════════════════

  // ─── Support et mise à disposition de services informatiques ───
  {
    slug: "serveur-apache",
    title: "Atelier — Serveur Apache",
    description:
      "Installer un serveur Apache sur Ubuntu pour héberger des sites web.",
    image: "/img/photos/minia-apache.jpg",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-apache.pdf" }],
    category: "formation",
    block: "support",
  },
  {
    slug: "gestion-parc-informatique",
    title: "Atelier — OCS Inventory & GLPI",
    description:
      "Déployer un serveur OCS Inventory couplé à GLPI pour inventorier automatiquement un parc informatique.",
    image: "/img/photos/minia-ocs-glpi.png",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
      { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-OCS-GLPI.pdf" }],
    category: "formation",
    block: "support",
  },
  {
    slug: "gestion-parc-tickets",
    title: "Atelier — Gestion de tickets (GLPI / OCS)",
    description:
      "Manipuler le cycle de vie complet d'un ticket dans GLPI et le lier à OCS.",
    image: "/img/photos/minia-ocs-glpi.png",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
      { label: "OCS Inventory", customIcon: "/img/icons/ocs-logo.png" },
      { label: "GLPI", customIcon: "/img/icons/glpi-logo.svg" },
      { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-OCS-GLPI-tickets.pdf" }],
    category: "formation",
    block: "support",
  },
  {
    slug: "windows-server-2019",
    title: "Atelier — Windows Server 2019",
    description:
      "Installer Windows Server 2019 en VM et le configurer.",
    image: "/img/photos/minia-winserver.jpg",
    techs: [
      { label: "Windows Server", icon: "devicon-windows8-plain colored" },
      { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-windowsserver.pdf" }],
    category: "formation",
    block: "support",
  },

  // ─── Cybersécurité des services informatiques ───
  // Ordre pédagogique : LABO 1 → LABO 2, puis prépa DVWA → attaque DVWA, puis crypto.
  {
    slug: "verif-integrite",
    title: "Labo — Vérification d'intégrité",
    description:
      "Vérifier qu'un téléchargement n'a pas été altéré via SHA-256.",
    image: "/img/photos/kali-linux1.png",
    techs: [
      { label: "Linux", icon: "devicon-linux-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-verif-int%C3%A9grit%C3%A9.pdf" }],
    category: "formation",
    block: "cyber",
  },
  {
    slug: "besoin-chiffrement",
    title: "Labo — Besoin de chiffrement",
    description:
      "Démontrer pourquoi et comment chiffrer les communications.",
    image: "/img/photos/kali-linux1.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-besoin-chiffrement.pdf" }],
    category: "formation",
    block: "cyber",
  },
  {
    slug: "dvwa-deployment",
    title: "Labo — Déploiement DVWA",
    description:
      "Monter un environnement DVWA isolé sur Kali Linux pour s'entraîner aux attaques web en toute légalité.",
    image: "/img/photos/dvwa.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
      { label: "MariaDB", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-d%C3%A9ploiement-DVWA.pdf" }],
    category: "formation",
    block: "cyber",
  },
  {
    slug: "dvwa-bruteforce",
    title: "Labo — Force brute sur DVWA",
    description:
      "Mener une attaque par force brute de bout en bout sur DVWA.",
    image: "/img/photos/dvwa.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-bruteforce.pdf" }],
    category: "formation",
    block: "cyber",
  },
  {
    slug: "crypto-asymetrique",
    title: "Labo — Cryptographie asymétrique",
    description:
      "Générer une paire de clés, chiffrer un message, puis signer et vérifier.",
    image: "/img/photos/kali-linux1.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-assymetriccryptography.pdf" }],
    category: "formation",
    block: "cyber",
  },

  // ─── Solution Logiciel et Application Métier (SLAM) ───
  {
    slug: "symfony-biblios",
    title: "Atelier — Symfony Biblios",
    description:
      "Démarrer un projet Symfony 7 de zéro pour comprendre le cycle d'une requête HTTP, le routing et le rendu via Twig.",
    image: "/img/photos/minia-symfony.jpg",
    techs: [{ label: "Symfony", icon: "devicon-symfony-plain colored" }],
    links: [{ label: "Documentation", href: "/pdf/doc-symfony.pdf" }],
    category: "formation",
    block: "slam",
  },
  {
    slug: "atelier-symfony-twig",
    title: "Atelier — Symfony & Twig",
    description:
      "Construire des vues dynamiques avec Twig dans Symfony.",
    image: "/img/photos/twig.png",
    techs: [
      { label: "PHP", icon: "devicon-php-plain colored" },
      { label: "Symfony", icon: "devicon-symfony-plain colored" },
      { label: "Twig", customIcon: "/img/icons/logo-twig.png" },
    ],
    links: [],
    category: "formation",
    block: "slam",
  },
  {
    slug: "atelier-mvc",
    title: "Atelier — Pattern MVC",
    description:
      "Comprendre le pattern MVC et ce qu'il apporte pour un projet web.",
    image: "/img/photos/minia-mvc.png",
    techs: [{ label: "PHP", icon: "devicon-php-plain colored" }],
    links: [{ label: "Documentation", href: "/pdf/doc-atelierMVC.pdf" }],
    category: "formation",
    block: "slam",
  },
  {
    slug: "tp-mysql",
    title: "TP — MySQL / MariaDB",
    description:
      "Tavail pratique pour s'approprier SQL autour d'un mini-blog.",
    image: "/img/photos/minia-mysql.png",
    techs: [
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
      { label: "Linux", icon: "devicon-linux-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-initiation-pratique-mysql-mariadb.pdf" }],
    category: "formation",
    block: "slam",
  },
  {
    slug: "tp-php",
    title: "TP — PHP fondamentaux",
    description:
      "Six exercices progressifs pour ancrer les bases du PHP côté serveur.",
    image: "/img/photos/minia-php.jpeg",
    techs: [
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-travaux-pratique-fondamentauxPHP.pdf" }],
    category: "formation",
    block: "slam",
  },

  // ════════════════════════════════════════════════════════════════════
  // ENTREPRISE
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "bot-iam",
    title: "Projet — Bot IAM",
    description:
      "Bot d'assistance basé sur la RAG (Retrieval Augmented Generation) pour répondre aux questions IAM des équipes en s'appuyant sur la doc interne.",
    image: "/img/photos/minia-botiam.png",
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

  // ════════════════════════════════════════════════════════════════════
  // PERSONNEL
  // (absolute-stream est aussi taggé epreuve: "E6" → apparaît dans la
  //  liste "Projets E6" de la home en plus de la section personnelle.)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "portfolio",
    title: "Projet — Portfolio",
    description:
      "Portfolio développé pour porter ma soutenance E5.",
    image: "/img/photos/minia-portfolio.png",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "Tailwind", icon: "devicon-tailwindcss-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/portfolio" }],
    category: "personnel",
  },
  {
    slug: "in-the-cave",
    title: "Projet — In the Cave",
    description:
      "Transformer un exercice JavaScript freeCodeCamp en RPG textuel React / TypeScript pour monter en compétences.",
    image: "/img/photos/minia-inthecave.jpg",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "Zustand", customIcon: "/img/icons/logo-zustand.png" },
    ],
    links: [
      { label: "Documentation", href: "/pdf/doc-inthecave.pdf" },
      { label: "Github", href: "https://github.com/thomas-montout/In-the-cave" },
    ],
    category: "personnel",
  },
  {
    slug: "absolute-stream",
    title: "Projet — Absolute Stream",
    description:
      "Plateforme sociale type Letterboxd développée en équipe autour d'une API.",
    image: "/img/photos/minia-absolutestream.png",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
      { label: "NeonDB", customIcon: "/img/icons/neondb-logo.png" },
      { label: "Prisma", icon: "devicon-prisma-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [
      { label: "Github", href: "https://github.com/thomas-montout/Absolute-Stream" },
      { label: "Documentation", href: "/pdf/doc-abolutestream.pdf" },
    ],
    category: "personnel",
    epreuve: "E6",
  },
  {
    slug: "v-room",
    title: "Projet — V.ROOM",
    description:
      "E-commerce de véhicules en architecture découplée React + API Symfony, avec un assistant IA qui interprète les besoins en langage naturel.",
    image: "/img/photos/minia-vroom.png",
    techs: [
      { label: "Symfony", icon: "devicon-symfony-plain colored" },
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [
      { label: "Github", href: "https://github.com/thomas-montout/V.ROOM" },
      { label: "Documentation", href: "/pdf/doc-vroom.pdf" },
    ],
    category: "personnel",
  },
  {
    slug: "pink-monster",
    title: "Projet — Pink Monster",
    description:
      "Petit jeu de plateforme 2D en pixel art avec Phaser pour aborder la POO appliquée au jeu vidéo et la gestion d'états.",
    image: "/img/photos/minia-pinkmonster.png",
    techs: [
      { label: "Phaser", customIcon: "/img/icons/phaser-logo.png" },
      { label: "JavaScript", icon: "devicon-javascript-plain colored" },
      { label: "Html", icon: "devicon-html5-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/V.ROOM" }],
    category: "personnel",
  },
  {
    slug: "faire-part-mariage",
    title: "Projet — Faire-part de mariage",
    description:
      "Site faire-part pour le mariage de ma mère, conçu comme un terrain d'expérimentation pur sur les animations et la mise en scène.",
    image: "/img/photos/minia-fairepart.png",
    techs: [
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "CSS3", icon: "devicon-css3-plain colored" },
    ],
    links: [],
    category: "personnel",
  },
  {
    slug: "tempo",
    title: "Projet — Tempo",
    description:
      "App météo qui change complètement de skin — couleurs, fond, micro-animations — selon les conditions retournées par une API publique.",
    image: "/img/photos/minia-tempo.png",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
    ],
    links: [],
    category: "personnel",
  },
];

// ════════════════════════════════════════════════════════════════════
// HELPERS — évitent de répéter les filtres dans les composants.
// ════════════════════════════════════════════════════════════════════

export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);

// Filtre par bloc BTS SIO (utilisé pour la sous-segmentation de la page formation).
export const missionsByBlock = (block: MissionBlock) => missions.filter((m) => m.block === block);
