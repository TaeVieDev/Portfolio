# Chapitre 1 — JavaScript et TypeScript modernes

Avant React, il faut maîtriser le langage. Ton projet utilise du JavaScript moderne (ES2020+) et TypeScript. Tous les concepts de ce chapitre se retrouvent en cascade dans les chapitres suivants — ne saute aucune section.

---

## 1.1 Modules ES (`import` / `export`)

**Notion.** Un module est un fichier `.ts` / `.tsx` qui peut exporter des valeurs (fonctions, classes, constantes, types) et en importer depuis d'autres modules. C'est le système qui remplace `<script src=...>` du HTML classique.

Deux formes d'export :

- `export default X` → un seul export principal par fichier, importé sans accolades : `import X from "./file"`.
- `export const Y = ...` → des exports nommés, plusieurs possibles, importés avec accolades : `import { Y, Z } from "./file"`.

**Code du projet** — [src/main.tsx](../../src/main.tsx) :

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
```

**Décodage** :

- Ligne 1 : `import { StrictMode } from "react"` — import **nommé** depuis la lib `react`. Les accolades indiquent qu'on cible un export précis (parmi plusieurs) de ce package.
- Ligne 2 : `import { createRoot } from "react-dom/client"` — import nommé depuis un **sous-chemin** (`/client`). Beaucoup de libs séparent leur API en sous-modules.
- Ligne 3 : pareil pour `BrowserRouter`.
- Ligne 4 : `import App from "./App"` — import **default**, pas d'accolades. Le nom (`App`) est libre — on aurait pu écrire `import Toto from "./App"`. Le chemin commence par `./` → c'est un fichier local, pas un package npm.
- Ligne 5 : `import "./index.css"` — **import sans variable**. On dit juste à Vite « charge ce fichier pour ses effets de bord ». Pour du CSS, l'effet est d'injecter les styles globaux dans la page.

**Côté export**, dans [src/App.tsx](../../src/App.tsx) :

```tsx
export default function App() { ... }
```

→ `export default` collé devant `function` : combine déclaration et export en une ligne. C'est cette fonction qui sera importée comme `App` dans `main.tsx`.

Et dans [src/data/missions.ts](../../src/data/missions.ts) :

```ts
export type Mission = { ... };
export const missions: Mission[] = [ ... ];
export const findMission = (slug: string) => ...;
```

→ trois exports **nommés** dans le même fichier. Côté consommateur, on prend ce qu'on veut : `import { findMission } from "../data/missions"`.

**À retenir.**
- Un fichier = un module isolé.
- Default = un seul, sans accolades à l'import.
- Nommé = autant qu'on veut, avec accolades à l'import.
- `import "./fichier.css"` charge le fichier pour ses effets (utile pour le CSS global).

---

## 1.2 Arrow functions

**Notion.** Syntaxe concise pour déclarer une fonction. Trois équivalences à connaître :

```js
// Fonction classique
function add(a, b) { return a + b; }

// Arrow avec accolades + return
const add = (a, b) => { return a + b; };

// Arrow concise : si le corps est une seule expression, return implicite
const add = (a, b) => a + b;

// Si UN seul argument, on peut omettre les parenthèses
const double = x => x * 2;
```

Différence avec `function` : une arrow function **n'a pas son propre `this`** — elle hérite de celui du contexte. En React fonctionnel, on n'utilise quasiment jamais `function` à l'intérieur d'un composant (sauf le composant lui-même par habitude).

**Code du projet** — [src/data/missions.ts:152-156](../../src/data/missions.ts) :

```ts
export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);

export const findMission = (slug: string): Mission | undefined =>
  missions.find((m) => m.slug === slug);
