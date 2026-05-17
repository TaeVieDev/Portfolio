# Chapitre 8 — Tooling et déploiement

Le code source n'est qu'une partie de l'histoire. Pour que le projet tourne en local, soit construit, validé, formaté, versionné et déployé, plein d'outils interviennent en coulisses. Ce chapitre couvre tout ce qui est autour du `src/`.

---

## 8.1 Vite (build et dev server)

**Notion.** Vite est un **outil de build** et un **serveur de dev** ultra-rapide. Il remplace Webpack/Create-React-App pour la plupart des projets modernes.

### En dev (`npm run dev`)

- Lance un serveur HTTP local (par défaut `http://localhost:5173`).
- **Hot Module Replacement (HMR)** : modifie un fichier, le navigateur recharge **uniquement** la partie changée sans perdre l'état React.
- Ne **transpile à la volée** que les fichiers demandés par le navigateur → démarrage instantané.

### En prod (`npm run build`)

- Lance d'abord `tsc -b` pour la vérification TypeScript.
- Puis bundle (regroupe) tout le code + CSS en quelques fichiers optimisés dans `dist/`.
- Minification, tree-shaking (suppression du code mort), split en chunks pour le cache navigateur.

**Code du projet** — [package.json](../../package.json) :

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

**Décodage** :

- `dev` lance le serveur de dev.
- `build` : vérifie d'abord les types (`tsc -b`), puis lance le bundling. Si TS échoue, build avorte.
- `preview` : sert le build de production en local (utile pour tester avant un déploiement).
- `format` / `format:check` : Prettier en mode écriture ou vérification.

**Code du projet** — [vite.config.ts](../../vite.config.ts) :

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

→ deux plugins activés :
- `@vitejs/plugin-react` : permet à Vite de comprendre le JSX et de gérer le HMR React.
- `@tailwindcss/vite` : scanne les fichiers pour générer le CSS Tailwind à la volée.

**À retenir.**
- Vite = dev server rapide + bundler prod.
- HMR en dev, bundling optimisé en prod.
- Configuration en un fichier `vite.config.ts`.

---

## 8.2 TypeScript et project references

**Notion.** TypeScript se configure dans `tsconfig.json`. Sur un projet Vite typique, on a souvent **plusieurs** `tsconfig` : un pour le code app (`tsconfig.app.json`), un pour la config de build (`tsconfig.node.json`), liés par un fichier racine (`tsconfig.json`).

**Code du projet** — [tsconfig.json](../../tsconfig.json) (extrait) :

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

→ pas de fichiers compilés directement ; ce `tsconfig.json` racine **délègue** vers deux configs. Lancer `tsc -b` (mode build) compile chacune indépendamment.

Bénéfice : on peut avoir des options TS différentes pour le code de l'app (qui tourne dans le navigateur) et pour les outils (qui tournent sous Node).

**À retenir.**
- `tsc -b` = mode build, compile selon les `references`.
- Permet de séparer les configs app/tooling.
- En cas d'erreur de type, `npm run build` échoue → garde-fou avant de déployer un code cassé.

---

## 8.3 Prettier

**Notion.** Formatter de code opinionnée : tu lances la commande, tous tes fichiers sont reformatés selon des règles cohérentes (indentation, guillemets, virgules, longueur de ligne, etc.).

Avantages :
- aucun débat dans une équipe sur le style — Prettier décide,
- diffs git plus propres (pas de "j'ai juste ajouté un espace"),
- on se concentre sur le code, pas la mise en forme.

**Code du projet** :
- `npm run format` — formate tout le repo.
- `npm run format:check` — vérifie sans modifier (utile en CI).

**À retenir.**
- Prettier = formatage cohérent automatisé.
- Lancer `npm run format` avant chaque commit.

---

## 8.4 Vercel (déploiement)

**Notion.** Vercel est une plateforme d'hébergement pour les sites front modernes. Elle :

- détecte automatiquement le framework (Vite, Next.js, Astro...),
- lance `npm run build`,
- déploie le contenu de `dist/` sur un CDN mondial,
- crée une URL stable par projet et une **preview deployment** par branche/PR.

