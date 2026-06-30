# Le `CLAUDE.md` — la fondation du cadrage

## C'est quoi, à quoi ça sert ?

`CLAUDE.md` est un fichier à la racine de ton projet. **Claude Code le lit automatiquement à chaque ouverture** et le garde toujours en tête.

C'est le **manuel d'utilisation de ton projet à destination de Claude** :
- Qui est l'utilisateur, c'est quoi le projet, en une phrase
- La stack technique exacte (langage, framework, DB, libs)
- Les règles métier qu'il ne doit JAMAIS casser
- Les conventions de code (nommage, structure, fichiers)
- Les **scripts déterministes** qu'il doit appeler (au lieu de réinventer la roue)
- Les anti-patterns à éviter spécifiques à ton projet

> 💡 **Sans CLAUDE.md, Claude invente.** Il invente ta stack, tes conventions, tes règles métier. Avec un bon CLAUDE.md, il **applique** ce que tu as décidé.

## Règles d'or pour un bon CLAUDE.md

1. **Court** (200-400 lignes max). Si c'est trop long, Claude lit moins bien (lost in the middle).
2. **Spécifique**. Pas de blabla générique. Du vrai contenu sur TON projet.
3. **Tient au jour le jour**. Quand ta stack ou tes conventions changent, tu mets à jour.
4. **Pointe vers d'autres fichiers**. Pour les détails (PROJECT_RULES, ARCHITECTURE, schéma DB), tu link au lieu de tout mettre dedans.
5. **Inclut le NON**. Aussi important que ce qu'on fait : ce qu'on ne fait JAMAIS.

---

## Template à copier

Copie ça à la racine de ton projet dans un fichier nommé `CLAUDE.md`, remplace les sections :

```markdown
# [NOM DU PROJET] — Notes pour Claude

## Pitch (1 phrase)

[Une phrase qui décrit le projet — qui c'est pour, quel problème ça résout.]

## Stack technique

- **Langage** : [TypeScript / JavaScript]
- **Framework front** : [Next.js 16 / Vite / Astro]
- **Framework back** : [Next.js API Routes / Express / Hono]
- **DB** : [SQLite via Drizzle ORM / Postgres via Prisma]
- **Auth** : [next-auth / clerk / pas d'auth]
- **Styling** : [Tailwind + Shadcn / CSS modules]
- **Tests** : [Vitest / Jest]

## Règles métier critiques (à NE JAMAIS casser)

[Liste 3 à 7 invariants — pas des conventions de code, des règles MÉTIER.]

1. [Exemple : "Un utilisateur ne peut PAS parier sur un marché qu'il a créé."]
2. [Exemple : "Tous les calculs de score se font dans `src/lib/scoring/` — JAMAIS inline."]
3. ...

## Conventions de code

- **Nommage fichiers** : kebab-case (`my-component.tsx`)
- **Nommage variables** : camelCase
- **Pas de `any` TypeScript**. Si tu hésites, demande.
- **Pas de `try/except: pass`** — toute erreur doit être loggée ou re-throw.
- **Un fichier = une responsabilité**. Si un fichier dépasse 250 lignes, on découpe.

## Scripts déterministes à appeler

Pour les calculs et règles métier, **utilise ces fonctions**, ne les réécris JAMAIS :

- `src/lib/scoring/calculate-payout.ts` → calcul de gain : `payout = stake × lockedOdds`
- `src/lib/state/bet-machine.ts` → machine d'état des paris (transitions légales uniquement)
- `src/lib/validation/wager.ts` → validation qu'un wager est légal (budget, fermeture, créateur)
- `data/agents.json` → données de référence (lire, JAMAIS inventer)

## Anti-patterns SPÉCIFIQUES au projet

- ❌ Ne JAMAIS appeler le LLM pour faire un calcul mathématique. Utilise les scripts ci-dessus.
- ❌ Ne JAMAIS mettre la logique métier dans un composant React. Toujours dans `src/lib/`.
- ❌ Ne JAMAIS hardcoder des valeurs business (durée saison, budget, plafonds). Toujours dans `src/config/`.

## Anti-patterns d'INGÉNIERIE (les 7 commandements transverses)

1. ❌ **Big bang refacto** : pas de feature flag, pas de coexistence. Remplace, nettoie, commit.
2. ❌ **No stub / no TODO** : pas de `return null; // TODO`. Si commité, ça MARCHE.
3. ❌ **No silent fail** : pas de `try/catch` qui avale. Log ou re-throw.
4. ❌ **No revert** : corrige forward, jamais backward.
5. ❌ **No god file** : >250 lignes = découpe.
6. ❌ **No magic number** : valeurs business → `src/config/`.
7. ❌ **No vibe-prompt** : prompt précis ou pas de prompt.

