# Portfolio BTS SIO — Thomas Montout

Portfolio personnel développé dans le cadre du BTS SIO (Services Informatiques aux
Organisations), option SLAM (Solutions Logicielles et Applications Métiers), suivi
en alternance chez Ynov Campus. Le site présente le parcours, les compétences,
les missions (E5), les projets (E6) et la veille technologique attendus pour la certification.

Version 2.0 — refonte complète de l'ancien site statique HTML/CSS/JS en application
React + TypeScript, single-page avec sections ancrées.

---

## Stack technique

| Domaine     | Outil                     | Version |
| ----------- | ------------------------- | ------- |
| Build / dev | Vite                      | 6.x     |
| UI          | React                     | 18.3    |
| Langage     | TypeScript                | 5.6     |
| Routage     | React Router DOM          | 6.28    |
| Styles      | Tailwind CSS v4 + CSS BEM | 4.0     |
| Formatage   | Prettier                  | 3.7     |
| Hébergement | Vercel (déploiement auto) | -       |

---

## Structure du projet

```
portfolio/
├─ index.html              Point d'entrée HTML (Vite injecte main.tsx dedans)
├─ vite.config.ts          Plugins Vite : React + Tailwind v4
├─ tsconfig.json           Config TypeScript stricte
├─ public/                 Assets statiques servis tels quels (CV.pdf, favicon, etc.)
└─ src/
   ├─ main.tsx             Bootstrap React + BrowserRouter
   ├─ App.tsx              Routes : / et /missions/:slug
   ├─ index.css            Tokens @theme + CSS global
   ├─ components/          Briques réutilisables
   │  ├─ Header.tsx        Pill nav avec IntersectionObserver pour le lien actif
   │  ├─ Footer.tsx
   │  ├─ Background.tsx    Dots + halo curseur
   │  ├─ BentoHero.tsx     Hero en grille asymétrique (grid-template-areas)
   │  ├─ FlipCard.tsx      Carte photo recto-verso
   │  └─ ScrollToTop.tsx   Remonte la page à chaque navigation
   ├─ pages/               Sections de la home + page détail
   │  ├─ Home.tsx          Compose toutes les sections en single-page
   │  ├─ BtsSio.tsx        Présentation du diplôme (SLAM vs SISR)
   │  ├─ Competence.tsx    Stack technique
   │  ├─ EcoleAlternance.tsx Ynov + Coface
   │  ├─ MissionsE5.tsx    Liste des missions E5
   │  ├─ MissionDetail.tsx Case study d'une mission (route dynamique :slug)
   │  └─ Contact.tsx       Formulaire de contact
   ├─ data/
   │  └─ missions.ts       Source de vérité des missions (titre, slug, techs, etc.)
   └─ hooks/
      └─ useSpotlight.ts   Hook custom pour le halo lumineux au hover
```

---

## Architecture et choix techniques

### 1. Single-page avec ancres

La home rend toutes les sections à la suite (`<BentoHero />`, `<BtsSio />`,
`<Competence />`, etc.). Chaque section a un `id` (`#hero`, `#bts`, `#competences`...).
Le header pill utilise un `IntersectionObserver` pour détecter la section visible
et mettre en surbrillance le lien correspondant.

Conséquence : un seul layout, navigation fluide, partage d'URL avec ancre possible
(ex. `/#missions`). Les anciennes routes (`/bts-sio`, `/competence`, etc.) sont
redirigées vers `/` via la route fallback `path="*"` dans `App.tsx`.

### 2. Page détail mission (case study)

La seule route distincte est `/missions/:slug` (`src/pages/MissionDetail.tsx`).
Elle lit le paramètre `slug` via `useParams` et récupère la mission correspondante
dans `src/data/missions.ts` (source de vérité unique, sans duplication).

### 3. Tailwind CSS v4 en mode hybride

Tailwind v4 est installé via `@tailwindcss/vite`, mais utilisé **principalement
comme moteur de tokens**, pas comme système d'utilitaires.

- `src/index.css` déclare les tokens dans `@theme` (couleurs, fonte) :
  ces tokens deviennent à la fois utilisables en CSS classique
  (`var(--color-bg-primary)`) et générés en classes Tailwind (`bg-bg-primary`).
- Les composants utilisent une convention BEM (`bento__cell`, `mission-detail__hero`)
  plutôt que des chaînes d'utilitaires inline.