### Workflow type

1. Push sur `main` → Vercel déploie en production sur ton domaine.
2. Push sur une autre branche → Vercel crée une preview (URL dédiée).
3. Tu mergees → la preview devient la prod.

### Auto-détection Vite

Pas besoin de `vercel.json` pour un projet Vite standard. Vercel détecte :
- **Build command** : `npm run build`
- **Output directory** : `dist/`
- **Install command** : `npm install`
- **Node version** : LTS récente

### Le piège du routing SPA

Une application React Router avec des routes côté client (`/missions/:slug`) a un problème en prod : si l'utilisateur **rafraîchit** la page sur `https://site.com/missions/portfolio`, le navigateur demande au serveur un fichier `missions/portfolio.html` qui n'existe pas → 404.

**Solution** : configurer une règle de **rewrite** qui sert `index.html` pour toutes les URLs. React Router prend ensuite le relais côté client.

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Pour les projets Vite, Vercel applique souvent ce rewrite par défaut. Si jamais le problème apparaît, créer ce fichier le résout.

**À retenir.**
- Vercel auto-détecte Vite.
- Push = déploie (main → prod, autres → preview).
- React Router + refresh sur sous-URL = besoin d'un rewrite SPA.

---

## 8.5 Git workflow

**Notion.** Git versionne le code. Branche, commit, push, PR, merge — les bases.

### Bonnes pratiques observées sur ce projet

- **Branches feature** : `feat/2.0`, etc. — une fonctionnalité = une branche, mergée par PR.
- **Préfixes de commit** : `feat:`, `refactor:`, `docs:`, `chore:`, `fix:`. Convention "Conventional Commits", aide à scanner l'historique.
- **Commits ciblés** : un commit = un changement logique. Pas de mégacommit "tout en vrac".
- **Pas de `--no-verify`**, **pas de force push sur main**.

### Le couple Vercel ↔ GitHub

Quand le repo est connecté à Vercel :
- chaque push déclenche un build,
- les PRs ont une URL de preview attachée,
- on peut tester visuellement avant merge.

**À retenir.**
- Branches feature + PR.
- Préfixes de commit (`feat:`, `refactor:`, `docs:`, etc.).
- Push = déploie automatiquement sur Vercel.

---

## 8.6 `.gitignore` et fichiers non versionnés

**Notion.** `.gitignore` liste ce que git doit ignorer (ne pas versionner). Typiquement : `node_modules/`, `dist/`, fichiers d'IDE, secrets.

**Pourquoi `node_modules/`** : énorme (des dizaines de milliers de fichiers), reproductible à partir de `package.json` + `package-lock.json`, donc inutile de le versionner.

**À retenir.**
- `node_modules/` JAMAIS commité.
- `dist/` non plus (sortie de build, reconstruite).
- Secrets jamais commités (clés API, mots de passe).

---

## Exercices

### Exercice 1 (lecture)

Que fait exactement la commande `npm run build` sur ce projet ? Quelle commande est-elle équivalente à ?

### Exercice 2 (prédiction)

Tu fais `npm run dev`. Tu modifies une couleur dans `index.css`. Que se passe-t-il dans ton navigateur ?

### Exercice 3 (analyse)

Tu déploies sur Vercel. Tout marche. Un visiteur copie l'URL `https://ton-site.vercel.app/missions/portfolio` et la partage. Quelqu'un clique sur le lien et tombe sur une 404. Quelle est la cause probable et comment la corriger ?

### Exercice 4 (écriture)

Écris un fichier `vercel.json` minimal qui force la redirection de toutes les URLs vers `/index.html`.

### Exercice 5 (analyse)

Quelle est la différence entre :
- `npm run build` puis ouvrir `dist/index.html` dans Chrome ?
- `npm run preview` ?

Pourquoi la première peut "marcher" mais avec des problèmes ?

### Exercice 6 (analyse)

Tu collabores avec un dev qui te dit "j'ai ajouté un commit, fais juste `git pull`". Tu fais `git pull`, et tu as un conflit dans `package-lock.json`. Que faire ?

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