```

**Décodage** :

- `missionsByCategory` est une constante qui contient une arrow function. Elle prend un argument `cat` (typé `MissionCategory`) et retourne `missions.filter(...)`.
- Pas d'accolades autour du corps → return implicite : la valeur de l'expression à droite de la flèche est retournée automatiquement.
- À l'intérieur, on passe une **autre** arrow function à `.filter()` : `(m) => m.category === cat`. C'est le callback que `filter` appelle pour chaque élément.

**Code du projet** — [src/components/FlipCard.tsx:32](../../src/components/FlipCard.tsx#L32) :

```tsx
onClick={() => setFlipped((v) => !v)}
```

Deux arrows imbriquées :
- `() => setFlipped(...)` — arrow sans argument déclenchée au clic.
- `(v) => !v` — arrow passée à `setFlipped` qui reçoit la valeur courante et retourne son opposé.

**À retenir.**
- Arrow = syntaxe courte, parfaite pour les callbacks (passer une fonction en argument).
- Sans accolades = return implicite de l'expression.
- Un seul argument = parenthèses optionnelles (`x => x * 2`).

---

## 1.3 Destructuration

**Notion.** Permet d'extraire des propriétés d'un objet (ou des éléments d'un tableau) en une seule ligne et de les assigner à des variables du même nom.

```js
// Sans destructuration
const user = { name: "Thomas", age: 24 };
const name = user.name;
const age = user.age;

// Avec destructuration
const { name, age } = user;
```

Sur les **paramètres de fonction**, c'est extrêmement courant en React :

```tsx
// Sans : on doit faire props.name à chaque usage
function Hello(props) { return <h1>{props.name}</h1>; }