- Quelques utilitaires Tailwind sont quand même présents pour les cas simples
  (ex. `className="relative w-full min-h-screen"` sur `<App>`).

Ce choix garde le JSX lisible et concentre le style complexe (animations, pseudo-éléments,
`grid-template-areas`) dans un seul fichier CSS facile à parcourir.

### 4. Background décoratif sans état React

Le composant `Background.tsx` superpose deux couches : une grille de dots en
`radial-gradient` répété, et un halo qui suit le curseur. Le halo est positionné
via les variables CSS `--cursor-x` / `--cursor-y` mises à jour directement sur
l'élément en JavaScript natif (pas de `useState`). C'est volontaire : éviter de
re-render React à chaque mouvement de souris.

Le hook `useSpotlight` applique le même principe pour les cartes au hover.

---

## Migration depuis l'ancien site

La v1 du portfolio était un site statique : trois fichiers (`index.html`,
`style.css`, `script.js`), pages multiples séparées (`bts-sio.html`,
`competence.html`...), navigation par rechargement complet.

La v2 conserve **l'identité visuelle** (palette bordeaux/crème, fonte Josefin Sans,
classes BEM portées tel quel) mais réécrit toute la base :

- **HTML statique multi-pages → React SPA single-page** : moins de duplication
  (header/footer/background définis une seule fois dans `App.tsx`).
- **Vanilla JS → composants React** : chaque section devient un composant typé
  TypeScript, réutilisable.
- **Données en dur dans le HTML → module `data/missions.ts`** : les missions sont
  définies une fois, consommées par la liste (`MissionsE5`) **et** par la page
  détail (`MissionDetail`). Ajouter une mission = ajouter une entrée dans le
  tableau.
- **CSS recompilé manuellement → Vite + Tailwind v4** : hot-reload en dev,
  bundling et minification automatiques en build.
- **Navigation par liens classiques → React Router** + scroll par ancres.

Le CSS de la v1 a été conservé dans `index.css` en BEM, avec quelques sections
réorganisées (commentaires `========== SECTION ==========` pour repérer chaque
zone).

---

## Contexte BTS SIO

Le BTS SIO (Services Informatiques aux Organisations) est un diplôme de niveau 5
(bac+2) de l'enseignement supérieur français. Il se divise en deux options :

- **SLAM** (Solutions Logicielles et Applications Métiers) — développement
  d'applications, c'est l'option suivie ici.
- **SISR** (Solutions d'Infrastructure, Systèmes et Réseaux) — administration
  réseau et systèmes.

---

## Démarrer le projet en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Vite, hot-reload)
npm run dev

# Construire la version de production (sortie dans dist/)
npm run build

# Prévisualiser le build de production en local
npm run preview

# Formater tous les fichiers avec Prettier
npm run format
```

Le serveur de dev tourne par défaut sur `http://localhost:5173`.

---

## Déploiement sur Vercel

Le site est déployé sur Vercel avec **auto-détection** : Vercel reconnaît
automatiquement un projet Vite et applique la configuration suivante sans
fichier `vercel.json` :

- **Build command** : `npm run build` (déclenche `tsc -b && vite build`)
- **Output directory** : `dist/`
- **Install command** : `npm install`
- **Node version** : détectée depuis l'environnement (LTS récente)

### Workflow de déploiement

1. Push sur `main` → Vercel construit et déploie en production automatiquement.
2. Push sur une autre branche → Vercel crée une **preview deployment** (URL
   dédiée par PR/branche) pour tester avant de merger.

### Point d'attention : React Router et le rewrite SPA

Cette application utilise des routes côté client (`/missions/:slug`). Sans
configuration de rewrite, un visiteur qui rafraîchit la page sur
`https://ton-site.vercel.app/missions/coface` reçoit un 404 — Vercel cherche un
fichier `missions/coface.html` qui n'existe pas.

Vercel applique heureusement un rewrite par défaut pour les projets Vite,
mais si jamais le problème apparaît, ajouter à la racine un fichier
`vercel.json` :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Cette règle envoie toutes les URLs vers `index.html`, qui charge React Router,
qui résout ensuite la route côté client.

---

## Conventions

- **TypeScript strict** : pas de `any`, props typées sur chaque composant.
- **Nommage CSS** : BEM (`bloc__element--modifier`).
- **Commentaires** : chaque composant et chaque section CSS comporte un en-tête
  expliquant l'intention et les notions employées (utile en révision pour le BTS).
- **Prettier** : `npm run format` avant chaque commit.
