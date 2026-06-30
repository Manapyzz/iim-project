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

## Exemple rempli — Bullymarket (projet d'Arnaud)

Voilà à quoi ça ressemble quand on remplit pour un vrai projet de la classe :

```markdown
# Bullymarket — Notes pour Claude

## Pitch

Plateforme de paris sociaux entre amis avec points virtuels (pas d'argent réel). Les groupes parient sur les actions/comportements de leurs membres, avec une mécanique parimutuelle.

## Stack technique

- **Langage** : TypeScript (strict)
- **Framework** : Next.js 16 (App Router, Front + API Routes)
- **DB** : SQLite via Drizzle ORM
- **Auth** : next-auth (email magic link)
- **Styling** : Tailwind + Shadcn/ui
- **Tests** : Vitest

## Règles métier critiques (à NE JAMAIS casser)

1. Le **créateur d'un pari ne peut PAS y miser**. Il est l'arbitre.
2. Une **fois la mise placée**, l'odds est *lockée* (snapshot de la distribution à ce moment). Elle ne change plus.
3. La **résolution suit une machine d'état stricte** : `open → locked → pending_resolution → resolved` OU `pending_resolution → contested → finalized`. JAMAIS d'autre transition.
4. Une **résolution non contestée dans les 48h est auto-approuvée**. Pas de cron, c'est calculé à la volée à chaque consultation.
5. Le **budget saisonnier est reset à chaque nouvelle saison** (durée définie dans `src/config/season.ts`). Les points ne sont JAMAIS transférables entre saisons.
6. Les **groupes sont multi-appartenances**. Un user peut être créateur dans un groupe et simple parieur dans un autre.

## Conventions de code

- **Nommage fichiers** : kebab-case
- **Nommage variables** : camelCase
- **Pas de `any`**. Pas de `// @ts-ignore`.
- **Pas de try/catch silencieux**. Toute erreur est loggée via `logger` ou re-throw.
- **Un fichier = une responsabilité**. Max 250 lignes.

## Scripts déterministes à appeler

- `src/lib/scoring/calculate-payout.ts` → `payout = stake × lockedOdds` (testé)
- `src/lib/scoring/distribute-pot.ts` → distribution multi-options du pot (testé sur 7 cas)
- `src/lib/state/bet-machine.ts` → transitions d'état des paris (refuse transitions illégales)
- `src/lib/validation/wager.ts` → vérification qu'un wager est légal (budget, fermeture, créateur)
- `src/lib/resolution/auto-approve.ts` → règle des 48h, calculée à la volée

## Anti-patterns SPÉCIFIQUES au projet

- ❌ Calculer un payout dans un composant React. Toujours `calculate-payout.ts`.
- ❌ Demander au LLM de "deviner" une odds ou un payout. Pas son rôle.
- ❌ Hardcoder la durée d'une saison ou le budget initial. Toujours dans `src/config/season.ts`.
- ❌ Permettre une transition d'état non listée dans la machine.

## Anti-patterns d'INGÉNIERIE (les 7 commandements transverses)

Ces 7 règles s'appliquent à TOUT projet, pas juste celui-ci. Claude les connaît mal — il faut les rappeler :

1. ❌ **Big bang refacto** : pas de feature flag, pas de coexistence "ancien + nouveau". Tu remplaces, tu nettoies, tu commits.
2. ❌ **No stub / no TODO** : pas de `return null; // TODO`. Si la fonction est commitée, elle MARCHE.
3. ❌ **No silent fail** : pas de `try/catch` qui avale les erreurs. Toujours logger ou re-throw.
4. ❌ **No revert** : on corrige forward. Si une régression apparaît, on fix, on ne revient pas en arrière.
5. ❌ **No god file** : >250 lignes = découpe. Un fichier = une responsabilité.
6. ❌ **No magic number** : pas de valeur business hardcodée dans le code. Toujours dans `src/config/`.
7. ❌ **No vibe-prompt** : pas de "fais-moi un truc qui marche". Prompt précis ou pas de prompt.

## Commandes utiles

- `pnpm dev` → lance Next.js
- `pnpm test` → tests Vitest
- `pnpm lint` → ESLint
- `pnpm drizzle:push` → applique le schéma DB

## Fichiers de référence

- [PROJECT_RULES.md](./PROJECT_RULES.md) → règles métier détaillées (machine d'état + formules + edge cases)
- [ARCHITECTURE.md](./ARCHITECTURE.md) → composants ↔ scripts ↔ DB
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

- À chaque nouvelle entité majeure ajoutée
- À chaque nouvelle règle métier critique
- À chaque nouveau script déterministe créé (l'ajouter à la liste pour qu'il soit appelé)
- Quand tu remarques que Claude fait toujours la même erreur → c'est qu'il manque une règle ici

## Erreurs fréquentes

1. **Trop long** : tu fais un CLAUDE.md de 800 lignes, Claude lit moins bien la fin
2. **Trop générique** : "respecte les bonnes pratiques" → inutile. Il faut du SPÉCIFIQUE à TON projet.
3. **Pas mis à jour** : ton CLAUDE.md parle d'une stack que tu as changée la veille → Claude se trompe.
4. **Pas testé** : tu n'as jamais vérifié que Claude le respecte. Demande-lui "résume-moi les règles du CLAUDE.md" pour vérifier qu'il les a lues.
