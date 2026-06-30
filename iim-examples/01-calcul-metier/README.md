# Demo 01 — Calcul Metier

> **Pattern enseigne** : extraire le calcul metier en script deterministe pur, teste, hors LLM.

## Le cas

Calcul de prix d'un panier e-commerce francais :
- Montant HT
- TVA (standard 20 % / reduit 10 % / super-reduit 5,5 %)
- Code promo optionnel : `WELCOME10`, `STUDENT20`, `BLACKFRIDAY` (-30 % si HT >= 100 EUR)
- Remise plafonnee a 50 % du HT

## Pourquoi cette demo

Sans cadrage, Claude va :
- Hardcoder un taux TVA (souvent **19,6 %** — l'ancien taux d'avant 2014 — c'est l'hallu classique)
- Coller le calcul dans un composant React
- Oublier l'arrondi a 2 decimales
- Inventer des codes promo qui n'existent pas
- Ne jamais ecrire de tests

Avec cadrage, on obtient :
- Un fichier `src/lib/pricing/calculate-price.ts` pur
- Les taux dans `src/config/tva.ts` (source unique)
- 10 tests Vitest qui passent
- Aucune dependance runtime

## Comment jouer la demo

```bash
cd 01-calcul-metier
pnpm install
pnpm test           # 10 tests verts
pnpm typecheck      # 0 erreur TS
```

## Lecture pedagogique

3. Lire [`CLAUDE.md`](./CLAUDE.md) — le cadre projet.
4. Lire le code : [`src/config/tva.ts`](./src/config/tva.ts) puis [`src/lib/pricing/calculate-price.ts`](./src/lib/pricing/calculate-price.ts).
5. Lire les tests : [`src/lib/pricing/calculate-price.test.ts`](./src/lib/pricing/calculate-price.test.ts).