## Commandes utiles

- `npm run dev` → lance le serveur de dev
- `npm test` → lance les tests unitaires
- `npm run lint` → vérifie le respect des règles
- `npm run check-dette` → lance le linter de dette IA (voir `scripts/lint_dette_ia.py`)

## Fichiers de référence

- `PROJECT_RULES.md` → règles métier détaillées (machine d'état, formules, edge cases)
- `ARCHITECTURE.md` → diagramme de l'archi (composants ↔ scripts ↔ DB)
- `README.md` → présentation utilisateur du projet
```

---

## Ce qui change AVEC vs SANS CLAUDE.md

| Sans CLAUDE.md | Avec CLAUDE.md |
|---|---|
| Claude invente ta stack | Claude utilise ta stack |
| Claude écrit ses propres calculs (souvent faux) | Claude appelle tes scripts testés |
| Claude utilise n'importe quel style de code | Claude respecte tes conventions |
| Claude peut casser des règles métier en silence | Claude refuse de casser tes invariants |
| Tu te retrouves avec un `any` partout en TS | Pas de `any`, c'est interdit |

## Quand le mettre à jour ?

CLAUDE.md est **injecté à chaque session** : tout ce que tu mets ici, Claude le relit en permanence. Garde-le concis et garde-le pour ce qui est VRAIMENT transverse. Le détail va ailleurs.

- **Quand tu remarques que Claude fait toujours la même erreur** → ajoute une règle qui l'empêche (c'est la mise à jour la plus rentable)
- **Quand ta stack change** (framework, DB, libs majeures) → mets à jour pour que Claude ne propose plus l'ancien
- **Quand tu prends une décision d'archi structurante** → écris un **ADR** (Architecture Decision Record) dans `docs/adr/` et linke depuis ici. Ne recopie pas l'ADR dans CLAUDE.md.
- **Quand tu regroupes des scripts en SKILL** → mentionne le skill ici (1 ligne). Le détail des scripts vit dans `skills/<nom>/SKILL.md`, pas ici — sinon CLAUDE.md devient un fourre-tout.

> 🚫 **Ce qui ne va PAS dans CLAUDE.md** : la liste exhaustive de tes entités, de tes règles métier détaillées, ou de chaque script créé. Ça gonfle inutilement le contexte injecté à chaque message. Mets-les dans des fichiers dédiés (`PROJECT_RULES.md`, `docs/adr/`, `skills/`) et pointe vers eux depuis CLAUDE.md.

## Erreurs fréquentes

1. **Trop long** : tu fais un CLAUDE.md de 800 lignes, Claude lit moins bien la fin
2. **Trop générique** : "respecte les bonnes pratiques" → inutile. Il faut du SPÉCIFIQUE à TON projet.
3. **Pas mis à jour** : ton CLAUDE.md parle d'une stack que tu as changée la veille → Claude se trompe.
4. **Pas testé** : tu n'as jamais vérifié que Claude le respecte. Demande-lui "résume-moi les règles du CLAUDE.md" pour vérifier qu'il les a lues.
