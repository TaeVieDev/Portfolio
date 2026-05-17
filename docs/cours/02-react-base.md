# Chapitre 2 — React de base

React est une **bibliothèque** (pas un framework) qui te permet de décrire ton interface comme une fonction de l'état. Tu décris « à quoi ressemble l'écran quand l'état vaut X », et React s'occupe de mettre à jour le DOM quand X change.

---

## 2.1 Composant fonctionnel

**Notion.** Un composant React est une **fonction** qui retourne du JSX. Le nom commence **obligatoirement** par une majuscule (sinon React la traiterait comme une balise HTML).

```tsx
function Hello() {
  return <h1>Bonjour</h1>;
}
```

S'utilise ensuite comme une balise : `<Hello />`.

**Code du projet** — [src/components/Footer.tsx:2-28](../../src/components/Footer.tsx) :

```tsx
export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="footer-social-links">
          <a href="https://github.com/thomas-montout" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-square-github" />
          </a>
          {/* ... */}
        </div>
        <p>© 2026 Thomas. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

**Décodage** :

- `export default function Footer()` — déclare une fonction nommée `Footer`, l'export default permet de l'importer avec `import Footer from "./Footer"`.
- Pas d'arguments → ce composant ne prend pas de props.
- `return ( ... )` — la fonction retourne un seul élément JSX racine. Les parenthèses autour ne sont pas obligatoires mais permettent de retourner du multi-ligne sans le `;` automatique de JavaScript qui casserait tout.
- À l'utilisation : `<Footer />` quelque part dans `App.tsx`.

**À retenir.**
- Composant = fonction qui retourne du JSX.
- Nom en **MajusculeCamelCase**.
- Doit retourner **un seul élément racine** (fragment `<>...</>` ou wrapper `<div>`).

---

## 2.2 JSX — différences avec HTML

**Notion.** JSX ressemble à du HTML écrit dans du JavaScript, mais ce n'est pas du HTML. C'est du sucre syntaxique compilé en appels `React.createElement(...)`.

Différences importantes :

| HTML | JSX | Pourquoi |
|------|-----|----------|
| `class` | `className` | `class` est mot-clé JS réservé |
| `for` | `htmlFor` | idem |
| `onclick="..."` | `onClick={fn}` | événements en camelCase, valeur = fonction JS |
| `autoplay` | `autoPlay` | attributs HTML deviennent camelCase |
| `<input>` | `<input />` | balises auto-fermantes obligatoires |
| `style="color: red"` | `style={{ color: "red" }}` | objet JS avec propriétés camelCase |
| `<!-- comment -->` | `{/* comment */}` | commentaires JS dans accolades |
| Booléens : `disabled` ou rien | `disabled` ou `disabled={true}` | `disabled={false}` retire l'attribut |

**Accolades `{ }`** — permettent d'insérer **n'importe quelle expression JS** dans le JSX :

```tsx
<p>{user.name}</p>                    // variable
<p>{1 + 1}</p>                        // expression
<p>{isAdmin ? "Admin" : "User"}</p>   // ternaire
<p>{items.map(...)}</p>               // appel de fonction
```

**Code du projet** — [src/pages/Contact.tsx:47-49](../../src/pages/Contact.tsx#L47-L51) :

```tsx
<label htmlFor="firstname" className="form-label">
  Prénom
</label>
```

→ `htmlFor` (pas `for`), `className` (pas `class`).

**Code du projet** — [src/pages/EcoleAlternance.tsx:56](../../src/pages/EcoleAlternance.tsx#L56) :

```tsx
<video className="coface-video" autoPlay loop muted playsInline>
```

→ booléens HTML écrits comme attributs sans valeur (`autoPlay`, `loop`, `muted`, `playsInline`), tous camelCased (`playsInline` et non `playsinline`).

**À retenir.**
- JSX ≠ HTML : `className`, `htmlFor`, événements `onXxx`.
- Balises auto-fermantes obligatoires : `<img />`, `<input />`.
- Accolades pour injecter du JS.
- `{/* commentaire */}` dans le JSX.

---

## 2.3 Props

**Notion.** Les props sont les **arguments** d'un composant. React les rassemble dans un seul objet passé en premier paramètre.

```tsx
// Définition
function Greeting({ name, age }) {
  return <p>{name} a {age} ans.</p>;
}

