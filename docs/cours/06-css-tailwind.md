# Chapitre 6 — CSS moderne et Tailwind v4

Le projet utilise CSS moderne (Grid, custom properties, transforms 3D) couplé à Tailwind v4 utilisé comme moteur de tokens. Comprendre les deux est essentiel pour expliquer toute partie visuelle du portfolio.

---

## 6.1 CSS Custom Properties (variables CSS)

**Notion.** Permettent de définir des "variables" en CSS, accessibles via `var(--nom)`. Cascade et héritage comme tout le reste du CSS.

```css
:root {
  --primary: #ff0000;
}

.button {
  background: var(--primary);
}
```

`var(--nom, fallback)` — fallback si la variable n'est pas définie.

**Code du projet** — [src/index.css:19-25](../../src/index.css#L19-L25) :

```css
@theme {
  --color-bg-primary: #561c24;
  --color-bg-secondary: #6d2932;
  --color-text-primary: #e8d8c4;
  --color-text-secondary: #c7b7a3;
  --font-sans: "Josefin Sans", ui-sans-serif, system-ui, ...;
}
```

→ ces variables sont disponibles **partout** dans le CSS (`var(--color-bg-primary)`) et génèrent en plus des classes Tailwind (`bg-bg-primary`, `text-text-primary`).

**Code du projet** — usage classique [src/index.css:34-40](../../src/index.css) :

```css
body {
  font-family: var(--font-sans);
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
}
```

**Code du projet** — variables dynamiques mises à jour par JS [src/index.css:138-142](../../src/index.css) :

```css
.bg-decor__glow {
  background: radial-gradient(
    600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
    rgba(232, 216, 196, 0.08),
    transparent 50%
  );
}
```

→ `--cursor-x` et `--cursor-y` sont mises à jour par JS dans `Background.tsx`. Le navigateur recalcule le gradient automatiquement.

**À retenir.**
- Variables CSS = `--nom`, accédées avec `var(--nom)`.
- Cascade et héritage naturels.
- Pont JS↔CSS via `element.style.setProperty`.
- Fallback : `var(--nom, default)`.

---

## 6.2 CSS Grid avec `grid-template-areas`

**Notion.** Grid permet de créer des grilles 2D. `grid-template-areas` est une syntaxe particulièrement lisible : tu **dessines la grille en ASCII**, chaque mot est le nom d'une zone. Ensuite, chaque cellule dit "je suis dans la zone X".

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

Chaque ligne entre guillemets = une rangée de la grille. Chaque mot = une cellule. Mots répétés = zones fusionnées.

**Code du projet** — [src/index.css:626-638](../../src/index.css) :

```css
.bento {
  display: grid;
  gap: 1rem;
  padding: 3rem 0;
  max-width: 1100px;
  margin: 0 auto;
  grid-template-columns: 1.2fr 1.2fr 1fr 1fr;
  grid-template-areas:
    "photo photo bts    coface"
    "photo photo stack  stack"
    "intro intro intro  social";
}
```

**Décodage** :

- 4 colonnes : `1.2fr 1.2fr 1fr 1fr` (les deux premières un peu plus larges).
- 3 rangées définies par les 3 chaînes.
- `"photo photo bts coface"` : la cellule photo prend les 2 premières colonnes, bts la 3ème, coface la 4ème.
- `"photo photo stack stack"` : photo continue (donc fusionnée sur 2 rangées × 2 colonnes), stack prend les 2 dernières.
- `"intro intro intro social"` : intro prend les 3 premières colonnes, social la dernière.

Chaque cellule s'attribue sa zone, [src/index.css:666-698](../../src/index.css) :

```css
.bento__photo  { grid-area: photo; }
.bento__bts    { grid-area: bts; }
.bento__coface { grid-area: coface; }
.bento__stack  { grid-area: stack; }
.bento__intro  { grid-area: intro; }
.bento__social { grid-area: social; }
```

**Reconfiguration responsive** [src/index.css:787-800](../../src/index.css) :

```css
@media (max-width: 992px) {
  .bento {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "photo  photo"
      "bts    coface"
      "stack  stack"
      "intro  intro"
      "social social";
  }
}
```

→ sur tablette, on redessine complètement la grille en 2 colonnes × 5 rangées. **Aucun changement de JSX** : juste le CSS qui re-positionne les mêmes éléments.

**À retenir.**
- `grid-template-areas` = dessiner la grille en ASCII.
- Mots répétés = zones fusionnées.
- Très lisible et facile à reconfigurer par media query.

---

## 6.3 Flexbox

**Notion.** L'autre système de layout. Idéal pour aligner sur **un axe** (horizontal ou vertical). Grid pour la 2D, Flexbox pour la 1D.

```css
.container {
  display: flex;
  flex-direction: row;          /* ou column */
  justify-content: center;       /* alignement axe principal */
  align-items: center;           /* alignement axe transverse */
  gap: 1rem;
}
```

**Code du projet** — [src/index.css:641-657](../../src/index.css) :

```css
.bento__cell {
  /* ... */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}
```

→ chaque cellule du bento empile son contenu verticalement (column) avec un espacement de 0.5rem, centré verticalement.

**À retenir.**
- Flex pour aligner en 1D (ligne ou colonne).
- `justify-content` = axe principal, `align-items` = axe transverse.
- `gap` = espacement entre enfants.

---

## 6.4 Transforms 3D : `perspective`, `rotateY`, `backface-visibility`

**Notion.** Le CSS sait faire des animations 3D :

- `perspective: 1000px` (sur le **parent**) — distance entre le viewer et l'écran. Plus la valeur est petite, plus la perspective est marquée.
- `transform: rotateY(180deg)` — rotation autour de l'axe Y.
- `transform-style: preserve-3d` — les enfants conservent leur position 3D dans la scène.
- `backface-visibility: hidden` — cache le verso d'un élément en rotation.

**Code du projet** — la flip card [src/index.css:549-617](../../src/index.css) :

```css
.flip-card {
  width: 250px;
  height: 250px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-front { transform: rotateY(0deg); }
.flip-card-back  { transform: rotateY(180deg); }
```

**Décodage** :

- `.flip-card` reçoit `perspective: 1000px` — c'est ce qui rend la rotation visible en 3D plutôt que comme un aplatissement.
- `.flip-card-inner` rotation animée via `transition`. Quand on lui ajoute la classe `flipped` (déclenché par JS via state), il pivote de 180°.
- `cubic-bezier(0.4, 0, 0.2, 1)` — courbe d'accélération qui imite le "ease" Material : démarrage rapide puis ralenti.
- `.flip-card-front` est à 0°, `.flip-card-back` est à 180°. Tous deux ont `backface-visibility: hidden` → quand le front tourne pour exposer son dos, il devient invisible ; à 180°, c'est le back qui était à 180° qui devient visible (en repassant à 0° relatif).

**À retenir.**
- `perspective` sur le parent.
- `transform-style: preserve-3d` pour les enfants.
- `backface-visibility: hidden` pour les flip cards.
- `cubic-bezier(a,b,c,d)` pour les courbes d'animation custom.

---

## 6.5 `radial-gradient` et `mask-image`

**Notion.**

- `radial-gradient(taille forme at X Y, color1, color2)` — dégradé circulaire ou elliptique.
- `mask-image` / `-webkit-mask-image` — masque l'élément selon une image (souvent un gradient). Les zones transparentes du mask deviennent invisibles.

**Code du projet** — grille de points avec masque [src/index.css:122-130](../../src/index.css) :

```css
.bg-decor__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(232, 216, 196, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
}
```

**Décodage** :

- `background-image: radial-gradient(circle, color 1px, transparent 1px)` — un seul tout petit point.
- `background-size: 24px 24px` — répétition du fond → grille de points espacés de 24px.
- `mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%)` — masque qui est **opaque** au centre et **transparent** sur les bords. Effet : les points sont visibles au centre de la page et fondent vers les bords.
- `-webkit-mask-image` — préfixe pour Safari.

**Code du projet** — halo curseur [src/index.css:135-144](../../src/index.css) :

```css
.bg-decor__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
    rgba(232, 216, 196, 0.08),
    transparent 50%
  );
  transition: background 0.05s linear;
}
```

→ un gradient de 600px de diamètre, positionné selon les variables CSS, fondu à transparent à 50%.

**À retenir.**
- `radial-gradient` = dégradé circulaire/elliptique.
- `background-size` répète le fond → patterns.
- `mask-image` masque selon une image (souvent un gradient).
- `inset: 0` = raccourci pour `top:0; right:0; bottom:0; left:0`.

---

## 6.6 `backdrop-filter`

**Notion.** Applique un filtre (blur, contraste, etc.) **à ce qui est derrière** l'élément. Donne l'effet "verre dépoli".

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);  /* Safari */
}
```

**Code du projet** — [src/index.css:162-167](../../src/index.css) :

```css
.pill-nav {
  background: rgba(86, 28, 36, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
}
```

→ fond semi-transparent + blur de 16px sur ce qui est derrière → on voit le contenu de la page comme à travers un verre dépoli.

**À retenir.**
- `backdrop-filter` floute (ou autre) le derrière de l'élément.
- Préfixer pour Safari (`-webkit-backdrop-filter`).
- Combiné avec un fond semi-transparent pour l'effet "frosted glass".

---

## 6.7 Pseudo-éléments `::before` et `::after`

**Notion.** Permettent de créer un élément CSS **sans markup HTML** correspondant. Indispensable d'avoir `content: ""` pour qu'ils apparaissent.

```css
.element::before {
  content: "";
  /* ... styles ... */
}
```

Utilisés pour des décorations, des halos, des séparateurs, etc.

**Code du projet** — halo spotlight [src/index.css:949-962](../../src/index.css) :

```css
.spotlight {
  position: relative;
  overflow: hidden;
}

.spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(232, 216, 196, 0.12),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.spotlight:hover::before {
  opacity: 1;
}
```

**Décodage** :

- `.spotlight::before` — pseudo-élément couvrant toute la carte (`inset: 0`).
- Contient le gradient halo, positionné selon les variables CSS mises à jour par JS.
- `opacity: 0` par défaut, `opacity: 1` au hover → le halo apparaît seulement quand la souris est sur la carte.
- `pointer-events: none` — le pseudo-élément ne capture pas les clics, ils passent à travers vers la carte en dessous.

**À retenir.**
- `::before` / `::after` créent un élément CSS pur.
- `content: ""` obligatoire.
- `pointer-events: none` pour que les clics traversent.

---

## 6.8 Convention BEM

**Notion.** BEM = **B**lock **E**lement **M**odifier. Convention de nommage CSS qui structure les classes en arbre :

- `bloc` — composant racine
- `bloc__element` — partie du bloc (double underscore)
- `bloc--modifier` — variante du bloc (double tiret)
- `bloc__element--modifier` — modifier sur un element

```css
.card { ... }
.card__title { ... }
.card__image { ... }
.card--featured { ... }
.card__title--large { ... }
```

Avantages :
- évite les conflits (chaque classe est unique grâce au préfixe),
- lisibilité immédiate de la hiérarchie,
- pas besoin de sélecteurs imbriqués profonds.

**Code du projet** — partout. Exemples [src/index.css](../../src/index.css) :

```css
.bento { ... }                /* bloc */
.bento__cell { ... }          /* element */
.bento__photo { ... }         /* element */
.bento__intro { ... }         /* element */

.mission-detail { ... }
.mission-detail__hero { ... }
.mission-detail__back { ... }
.mission-detail__heading { ... }

.option-card { ... }          /* bloc */
.slam-card { ... }            /* peut être vu comme un modifier */
.sisr-card { ... }
```

**À retenir.**
- BEM : `bloc__element--modifier`.
- Double underscore pour les enfants, double tiret pour les variantes.
- Classes plates, pas de sélecteurs `.parent .enfant`.

---

## 6.9 Tailwind v4 : `@theme`, breakpoints custom, valeurs arbitraires

**Notion.** Tailwind v4 a profondément changé par rapport à v3. Plus de `tailwind.config.js` : la config vit dans le CSS via la règle `@theme`.

### Tokens dans `@theme`

```css
@theme {
  --color-bg-primary: #561c24;
  --font-sans: "Josefin Sans", sans-serif;
  --breakpoint-xs: 480px;
}
```

Chaque variable :
- est utilisable en CSS classique via `var(--...)`,
- **génère automatiquement** des classes Tailwind selon sa convention de nom :
  - `--color-x` → `bg-x`, `text-x`, `border-x`, etc.
  - `--font-x` → `font-x`
  - `--breakpoint-x` → préfixe responsive `x:`

**Code du projet** — [src/index.css:18-34](../../src/index.css#L18-L34) :

```css
@theme {
  --color-bg-primary: #561c24;
  --color-bg-secondary: #6d2932;
  --color-text-primary: #e8d8c4;
  --color-text-secondary: #c7b7a3;

  --font-sans: "Josefin Sans", ui-sans-serif, ...;

  --breakpoint-xs: 480px;
  --breakpoint-mid: 992px;
}
```

### Breakpoints custom

Par défaut Tailwind a : `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

En déclarant `--breakpoint-<nom>` dans `@theme`, on **ajoute** un breakpoint. On peut aussi **remplacer** ceux par défaut en redéclarant `--breakpoint-md` etc.

Le projet ajoute `xs` (480) et `mid` (992) pour respecter le design d'origine.

### Valeurs arbitraires

Pour les valeurs qui ne sont pas dans les tokens, syntaxe `[valeur]` :

```tsx
text-[1.5rem]            // font-size: 1.5rem
mb-[12px]                // margin-bottom: 12px
[word-spacing:1px]       // word-spacing: 1px (propriété arbitraire complète)
bg-[#561c24]             // background-color: #561c24
```

**Code du projet** — [src/components/SectionTitle.tsx:17](../../src/components/SectionTitle.tsx#L17) :

```tsx
<h2 className="mb-8 tracking-[1px] [word-spacing:1px] text-text-primary text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] mid:text-[2.5rem]">
```

**Décodage** :

- `mb-8` — `margin-bottom: 2rem` (échelle Tailwind où 8 = 8 × 0.25rem).
- `tracking-[1px]` — `letter-spacing: 1px` (valeur arbitraire).
- `[word-spacing:1px]` — pas d'utilitaire natif Tailwind, donc propriété arbitraire complète.
- `text-text-primary` — la classe `text-text-primary` existe parce qu'on a déclaré `--color-text-primary` dans `@theme`.
- `text-[1.5rem]` — mobile par défaut.
- `xs:text-[1.8rem]` — à partir de 480px (breakpoint custom).
- `md:text-[2rem]` — à partir de 768px (standard Tailwind).
- `mid:text-[2.5rem]` — à partir de 992px (breakpoint custom).

### Mobile-first

Tailwind utilise `min-width` pour les préfixes responsive. Sans préfixe = mobile (taille de base). Avec un préfixe = "à partir de cette taille".

C'est l'**inverse** de la convention `max-width` du CSS classique souvent appelée "desktop-first".

**À retenir.**
- Tailwind v4 : config dans le CSS via `@theme`.
- Tokens `--color-x`, `--font-x`, `--breakpoint-x` génèrent classes et préfixes.
- Valeurs arbitraires : `[valeur]` (propriété connue) ou `[prop:valeur]` (propriété arbitraire).
- Mobile-first : sans préfixe = mobile, préfixes = breakpoints croissants.

---

## Exercices

### Exercice 1 (lecture)

Que produit ce snippet ?

```css
.button {
  background: var(--btn-bg, blue);
}
```

Quelle couleur si `--btn-bg` n'est pas défini ?

### Exercice 2 (écriture)

Dessine en `grid-template-areas` une page avec :
- un header en haut sur toute la largeur,
- une sidebar à gauche, un main au centre, un aside à droite,
- un footer en bas sur toute la largeur.

3 colonnes (1fr, 3fr, 1fr), 3 rangées (auto, 1fr, auto).

### Exercice 3 (analyse)

Pourquoi `backface-visibility: hidden` est crucial pour une flip card ? Que se passerait-il sans ?

### Exercice 4 (lecture du projet)

Décode la chaîne Tailwind :

```tsx
className="mb-8 tracking-[1px] text-text-primary text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] mid:text-[2.5rem]"
```

À quelle taille de viewport (mobile, 500px, 800px, 1024px) quelle est la `font-size` ?

### Exercice 5 (écriture CSS)

Écris une CSS pour un avatar rond de 80px qui passe en niveau de gris **et** se zoome légèrement au hover. Utilise une transition douce.

### Exercice 6 (BEM)

Réécris ce CSS en BEM correct :

```css
.card { ... }
.card .title { ... }
.card .image { ... }
.card.dark .title { ... }
```

### Exercice 7 (Tailwind v4)

Tu veux ajouter une couleur "accent" `#ff6b35` à ton thème Tailwind v4 (utilisable comme `bg-accent`, `text-accent`, `border-accent`). Écris la déclaration dans `@theme`.

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

`var(--btn-bg, blue)` cherche la valeur de la variable `--btn-bg`. Si elle existe, l'utilise. Sinon, utilise `blue` (fallback).

Donc :
- Si `--btn-bg: red` est défini quelque part → `background: red`.
- Sinon → `background: blue`.

</details>

<details>
<summary>Corrigé Exercice 2</summary>

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

</details>

<details>
<summary>Corrigé Exercice 3</summary>

Sans `backface-visibility: hidden`, quand la flip card pivote, le côté arrière de la face avant resterait visible (vu de derrière, l'image apparaîtrait en miroir). Au milieu de la rotation (90°), les deux faces se superposeraient bizarrement.

Avec `backface-visibility: hidden` sur les deux faces, **chaque face devient invisible quand son dos est exposé**. La face avant disparaît dès qu'elle dépasse 90° de rotation, et le verso devient visible (parce qu'à ce moment-là, c'est SON recto qu'on voit). Résultat : transition propre, on ne voit jamais le verso d'aucune face.

</details>

<details>
<summary>Corrigé Exercice 4</summary>

| Viewport | font-size active | Pourquoi |
|----------|------------------|----------|
| Mobile (320px) | `text-[1.5rem]` | aucun breakpoint atteint |
| 500px | `xs:text-[1.8rem]` | dépasse 480px (xs) |
| 800px | `md:text-[2rem]` | dépasse 768px (md), pas encore mid |
| 1024px | `mid:text-[2.5rem]` | dépasse 992px (mid) |

Les autres classes (`mb-8`, `tracking-[1px]`, `text-text-primary`) sont **constantes** (pas de préfixe responsive).

</details>

<details>
<summary>Corrigé Exercice 5</summary>

```css
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(0);
  transform: scale(1);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.avatar:hover {
  filter: grayscale(100%);
  transform: scale(1.05);
}
```

Notes :
- `object-fit: cover` pour que l'image ne soit pas déformée.
- Transition sur **les deux** propriétés.
- `1.05` (5%) est subtil ; plus haut donnerait un effet trop marqué.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

```css
.card { ... }
.card__title { ... }
.card__image { ... }
.card--dark .card__title { ... }
```

Notes :
- `.title` et `.image` deviennent `.card__title` et `.card__image` (préfixe = bloc parent, double underscore).
- `.dark` devient `.card--dark` (modifier du bloc).
- Le sélecteur final `.card--dark .card__title` cible "le titre quand la carte est en mode sombre". On pourrait aussi avoir `.card__title--inverted` si on voulait modifier le titre indépendamment du parent.

</details>

<details>
<summary>Corrigé Exercice 7</summary>

```css
@theme {
  --color-accent: #ff6b35;
}
```

Et c'est tout. Tailwind v4 génère automatiquement :
- `bg-accent` → `background-color: #ff6b35`
- `text-accent` → `color: #ff6b35`
- `border-accent` → `border-color: #ff6b35`
- `ring-accent`, `from-accent`, `to-accent`, etc.

On peut l'utiliser aussi en CSS classique : `color: var(--color-accent);`.

</details>