`npm run build` exécute le script `build` défini dans `package.json` : `tsc -b && vite build`.

Décomposé :
1. `tsc -b` lance le compilateur TypeScript en mode build (utilise les `references` du `tsconfig.json`). Il vérifie tous les types et émet (ou pas, selon la config) du JS.
2. `&&` enchaîne : si `tsc` retourne 0 (succès), on passe à la suite.
3. `vite build` bundle le code dans `dist/` (HTML, CSS, JS minifiés).

Si TS détecte une erreur, le build avorte → impossible de déployer un code typé incorrect.

</details>

<details>
<summary>Corrigé Exercice 2</summary>

Le navigateur reflète le changement **instantanément**, sans perdre l'état React (par exemple, si tu avais cliqué sur un flip card, il reste flippé). C'est le **HMR (Hot Module Replacement)** de Vite.

Pour du CSS, c'est l'équivalent de modifier le style dans les devtools : le navigateur applique le nouveau CSS sans recharger.

</details>

<details>
<summary>Corrigé Exercice 3</summary>

**Cause** : sans configuration de rewrite, Vercel cherche un fichier `missions/portfolio.html` à l'URL demandée. Comme `dist/` ne contient que `index.html` (SPA), il renvoie 404.

**Correction** : ajouter `vercel.json` à la racine du projet :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Cela sert `index.html` pour toute URL. Une fois le HTML chargé, React Router lit l'URL et rend `<MissionDetail />` correctement.

Note : Vercel applique souvent ce rewrite automatiquement sur les projets Vite. Si tu l'observes, c'est qu'il n'y est pas (config Vercel changée, framework non détecté, etc.).

</details>

<details>
<summary>Corrigé Exercice 4</summary>

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Détails :
- `source: "/(.*)"` — regex qui matche tout (le `(.*)` capture le chemin entier).
- `destination: "/index.html"` — fichier servi en réponse.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

- **`npm run build` puis ouvrir `dist/index.html` dans Chrome** : tu utilises le protocole `file://`. Beaucoup de choses peuvent casser : chemins absolus mal résolus, CORS sur les fetch, Service Workers, modules ES restreints. Tu peux voir la page mais pas la tester sérieusement.
- **`npm run preview`** : lance un serveur HTTP local qui sert `dist/` sur `http://localhost:4173` (par défaut). Comportement **proche de la prod**. C'est ce qu'il faut utiliser pour valider un build avant de déployer.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

`package-lock.json` est généré automatiquement par `npm`. En cas de conflit, n'essaye pas de le résoudre manuellement à la main (très complexe, format JSON imbriqué).

Procédure :
1. Accepter la version d'`origin` (l'autre dev) :
   ```bash
   git checkout --theirs package-lock.json
   ```
2. Régénérer en local :
   ```bash
   npm install
   ```
3. Stager et continuer le merge :
   ```bash
   git add package-lock.json
   git commit
   ```

Cette procédure garantit que `package-lock.json` reflète bien `package.json` après la fusion.

</details>

---

## Conclusion du cours

Tu as parcouru :

1. **JavaScript / TypeScript modernes** — les outils du langage.
2. **React de base** — composants, props, état, événements.
3. **Hooks** — `useState`, `useEffect`, `useRef`, custom hooks.
4. **React Router** — routes, params, navigation programmatique.
5. **APIs navigateur** — IntersectionObserver, rAF, CSS vars depuis JS.
6. **CSS moderne + Tailwind v4** — Grid areas, transforms 3D, BEM, tokens.
7. **Architecture et patterns** — SSOT, composition, sous-composants pour hooks.
8. **Tooling et déploiement** — Vite, TS, Prettier, Vercel, Git.

Pour la soutenance E5, garde en tête les **trois niveaux** de réponse :

1. **Ce que ça fait** — la fonction visible.
2. **Comment ça marche** — le mécanisme technique.
3. **Pourquoi ce choix** — la raison architecturale.

Si tu peux donner ces trois niveaux pour n'importe quelle ligne de ton code, tu es prêt.

Bon courage.