// Usage
<Greeting name="Thomas" age={24} />
```

Note : `name="Thomas"` (string littérale) vs `age={24}` (expression JS — un nombre).

En TypeScript, on **type** les props pour avoir l'auto-complétion et l'erreur à la compilation si on en oublie une.

**Code du projet** — [src/components/FlipCard.tsx:7-18](../../src/components/FlipCard.tsx#L7-L18) :

```tsx
type Props = {
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
};

export default function FlipCard({ frontSrc, frontAlt, backSrc, backAlt }: Props) {
```

**Décodage** :

- `type Props = { ... }` — on définit la forme attendue de l'objet props.
- Toutes les propriétés sont obligatoires (pas de `?`).
- Dans la signature : `({ frontSrc, frontAlt, ... }: Props)` — destructuration des props, typage `Props` de l'objet entier.

À l'utilisation, [src/components/BentoHero.tsx:21-26](../../src/components/BentoHero.tsx#L21-L26) :

```tsx
<FlipCard
  frontSrc="/img/photos/herophoto.png"
  frontAlt="Photo de profil - Recto"
  backSrc="/img/photos/luffy.png"
  backAlt="Photo de profil - Verso"
/>
```

→ chaque prop est passée comme attribut. Si on oubliait `backAlt`, TypeScript refuserait de compiler.

### Props optionnelles + valeurs par défaut

**Code du projet** — [src/components/BentoHero.tsx:14](../../src/components/BentoHero.tsx#L14) :

```tsx
export default function BentoHero({ id = "hero" }: { id?: string }) {
```

- `id?: string` — prop optionnelle (le `?` dans le type).
- `id = "hero"` — valeur par défaut si non fournie.
- Résultat : `<BentoHero />` et `<BentoHero id="autre" />` sont tous deux valides.

**À retenir.**
- Props = arguments du composant, rassemblés dans un objet.
- En TS, on type cet objet avec `type` ou `interface`.
- `prop?` = optionnelle ; `prop = "valeur"` = valeur par défaut dans la signature.
- Strings entre guillemets, autres expressions entre accolades.

---

## 2.4 Children (le contenu entre balises)

**Notion.** Quand tu écris `<X>contenu</X>`, le « contenu » est passé comme une prop spéciale appelée `children`. Elle peut être du texte, des nombres, du JSX, un tableau, `null`, etc.

```tsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>Bonjour</Card>
<Card><h1>Titre</h1><p>Texte</p></Card>
```

Le type TypeScript pour `children` est généralement `ReactNode` — le type le plus large possible pour ce qui peut être rendu.

**Code du projet** — [src/components/SectionTitle.tsx](../../src/components/SectionTitle.tsx) :

```tsx
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SectionTitle({ children }: Props) {
  return (
    <h2 className="mb-8 tracking-[1px] [word-spacing:1px] text-text-primary text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] mid:text-[2.5rem]">
      <strong>{children}</strong>
    </h2>
  );
}
```

**Décodage** :

- `interface Props { children: ReactNode }` — déclare que ce composant attend des enfants.
- `{ children }: Props` — destructure les props pour extraire `children`.
- `<strong>{children}</strong>` — injecte les enfants dans le rendu.

À l'utilisation :

```tsx
<SectionTitle>En quelques mots</SectionTitle>
```

→ la chaîne `"En quelques mots"` est `children`. Le composant l'enveloppe dans un `<h2><strong>...</strong></h2>` stylé.

**À retenir.**
- `children` = contenu entre balises ouvrante et fermante.
- Type usuel : `ReactNode`.
- Permet de créer des **wrappers** réutilisables (cartes, layouts, titres).

---

## 2.5 État local avec `useState` (introduction)

**Notion.** Un composant peut avoir des **valeurs internes** qui changent au cours du temps. React appelle ça l'**état** (state). Quand l'état change, React **re-rend** le composant.

`useState` est le hook qui crée une variable d'état. Il retourne un tableau `[valeur, setter]`.

```tsx
const [count, setCount] = useState(0);
// count : valeur actuelle (lecture)
// setCount : fonction pour la mettre à jour
```

Lire `count` te donne la valeur. Appeler `setCount(nouvelleValeur)` la change ET déclenche un re-rendu.

**Code du projet** — [src/components/FlipCard.tsx:23-32](../../src/components/FlipCard.tsx#L23-L32) :

```tsx
const [flipped, setFlipped] = useState(false);

return (
  <div
    className={`flip-card ${flipped ? "flipped" : ""}`}
    onClick={() => setFlipped((v) => !v)}
  >
    {/* ... */}
  </div>
);
```

**Décodage** :

- `useState(false)` — création de l'état avec valeur initiale `false`.
- `[flipped, setFlipped]` — destructuration du tableau retourné.
- `className={...flipped ? "flipped" : ""}` — la classe CSS dépend de l'état.
- `onClick={() => setFlipped((v) => !v)}` — au clic, on bascule.
- **Setter fonctionnel** `(v) => !v` : v est la valeur courante, on retourne l'opposée. Plus sûr que `setFlipped(!flipped)` si plusieurs updates s'enchaînent (React peut les fusionner).

Le détail des hooks (et notamment `useState`) est repris au chapitre 3.

**À retenir.**
- `useState(init)` crée un état local au composant.
- Retourne `[valeur, setter]`.
- Appeler le setter déclenche un re-rendu.
- Préférer la forme fonctionnelle du setter (`v => ...`) quand la nouvelle valeur dépend de l'ancienne.

---

## 2.6 Événements

**Notion.** En JSX, on attache un gestionnaire d'événement avec une prop `onXxx` qui prend une fonction. La fonction reçoit un **objet événement** (équivalent React du `Event` du DOM).

```tsx
<button onClick={(e) => console.log(e)}>Clic</button>
```

Événements courants : `onClick`, `onChange`, `onSubmit`, `onMouseMove`, `onMouseEnter`, `onFocus`, `onBlur`, `onKeyDown`...

En TypeScript, on type l'événement pour avoir l'auto-complétion :
- `React.MouseEvent<HTMLButtonElement>` pour les clics
- `React.FormEvent<HTMLFormElement>` pour les submits
- `React.ChangeEvent<HTMLInputElement>` pour les changements d'input

**Code du projet** — [src/pages/Contact.tsx:14-25](../../src/pages/Contact.tsx#L14-L25) :

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setStatus("sent");
  (e.currentTarget as HTMLFormElement).reset();
  setTimeout(() => setStatus("idle"), 4000);
};

return (
  <form method="post" className="contact-form" onSubmit={handleSubmit}>
    {/* ... */}
  </form>
);
```

**Décodage** :

- `(e: React.FormEvent<HTMLFormElement>)` — type précis de l'événement de submit sur un `<form>`.
- `e.preventDefault()` — empêche le comportement par défaut du navigateur (ici, le rechargement de la page après submit).
- `e.currentTarget` — référence vers l'élément sur lequel le handler est attaché (le `<form>`).
- `setTimeout(..., 4000)` — au bout de 4 secondes, on remet l'état à `"idle"`.

**Code du projet** — [src/components/Header.tsx:67-83](../../src/components/Header.tsx#L67-L83) :

```tsx
const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  setMobileOpen(false);
  // ...
};

// Usage :
onClick={(e) => handleClick(e, item.id)}
```

→ note qu'on encapsule l'appel pour passer **deux** arguments (`e` et `id`).

**À retenir.**
- Événements JSX : `onClick`, `onSubmit`, `onChange`, etc.
- `e.preventDefault()` annule le comportement défaut.
- Toujours typer en TS : `React.XxxEvent<HTMLYyy>`.
- Pour passer des args supplémentaires : wrapping arrow `(e) => handler(e, arg)`.

---

## 2.7 Listes et `key`

**Notion.** Pour rendre une liste, on utilise `.map()` qui transforme un tableau de données en tableau de JSX.

**Règle d'or** : chaque élément d'une liste doit avoir une prop `key` **unique** et **stable**. C'est ce qui permet à React de savoir quel élément a changé, lequel a bougé, lequel a été supprimé.

```tsx
{users.map((u) => <li key={u.id}>{u.name}</li>)}
```

- ✅ `key={u.id}` — unique et stable (l'id ne change pas).
- ⚠️ `key={index}` — accepté mais déconseillé si l'ordre peut changer (insertion, suppression).
- ❌ `key={Math.random()}` — change à chaque rendu, React ne peut rien optimiser.

**Code du projet** — [src/components/Header.tsx:94-103](../../src/components/Header.tsx#L94-L103) :

```tsx
{navItems.map((item) => (
  <a
    key={item.id}
    href={`#${item.id}`}
    onClick={(e) => handleClick(e, item.id)}
    className={active === item.id ? "active" : ""}
  >
    {item.label}
  </a>
))}
```

**Décodage** :

- `navItems.map(item => ...)` — pour chaque item de la liste, on produit un `<a>`.
- `key={item.id}` — `item.id` est unique parmi les nav items (`"hero"`, `"bts"`, etc.). Parfait comme key.
- Les autres props du `<a>` utilisent aussi `item.id` ou `item.label` pour le contenu dynamique.

**Code du projet** — [src/pages/MissionsE5.tsx:64-66](../../src/pages/MissionsE5.tsx#L64-L66) :

```tsx
{formation.map((m) => (
  <Card key={m.slug} mission={m} />
))}
```

→ `key={m.slug}` — `slug` est l'identifiant unique d'une mission (utilisé aussi dans l'URL).

**À retenir.**
- `array.map(...)` rend une liste en JSX.
- `key` obligatoire, unique, stable.
- Préférer un identifiant métier (`slug`, `id`) à l'index.

---

## 2.8 Rendu conditionnel (récap)

Déjà vu au chapitre 1, à réviser ici :

**Ternaire** :
```tsx
{flag ? <A /> : <B />}
```

**Court-circuit** :
```tsx
{flag && <A />}
```

**Early return** dans le composant :
```tsx
if (!mission) return <Navigate to="/" />;
```

**Code du projet** — [src/pages/MissionDetail.tsx:17](../../src/pages/MissionDetail.tsx#L17) :

```tsx
if (!mission) return <Navigate to="/#missions" replace />;
```

→ si pas de mission, on ne va jamais jusqu'au rendu normal. C'est une **garde** en haut du composant qui simplifie le reste du code.

**À retenir.**
- Ternaire pour A ou B.
- `&&` pour A ou rien.
- Early return pour court-circuiter complètement le rendu normal.

---

## 2.9 Fragments `<>...</>`

**Notion.** Un composant ne peut retourner qu'un seul élément racine. Si tu veux retourner plusieurs éléments sans wrapper DOM, utilise un **fragment** : `<>...</>`.

```tsx
return (
  <>
    <h1>Titre</h1>
    <p>Texte</p>
  </>
);
```

Le fragment n'ajoute **aucun élément** dans le DOM final. Pratique pour éviter une `<div>` parasite.

**Code du projet** — [src/pages/Home.tsx:15-16](../../src/pages/Home.tsx#L15-L16) :

```tsx
return (
  <>
    <BentoHero />
    {/* ... autres sections ... */}
  </>
);
```

→ on rend plusieurs sections à la racine, sans wrapper inutile.

**À retenir.**
- `<>...</>` = fragment, regroupe plusieurs éléments sans wrapper DOM.

---

## 2.10 `StrictMode`

**Notion.** Composant officiel de React qui **active des vérifications supplémentaires en mode développement** :
- Détecte les effets de bord en montant chaque composant **deux fois** (en dev uniquement, en prod rien ne change).
- Avertit sur des APIs dépréciées.

Sans effet en production.

**Code du projet** — [src/main.tsx:12-17](../../src/main.tsx#L12-L17) :

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

→ tout l'arbre est enveloppé dans `<StrictMode>` → toute l'app bénéficie des vérifications en dev.

**À retenir.**
- `StrictMode` = double rendu en dev pour repérer les effets non purs.
- Aucun impact en prod.

---

## Exercices

### Exercice 1 (lecture, facile)

Quelle est la différence entre ces deux écritures ?

```tsx
// A
<input disabled />

// B
<input disabled={false} />
```

### Exercice 2 (prédiction)

Que va afficher ce composant ?

```tsx
function Display() {
  const items = ["a", "b", "c"];
  return <ul>{items.map((x) => <li>{x}</li>)}</ul>;
}
```

Quel avertissement React va apparaître dans la console ? Pourquoi ?

### Exercice 3 (écriture)

Écris un composant `Greeting` qui prend une prop `name` (string) et une prop optionnelle `excited` (booléen). S'il est excité, affiche `"Bonjour, NAME!!!"`, sinon `"Bonjour, NAME."`. Type les props avec une interface TypeScript.

### Exercice 4 (lecture du projet)

Ouvre [src/components/Header.tsx:88-90](../../src/components/Header.tsx#L88-L90) et explique chaque morceau :

```tsx
<button className="pill-burger" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
  <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
</button>
```

### Exercice 5 (écriture)

Écris un composant `Counter` qui affiche un nombre et deux boutons (`+` et `-`) qui incrémentent/décrémentent. Utilise `useState`.

### Exercice 6 (correction)

Identifie les 3 erreurs JSX ici :

```tsx
function Form() {
  const handleSubmit = () => console.log("submit");
  return (
    <form onsubmit={handleSubmit}>
      <label for="email">Email</label>
      <input type="email" id="email" class="input" />
    </form>
  );
}
```

### Exercice 7 (analyse, plus dur)

Pourquoi le composant `BentoHero` utilise-t-il `{ id = "hero" }: { id?: string }` dans sa signature, alors que le composant `Footer` n'a aucune prop ? Quels sont les bénéfices et inconvénients de cette pratique ?

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

- A `<input disabled />` — attribut booléen écrit sans valeur. Équivalent à `disabled={true}` en JSX. L'input **est** désactivé.
- B `<input disabled={false} />` — attribut booléen explicite. JSX **retire** l'attribut du DOM. L'input **n'est pas** désactivé.

Donc A désactive, B ne désactive pas. La syntaxe sans valeur n'est pas un raccourci pour "indéterminé" — c'est un raccourci pour `true`.

</details>

<details>
<summary>Corrigé Exercice 2</summary>

Le rendu visible sera `a b c` (3 puces).

React va loguer dans la console : `Warning: Each child in a list should have a unique "key" prop.`

Pourquoi : la prop `key` est obligatoire sur les éléments produits par `.map()`. Sans elle, React ne peut pas suivre quel `<li>` correspond à quel élément des données entre deux rendus. Performance dégradée et bugs possibles si la liste change. La correction : `<li key={x}>{x}</li>` (ici les valeurs étant uniques, on peut s'en servir comme key).

</details>

<details>
<summary>Corrigé Exercice 3</summary>

```tsx
interface Props {
  name: string;
  excited?: boolean;
}

export default function Greeting({ name, excited = false }: Props) {
  return <p>{`Bonjour, ${name}${excited ? "!!!" : "."}`}</p>;
}
```

Points clés :
- `excited?: boolean` — prop optionnelle.
- `excited = false` — valeur par défaut dans la destructuration.
- Template string + ternaire pour la fin de chaîne.

</details>

<details>
<summary>Corrigé Exercice 4</summary>

- `<button className="pill-burger"` — un bouton avec une classe CSS (camelCase JSX).
- `aria-label="Menu"` — accessibilité : pour les lecteurs d'écran, ce bouton a le label "Menu" même s'il n'a pas de texte visible (seulement une icône).
- `onClick={() => setMobileOpen((v) => !v)}` — au clic, on bascule l'état du menu mobile. Setter fonctionnel (`v => !v`) pour basculer proprement.
- `<i className={...}` — l'icône (Font Awesome) à l'intérieur du bouton.
- Template string `` `fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}` `` — la classe change selon l'état : icône "X" si menu ouvert, icône "hamburger" sinon.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

```tsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

Notes :
- `useState(0)` — état initial à 0.
- Setters fonctionnels (`c => c + 1`) : robustes face aux clics rapides multiples.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

Trois erreurs :
1. `onsubmit` → `onSubmit` (camelCase JSX).
2. `for="email"` → `htmlFor="email"` (`for` est mot-clé JS réservé).
3. `class="input"` → `className="input"` (`class` est mot-clé JS réservé).

Aucune ne provoque une erreur JS, mais elles sont mal interprétées par React et le HTML résultant sera cassé pour l'accessibilité (label/input dissociés).

</details>

<details>
<summary>Corrigé Exercice 7</summary>

`BentoHero({ id = "hero" }: { id?: string })` permet de réutiliser le composant à plusieurs endroits avec des `id` HTML différents (pour les ancres du header). Par défaut `"hero"`, mais on pourrait écrire `<BentoHero id="autre" />`.

`Footer()` n'a pas cette préoccupation : il n'y a qu'un seul footer dans toute l'app, pas besoin de paramétrer.

Bénéfices de paramétrer :
- réutilisabilité (un composant, plusieurs instances avec config différente),
- testabilité (on peut passer des props de test).

Inconvénients :
- légère complexité supplémentaire,
- si une seule instance existe, c'est de la flexibilité non utilisée.

Règle pragmatique : commence simple, ajoute les props quand un vrai besoin apparaît.

</details>
