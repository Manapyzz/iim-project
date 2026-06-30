# Demo 02 — State Machine

> **Pattern enseigne** : modeliser une machine d'etat explicite que le LLM ne peut pas violer.

## Le cas

Cycle de vie d'une commande e-commerce :

```
cart --(checkout)--> pending --(payment_validated)--> confirmed --(ship)--> shipped --(deliver)--> delivered --(refund)--> refunded
                       |  \--(payment_failed)----------> cancelled
                       \-----(user_cancel)-------------> cancelled
                                                 confirmed --(admin_cancel)--> cancelled
```

7 etats, 8 events, 9 transitions legales. Aucune autre transition n'existe.

## Pourquoi cette demo

Sans cadrage, Claude va :
- Inventer une transition `delivered -> shipped` "au cas ou" l'admin reprend la commande
- Faire un `order.state = "refunded"` direct dans un composant React, sans valider le flow
- Reimplementer la logique de transition dans 3 endroits differents (route API, webhook, UI)
- Oublier les etats terminaux et permettre `cancelled -> shipped`

Avec cadrage, on obtient :
- Une table `TRANSITIONS` qui est la source UNIQUE de verite
- Une fonction `transition(state, event): Result<...>` qui refuse toute transition illegale
- 17 tests Vitest qui couvrent happy paths, cancellation, etats terminaux, events inconnus

## Comment jouer la demo

```bash
cd 02-state-machine
pnpm install
pnpm test           # 17 tests verts
pnpm typecheck      # 0 erreur TS
```

## Lecture pedagogique

3. [`CLAUDE.md`](./CLAUDE.md) — le cadre projet
4. [`src/lib/order-state/types.ts`](./src/lib/order-state/types.ts) — les types
5. [`src/lib/order-state/order-machine.ts`](./src/lib/order-state/order-machine.ts) — la table + la fonction
6. [`src/lib/order-state/order-machine.test.ts`](./src/lib/order-state/order-machine.test.ts) — les 17 tests