// Avec : on extrait name dès la signature
function Hello({ name }) { return <h1>{name}</h1>; }
```

On peut aussi **renommer** ou donner une **valeur par défaut** :

```js
const { name: prenom = "Anonyme" } = user;
// prenom vaut user.name, ou "Anonyme" si absent
```

**Code du projet** — [src/components/FlipCard.tsx:18](../../src/components/FlipCard.tsx#L18) :

```tsx
export default function FlipCard({ frontSrc, frontAlt, backSrc, backAlt }: Props) {
```

→ React passe un objet `props` au composant. La destructuration dans la signature extrait directement les 4 propriétés. Dans le corps, on écrit `frontSrc`, pas `props.frontSrc`.

**Code du projet** — [src/components/Header.tsx:23-24](../../src/components/Header.tsx#L23-L24) :

```tsx
const location = useLocation();
const navigate = useNavigate();
```

(Ici **pas** de destructuration : `useLocation` retourne un objet complet, et `useNavigate` retourne une fonction.)

Mais juste en dessous, [src/components/ScrollToTop.tsx:10](../../src/components/ScrollToTop.tsx#L10) :

```tsx
const { pathname, hash } = useLocation();
```

→ destructuration directe : on garde seulement les deux propriétés qui nous intéressent.

**Valeurs par défaut sur les props** — [src/components/BentoHero.tsx:14](../../src/components/BentoHero.tsx#L14) :

```tsx
export default function BentoHero({ id = "hero" }: { id?: string }) {
```

→ `id = "hero"` : si l'appelant ne passe pas `id`, on prend la valeur par défaut. Combiné avec `id?: string` (prop optionnelle dans le type), c'est ce qui permet d'écrire soit `<BentoHero />` soit `<BentoHero id="autre" />`.

**À retenir.**
- `const { x, y } = obj` extrait `obj.x` et `obj.y` en variables.
- Marche aussi dans les signatures de fonction.
- Valeur par défaut avec `=`, renommage avec `:`.

---

## 1.4 Template strings (backticks)

**Notion.** Chaîne de caractères entre **backticks** (`` ` ``) qui accepte :

- des **interpolations** `${expression}` (la valeur est convertie en string et insérée),
- les **retours à la ligne** sans `\n`.

```js
const name = "Thomas";
const msg = `Bonjour ${name}, il est ${new Date().getHours()}h.`;
// "Bonjour Thomas, il est 14h."
```

**Code du projet** — [src/components/Background.tsx:45-46](../../src/components/Background.tsx#L45-L46) :

```ts
el.style.setProperty("--cursor-x", `${lastX}px`);
el.style.setProperty("--cursor-y", `${lastY}px`);
```

→ on construit dynamiquement une string comme `"123px"` à partir de la variable `lastX`. Sans template string on écrirait `lastX + "px"` ou `String(lastX) + "px"`.

**Code du projet** — [src/components/FlipCard.tsx:29](../../src/components/FlipCard.tsx#L29) :

```tsx
className={`flip-card ${flipped ? "flipped" : ""}`}
```

→ on **concatène conditionnellement** une classe CSS. Si `flipped` est vrai, le résultat est `"flip-card flipped"`, sinon juste `"flip-card "`.

**Code du projet** — [src/components/Header.tsx:74](../../src/components/Header.tsx#L74) :

```tsx
navigate(`/#${id}`);
```

→ construction d'une URL : si `id === "contact"`, ça donne `/#contact`.

**À retenir.**
- Backticks `` ` `` au lieu de guillemets pour interpoler.
- `${expr}` insère le résultat de l'expression.
- Multi-ligne naturelle (pas besoin de `\n`).

---

## 1.5 Optional chaining `?.`

**Notion.** L'opérateur `?.` permet d'accéder à une propriété **uniquement si l'objet n'est ni `null` ni `undefined`**. Sinon, l'expression entière retourne `undefined` sans planter.

```js
// Sans : risque de "Cannot read properties of null"
const city = user.address.city;

// Avec : si user ou user.address est null/undefined, city = undefined
const city = user?.address?.city;

// Sur un appel de méthode
el?.scrollIntoView();        // n'appelle scrollIntoView que si el existe
fn?.(arg);                    // n'appelle fn que si fn existe
arr?.[0];                     // accède à arr[0] que si arr existe
```

**Code du projet** — [src/components/Header.tsx:80](../../src/components/Header.tsx#L80) :

```tsx
const el = document.getElementById(id);
el?.scrollIntoView({ behavior: "smooth" });
```

`getElementById` peut retourner `null` si aucun élément n'a cet id. Si `el` est `null`, `el?.scrollIntoView(...)` ne fait rien (pas d'erreur). Si `el` existe, la méthode est appelée normalement. C'est **plus court et plus sûr** que `if (el) el.scrollIntoView(...)`.

**À retenir.**
- `?.` évite les `TypeError` sur des accès profonds.
- Si la chaîne casse à un `null/undefined`, le résultat est `undefined` sans erreur.
- À utiliser dès qu'une valeur peut être absente (résultat de `document.getElementById`, prop optionnelle, etc.).

---

## 1.6 Nullish coalescing `??`

**Notion.** L'opérateur `??` retourne la valeur de droite **seulement si celle de gauche est `null` ou `undefined`**. Sinon il retourne la valeur de gauche.

À ne pas confondre avec `||` (OU logique) qui considère aussi `0`, `""`, et `false` comme « faux » :

```js
const a = 0;
a || "défaut";   // → "défaut" (parce que 0 est falsy)
a ?? "défaut";   // → 0 (parce que 0 n'est ni null ni undefined)
```

**Code du projet** — [src/pages/MissionsE5.tsx:14](../../src/pages/MissionsE5.tsx) :

```tsx
<div className={`mission-badge ${mission.badgeClass ?? ""}`}>
```

`badgeClass` est une prop **optionnelle** dans le type `Mission` (`badgeClass?: string`). Donc elle peut être `undefined`. Si on faisait juste `${mission.badgeClass}`, on aurait `"mission-badge undefined"` dans la classe (catastrophe). Avec `?? ""`, on remplace `undefined` par une chaîne vide → `"mission-badge "` propre.

**À retenir.**
- `??` = « si null ou undefined, prends la valeur de droite ».
- Préférer `??` à `||` quand `0` ou `""` sont des valeurs légitimes.

---

## 1.7 Ternaire conditionnel `? :`

**Notion.** Forme courte d'un `if/else` qui **retourne une valeur**. Très utilisée en JSX où on a besoin d'expressions.

```js
// Forme longue
let label;
if (status === "sent") {
  label = "Envoyé";
} else {
  label = "Envoyer";
}

// Ternaire
const label = status === "sent" ? "Envoyé" : "Envoyer";
```

Structure : `condition ? valeurSiVrai : valeurSiFaux`.

**Code du projet** — [src/pages/Contact.tsx:117](../../src/pages/Contact.tsx) :

```tsx
{status === "sent" ? "Message envoyé ✓" : "Envoyer le message"}
```

→ change le texte du bouton selon l'état.

**Code du projet** — [src/pages/Competence.tsx:48-52](../../src/pages/Competence.tsx#L48-L52) :

```tsx
{skill.customIcon ? (
  <img src={skill.customIcon} alt={skill.label} className="custom-tech-icon" />
) : (
  <i className={skill.icon} />
)}
```

→ rendu conditionnel d'**éléments JSX entiers**. Si une icône custom est définie, on rend `<img>`, sinon `<i>`. Les parenthèses encadrent les éléments JSX multi-lignes pour la lisibilité.

**À retenir.**
- Ternaire = `if/else` qui rend une valeur.
- Indispensable en JSX où on ne peut pas mettre un `if` au milieu.
- Imbriquable mais déconseillé pour la lisibilité.

---

## 1.8 Court-circuit logique `&&` en JSX

**Notion.** `A && B` retourne `B` si `A` est truthy, sinon retourne `A` (qui est falsy). En JSX, ça permet d'afficher conditionnellement un élément sans `else` :

```tsx
{condition && <Composant />}
```

Si `condition` est vrai → React rend `<Composant />`.
Si `condition` est faux → React rend `false` (qui n'affiche rien).

**Piège** : `0 && <X />` rend `0` à l'écran (le chiffre zéro). C'est pour ça qu'on évite `array.length && ...` au profit de `array.length > 0 && ...`.

**Code du projet** — [src/pages/MissionDetail.tsx:54-59](../../src/pages/MissionDetail.tsx#L54-L59) :

```tsx
{mission.context && (
  <div className="mission-detail__block">
    <h2>Contexte</h2>
    <p>{mission.context}</p>
  </div>
)}
```

→ si `mission.context` est défini (truthy), on rend la carte. Sinon, rien. Plus simple qu'un ternaire avec `null` à droite.

**Code du projet** — [src/pages/MissionDetail.tsx:76](../../src/pages/MissionDetail.tsx#L76) :

```tsx
{mission.links.length > 0 && ( ... )}
```

→ noter le `> 0` explicite : on évite que `0` soit rendu si le tableau est vide.

**À retenir.**
- `&&` en JSX = rendu conditionnel sans branche `else`.
- Toujours utiliser une vraie condition booléenne, pas un nombre brut.

---

## 1.9 Méthodes de tableau : `map`, `filter`, `find`, `forEach`

**Notion.** Quatre méthodes qu'on retrouve partout dans le projet.

| Méthode | Retourne | Usage typique |
|---------|----------|---------------|
| `map(fn)` | Un **nouveau tableau** de même longueur, où chaque élément est transformé | Rendre une liste JSX, transformer des données |
| `filter(fn)` | Un **nouveau tableau** ne contenant que les éléments où `fn` retourne `true` | Garder ce qui correspond à un critère |
| `find(fn)` | **Le premier élément** où `fn` retourne `true`, ou `undefined` | Trouver UN élément par identifiant |
| `forEach(fn)` | Rien (`undefined`) | Exécuter un effet de bord sur chaque élément |

Toutes prennent un callback (souvent une arrow function) qui reçoit `(element, index, array)`.

**Code du projet — `map`** — [src/pages/Competence.tsx:65-67](../../src/pages/Competence.tsx#L65-L67) :

```tsx
{skills.map((s) => (
  <SkillCard key={s.label} skill={s} />
))}
```

→ on transforme un tableau de `Skill` en un tableau de `<SkillCard />`. React saura les rendre côte à côte. La prop `key` est **obligatoire** sur chaque élément d'une liste (voir chapitre 2).

**Code du projet — `filter`** — [src/data/missions.ts:152](../../src/data/missions.ts#L152) :

```ts
export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);
```

→ ne garde que les missions dont la catégorie correspond. Retourne un nouveau tableau (l'original n'est pas modifié).

**Code du projet — `find`** — [src/data/missions.ts:155-156](../../src/data/missions.ts#L155-L156) :

```ts
export const findMission = (slug: string): Mission | undefined =>
  missions.find((m) => m.slug === slug);
```

→ retourne **la première** mission dont le slug matche. Si aucune ne matche, retourne `undefined` (d'où le type de retour `Mission | undefined`).

**Code du projet — `forEach`** — [src/components/Header.tsx:51-55](../../src/components/Header.tsx#L51-L55) :

```ts
entries.forEach((entry) => {
  if (entry.isIntersecting) {
    setActive(entry.target.id);
  }
});
```

→ on parcourt les `entries` (sans transformer en nouveau tableau) pour déclencher un effet de bord (`setActive`). Ici `map` serait incorrect parce qu'on ne se sert pas du tableau retourné.

**À retenir.**
- `map` quand tu veux **transformer** (notamment vers du JSX).
- `filter` pour **garder ce qui correspond**.
- `find` pour **chercher un seul élément**.
- `forEach` pour **exécuter un effet** sans valeur retournée.
- Les trois premières **ne modifient pas** le tableau original.

---

## 1.10 TypeScript : `type`, `interface`, unions, optionnels, génériques

**Notion.** TypeScript ajoute des **annotations de types** à JavaScript. Elles sont vérifiées par le compilateur (`tsc`) et disparaissent à la compilation — le navigateur n'exécute que du JS.

### `type` vs `interface`

Les deux décrivent la forme d'un objet. Différences pratiques :

- `interface` peut être étendue par déclaration multiple (réouverture).
- `type` peut représenter aussi des unions, des tuples, etc.

Dans la pratique pour le projet, ils sont interchangeables. Ton code utilise les deux.

**Code du projet** — [src/components/SectionTitle.tsx:3-5](../../src/components/SectionTitle.tsx#L3-L5) :

```tsx
interface Props {
  children: ReactNode;
}
```

**Code du projet** — [src/components/FlipCard.tsx:7-12](../../src/components/FlipCard.tsx#L7-L12) :

```tsx
type Props = {
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
};
```

### Propriétés optionnelles `?`

Le `?` après le nom dit « cette propriété peut être absente ».

**Code du projet** — [src/data/missions.ts:15-28](../../src/data/missions.ts#L15-L28) :

```ts
export type Mission = {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;  // optionnelle
  badgeClass?: string;       // optionnelle
  // ...
};
```

→ une mission **doit** avoir un `slug`, `title`, `description`. Elle peut avoir ou pas un `longDescription`. Combiné avec le `??` (vu en 1.6) et le `&&` (vu en 1.8), on rend ces champs proprement.

### Unions de littéraux

Une union dit « la valeur est forcément une de cette liste ».

**Code du projet** — [src/pages/Contact.tsx:6](../../src/pages/Contact.tsx) :

```ts
type Status = "idle" | "sent";
```

→ une variable typée `Status` ne peut **que** valoir `"idle"` ou `"sent"`. Si tu écris `setStatus("loading")`, TypeScript refuse de compiler. C'est une mini state-machine type-safe.

### Génériques `<T>`

Une fonction ou un hook peut être **paramétré par un type**. Tu vois `<T>` comme un paramètre, mais pour les types.

**Code du projet** — [src/hooks/useSpotlight.ts:13](../../src/hooks/useSpotlight.ts#L13) :

```ts
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  // ...
}
```

Décodage :
- `<T extends HTMLElement = HTMLDivElement>` — `T` est un paramètre de type. Contrainte : `T` doit être un sous-type de `HTMLElement` (sinon refusé). Par défaut, si on n'en précise pas, c'est `HTMLDivElement`.
- `useRef<T>(null)` — on transmet `T` au hook `useRef`, qui crée une ref typée vers ce type d'élément.

Usage par défaut : `const { ref } = useSpotlight();` → ref pointera vers un `<div>`.
Usage typé autrement : `const { ref } = useSpotlight<HTMLArticleElement>();` → ref pointera vers un `<article>`.

### Assertions `as`

Force TypeScript à considérer une valeur comme d'un type donné. À utiliser avec parcimonie — c'est désactiver la vérification.

**Code du projet** — [src/pages/Contact.tsx:21](../../src/pages/Contact.tsx#L21) :

```ts
(e.currentTarget as HTMLFormElement).reset();
```

→ `e.currentTarget` est typé `Element` par défaut (interface large), qui n'a pas de méthode `reset()`. L'assertion `as HTMLFormElement` dit à TS « je te garantis que c'est un formulaire », et débloque l'accès à `.reset()`.

### Non-null assertion `!`

Le `!` à la fin d'une expression dit « cette valeur n'est jamais null ni undefined, fais-moi confiance ».

**Code du projet** — [src/main.tsx:12](../../src/main.tsx#L12) :

```ts
createRoot(document.getElementById("root")!).render(...);
```

→ `getElementById` retourne `HTMLElement | null`. Mais on sait qu'on a bien un `<div id="root">` dans `index.html`. Le `!` enlève le `null` du type pour que `createRoot` (qui n'accepte pas `null`) compile.

**À retenir.**
- `type` et `interface` pour décrire la forme des objets / props.
- `?` après un nom de propriété = optionnelle.
- Unions de littéraux = mini state-machine.
- Génériques `<T>` = fonction paramétrée par un type.
- `as` = assertion (force le type, à éviter sauf nécessité).
- `!` = « pas null/undefined, garanti ».

---

## Exercices

Réponds à chaque exercice **sans ouvrir le corrigé**. Le but est de t'auto-évaluer.

### Exercice 1 (lecture, facile)

Que fait cette ligne, mot par mot ?

```ts
import { type Mission, missionsByCategory } from "../data/missions";
```

### Exercice 2 (prédiction)

Quelle est la valeur de `result` après ces lignes ?

```js
const user = { name: "Thomas", role: undefined };
const result = user.role ?? "Étudiant";
```

Et avec `||` à la place de `??` ?

### Exercice 3 (prédiction, piège)

Quelle est la valeur de `result` ?

```js
const count = 0;
const result = count || "Aucun";
```

Et avec `??` ?

### Exercice 4 (lecture)

Décompose cette ligne en expliquant chaque morceau (`?.`, `?.`, ternaire, template string) :

```tsx
className={`mission-badge ${mission.badgeClass ?? ""}`}
```

### Exercice 5 (écriture)

Réécris cette boucle classique en utilisant `.filter()` puis `.map()` :

```js
const adultsNames = [];
for (const u of users) {
  if (u.age >= 18) {
    adultsNames.push(u.name.toUpperCase());
  }
}
```

### Exercice 6 (TypeScript, prédiction)

Quel(s) appel(s) compilent sans erreur ?

```ts
type Color = "red" | "green" | "blue";
function paint(c: Color) { /* ... */ }

paint("red");       // a
paint("yellow");    // b
paint("Red");       // c
const x: Color = "blue";
paint(x);           // d
```

### Exercice 7 (lecture du projet)

Ouvre [src/pages/MissionDetail.tsx:11-17](../../src/pages/MissionDetail.tsx#L11-L17) et explique en 4-5 phrases ce que fait le code :

```tsx
const { slug } = useParams<{ slug: string }>();
const mission = slug ? findMission(slug) : undefined;
const { ref, onMouseMove } = useSpotlight();

if (!mission) return <Navigate to="/#missions" replace />;
```

(Concepts du chapitre à mobiliser : destructuration, ternaire, génériques, optional chaining indirect.)

### Exercice 8 (écriture, plus dur)

Écris un type TypeScript pour décrire un commentaire de blog ayant :
- un `id` (number),
- un `author` (string),
- un `text` (string),
- un `replies` optionnel (tableau de commentaires de la même forme).

Puis écris une fonction `findById(comments, id)` qui retourne le commentaire avec cet id parmi un tableau **plat** (pas de récursion sur `replies`).

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

- `import` : on importe quelque chose depuis un autre module.
- `{ ... }` : import nommé (plusieurs items possibles entre accolades).
- `type Mission` : **import de type uniquement**. Le préfixe `type` dit à TypeScript que c'est un type, pas une valeur runtime → ça permet à Vite/esbuild de complètement supprimer cette ligne à la compilation (un type n'existe pas en JS).
- `, missionsByCategory` : on importe aussi cette fonction (valeur, pas type).
- `from "../data/missions"` : chemin relatif. `..` = remonter d'un dossier, donc depuis `src/pages/MissionsE5.tsx`, on vise `src/data/missions.ts`. L'extension `.ts` est omise (Vite la résout tout seul).

</details>

<details>
<summary>Corrigé Exercice 2</summary>

- Avec `??` : `result = "Étudiant"`. `user.role` vaut `undefined`, donc on prend la valeur de droite.
- Avec `||` : `result = "Étudiant"` aussi. `undefined` est falsy, donc `||` saute à droite.

Dans ce cas précis, le résultat est identique. La différence apparaît avec `0` ou `""` (exercice suivant).

</details>

<details>
<summary>Corrigé Exercice 3</summary>

- Avec `||` : `result = "Aucun"`. Parce que `0` est falsy, donc `||` saute à droite.
- Avec `??` : `result = 0`. Parce que `0` n'est ni `null` ni `undefined`, on garde la gauche.

C'est exactement pour éviter ce piège qu'on préfère `??` quand `0`, `""` ou `false` sont des valeurs **valides** dans le contexte (par exemple, un compteur, une chaîne vide volontaire).

</details>

<details>
<summary>Corrigé Exercice 4</summary>

- `className={...}` : prop JSX. Les accolades indiquent qu'on passe une **expression** (pas une chaîne littérale).
- `` `mission-badge ${...}` `` : template string. La partie fixe `"mission-badge "` est concaténée avec le résultat de l'expression entre `${ }`.
- `mission.badgeClass` : accès à la propriété `badgeClass` de l'objet `mission`.
- `?? ""` : si `mission.badgeClass` est `null` ou `undefined`, on utilise `""` (chaîne vide) à la place — évite d'avoir le texte `"undefined"` dans la classe CSS.
- Résultat final : `"mission-badge atelier-badge"` si badgeClass défini, `"mission-badge "` sinon.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

```js
const adultsNames = users
  .filter((u) => u.age >= 18)
  .map((u) => u.name.toUpperCase());
```

Décodage :
- `.filter(...)` produit un nouveau tableau ne contenant que les users majeurs.
- On chaîne `.map(...)` sur ce nouveau tableau pour transformer chaque user en son `name` en majuscules.
- Résultat : un tableau de strings.

Avantages vs `for` : plus court, lit comme une description ("garde les adultes, prends leur nom"), pas de variable mutable, immutable (l'original `users` est intact).

</details>

<details>
<summary>Corrigé Exercice 6</summary>

- a) `paint("red")` ✅ — `"red"` est dans l'union.
- b) `paint("yellow")` ❌ — pas dans l'union, erreur TS.
- c) `paint("Red")` ❌ — sensible à la casse, `"Red"` ≠ `"red"`.
- d) `paint(x)` ✅ — `x` est typé `Color`, et `"blue"` est bien dans l'union.

Le bénéfice des unions de littéraux : impossible de se tromper sur les valeurs acceptées, l'erreur saute à la compilation.

</details>

<details>
<summary>Corrigé Exercice 7</summary>

1. `const { slug } = useParams<{ slug: string }>();` — on appelle `useParams` (hook de React Router) en lui disant via le générique `<{ slug: string }>` que les paramètres d'URL contiennent un `slug` typé string. On destructure le retour pour ne garder que `slug`.
2. `const mission = slug ? findMission(slug) : undefined;` — ternaire : si `slug` est défini, on cherche la mission correspondante dans les données ; sinon on met `undefined`. (En pratique, `slug` sera toujours défini ici parce que la route `/missions/:slug` ne matche pas sans slug, mais TypeScript force la vérification.)
3. `const { ref, onMouseMove } = useSpotlight();` — destructure le custom hook (vu chapitre 3).
4. `if (!mission) return <Navigate to="/#missions" replace />;` — **early return** : si la mission n'existe pas (slug invalide dans l'URL), on rend un composant `<Navigate>` qui redirige vers la liste des missions. Le `replace` évite d'empiler dans l'historique (le retour arrière ne ramènera pas sur cette URL invalide).

</details>

<details>
<summary>Corrigé Exercice 8</summary>

```ts
type Comment = {
  id: number;
  author: string;
  text: string;
  replies?: Comment[];   // type récursif : auto-référence
};

const findById = (comments: Comment[], id: number): Comment | undefined =>
  comments.find((c) => c.id === id);
```

Points clés :
- `replies?: Comment[]` — la propriété est optionnelle ET son type se réfère à `Comment` lui-même (type récursif, autorisé en TS).
- Le retour `Comment | undefined` reflète que `find` peut ne rien trouver.
- L'arrow concise (sans accolades) retourne directement le résultat de `find`.

Note : si tu voulais chercher récursivement à travers les `replies`, il faudrait une fonction qui s'appelle elle-même — concept hors scope ici.

</details>
