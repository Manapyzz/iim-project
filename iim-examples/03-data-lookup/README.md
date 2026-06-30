# Demo 03 — Data Lookup (anti-hallucination)

> **Pattern enseigne** : eviter les hallucinations en stockant les donnees dans des fichiers et en obligeant Claude a les LIRE — jamais a les inventer.

## Le cas

Recherche d'une ville francaise par code postal :
- Input : code postal au format `5 chiffres`
- Output : `{ city, department, region }` si trouve, `null` sinon
- Source : `data/postal-codes.json` (30 entrees : 20 arrondissements de Paris + 10 grandes villes)

## Pourquoi cette demo

Sans cadrage, Claude va :
- Inventer une ville si elle lui semble "plausible"
- Confondre Lyon (69) avec Limoges (87)
- Te retourner "Saint-Etienne" pour `42000` "par culture generale" alors que ce code n'est pas dans tes donnees
- Faire un fallback `{ city: "France" }` pour passer les tests

Avec cadrage, on obtient :
- Une fonction `getCity(postalCode)` qui ne lit QUE le JSON
- `null` strict pour tout code absent (jamais d'invention)
- `throw` si format invalide (pas 5 chiffres)
- 14 tests Vitest qui verifient happy paths, absences, et formats invalides

## Comment jouer la demo

```bash
cd 03-data-lookup
pnpm install
pnpm test           # 14 tests verts
pnpm typecheck      # 0 erreur TS
```

## Lecture pedagogique

3. [`CLAUDE.md`](./CLAUDE.md) — la regle d'or interdiction-d'inventer
4. [`data/postal-codes.json`](./data/postal-codes.json) — la source de verite
5. [`src/lib/postal/get-city.ts`](./src/lib/postal/get-city.ts) — la fonction lookup
6. [`src/lib/postal/get-city.test.ts`](./src/lib/postal/get-city.test.ts) — les tests
