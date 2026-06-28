# Slides Remotion — Workshop IIM

Decks de présentation Remotion pour le workshop **Stratégie de l'Innovation & IA générative avec Claude Code** (M1 IWID).

## Lancer le mode présentation

```bash
cd slides
npm install
npm run present
```

Ouvre http://localhost:5173. Navigation clavier :

- `Espace` ou `→` : slide suivante
- `←` : slide précédente
- `F` : plein écran

## Slides disponibles

### J1 — Théorie (1h)

10 slides qui couvrent les 6 blocs théoriques du jour 1 :

1. **S0** — Titre "Comprendre le LLM en 1h"
2. **S1** — Bloc A : "Un prédicteur de tokens autoregressif"
3. **S2** — Bloc B : "Le contexte — 200 000 tokens max"
4. **S3** — Bloc C : "Dégradation — plus le contexte gonfle, moins c'est précis"
5. **S4** — Bloc D intro : "L'économie — pricing Sonnet + caching"
6. **S5** — Bloc D détail : "Sans cadrage, ça part en flammes"
7. **S6** — Bloc E intro : "La limite du LLM seul"
8. **S7** — Bloc E réponse : "Skills + scripts déterministes" (pattern central)
9. **S8** — Bloc F : "L'écosystème agentique 2026"
10. **S9** — Closing : "Cette semaine, on apprend à cadrer"

## Identité visuelle

- Fond : `#0E1116` (bleu nuit)
- Texte : `#F5F5F0` (blanc cassé)
- Accent chaud : `#FF7A1A` (orange)
- Accent froid : `#3FA7FF` (bleu)
- Typo : Poppins / Inter

(centralisée dans `src/theme.ts`)

## Ajouter ou modifier une slide

Toutes les slides J1 sont dans `src/Slides.tsx`. Pour modifier :
- Le titre / kicker / label → éditer le composant `S0` à `S9`
- L'icône → changer la clé dans `ICON` ou ajouter une icône Lordicon dans `public/`
- Le layout → utiliser `CenterHero` (icône centrée + texte dessous) ou `Split` (icône à gauche/droite + texte)

Pour ajouter une slide :
1. Créer un nouveau composant `S10` style `CenterHero` ou `Split`
2. L'ajouter au tableau `SLIDE_COMPONENTS`
3. Sauvegarder, la slide apparaît automatiquement

## Ajouter une icône Lordicon

1. Aller sur [lordicon.com](https://lordicon.com/)
2. Choisir une icône, télécharger en **JSON** (Lottie)
3. Déposer dans `public/`
4. Ajouter une clé dans le mapping `ICON` de `src/Slides.tsx`

## Rendu vidéo (optionnel)

Pour rendre les slides en MP4 (par exemple pour les distribuer aux étudiants après le cours) :

```bash
npm run render:j1
```

Génère `out/j1-theorie.mp4`.

## Structure

```
slides/
├── public/                  # Icônes Lordicon (.json)
├── src/
│   ├── theme.ts             # Palette + typo
│   ├── components.tsx       # KineticText, Reveal, Centered, etc.
│   ├── LordiconIcon.tsx     # Composant pour rendre une icône Lottie
│   ├── Slides.tsx           # ← Les slides du jour 1 (modifier ici)
│   ├── Deck.tsx             # Player avec navigation clavier
│   ├── Root.tsx             # Composition pour rendu vidéo
│   ├── main.tsx             # Entry point web (Vite)
│   └── index.ts             # Entry point Remotion CLI
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```
