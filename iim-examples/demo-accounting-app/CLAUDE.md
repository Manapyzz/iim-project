# demo-accounting-app — Notes pour Claude

## Contexte du projet

Ce dossier est un **projet démo** pour le workshop IIM. Il illustre :
1. Comment un projet consomme des **skills** (`.claude/skills/`)
2. Comment les scripts déterministes et la prose LLM cohabitent dans le même skill
3. Comment un skill fait tourner ses **sessions logs** pour l'auditabilité

Le projet simule la comptabilité d'une petite association étudiante fictive, **IIMPACT**, qui vend des goodies, organise des événements et prend des adhésions. On a 25 factures fictives pour juin 2026.

## Stack

- **Langage** : TypeScript strict (ES2022)
- **Runtime** : Node 20+, tsx pour l'exécution
- **Tests** : Vitest
- **Package manager** : pnpm

Pas de framework, pas de UI. C'est un projet CLI + skills.

## Skills disponibles

Deux skills sont chargés depuis `.claude/skills/` :

### 1. `accounting` (pattern mixte : scripts + prose)
- `calculate-invoice` (script) → calcule le HT/TVA/TTC d'une facture avec promo
- `summarize-month` (script) → agrège un mois de factures (top clients, TVA à reverser)
- `detect-overdue` (script) → liste les impayés avec sévérité
- `format-monthly-report` (prose) → rédige le rapport client en français

### 2. `task-journal` (sans script, pure doctrine)
- Clôture propre d'une conversation
- Écrit un récap PM-style dans `docs/journal/YYYY-MM.md`

## Comment invoquer un skill

Claude Code charge automatiquement les skills du dossier `.claude/skills/` et lit leur `description`. Deux modes :

### Mode auto
"Résume-moi les factures de juin" → devrait matcher `accounting.summarize-month`.

### Mode explicite (préféré si l'auto rate)
"Utilise le skill accounting pour résumer juin 2026."

## Règles métier critiques (à NE JAMAIS casser)

1. **Aucun calcul de TVA inline** — toujours passer par `accounting/scripts/calculate-invoice`.
2. **La remise s'applique sur le HT AVANT la TVA** (règle fiscale française).
3. **Les taux de TVA vivent dans `config/tva.ts`** — jamais hardcodés.
4. **La date d'entrée journal = date de la tâche**, pas date système.
5. **Ne JAMAIS inventer une valeur métier** (montant, email, code promo). Si ça manque, on demande.

## Conventions de code

- Nommage fichiers : kebab-case
- Nommage variables : camelCase
- TypeScript strict activé, pas de `any`, pas de `// @ts-ignore`
- Un fichier = une responsabilité, max 250 lignes
- Imports relatifs avec l'extension `.js` (car ESM + tsx)

## Anti-patterns (les 7 commandements ingé)

1. ❌ Big bang refacto — pas de coexistence, on remplace, on nettoie, on commit.
2. ❌ No stub / no TODO — si commité, ça marche.
3. ❌ No silent fail — pas de `try/catch` qui avale une erreur.
4. ❌ No revert — corriger forward.
5. ❌ No god file — >250 lignes = découpe.
6. ❌ No magic number — valeurs dans `config/`.
7. ❌ No vibe-prompt — prompt précis ou pas de prompt.

## Commandes utiles

```bash
pnpm install
pnpm test                                              # tous les tests skills
pnpm typecheck                                         # vérifie les types
pnpm cli:summary fixtures/invoices-2026-06.json 2026-06
pnpm cli:overdue fixtures/invoices-2026-06.json 2026-07-15
pnpm cli:invoice fixtures/invoices-2026-06.json INV-2026-06-001
```

## Où va quoi

| Dossier | Contenu |
|---|---|
| `.claude/skills/` | Les 2 skills (accounting + task-journal) |
| `.claude/skills/accounting/sessions/` | Logs runtime des scripts (auditabilité) |
| `fixtures/` | Données de test (25 factures fictives) |
| `docs/journal/` | Cible d'écriture du skill task-journal (YYYY-MM.md) |

## Ressources externes

- Repo workshop : https://github.com/Manapyzz/iim-project
- Template CLAUDE.md générique : https://github.com/Manapyzz/iim-project/blob/main/jour-2/template-claude-md.md
