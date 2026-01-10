# Instructions Copilot - Portfolio Thomas

Portfolio statique BTS SIO présentant missions E5, projets E6 et veille technologique. Aucun framework JS, Bootstrap local uniquement.

## Architecture & Pages

**5 pages HTML principales** :

- `index.html` : Hero + sections about_me, bts_sio, alternance
- `ecole-alternance.html` : Informations sur l'école et l'alternance
- `projets-missions.html` : Grilles de cartes missions E5 + section `#projets_E6_section`
- `veille-technologique.html` : Grille de cartes veille technologique
- `contact.html` : Page de contact

**Navigation critique** : Lien "projets_E6" redirige vers `projets-missions.html#projets_E6_section` (pas de page dédiée).

## Conventions strictes

### Pattern HTML obligatoire

```html
<section class="{nom}_section">
  <div class="{nom}_container">
    <div class="section_title">
      <h2><span>//</span> nom_section</h2>
      <!-- Pattern // présent partout : nav, titres -->
    </div>
  </div>
</section>
```

### Chemins assets : INCOHÉRENCE ACTUELLE

- `index.html` : chemins **absolus** `/assets/` et `/assets/script.js`
- `projets-missions.html` + `veille-technologique.html` + autres pages : chemins **relatifs** `assets/`
- **Toujours relatifs pour nouveaux fichiers** jusqu'à décision de standardisation

### Bootstrap local (jamais CDN)

```html
<link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
```

### Grilles de cartes Bootstrap

Pattern exact dans `projets-missions.html` et `veille-technologique.html` :

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100"></div>
  </div>
</div>
```

## Développement

**Installation** : `npm install` (installe Bootstrap 5.3.8)

**Dev server** : Live Server extension VS Code (pas de script npm)

**Formatage** : Prettier configuré (`.prettierrc`) :

```bash
npm run format        # Formate tout
npm run format:check  # Vérifie seulement
```

## État actuel (phase squelette)

- `assets/script.js` : **vide** (pas d'interactions prévues pour le moment)
- `assets/styles.css` : **minimal** (reset + `.background` div avec `z-index: -1`)
- Cartes : placeholders `src="..."` et Lorem ipsum
- Footer : structure différente entre `index.html` (année 2026) et autres pages
- Logos sociaux : répétés hero + footer (`logo-github.svg`, `logo-linkedin.svg`, `logo-mail.svg`)

## Patterns découverts

**Header identique** sur 3 pages (classes : `header_container`, nav avec `<span>//</span>`)

**Images décoratives** : SVG dans `assets/img/` (`line1-about.svg`, `line2-about.svg`, `line3-BTS.svg`, `line4-alternance.svg`, `points-carré.svg`, `points-rectangle.svg`)

**Structure footer** :

```html
<footer>
  <img src="assets/img/line3-BTS.svg" alt="" />
  <div><!-- Logos sociaux --></div>
</footer>
```

**Container principal** : `<div class="main_container position-relative w-100 min-vh-100">` + `<div class="background"></div>` à la fin
