# Chapitre 5 — APIs navigateur avancées

React ne remplace pas les APIs du navigateur — il les complète. Ton projet utilise plusieurs APIs natives (sans librairie) pour des comportements précis : suivre la souris, détecter une section visible, scroller en douceur, modifier des CSS variables en JS.

---

## 5.1 `addEventListener` et `passive: true`

**Notion.** L'API standard pour écouter un événement du DOM.

```ts
element.addEventListener("eventName", handler, options);
element.removeEventListener("eventName", handler);
```

**Important** : pour que `removeEventListener` enlève bien le bon listener, il faut passer **la même référence** de fonction. C'est pourquoi on stocke souvent le handler dans une variable.

```ts
// ❌ Ne marche pas (deux fonctions différentes)
window.addEventListener("scroll", () => console.log("hi"));
window.removeEventListener("scroll", () => console.log("hi"));

// ✅ Marche
const handler = () => console.log("hi");
window.addEventListener("scroll", handler);
window.removeEventListener("scroll", handler);
```

**Option `passive: true`** : promet au navigateur que le handler **n'appellera pas `preventDefault()`**. Permet au navigateur d'optimiser le défilement (il n'a pas à attendre que ton handler finisse pour scroller). Utile sur `scroll`, `wheel`, `touchstart`, `touchmove`, `mousemove`.

**Code du projet** — [src/components/Background.tsx:54-60](../../src/components/Background.tsx#L54-L60) :

```ts
window.addEventListener("mousemove", onMove, { passive: true });
return () => {
  window.removeEventListener("mousemove", onMove);
  if (frame) cancelAnimationFrame(frame);
};
```

**Décodage** :

- `addEventListener("mousemove", onMove, { passive: true })` — abonne `onMove` aux mouvements de souris en mode passif.
- Le cleanup dans `useEffect` retire le listener au démontage.
- On stocke aussi un éventuel `frame` (id retourné par `requestAnimationFrame`) qu'on annule pour ne pas qu'une frame en attente s'exécute après le démontage.

**À retenir.**
- `addEventListener(type, fn, options)` + cleanup obligatoire en `useEffect`.
- `{ passive: true }` sur les events de défilement pour les perfs.

---

## 5.2 `IntersectionObserver`

**Notion.** API native qui surveille **l'intersection** d'un élément avec un autre (souvent le viewport). Permet de détecter quand un élément entre/sort de l'écran sans écouter `scroll`.

Construction :

```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // l'élément est visible
      }
    });
  },
  options
);

observer.observe(element);  // démarrer l'observation
observer.unobserve(element); // arrêter pour un élément
observer.disconnect();      // tout arrêter
```

Options principales :
- `root` — élément ancêtre (par défaut le viewport).
- `rootMargin` — marge appliquée au root, format CSS (`"10px 20px 30px 40px"`). Permet de **rétrécir ou élargir** la zone d'observation.
- `threshold` — fraction de visibilité qui déclenche le callback (0 à 1, ou un tableau).

**Code du projet** — [src/components/Header.tsx:41-58](../../src/components/Header.tsx#L41-L58) :

```ts
const sections = document.querySelectorAll<HTMLElement>("section[id]");
if (sections.length === 0) return;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((s) => observer.observe(s));
return () => observer.disconnect();
```

**Décodage** :

- `document.querySelectorAll<HTMLElement>("section[id]")` — sélectionne toutes les `<section>` qui ont un attribut `id`. Le générique `<HTMLElement>` type le retour.
- `new IntersectionObserver(callback, options)` — construit l'observer.
- `rootMargin: "-40% 0px -50% 0px"` — rétrécit la zone d'observation au **milieu vertical** du viewport (40% en moins en haut, 50% en moins en bas → la "ligne active" est au quart supérieur). Effet : le lien actif change juste **avant** que la section touche le haut, ce qui semble plus naturel.
- Pour chaque entry, si `isIntersecting`, on met à jour `active` avec l'id de la section.
- Cleanup : `observer.disconnect()` au démontage de l'effet.

**À retenir.**
- `IntersectionObserver` est l'API moderne pour les effets liés au scroll.
- `rootMargin` permet de décaler la zone de détection.
- Beaucoup plus performant que d'écouter `scroll` et calculer les positions à la main.

---

## 5.3 `requestAnimationFrame`

**Notion.** Demande au navigateur d'exécuter une fonction **avant le prochain repaint** (typiquement 60 fois par seconde). Sert à synchroniser les animations avec le rafraîchissement écran.

```ts
const id = requestAnimationFrame(() => {
  // exécuté au prochain frame
});
cancelAnimationFrame(id); // annuler si plus utile
```

**Cas d'usage classique : throttler un événement très fréquent** (mousemove, scroll). Au lieu de mettre à jour le DOM à chaque event (60+/s), on accumule et on écrit **une seule fois par frame**.

**Code du projet** — [src/components/Background.tsx:21-50](../../src/components/Background.tsx#L21-L50) :

```ts
let frame = 0;
let lastX = 0;
let lastY = 0;

const onMove = (e: MouseEvent) => {
  lastX = e.clientX;
  lastY = e.clientY;

  if (frame) return;  // une frame est déjà planifiée → on ne replanifie pas

  frame = requestAnimationFrame(() => {
    const el = glowRef.current;
    if (el) {
      el.style.setProperty("--cursor-x", `${lastX}px`);
      el.style.setProperty("--cursor-y", `${lastY}px`);
    }
    frame = 0;
  });
};
```

**Décodage** :

- À chaque mouvement de souris, on **met à jour** `lastX` / `lastY` (très rapide).
- Si `frame !== 0`, ça veut dire qu'une frame est déjà planifiée → on ne planifie rien de plus.
- Sinon, on planifie : à la prochaine frame, on écrit les CSS variables avec la dernière position connue. Puis on remet `frame = 0`.
- Résultat : même si `mousemove` se déclenche 100 fois en une seconde, le DOM n'est mis à jour qu'environ 60 fois (1× par frame).

**À retenir.**
- `requestAnimationFrame` = "exécute juste avant le prochain repaint".
- Idéal pour throttler les events à haute fréquence à 60 Hz.
- Toujours retenir l'`id` pour pouvoir `cancelAnimationFrame` au cleanup.

---

## 5.4 `getBoundingClientRect`

**Notion.** Méthode DOM qui retourne un `DOMRect` décrivant la **position et taille** d'un élément par rapport au viewport.

```ts
const rect = element.getBoundingClientRect();
// rect = { x, y, top, left, right, bottom, width, height }
```

Important : `top`/`left` sont relatifs au **viewport**, pas au document. Si la page est scrollée, les valeurs reflètent ça.

**Code du projet** — [src/hooks/useSpotlight.ts:21-27](../../src/hooks/useSpotlight.ts#L21-L27) :

```ts
const onMouseMove = (e: React.MouseEvent<T>) => {
  const el = ref.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
};
```

**Décodage** :

- `e.clientX` / `e.clientY` — position de la souris dans le viewport.
- `rect.left` / `rect.top` — position du coin haut-gauche de la carte dans le viewport.
- `e.clientX - rect.left` — position de la souris **dans le repère de la carte**. Si la souris est au coin haut-gauche de la carte, ça donne `(0, 0)`. Si à 50px à droite, `(50, 0)`.

C'est exactement ce qu'il faut pour positionner le `radial-gradient` du halo à l'endroit de la souris **relatif** à l'élément, pas à l'écran.

**À retenir.**
- `getBoundingClientRect()` = position + taille d'un élément dans le viewport.
- Pour passer du repère viewport au repère élément : `event.clientX - rect.left`.

---

## 5.5 `scrollIntoView`, `scrollTo`

**Notion.** Deux méthodes pour scroller programmatiquement :

- `element.scrollIntoView(options)` — fait défiler la page pour que l'élément soit visible.
- `window.scrollTo(x, y)` ou `window.scrollTo({ top, left, behavior })` — scrolle la fenêtre à des coordonnées précises.

Option `behavior: "smooth"` — défilement animé doux au lieu d'un saut brutal.

**Code du projet** — [src/components/Header.tsx:80](../../src/components/Header.tsx#L80) :

```ts
el?.scrollIntoView({ behavior: "smooth" });
```

**Code du projet** — [src/components/ScrollToTop.tsx:17, 22](../../src/components/ScrollToTop.tsx#L17) :

```ts
if (hash) {
  const el = document.getElementById(hash.slice(1));
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    return;
  }
}
window.scrollTo(0, 0);
```

→ s'il y a un hash dans l'URL, on scrolle vers l'élément ; sinon, retour en haut.

**À retenir.**
- `scrollIntoView({ behavior: "smooth" })` pour atteindre un élément précis.
- `window.scrollTo(0, 0)` pour revenir en haut.
- `scroll-behavior: smooth` en CSS (sur `html`) active le défilement doux par défaut pour les liens d'ancres aussi.

---

## 5.6 `history.replaceState`

**Notion.** API du navigateur pour modifier l'URL **sans recharger** et **sans ajouter d'entrée dans l'historique**.

```ts
history.replaceState(state, title, url);
// state : objet associé à l'entrée
// title : ignoré par les navigateurs
// url : nouvelle URL
```

À comparer avec `history.pushState` qui **ajoute** une entrée (ce que fait React Router).

**Code du projet** — [src/components/Header.tsx:82](../../src/components/Header.tsx#L82) :

```ts
history.replaceState(null, "", `#${id}`);
```

→ après avoir scrollé vers une section, on met à jour l'URL avec le hash (`/#contact`) **sans** que ça empile une nouvelle entrée dans l'historique. L'utilisateur peut alors copier-coller l'URL et tomber pile sur la bonne section au prochain chargement.

Pourquoi `replaceState` et pas `pushState` ? Pour ne pas polluer l'historique : si tu scrolles entre 6 sections, tu ne veux pas que le bouton retour t'oblige à cliquer 6 fois.

**À retenir.**
- `history.replaceState(null, "", url)` met à jour l'URL sans recharger ni empiler.
- Différence avec `pushState` : pas de nouvelle entrée d'historique.

---

## 5.7 CSS custom properties depuis JS (`element.style.setProperty`)

**Notion.** On peut **lire et écrire** des variables CSS depuis JavaScript. Le navigateur recalcule automatiquement les règles qui dépendent de la variable.

```ts
element.style.setProperty("--ma-var", "10px");
element.style.getPropertyValue("--ma-var"); // "10px"
```

**Pourquoi c'est puissant** : pas besoin de re-rendre du JSX ni de toucher des classes. Tu changes une variable, le CSS suit automatiquement.

**Code du projet** — [src/components/Background.tsx:45-46](../../src/components/Background.tsx#L45-L46) :

```ts
el.style.setProperty("--cursor-x", `${lastX}px`);
el.style.setProperty("--cursor-y", `${lastY}px`);
```

Et dans le CSS, [src/index.css:138-142](../../src/index.css) :

```css
.bg-decor__glow {
  background: radial-gradient(
    600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
    rgba(232, 216, 196, 0.08),
    transparent 50%
  );
}
```

→ le CSS lit `--cursor-x` et `--cursor-y` pour positionner le centre du halo. Quand JS change la variable, le navigateur repaint le gradient. **Aucun re-render React.**

**Code du projet — même pattern dans `useSpotlight`** :

```ts
el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
```

```css
.spotlight::before {
  background: radial-gradient(
    500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(232, 216, 196, 0.12),
    transparent 40%
  );
}
```

**À retenir.**
- `element.style.setProperty("--var", "value")` modifie une CSS variable.
- Le navigateur recalcule les règles qui en dépendent automatiquement.
- Stratégie de perfo : laisser le CSS faire le travail visuel, JS ne fait que mettre à jour des variables.

---

## Exercices

### Exercice 1 (prédiction)

Que fait ce code ?

```ts
window.addEventListener("scroll", () => console.log("scrolled"));
```

Pourquoi est-ce une mauvaise pratique sur une page longue ? Comment l'améliorer ?

### Exercice 2 (lecture du projet)

Pourquoi dans `Background.tsx`, on vérifie `if (frame) return;` avant `requestAnimationFrame` ? Que se passerait-il sans cette ligne ?

### Exercice 3 (écriture)

Écris un hook `useScrollY` qui retourne la position de scroll verticale actuelle (mise à jour à chaque scroll). Pense au cleanup.

### Exercice 4 (analyse)

Dans `Header.tsx`, le `rootMargin` est `"-40% 0px -50% 0px"`. Si je le change en `"0px 0px 0px 0px"` (zéro), quel sera l'effet visible ?

### Exercice 5 (lecture)

Décode `e.clientX - rect.left` dans `useSpotlight.ts`. Pourquoi pas juste `e.clientX` ?

### Exercice 6 (écriture)

Écris un effet React qui ajoute une CSS variable `--scroll-progress` sur `document.documentElement`, qui contient la fraction de page scrollée (0 à 1).

### Exercice 7 (analyse, plus dur)

Dans `Background.tsx`, l'option `{ passive: true }` est passée à `addEventListener`. Quelle est la conséquence si on l'oublie ? Et quelle est la conséquence si on l'utilise mais qu'on appelle `e.preventDefault()` dans le handler ?

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

Ce code écoute chaque event scroll et log dans la console. Problème : `scroll` peut se déclencher des centaines de fois par seconde sur certains trackpads → console saturée, frame drops si on faisait du vrai travail.

Améliorations :
- **Throttle avec `requestAnimationFrame`** : accumuler et n'agir qu'une fois par frame.
- **Throttle/debounce avec setTimeout** : agir au plus toutes les N ms.
- **Option `passive: true`** : promet de ne pas bloquer le scroll, le navigateur optimise.

```ts
let frame = 0;
window.addEventListener("scroll", () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    console.log("scrolled", window.scrollY);
    frame = 0;
  });
}, { passive: true });
```

</details>

<details>
<summary>Corrigé Exercice 2</summary>

Sans la garde `if (frame) return`, **chaque** mousemove déclenche un `requestAnimationFrame`. Comme `mousemove` peut se produire 100+ fois par seconde et `requestAnimationFrame` à 60 Hz, on accumulerait des frames non exécutées dans la queue interne du navigateur.

Avec la garde : on ne planifie qu'une seule frame à la fois. Si une est déjà en attente, on met juste à jour `lastX/lastY` et on attend qu'elle s'exécute avec les **dernières** valeurs. Résultat : exactement une écriture DOM par frame, jamais plus.

</details>

<details>
<summary>Corrigé Exercice 3</summary>

```tsx
import { useEffect, useState } from "react";

export function useScrollY() {
  const [y, setY] = useState(window.scrollY);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return y;
}
```

Notes :
- Valeur initiale = `window.scrollY` au montage.
- `passive: true` pour les perfs.
- Cleanup obligatoire.
- Attention : déclenche un re-rendu à chaque scroll. Pour une page lourde, mieux vaut utiliser `useRef + setProperty` comme dans `Background.tsx`.

</details>

<details>
<summary>Corrigé Exercice 4</summary>

`rootMargin: "0px 0px 0px 0px"` (ou juste sa valeur par défaut) → la zone d'observation est **tout le viewport**. Une section est `isIntersecting` dès qu'elle touche n'importe quel bord du viewport.

Effet visible : le lien actif change dès qu'une **petite portion** de la nouvelle section commence à apparaître (en bas), même si l'utilisateur regarde encore la section précédente. Ça donne une sensation de "changement trop tôt".

Avec `"-40% 0px -50% 0px"`, la zone effective est rétrécie au quart supérieur du viewport → le lien change quand la section est vraiment au "milieu haut" de l'écran, ce qui semble plus naturel.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

- `e.clientX` = position de la souris **dans le viewport** (depuis le bord gauche de la fenêtre).
- `rect.left` = position **du bord gauche de la carte** dans le viewport.
- `e.clientX - rect.left` = position de la souris **dans le repère de la carte** (depuis son bord gauche).

Pour positionner un `radial-gradient at X Y` sur l'élément, il faut des coordonnées relatives à l'élément, pas au viewport. Avec juste `e.clientX`, le centre du halo serait toujours décalé (la valeur ne tient pas compte de la position de la carte dans la page).

</details>

<details>
<summary>Corrigé Exercice 6</summary>

```tsx
useEffect(() => {
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--scroll-progress", progress.toString());
      frame = 0;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();  // calculer au montage
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) cancelAnimationFrame(frame);
  };
}, []);
```

Le CSS peut ensuite l'utiliser :
```css
.progress-bar { width: calc(var(--scroll-progress, 0) * 100%); }
```

</details>

<details>
<summary>Corrigé Exercice 7</summary>

**Sans `passive: true`** : à chaque mousemove, le navigateur doit **attendre** que ton handler finisse avant de pouvoir déterminer s'il scrolle ou non. Si ton handler appelle `preventDefault()` (ou pourrait le faire), le navigateur ne sait pas et bloque le défilement le temps de la vérification. Sur des appareils tactiles ou des wheels rapides, ça crée du jank.

**Avec `passive: true` et appel de `preventDefault()` dans le handler** : le navigateur **ignore** l'appel et logue un warning. La promesse "je ne préviens pas" est trahie, mais le scroll continue.

Conclusion : `passive: true` est une optimisation gratuite **si tu ne préviens pas**. Sinon, retire-la.

</details>
