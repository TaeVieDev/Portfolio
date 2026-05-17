# Chapitre 7 — Architecture et patterns du projet

Les chapitres précédents ont décortiqué les briques. Ici on prend du recul : **pourquoi** le projet est organisé comme ça ? Quels patterns reviennent, et quel problème ils résolvent ?

---

## 7.1 Single Page Application (SPA) avec sections ancrées

**Notion.** Une SPA charge un seul HTML, et utilise du JS pour changer le contenu sans rechargement. Avantage : pas de "flash blanc" entre pages, transitions fluides, état React préservé.

Sur ce projet, la home est elle-même **single-page** : toutes les sections sont rendues sur `/`, et la navigation se fait par **ancres** (`#bts`, `#contact`).

**Code du projet** — [src/App.tsx:23-28](../../src/App.tsx#L23-L28) :

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/missions/:slug" element={<MissionDetail />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

→ deux vraies routes : la home et la page détail. Tout le reste = ancres dans la home.

**Pourquoi ce choix** :
- Le portfolio est court — pas besoin de 6 pages distinctes.
- Une seule URL à partager (`thomas.com/`) → ancrer le marketing/CV plus simple.
- Le scroll continu raconte une histoire (du hero aux missions, en passant par les compétences) — plus narratif que cliquer entre des pages séparées.

**Conséquences techniques** :
- `Header.tsx` doit détecter quelle section est visible (`IntersectionObserver`) — voir chapitre 5.
- `ScrollToTop.tsx` doit gérer les hashs (`#bts`) pour scroller au bon endroit en arrivant d'une autre page.

**À retenir.**
- Single-page = un seul HTML, navigation JS.
- Page unique avec sections = bon pattern pour les portfolios courts.
- L'effet "narratif" du scroll est un choix éditorial autant que technique.

---

## 7.2 Single source of truth (données centralisées)

**Notion.** Une donnée n'est définie qu'à **un seul endroit**. Tous les composants qui en ont besoin la lisent depuis cette source. Si elle change, tout suit automatiquement.

L'opposé : dupliquer les données (par copier-coller) → on doit penser à mettre à jour partout, et tôt ou tard une copie diverge.

**Code du projet** — [src/data/missions.ts](../../src/data/missions.ts) :

```ts
export const missions: Mission[] = [
  { slug: "portfolio", title: "Portfolio", /* ... */ },
  { slug: "serveur-apache", title: "Serveur Apache", /* ... */ },
  // ...
];

export const missionsByCategory = (cat: MissionCategory) =>
  missions.filter((m) => m.category === cat);

export const findMission = (slug: string): Mission | undefined =>
  missions.find((m) => m.slug === slug);
```

Le tableau `missions` est la **source de vérité**. Deux consommateurs :

- [src/pages/MissionsE5.tsx:52-53](../../src/pages/MissionsE5.tsx#L52-L53) — affiche la liste, filtre par catégorie :
  ```tsx
  const formation = missionsByCategory("formation");
  const personnels = missionsByCategory("personnel");
  ```

- [src/pages/MissionDetail.tsx:12](../../src/pages/MissionDetail.tsx#L12) — affiche le détail d'une mission, recherche par slug :
  ```tsx
  const mission = slug ? findMission(slug) : undefined;
  ```

**Pour ajouter une mission**, on modifie **un seul fichier** (`missions.ts`). La liste sur la home, la page détail accessible via URL, le filtre par catégorie : tout suit automatiquement.

**Si les données étaient dupliquées** dans chaque composant, ajouter une mission nécessiterait :
- modifier le JSX de `MissionsE5.tsx`,
- modifier celui de `MissionDetail.tsx` (s'il en avait une copie),
- gérer la cohérence à la main.

**À retenir.**
- Une donnée = un fichier.
- Les composants consomment via des helpers (`filter`, `find`).
- Modification locale, impact global automatique.

---

## 7.3 Configuration centralisée

**Notion.** Variante du SSOT pour des configurations qu'on aurait tendance à mettre en dur dans le JSX.

**Code du projet** — [src/components/Header.tsx:5-12](../../src/components/Header.tsx#L5-L12) :

```tsx
const navItems = [
  { id: "hero", label: "Accueil" },
  { id: "bts", label: "BTS" },
  { id: "competences", label: "Compétences" },
  { id: "ecole", label: "École" },
  { id: "missions", label: "Missions" },
  { id: "contact", label: "Contact" },
];
```

→ la liste des items de nav est en dehors du composant. Ajouter un onglet = ajouter une entrée dans le tableau, **pas** modifier le JSX.

Dans le rendu, [src/components/Header.tsx:94-103](../../src/components/Header.tsx#L94-L103) :

```tsx
{navItems.map((item) => (
  <a key={item.id} href={`#${item.id}`} /* ... */>
    {item.label}
  </a>
))}
```

→ le JSX itère sur la config. Tu vois immédiatement combien tu as de liens et lesquels.

**À retenir.**
- Sors les listes/configs du JSX.
- Le JSX devient un simple `map` sur la config.

---

## 7.4 State machine via union de littéraux

**Notion.** Plutôt qu'un booléen ou un nombre magique pour décrire un état complexe, on utilise une **union de littéraux** TypeScript. Chaque valeur possible est explicite, et TS refuse les valeurs non autorisées.

**Code du projet** — [src/pages/Contact.tsx:6-10](../../src/pages/Contact.tsx#L6-L10) :

```ts
type Status = "idle" | "sent";

const [status, setStatus] = useState<Status>("idle");
```

→ `status` ne peut **que** valoir `"idle"` ou `"sent"`. Si on ajoute plus tard un `"loading"`, l'union TS l'oblige à être déclaré explicitement → le compilateur trouvera tous les endroits où ce nouvel état doit être géré.

Plus tard, [src/pages/Contact.tsx:117](../../src/pages/Contact.tsx#L117) :

```tsx
{status === "sent" ? "Message envoyé ✓" : "Envoyer le message"}
```

→ rendu conditionnel sur l'état. Avec un booléen (`isSent`), le code marche aussi, mais ajouter un troisième état (`isLoading`) demanderait de l'ajouter et tout repenser.

**Pourquoi c'est mieux qu'un booléen** :
- Extensible : passer de 2 à 3 états ne change pas la structure de l'app.
- Documenté : un développeur lit `Status = "idle" | "sent"` et comprend instantanément.
- Type-safe : impossible de mettre une valeur incohérente.

**À retenir.**
- Pour 2+ états textuellement nommables → union de littéraux.
- Pour un simple oui/non sans futur évolutif → booléen.
- Ne pas utiliser `0/1/2` ou `string` non contraint pour ça.

---

## 7.5 Sous-composants pour respecter les Rules of Hooks

**Notion.** On ne peut pas appeler un hook dans une boucle. Donc si chaque élément d'une liste a besoin de son propre état/ref/hook, on **extrait le rendu d'un élément** dans un sous-composant. Chaque instance du sous-composant a alors son propre cycle de hooks.

**Code du projet** — [src/pages/MissionsE5.tsx:12-48](../../src/pages/MissionsE5.tsx#L12-L48) :

```tsx
function Card({ mission }: { mission: Mission }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="card-E5 spotlight">
      {/* ... */}
    </div>
  );
}

export default function MissionsE5() {
  const formation = missionsByCategory("formation");
  return (
    <section>
      {formation.map((m) => (
        <Card key={m.slug} mission={m} />
      ))}
    </section>
  );
}
```

**Décodage** :

- `Card` est un sous-composant **local** (non exporté).
- À chaque itération du `.map`, React rend **une nouvelle instance** de `Card` → chaque carte a son propre `useSpotlight()`.
- Si on avait appelé `useSpotlight()` directement dans le `.map`, ça aurait violé la Rule "hooks au top du composant".

**Code du projet** — même pattern dans [src/pages/Competence.tsx:42-56](../../src/pages/Competence.tsx#L42-L56) :

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

**À retenir.**
- Hook par item de liste → sous-composant.
- Le sous-composant peut rester dans le même fichier (pas d'export nécessaire si usage local).
- Chaque instance = cycle de hooks indépendant.

---

## 7.6 Composition de composants (réutilisation par enfants, pas par config)

**Notion.** Une bonne hiérarchie React préfère la **composition** (passer des `children`) plutôt que la **configuration** (passer des props pour chaque sous-élément possible).

**Bon (composition)** :
```tsx
<Card>
  <h2>Titre</h2>
  <p>Contenu</p>
</Card>
```

**Moins bon (config)** :
```tsx
<Card title="Titre" content="Contenu" />
```

→ le second nécessite d'ajouter une prop pour chaque scénario (icône avant le titre ? action en bas ? etc.). Le premier accepte n'importe quoi en `children`.

**Code du projet** — [src/components/SectionTitle.tsx](../../src/components/SectionTitle.tsx) :

```tsx
export default function SectionTitle({ children }: Props) {
  return (
    <h2 className="...">
      <strong>{children}</strong>
    </h2>
  );
}
```

Usage :
```tsx
<SectionTitle>En quelques mots</SectionTitle>
<SectionTitle>Mon parcours académique</SectionTitle>
```

→ on passe le texte en children. Si demain on voulait y mettre `<SectionTitle><span>Mon</span> parcours</SectionTitle>`, ça marcherait sans changer `SectionTitle`.

**Code du projet** — Home compose les sections en enfants logiques :

```tsx
<>
  <BentoHero />
  <section id="about">...</section>
  <BtsSio />
  <Competence />
  <EcoleAlternance />
  <MissionsE5 />
  <Contact />
</>
```

→ Home **compose** les sections. Chaque section est un composant indépendant. Pour ajouter une section, on en crée une et on l'insère ici.

**À retenir.**
- Préférer `children` (composition) à une config exhaustive en props.
- Les composants haut-niveau **composent** des composants plus petits.
- Plus flexible, plus testable, plus lisible.

---

## 7.7 Composants à "effet pur" (rendent `null`)

**Notion.** Certains composants existent uniquement pour exécuter de la logique au montage / changement de props. Ils ne rendent rien à l'écran. Ils retournent `null` à la fin.

**Code du projet** — [src/components/ScrollToTop.tsx](../../src/components/ScrollToTop.tsx) :

```tsx
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
```

**Décodage** :

- Pas de rendu visible.
- Le composant existe pour **réagir** aux changements de `pathname` / `hash`.
- Placé à un endroit où il a accès au routing (sous `BrowserRouter` dans `main.tsx`).

**Pourquoi ce pattern** : on isole une responsabilité (scroll-to-top sur navigation) dans un endroit dédié. Plus propre que d'éparpiller la logique dans chaque page.

**À retenir.**
- `return null` = composant invisible.
- Sert à exécuter une logique transverse, déclenchée par un état réactif.

---

## Exercices

### Exercice 1 (analyse)

Identifie tous les composants du projet qui consomment `data/missions.ts`. Que se passerait-il si on supprimait `findMission` ?

### Exercice 2 (refactor)

On a ce code dans un composant :

```tsx
function App() {
  return (
    <div>
      <nav>
        <a href="#a">A</a>
        <a href="#b">B</a>
        <a href="#c">C</a>
        <a href="#d">D</a>
      </nav>
    </div>
  );
}
```

Refactore en utilisant le pattern "configuration centralisée".

### Exercice 3 (analyse)

Pourquoi `Card` est défini **dans** `MissionsE5.tsx` plutôt qu'extrait en `src/components/Card.tsx` ? Quels seraient les pour/contre de l'extraire ?

### Exercice 4 (écriture)

Crée un type union pour un état de chargement avec 4 phases : `"idle"`, `"loading"`, `"success"`, `"error"`. Utilise-le dans un composant `FetchButton` qui affiche le bon texte selon l'état.

### Exercice 5 (lecture du projet)

Compare `BentoHero.tsx` (composant qui ne consomme pas `data/missions.ts`) et `MissionsE5.tsx` (qui le consomme). Quel pattern d'architecture permet cette différence ?

### Exercice 6 (analyse, plus dur)

Imagine qu'on veuille ajouter une route `/competences-detail/:skillSlug` qui affiche les détails d'une compétence. Que faudrait-il faire dans :
1. `data/` ?
2. `App.tsx` ?
3. les composants existants ?

Quel pattern du projet rends cet ajout simple ?

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

Consommateurs de `data/missions.ts` :
- `src/pages/MissionsE5.tsx` — utilise `missionsByCategory`, `Mission` (type).
- `src/pages/MissionDetail.tsx` — utilise `findMission`.

Si on supprimait `findMission`, `MissionDetail.tsx` ne compilerait plus (import cassé). Il faudrait soit le réécrire en inline (`missions.find(m => m.slug === slug)`), soit reconstruire un helper équivalent ailleurs.

C'est l'avantage du pattern : un seul endroit à maintenir.

</details>

<details>
<summary>Corrigé Exercice 2</summary>

```tsx
const links = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
  { id: "d", label: "D" },
];

function App() {
  return (
    <div>
      <nav>
        {links.map((l) => (
          <a key={l.id} href={`#${l.id}`}>{l.label}</a>
        ))}
      </nav>
    </div>
  );
}
```

Bénéfices : ajouter un lien = ajouter une entrée dans `links`, sans toucher au JSX.

</details>

<details>
<summary>Corrigé Exercice 3</summary>

`Card` est local à `MissionsE5.tsx` parce que :
- elle est **spécifique** à l'affichage des missions (`badge`, `card-E5-icons`, lien `/missions/:slug`),
- elle n'est utilisée **nulle part ailleurs** dans le projet.

**Pour l'extraire** dans `src/components/Card.tsx` :
- + : réutilisabilité si une autre page voulait afficher des missions.
- + : isolation, tests unitaires plus faciles.
- − : un import supplémentaire à gérer.
- − : si elle n'est utilisée qu'à un seul endroit, c'est de la complexité prématurée.

Règle pragmatique : extraire quand on a au moins 2 usages, ou quand le composant devient trop gros à lire dans son fichier hôte.

</details>

<details>
<summary>Corrigé Exercice 4</summary>

```tsx
import { useState } from "react";

type FetchState = "idle" | "loading" | "success" | "error";

export default function FetchButton() {
  const [state, setState] = useState<FetchState>("idle");

  const labels: Record<FetchState, string> = {
    idle: "Charger",
    loading: "Chargement...",
    success: "OK !",
    error: "Erreur, réessayer",
  };

  const handleClick = async () => {
    setState("loading");
    try {
      await fetch("/api/data");
      setState("success");
    } catch {
      setState("error");
    }
  };

  return <button onClick={handleClick} disabled={state === "loading"}>{labels[state]}</button>;
}
```

Notes :
- `Record<FetchState, string>` force TS à vérifier que chaque état a un label.
- Si on ajoute plus tard `"refreshing"` à l'union, TS pointera l'erreur dans `labels`.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

- `BentoHero.tsx` rend des données **statiques** (formation, alternance, stack, etc.) écrites directement en JSX.
- `MissionsE5.tsx` rend des données **dynamiques** lues depuis `data/missions.ts`.

Le pattern qui permet cette différence : on ne sort pas les données dans un module séparé tant qu'il n'y a **qu'un seul consommateur** et qu'elles ne changent pas. Les données du hero sont consommées une seule fois → en JSX inline, c'est OK. Les missions sont consommées à deux endroits (liste + détail) → centralisées dans `data/`.

Règle : extraire en `data/` quand au moins 2 consommateurs, ou quand la donnée change souvent et qu'elle bénéficie de typage.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

1. **Dans `data/`** : créer `src/data/skills.ts` avec un type `Skill`, un tableau `skills: Skill[]`, et un helper `findSkill(slug)`. Exactement le même pattern que `missions.ts`.
2. **Dans `App.tsx`** : ajouter une route `<Route path="/competences-detail/:skillSlug" element={<CompetenceDetail />} />`.
3. **Composants existants** :
   - Créer `src/pages/CompetenceDetail.tsx` (calque sur `MissionDetail.tsx` : `useParams`, `findSkill`, `<Navigate>` si pas trouvé).
   - Modifier `src/pages/Competence.tsx` pour wrapper chaque `SkillCard` dans un `<Link to={'/competences-detail/${slug}'}>`.

Le pattern **single source of truth** + **slug-based routing** rend cet ajout trivial : on duplique la logique de `missions` → `skills` sans rien casser. Si les données étaient inline dans le JSX, il faudrait restructurer beaucoup plus.

</details>
