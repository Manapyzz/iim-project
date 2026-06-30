# Demo 04 — Gates — Notes pour Claude

## Pitch

Demo des gates pre-commit qui empechent la dette IA d'arriver dans le repo. On a un fichier volontairement endette (`bad-code.ts`) et la version refactoree propre (`good-code.ts`).

## Stack technique

- **Langage** : TypeScript 5.x strict
- **Runtime** : Node.js 20+
- **Hook** : pre-commit (Python) qui lance `scripts/lint-dette.sh`
- **Linter** : appelle le linter principal du repo workshop, ou fallback regex local
- **Package manager** : pnpm

## Regles metier critiques (a NE JAMAIS casser)

1. Tout fichier dans `src/` est scanne par `scripts/lint-dette.sh`. Si la dette > 0, le commit est REFUSE.
2. Le linter est 100 % DETERMINISTE. **Aucun appel LLM** dans le scanner. C'est le coeur du message : on lutte contre la dette IA avec un outil non-IA.
3. La liste des anti-patterns detectes :
   - `TODO` restants
   - `try/catch` silencieux (catch vide ou commentaire "swallow")
   - Magic numbers business (heuristique sur `* 0.X`)
   - Stubs (`return 0; // TODO`)
   - God files (> 250 lignes)
4. Le fichier `bad-code.ts` est PRESERVE volontairement pour la demo. Il fait exploser le linter. C'est attendu. On ne le "corrige" pas.

## Conventions de code

- **Nommage fichiers** : kebab-case
- **Nommage variables** : camelCase
- **Pas de `any`**. Pas de `// @ts-ignore`.
- **Pas de `try/catch` silencieux** dans le code de prod (sauf `bad-code.ts`, demo).
- **Un fichier = une responsabilite**. Max 250 lignes (sauf `bad-code.ts`, demo god file).

## Scripts deterministes a appeler

- `scripts/lint-dette.sh [target_dir]` → wrapper qui delegue au linter principal `lint_dette_ia.py` (ou fallback regex local).
- `.pre-commit-config.yaml` → hook qui bloque les commits endettes.

## Anti-patterns SPECIFIQUES au projet

- Ne JAMAIS "corriger" `bad-code.ts` : il est volontairement endette pour la demo.
- Ne JAMAIS ajouter de logique IA dans le scanner. Regex uniquement.
- Ne JAMAIS desactiver le hook pre-commit "juste pour ce commit" (`--no-verify`). Si le hook bloque, c'est que la dette est reelle.
- Ne JAMAIS dupliquer la liste des anti-patterns ailleurs. Source unique : `lint-dette.sh`.

## Anti-patterns d'INGENIERIE (les 7 commandements transverses)

1. **Big bang refacto** : pas de feature flag, pas de coexistence.
2. **No stub / no TODO** : pas de `return null; // TODO`. (Sauf `bad-code.ts`, demo.)
3. **No silent fail** : pas de `try/catch` qui avale. (Sauf `bad-code.ts`, demo.)
4. **No revert** : on corrige forward.
5. **No god file** : >250 lignes = decoupe. (Sauf `bad-code.ts`, demo.)
6. **No magic number** : valeurs business → config.
7. **No vibe-prompt** : prompt precis ou pas de prompt.

## Commandes utiles

- `pnpm install`
- `pnpm lint:dette` → lance le scan sur `src/`
- `pnpm lint:dette src/good-code.ts` → scan ciblé sur le fichier propre (devrait dire OK)
- `pre-commit install` → branche le hook git
- `pre-commit run --all-files` → test du hook manuellement

## Fichiers de reference

- `DEMO.md` → script de la demo en classe (5 etapes)
- `src/bad-code.ts` → code volontairement endette
- `src/good-code.ts` → version refactoree propre
- `scripts/lint-dette.sh` → le scanner
- `.pre-commit-config.yaml` → le hook
