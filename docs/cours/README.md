# Cours — Comprendre chaque ligne de ce portfolio

Ce cours décortique tout le portfolio et est structuré **par concept** pour que tu construises une vraie compréhension transverse plutôt qu'une mémorisation locale.

Chaque notion est :

1. expliquée en théorie (la définition et le « pourquoi »),
2. illustrée par un **extrait réel de ton code** décodé ligne par ligne,
3. suivie d'**exercices progressifs** avec corrigés cachés.

---

## Comment utiliser ce cours

1. **Lis dans l'ordre.** Les chapitres sont progressifs : les concepts du chapitre 1 sont supposés acquis au chapitre 2.
2. **Garde le code ouvert à côté.** Quand un chapitre cite un fichier, ouvre-le pour voir le contexte complet.
3. **Fais les exercices avant de regarder les corrigés.** Résister à la tentation est la moitié de l'apprentissage.
4. **Reviens en arrière.** Si en chapitre 5 tu bloques sur une destructuration, retourne au 1.3.

---

## Plan des chapitres

| #                                | Chapitre                         | Ce que tu sauras expliquer après                                                |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| [1](01-js-ts-modernes.md)        | JavaScript / TypeScript modernes | `import`, destructuration, `?.`, `??`, ternaire, méthodes tableau, types TS     |
| [2](02-react-base.md)            | React de base                    | Composant fonctionnel, JSX, props, état, événements, listes, rendu conditionnel |
| [3](03-hooks.md)                 | Les hooks React                  | `useState`, `useEffect`, `useRef`, custom hooks, Rules of Hooks                 |
| [4](04-react-router.md)          | Routing client                   | `BrowserRouter`, routes dynamiques, `useParams`, `Link`, `Navigate`, fallback   |
| [5](05-apis-navigateur.md)       | APIs navigateur avancées         | `IntersectionObserver`, `requestAnimationFrame`, CSS vars depuis JS             |
| [6](06-css-tailwind.md)          | CSS moderne + Tailwind v4        | Grid areas, custom properties, transforms 3D, BEM, `@theme`, breakpoints        |
| [7](07-architecture-patterns.md) | Architecture et patterns         | Single source of truth, composition, state-machine, sous-composants             |
| [8](08-tooling-deploiement.md)   | Tooling et déploiement           | Vite, TS project refs, Prettier, Vercel SPA, Git                                |

---

## Légende des sections

Dans chaque chapitre tu trouveras toujours la même structure :

- **Notion** — la définition et le « pourquoi ».
- **Code du projet** — un extrait réel issu de tes fichiers `src/`.
- **Décodage** — explication ligne par ligne du code montré.
- **À retenir** — le résumé à mémoriser.
- **Exercices** — 5 à 8 questions progressives à la fin du chapitre.
- **Corrigés** — section repliable, à n'ouvrir qu'après ta tentative.

---

## Conseil de méthode

Le jury peut te demander : « explique-moi cette ligne ». Trois réponses possibles selon la profondeur attendue :

1. **Niveau 1 — ce que ça fait** : « ça récupère le slug de l'URL ».
2. **Niveau 2 — comment ça marche** : « `useParams` est un hook React Router qui lit les segments dynamiques de l'URL définis dans la route, ici `:slug` dans `/missions/:slug` ».
3. **Niveau 3 — pourquoi ce choix** : « on extrait le slug ici parce qu'il sert d'identifiant pour retrouver la mission dans `data/missions.ts`, ce qui évite de dupliquer les données entre la liste et la page détail ».

Ce cours vise à te donner les trois niveaux pour chaque concept du projet.
