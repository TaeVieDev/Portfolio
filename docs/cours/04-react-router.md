# Chapitre 4 — React Router (routing client)

Une SPA (Single Page Application) charge un seul HTML, puis change le contenu de la page en fonction de l'URL **sans recharger**. React Router est la bibliothèque qui gère ce routage côté client.

---

## 4.1 `BrowserRouter`

**Notion.** Composant qui active le routing pour tout l'arbre enfant. Il faut **un seul** `BrowserRouter` qui englobe toute l'app — sinon les hooks comme `useLocation` ne sauront pas où chercher l'info.

**Code du projet** — [src/main.tsx:14-16](../../src/main.tsx#L14-L16) :

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Décodage** :

- `<BrowserRouter>` enveloppe `<App />`. Tous les hooks de routing (`useLocation`, `useNavigate`, `useParams`) appelés à l'intérieur fonctionneront.
- `BrowserRouter` utilise l'API native `history.pushState` du navigateur — c'est ce qui permet de changer l'URL sans rechargement.

**À retenir.**
- Un seul `BrowserRouter` en haut de l'arbre, dans `main.tsx`.
- Tout ce qui doit accéder au routing doit être à l'intérieur.

---

## 4.2 `Routes` et `Route`

**Notion.** À l'intérieur de l'app, on déclare les correspondances URL → composant via `<Routes>` (le conteneur) et `<Route>` (chaque règle).

**Code du projet** — [src/App.tsx:23-28](../../src/App.tsx#L23-L28) :

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/missions/:slug" element={<MissionDetail />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

**Décodage** :

- `<Routes>` — conteneur. React Router compare l'URL courante à chaque `<Route>` enfant et **rend seulement celle qui matche**.
- `<Route path="/" element={<Home />} />` — quand l'URL est `/`, rend `<Home />`.
- `<Route path="/missions/:slug" element={<MissionDetail />} />` — route **dynamique** : `:slug` est un placeholder qui matche n'importe quel segment. `/missions/portfolio` ou `/missions/abc-def` matchent tous les deux.
- `<Route path="*" element={<Navigate to="/" replace />} />` — **wildcard** : matche tout ce que les autres routes n'ont pas matché. Sert de fallback pour les URLs inconnues. Ici on redirige vers `/`.

**À retenir.**
- `<Routes>` choisit **une** `<Route>` qui matche.
- `:param` dans un path = segment dynamique, accessible via `useParams`.
- `path="*"` = fallback pour les URLs non gérées.

---

## 4.3 `useParams` (lire les segments dynamiques)

**Notion.** Hook qui retourne un objet contenant les valeurs des segments dynamiques de l'URL courante.

**Code du projet** — [src/pages/MissionDetail.tsx:11](../../src/pages/MissionDetail.tsx#L11) :

```tsx
const { slug } = useParams<{ slug: string }>();
```

**Décodage** :

- `useParams()` retourne un objet `{ slug: "..." }` si la route définit `:slug`.
- Le générique `<{ slug: string }>` dit à TypeScript le format attendu.
- Destructuration pour récupérer directement `slug`.
- Type technique : `slug` est en réalité `string | undefined` (React Router n'a pas de garantie côté types stricts).

Ensuite, [src/pages/MissionDetail.tsx:12](../../src/pages/MissionDetail.tsx#L12) :

```tsx
const mission = slug ? findMission(slug) : undefined;
```

→ on protège l'appel à `findMission` avec un ternaire au cas où `slug` serait `undefined`.

**À retenir.**
- `useParams<{ paramName: string }>()` lit les segments dynamiques de l'URL.
- Toujours vérifier que le param existe avant de l'utiliser.

---

## 4.4 `useLocation` (info sur l'URL courante)

**Notion.** Retourne un objet décrivant l'URL courante : `pathname`, `search` (les query params), `hash`.

```ts
const location = useLocation();
// location = { pathname: "/missions/portfolio", search: "", hash: "" }
```

**Code du projet** — [src/components/ScrollToTop.tsx:10](../../src/components/ScrollToTop.tsx#L10) :

```tsx
const { pathname, hash } = useLocation();
```

→ destructure pour ne garder que ce qui sert : le chemin et l'ancre.

**Code du projet** — [src/components/Header.tsx:23, 28](../../src/components/Header.tsx#L23) :

```tsx
const location = useLocation();
// ...
const onHome = location.pathname === "/";
```

→ on calcule un booléen dérivé : "est-on sur la home ?". Utilisé pour conditionner le comportement des liens.

**À retenir.**
- `useLocation()` lit l'URL courante.
- Combinable avec destructuration pour ne garder que ce qui sert.

---

## 4.5 `useNavigate` (changer d'URL programmatiquement)

**Notion.** Retourne une fonction qui change l'URL. Équivalent JS d'un clic sur un `<Link>`.

```ts
const navigate = useNavigate();
navigate("/contact");                 // navigue vers /contact
navigate("/contact", { replace: true });  // remplace l'entrée d'historique
navigate(-1);                         // équivalent du bouton retour
```

**Code du projet** — [src/components/Header.tsx:24, 74](../../src/components/Header.tsx#L24) :

```tsx
const navigate = useNavigate();
// ...
if (!onHome) {
  navigate(`/#${id}`);
  return;
}
```

**Décodage** :

- Quand on clique sur un lien du header alors qu'on n'est PAS sur la home (donc sur `/missions/...`), on doit d'abord revenir à `/` avant que les ancres `#bts`, `#contact` fonctionnent.
- `navigate('/#contact')` change l'URL → React Router rend `<Home />` (qui matche `/`) → puis `ScrollToTop.tsx` détecte le hash et scrolle.

**À retenir.**
- `useNavigate()` retourne une fonction pour changer d'URL en JS.
- Utile pour les redirections après une action (submit, login, etc.).

---

## 4.6 `<Link>` vs `<a>`

**Notion.** Pour naviguer dans une SPA, **toujours** utiliser `<Link>` (de React Router), pas `<a>`.

- `<a href="/contact">` → navigation classique du navigateur → **rechargement complet** de la page → perte de l'état React.
- `<Link to="/contact">` → React Router intercepte le clic, met à jour l'URL via `pushState`, et re-rend l'arbre **sans recharger**.

**Code du projet** — [src/components/BentoHero.tsx:72-74](../../src/components/BentoHero.tsx#L72-L74) :

```tsx
<Link to="/missions-e5" className="bento__cta">
  Voir mes projets <i className="fa-solid fa-arrow-right" />
</Link>
```

**Code du projet** — [src/pages/MissionDetail.tsx:23-25](../../src/pages/MissionDetail.tsx#L23-L25) :

```tsx
<Link to="/#missions" className="mission-detail__back">
  <i className="fa-solid fa-arrow-left" /> Retour aux missions
</Link>
```

→ `to="/#missions"` : navigation vers `/` avec hash `#missions`. `ScrollToTop` détectera ensuite le hash et scrollera vers la section.

**Quand utiliser `<a>` quand même ?**

Pour les liens **externes** ou les ressources non-SPA (PDF, mailto, etc.).

**Code du projet** — [src/components/Footer.tsx:10](../../src/components/Footer.tsx#L10) :

```tsx
<a href="https://github.com/thomas-montout" target="_blank" rel="noopener noreferrer">
```

→ lien externe → `<a>` classique avec `target="_blank"` (nouvel onglet) et `rel="noopener noreferrer"` (sécurité).

**À retenir.**
- Liens **internes** SPA → `<Link to="...">`.
- Liens **externes** (autre site, fichier, mailto) → `<a href="...">`.

---

## 4.7 `<Navigate>` (redirection déclarative)

**Notion.** Composant qui redirige dès qu'il est rendu. Sert souvent dans les gardes d'authentification ou les fallbacks.

**Code du projet** — [src/App.tsx:27](../../src/App.tsx#L27) :

```tsx
<Route path="*" element={<Navigate to="/" replace />} />
```

→ pour toute URL inconnue, on redirige vers `/`. Le prop `replace` **remplace** l'entrée d'historique au lieu d'en ajouter une nouvelle — sinon le bouton retour reviendrait sur l'URL invalide et bouclerait la redirection.

**Code du projet** — [src/pages/MissionDetail.tsx:17](../../src/pages/MissionDetail.tsx#L17) :

```tsx
if (!mission) return <Navigate to="/#missions" replace />;
```

→ si on tape `/missions/n-existe-pas`, le slug ne matche aucune mission → on redirige proprement vers la liste.

**À retenir.**
- `<Navigate to="..." />` redirige immédiatement.
- `replace` évite de polluer l'historique.

---

## Exercices

### Exercice 1 (lecture)

Pourquoi la route `<Route path="*" element={<Navigate to="/" replace />} />` doit-elle être en **dernier** dans `<Routes>` ?

### Exercice 2 (prédiction)

Si l'URL est `/missions/portfolio/extra`, est-ce que ces routes matchent ? Pourquoi ?

```tsx
<Route path="/" element={<Home />} />
<Route path="/missions/:slug" element={<MissionDetail />} />
<Route path="*" element={<Navigate to="/" replace />} />
```

### Exercice 3 (écriture)

Écris une route paramétrée pour `/user/:id/posts/:postId` et un composant qui affiche `User N, post N`.

### Exercice 4 (lecture du projet)

Explique le comportement complet quand l'utilisateur clique sur le lien "Contact" du header alors qu'il est sur `/missions/portfolio`. Décris la séquence d'événements (3 étapes au moins).

### Exercice 5 (analyse)

Pourquoi `<Navigate replace />` (avec replace) plutôt que `<Navigate />` (sans) dans le fallback wildcard ? Que se passerait-il sans `replace` ?

### Exercice 6 (écriture)

Écris un composant `LoginGate` qui prend une prop `isAuthenticated: boolean`. S'il vaut `true`, il rend `children`. Sinon, il redirige vers `/login`.

---

## Corrigés

<details>
<summary>Corrigé Exercice 1</summary>

`<Routes>` en v6 matche la première route qui correspond, mais avec un système de spécificité : les routes plus spécifiques l'emportent sur les wildcards. En pratique on met quand même la `*` en dernier par clarté. Si elle était en premier, ce serait techniquement matché en dernier (spécificité), mais le lecteur du code serait confus.

</details>

<details>
<summary>Corrigé Exercice 2</summary>

L'URL `/missions/portfolio/extra` :
- ❌ `path="/"` — ne matche pas (le path est plus long que juste `/`).
- ❌ `path="/missions/:slug"` — ne matche pas non plus, car `:slug` matche UN segment, pas plusieurs. Donc `/missions/portfolio` matche, mais `/missions/portfolio/extra` non.
- ✅ `path="*"` — matche en dernier recours → redirige vers `/`.

Pour matcher plusieurs segments, il faudrait `/missions/:slug/*` ou plusieurs paramètres.

</details>

<details>
<summary>Corrigé Exercice 3</summary>

```tsx
// Dans App.tsx :
<Route path="/user/:id/posts/:postId" element={<UserPost />} />

// Composant :
function UserPost() {
  const { id, postId } = useParams<{ id: string; postId: string }>();
  return <p>User {id}, post {postId}</p>;
}
```

</details>

<details>
<summary>Corrigé Exercice 4</summary>

1. **Clic sur le lien.** Dans `Header.tsx`, `handleClick` est appelé. `e.preventDefault()` empêche le saut natif. `setMobileOpen(false)` ferme le menu mobile.
2. **`onHome` est `false`** (on est sur `/missions/portfolio`). Le code appelle `navigate('/#contact')` puis `return`.
3. **Changement d'URL.** React Router met à jour le path en `/` (avec hash `#contact`). `<Routes>` re-matche → c'est `<Home />` qui rend maintenant.
4. **`ScrollToTop` s'active.** Son `useEffect` re-déclenche (deps `[pathname, hash]` ont changé). Il voit le hash `#contact`, fait `document.getElementById("contact").scrollIntoView({behavior:"smooth"})`. La page scrolle jusqu'à la section Contact.

</details>

<details>
<summary>Corrigé Exercice 5</summary>

Sans `replace`, chaque visite d'URL invalide ajoute une entrée dans l'historique. Imagine : l'utilisateur tape `/inexistante` → redirigé vers `/`. Il clique sur "retour" dans son navigateur. Il revient sur `/inexistante` → redirigé vers `/`. Il clique encore "retour". Etc. **Boucle infinie** apparente.

Avec `replace`, l'URL `/inexistante` **remplace** l'entrée précédente dans l'historique. Le "retour" du navigateur saute directement à la page d'avant.

</details>

<details>
<summary>Corrigé Exercice 6</summary>

```tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  isAuthenticated: boolean;
  children: ReactNode;
}

export default function LoginGate({ isAuthenticated, children }: Props) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

Usage :
```tsx
<LoginGate isAuthenticated={user !== null}>
  <Dashboard />
</LoginGate>
```

</details>
