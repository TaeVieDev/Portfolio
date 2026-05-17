# Chapitre 3 — Les hooks React

Les **hooks** sont des fonctions spéciales qui te permettent de « brancher » des fonctionnalités React dans un composant fonctionnel : état, effets, références, etc. Ils ont tous un nom qui commence par `use`.

---

## 3.1 Les Rules of Hooks

**Notion.** Deux règles strictes à connaître par cœur :

1. **Appel toujours au top du composant** — jamais dans un `if`, une boucle, ou une fonction imbriquée. React identifie chaque hook par sa position d'appel ; si l'ordre change, tout casse.
2. **Appel uniquement depuis un composant React ou un autre custom hook** — pas dans une fonction utilitaire classique.

```tsx
// ❌ Mauvais : hook dans une condition
function Bad({ flag }) {
  if (flag) {
    const [x, setX] = useState(0);  // INTERDIT
  }
}

// ✅ Bon : hook toujours appelé, condition à l'intérieur
function Good({ flag }) {
  const [x, setX] = useState(0);
  if (!flag) return null;
  // ...
}
```

**Code du projet** — [src/pages/MissionsE5.tsx:12-13](../../src/pages/MissionsE5.tsx#L12-L13) :

```tsx
function Card({ mission }: { mission: Mission }) {
  const { ref, onMouseMove } = useSpotlight();
  // ...
}
```

→ chaque carte appelle `useSpotlight()` **dans son propre composant**. Si on avait appelé `useSpotlight()` dans une boucle `.map()`, ça aurait violé la règle 1.

**À retenir.**
- Hooks toujours au top, jamais conditionnels.
- Pour appliquer un hook à chaque élément d'une liste, **extraire en sous-composant**.

---

## 3.2 `useState` en profondeur

**Notion.** Crée une variable d'état locale au composant. Retourne `[valeur, setter]`.

### Setter classique vs fonctionnel

```tsx
const [count, setCount] = useState(0);

// Setter classique
setCount(count + 1);

// Setter fonctionnel : reçoit la valeur courante, retourne la nouvelle
setCount((c) => c + 1);
```

Différence cruciale : si plusieurs setters sont batchés (React le fait pour les perfs), le setter classique utilise la **valeur capturée au moment du rendu**, le fonctionnel utilise la **valeur la plus à jour**.

```tsx
setCount(count + 1);  // si appelé 3x rapidement avec count=0 → finit à 1
setCount(c => c + 1); // si appelé 3x rapidement → finit à 3
```

**Code du projet** — [src/components/FlipCard.tsx:32](../../src/components/FlipCard.tsx#L32) :

```tsx
onClick={() => setFlipped((v) => !v)}
```

→ setter fonctionnel : on bascule l'état booléen sans dépendre d'une closure potentiellement obsolète.

### Typage TypeScript

Par défaut TS infère le type depuis la valeur initiale :

```tsx
useState(0);          // inféré: number
useState("");         // inféré: string
useState(false);      // inféré: boolean
```

Pour des unions ou des types plus complexes, on précise :

```tsx
useState<Status>("idle");   // Status = "idle" | "sent"
useState<User | null>(null);
```

**Code du projet** — [src/components/Header.tsx:21](../../src/components/Header.tsx#L21) :

```tsx
const [active, setActive] = useState<string>("hero");
```

→ on annote `<string>` explicitement (ici TS l'aurait inféré pareil, mais c'est plus lisible).

**À retenir.**
- `useState(init)` → `[valeur, setter]`.
- Setter fonctionnel (`v => ...`) quand la nouvelle valeur dépend de l'ancienne.
- Typer explicitement quand l'inférence est ambiguë (unions, `null`).

---

## 3.3 `useEffect`

**Notion.** Permet d'exécuter du code **après** le rendu du composant. Utilisé pour les **effets de bord** : abonnement à des événements, requêtes réseau, manipulation manuelle du DOM, timers...

Signature :

```tsx
useEffect(() => {
  // code exécuté après chaque rendu (par défaut)
  return () => {
    // optionnel : fonction de cleanup
  };
}, [dependencies]);
```

### Le tableau de dépendances

| Forme | Quand l'effet s'exécute |
|-------|--------------------------|
| Pas de tableau | Après **chaque** rendu (à éviter en général) |
| `[]` (vide) | **Une seule fois** au montage |
| `[a, b]` | Au montage **et** quand `a` ou `b` change |

### Le cleanup

La fonction retournée par l'effet est appelée :
- avant l'effet suivant (si les deps changent),
- au démontage du composant.

Sert à **annuler** ce que l'effet a installé : retirer un listener, clear un timeout, déconnecter un observer.

**Code du projet** — [src/components/Background.tsx:19-61](../../src/components/Background.tsx#L19-L61) :

```tsx
useEffect(() => {
  let frame = 0;
  let lastX = 0;
  let lastY = 0;

  const onMove = (e: MouseEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const el = glowRef.current;
      if (el) {
        el.style.setProperty("--cursor-x", `${lastX}px`);
        el.style.setProperty("--cursor-y", `${lastY}px`);
      }
      frame = 0;
    });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    if (frame) cancelAnimationFrame(frame);
  };
}, []);
```

**Décodage** :

- `useEffect(() => { ... }, [])` — `[]` → exécuté **une seule fois** au montage.
- À l'intérieur : on prépare des variables (`frame`, `lastX`, `lastY`), on définit la fonction `onMove`, et on l'abonne au `mousemove` de la window.
- `return () => { ... }` — **cleanup** : au démontage du composant, on retire le listener (sinon fuite mémoire : la fonction continuerait à être appelée même après que le composant ait disparu).

**Code du projet — déps dynamiques** — [src/components/Header.tsx:36-64](../../src/components/Header.tsx#L36-L64) :

```tsx
useEffect(() => {
  if (!onHome) return;

  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(/* ... */);
  sections.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}, [onHome]);
```

→ `[onHome]` en deps → l'effet ré-exécute quand on quitte/revient sur la home. Le cleanup déconnecte l'observer entre deux exécutions.

**À retenir.**
- `useEffect(fn, deps)` exécute `fn` après le rendu.
- `[]` = une fois au montage ; `[x, y]` = à chaque changement de `x` ou `y`.
- Cleanup obligatoire pour les listeners et abonnements (sinon fuite mémoire).
- N'utilise `useEffect` que pour les effets de bord, pas pour calculer une valeur dérivée (utiliser une variable normale ou `useMemo` plus tard).

---

## 3.4 `useRef`

**Notion.** Crée une référence mutable persistante entre les rendus, **sans déclencher de re-rendu** quand sa valeur change.

Deux usages principaux :

1. **Référencer un élément DOM** pour le manipuler directement (focus, mesure, animation).
2. **Stocker une valeur mutable** qui doit survivre entre les rendus sans déclencher de re-render (ex: id de timer).

```tsx
const ref = useRef<HTMLDivElement>(null);
return <div ref={ref}>...</div>;

// Plus tard :
ref.current?.focus();
```

Le `.current` contient la valeur. Pour un ref DOM, c'est l'élément (ou `null` tant qu'il n'est pas monté).

**Code du projet** — [src/components/Background.tsx:17, 65](../../src/components/Background.tsx#L17) :

```tsx
const glowRef = useRef<HTMLDivElement>(null);
// ...
return (
  <div className="bg-decor" ref={glowRef}>
    {/* ... */}
  </div>
);
```

**Décodage** :

- `useRef<HTMLDivElement>(null)` — création d'une ref typée vers une `<div>`, valeur initiale `null`.
- `ref={glowRef}` — on attache la ref à l'élément.
- Plus tard, `glowRef.current` est l'élément `<div>` du DOM, sur lequel on peut appeler `.style.setProperty(...)`.

**Code du projet** — [src/hooks/useSpotlight.ts:17](../../src/hooks/useSpotlight.ts#L17) :

```tsx
const ref = useRef<T>(null);
```

→ même principe, mais le type est générique (`T` paramétré, voir chapitre 1).

**À retenir.**
- `useRef(init)` retourne un objet `{ current: init }` qui persiste entre rendus.
- Modifier `.current` ne re-rend pas le composant (contraire à `useState`).
- Parfait pour les manipulations DOM directes (animations, focus, mesures).

---

## 3.5 Custom hooks

**Notion.** Une fonction qui **utilise d'autres hooks** et dont le nom commence par `use`. Permet de **factoriser une logique réactive** réutilisable.

Pourquoi c'est puissant : tu peux extraire 50 lignes d'`useEffect` complexe en un seul `useSpotlight()` au top du composant.

**Code du projet — la définition** — [src/hooks/useSpotlight.ts](../../src/hooks/useSpotlight.ts) :

```tsx
import { useRef } from "react";

export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return { ref, onMouseMove };
}
```

**Décodage** :

- Fonction nommée `useSpotlight` (commence par `use` → c'est un hook).
- Générique `<T extends HTMLElement = HTMLDivElement>` — paramètre de type.
- À l'intérieur : appelle `useRef` (un autre hook, donc autorisé).
- Définit `onMouseMove` : un handler qui calcule la position relative et écrit dans 2 custom properties CSS.
- Retourne `{ ref, onMouseMove }` — l'objet que le consommateur va destructurer.

**Code du projet — l'utilisation** — [src/pages/Competence.tsx:42-45](../../src/pages/Competence.tsx#L42-L45) :

```tsx
function SkillCard({ skill }: { skill: Skill }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="skill-card spotlight">
      {/* ... */}
    </div>
  );
}
```

→ trois lignes seulement pour avoir l'effet spotlight. La logique complète vit dans le hook.

**Plusieurs instances** dans un même composant — [src/pages/BtsSio.tsx:8-9](../../src/pages/BtsSio.tsx#L8-L9) :

```tsx
const slam = useSpotlight();
const sisr = useSpotlight();
```

→ chaque appel crée une **instance indépendante** (sa propre ref, son propre handler). On peut brancher chacune sur une carte différente.

**À retenir.**
- Custom hook = fonction `useXxx` qui appelle d'autres hooks.
- Permet de **réutiliser une logique réactive** d'un composant à l'autre.
- Retourne ce que tu veux (objet, tableau, valeur).
- Chaque appel = instance indépendante.

---

## Exercices

### Exercice 1 (lecture)

Pourquoi cet exemple va-t-il provoquer une erreur ?

```tsx
function MyComp({ show }) {
  if (show) {
    const [x, setX] = useState(0);
    return <div>{x}</div>;
  }
  return null;
}
```

### Exercice 2 (prédiction)

Combien de fois `console.log("effet")` va-t-il s'exécuter dans ce composant si on le monte une fois ?

```tsx
function Comp() {
  const [x, setX] = useState(0);
  useEffect(() => {
    console.log("effet");
  }, []);
  return <button onClick={() => setX(x + 1)}>{x}</button>;
}
```

Réponse : juste au montage, ou à chaque clic ?

### Exercice 3 (prédiction)

Et celui-ci ?

```tsx
function Comp() {
  const [x, setX] = useState(0);
  useEffect(() => {
    console.log("effet", x);
  }, [x]);
  return <button onClick={() => setX(x + 1)}>{x}</button>;
}
```

### Exercice 4 (écriture)

Écris un custom hook `useToggle(initial: boolean)` qui retourne `[value, toggle]`, où `toggle` est une fonction qui inverse la valeur.

### Exercice 5 (écriture)

Écris un composant `MouseTracker` qui suit la position de la souris dans la fenêtre et l'affiche en haut à gauche (`x: 123, y: 456`). Utilise `useEffect` pour s'abonner/désabonner à `mousemove`, et `useState` pour stocker la position.

### Exercice 6 (debug)

Pourquoi ce code provoque une fuite mémoire ? Comment le corriger ?

```tsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
}, []);
```

### Exercice 7 (lecture du projet)

Ouvre [src/components/ScrollToTop.tsx](../../src/components/ScrollToTop.tsx) et explique :
1. Pourquoi ce composant retourne `null`.
2. Pourquoi `pathname` et `hash` sont dans les dépendances de l'effet.
3. Ce qui se passe quand on tape `/missions/portfolio` dans le navigateur.

### Exercice 8 (analyse, plus dur)

Dans `Background.tsx`, pourquoi utilise-t-on `useRef` plutôt que `useState` pour stocker la position du curseur ? Quelle serait la différence visible si on utilisait `useState` ?

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

Erreur : le hook `useState` est appelé **conditionnellement** (dans un `if`). Si `show` vaut `true` au premier rendu puis `false` au suivant, l'ordre des hooks change entre les rendus. React utilise l'ordre pour identifier les hooks, donc tout casse.

Correction : appeler `useState` au top, condition après.

```tsx
function MyComp({ show }) {
  const [x, setX] = useState(0);
  if (!show) return null;
  return <div>{x}</div>;
}
```

</details>

<details>
<summary>Corrigé Exercice 2</summary>

`console.log("effet")` s'exécute **une seule fois** au montage. Le tableau `[]` dit "déclencher l'effet seulement après le premier rendu, jamais plus". Cliquer sur le bouton change `x`, ce qui re-rend le composant, mais `[]` n'a pas changé donc l'effet ne re-déclenche pas.

Note : en `StrictMode`, en dev, l'effet est appelé deux fois pour détecter les bugs. En prod, une seule fois.

</details>

<details>
<summary>Corrigé Exercice 3</summary>

`console.log("effet", x)` s'exécute :
- au montage (x=0),
- puis à chaque clic (x change).

Car `[x]` en deps dit "exécute aussi quand x change". Donc à chaque setX, re-rendu + déclenchement de l'effet.

</details>

<details>
<summary>Corrigé Exercice 4</summary>

```tsx
import { useState } from "react";

export function useToggle(initial: boolean) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle] as const;
}
```

Notes :
- Le `as const` aide TypeScript à inférer un tuple `[boolean, () => void]` au lieu d'un tableau hétérogène, pour que la destructuration côté usage soit bien typée.

Usage :
```tsx
const [open, toggle] = useToggle(false);
<button onClick={toggle}>{open ? "Ouvert" : "Fermé"}</button>
```

</details>

<details>
<summary>Corrigé Exercice 5</summary>

```tsx
import { useEffect, useState } from "react";

export function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div style={{ position: "fixed", top: 0, left: 0 }}>x: {pos.x}, y: {pos.y}</div>;
}
```

Note : cette implémentation déclenche un re-rendu à chaque mousemove (~60/s). Pour éviter ça (comme dans `Background.tsx`), on aurait stocké la position dans une CSS variable via une ref + setProperty.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

L'effet crée un `setInterval` mais ne le **clear jamais**. Quand le composant démonte, l'interval continue de tourner et déclenche `console.log("tick")` toutes les secondes pour rien → fuite mémoire et bug potentiel.

Correction : retourner une fonction de cleanup qui appelle `clearInterval`.

```tsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);
```

</details>

<details>
<summary>Corrigé Exercice 7</summary>

1. **Retourne `null`** parce que c'est un composant « pur effet » : il n'a pas de rendu visuel, il existe juste pour exécuter du code (scroller) quand l'URL change. C'est un pattern courant pour isoler une logique transverse.

2. **`pathname` et `hash` en deps** parce que l'effet doit re-déclencher quand l'un OU l'autre change. Naviguer de `/` vers `/missions/portfolio` change le `pathname`. Cliquer sur un lien `#bts` change le `hash` sans changer le `pathname`. Sans les deux en deps, certains cas seraient manqués.

3. **`/missions/portfolio`** :
   - `pathname` = `"/missions/portfolio"`, `hash` = `""`.
   - L'effet voit `hash` vide → branche `if (hash)` ignorée.
   - Exécute `window.scrollTo(0, 0)` → la page démarre en haut.

</details>

<details>
<summary>Corrigé Exercice 8</summary>

`useState` déclenche un **re-rendu** à chaque appel du setter. Or `mousemove` se déclenche à ~60 Hz. Avec `useState`, ce serait 60 re-renders par seconde → React recalculerait tout le composant et son sous-arbre → catastrophique pour les performances.

`useRef` ne déclenche **aucun re-rendu** quand `.current` change. On profite ensuite de l'API DOM (`setProperty`) pour mettre à jour le visuel via CSS variables — c'est le navigateur qui repeint, pas React.

Différence visible avec `useState` : à partir d'un certain seuil de complexité du DOM, on verrait des lags / saccades quand on bouge la souris.

</details>
