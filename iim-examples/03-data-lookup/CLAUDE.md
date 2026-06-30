# Demo 03 — Data Lookup — Notes pour Claude

## Pitch

Lookup determine code postal -> ville (France). Sert d'exemple pedagogique : eviter les hallucinations en mettant les donnees dans un fichier JSON et en obligeant Claude a les LIRE, sans jamais inventer.

## Stack technique

- **Langage** : TypeScript 5.x strict
- **Runtime** : Node.js 20+
- **Tests** : Vitest
- **Package manager** : pnpm
- **Donnees** : `data/postal-codes.json` (30 entrees)

## Regle metier critique (a NE JAMAIS casser) — REGLE D'OR

> **Si un code postal n'est PAS dans `data/postal-codes.json`, la fonction renvoie `null`.**
> **JAMAIS de devinette, JAMAIS d'invention, JAMAIS de fallback "Ville inconnue", JAMAIS de "j'ai deduit d'apres les deux premiers chiffres".**

Cette regle est non-negociable. C'est l'essence meme de ce projet.

## Regles complementaires

1. Le format attendu est **exactement 5 chiffres ASCII** (regex `^\d{5}$`). Tout autre format => `throw`.
2. La table `POSTAL_TABLE` est **chargee une fois** depuis `data/postal-codes.json` et traitee comme immutable.
3. Toute extension de la table => modifier `data/postal-codes.json`, JAMAIS ajouter en dur dans le code TS.
4. Aucun appel reseau, aucune base de donnees, aucune API tierce.

## Conventions de code

- **Nommage fichiers** : kebab-case (`get-city.ts`)
- **Nommage variables** : camelCase
- **Pas de `any`**. Pas de `// @ts-ignore`.
- **Pas de `try/catch` silencieux**.
- **Un fichier = une responsabilite**. Max 250 lignes.
- **Imports relatifs avec extension `.js`** (ESM strict).

## Scripts deterministes a appeler

- `src/lib/postal/get-city.ts` → `getCity(postalCode)` : seule porte d'entree pour resoudre un code postal.
- `listKnownPostalCodes()` → utile pour generer un autocomplete ou debugger.
- `data/postal-codes.json` → source unique des donnees. JAMAIS dupliquee.

## Anti-patterns SPECIFIQUES au projet — INTERDITS ABSOLUS

- Ne JAMAIS retourner une ville inventee pour un code absent.
- Ne JAMAIS faire un fallback type `return { city: "Ville inconnue", ... }` ou `return { city: "France", ... }`.
- Ne JAMAIS deviner une ville d'apres les 2 premiers chiffres (departement).
- Ne JAMAIS appeler le LLM pour completer la table de codes postaux.
- Ne JAMAIS hardcoder une entree dans le `.ts` (toujours `.json`).

Si un code manque, c'est `null`. Point. Le caller decide ce qu'il en fait (afficher "Code inconnu", proposer une recherche manuelle, etc.).

## Anti-patterns d'INGENIERIE (les 7 commandements transverses)

1. **Big bang refacto** : pas de feature flag, pas de coexistence.
2. **No stub / no TODO** : pas de `return null; // TODO`.
3. **No silent fail** : pas de `try/catch` qui avale.
4. **No revert** : on corrige forward.
5. **No god file** : >250 lignes = decoupe.
6. **No magic number** : valeurs business → config ou data.
7. **No vibe-prompt** : prompt precis ou pas de prompt.

## Commandes utiles

- `pnpm install`
- `pnpm test`
- `pnpm test:watch`
- `pnpm typecheck`

## Fichiers de reference

