# Demo 01 — Calcul Metier — Notes pour Claude

## Pitch

Mini-bibliotheque de calcul de prix (HT/TVA/promo) pour un e-commerce francais. Sert d'exemple pedagogique : extraire un calcul metier en script deterministe pur, hors LLM.

## Stack technique

- **Langage** : TypeScript 5.x strict
- **Runtime** : Node.js 20+
- **Tests** : Vitest
- **Package manager** : pnpm
- **Pas de framework** : c'est une lib pure, aucune dependance runtime.

## Regles metier critiques (a NE JAMAIS casser)

1. Les **taux de TVA** vivent dans `src/config/tva.ts`. JAMAIS un taux hardcode dans `calculate-price.ts` ou ailleurs.
2. La **remise s'applique sur le HT, AVANT la TVA**. Pas l'inverse.
3. La **remise est plafonnee a 50 %** du HT (`MAX_DISCOUNT_RATIO`).
4. Le code **BLACKFRIDAY ne s'active que si le HT initial >= 100 EUR**. En dessous, on n'applique simplement pas la remise (pas d'exception).
5. Tout **code promo inconnu => exception**. Pas de fallback silencieux.
6. Tout **montant <= 0 ou taux TVA inconnu => exception**. Pas de `NaN` qui se propage.
7. Les montants en sortie sont **arrondis a 2 decimales** via la helper `round2()`. JAMAIS un `toFixed` direct dans le code metier.

## Conventions de code

- **Nommage fichiers** : kebab-case (`calculate-price.ts`)
- **Nommage variables** : camelCase
- **Pas de `any`**. Pas de `// @ts-ignore`.
- **Pas de `try/catch` silencieux** : si tu attrapes, tu log ou tu re-throw.
- **Un fichier = une responsabilite**. Max 250 lignes.
- **Imports relatifs avec extension `.js`** (ESM strict).

## Scripts deterministes a appeler

Pour tout calcul de prix dans ce projet, **appelle ces fonctions**, ne les reecris JAMAIS :

- `src/lib/pricing/calculate-price.ts` → fonction `calculatePrice(input)` : seule porte d'entree pour calculer un prix HT+TVA+promo. Renvoie un `PriceBreakdown` immutable.
- `src/config/tva.ts` → constantes `TVA_RATES` et `MAX_DISCOUNT_RATIO`. Source unique des taux.

## Anti-patterns SPECIFIQUES au projet

- Ne JAMAIS demander au LLM de calculer un prix, une TVA ou une remise a la volee. Le LLM appelle `calculatePrice`.
- Ne JAMAIS hardcoder `0.20` ou `0.196` (ancien taux !) dans un fichier metier. Toujours `TVA_RATES.standard`.
- Ne JAMAIS dupliquer la liste des codes promo dans un composant UI ou une API route. Source unique : `calculate-price.ts`.
- Ne JAMAIS mettre la logique de calcul dans un composant React. La fonction est pure, isole-la dans `src/lib/pricing/`.

## Anti-patterns d'INGENIERIE (les 7 commandements transverses)

1. **Big bang refacto** : pas de feature flag, pas de coexistence. Tu remplaces, tu nettoies, tu commits.
2. **No stub / no TODO** : pas de `return 0; // TODO`. Si commite, ca MARCHE.
3. **No silent fail** : pas de `try/catch` qui avale. Log ou re-throw.
4. **No revert** : on corrige forward, jamais backward.
5. **No god file** : >250 lignes = decoupe.
6. **No magic number** : taux, plafonds, seuils → `src/config/`.
7. **No vibe-prompt** : prompt precis ou pas de prompt.

## Commandes utiles

- `pnpm install` → installe les dependances
- `pnpm test` → lance les tests Vitest
- `pnpm test:watch` → tests en watch
- `pnpm typecheck` → verifie les types sans emettre

## Fichiers de reference

- `README.md` → presentation de la demo
