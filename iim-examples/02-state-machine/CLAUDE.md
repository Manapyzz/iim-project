# Demo 02 — State Machine — Notes pour Claude

## Pitch

Machine d'etat explicite pour le cycle de vie d'une commande e-commerce. Sert d'exemple pedagogique : le LLM ne peut pas inventer de transition illegale parce que la table de transitions est la source unique de verite.

## Stack technique

- **Langage** : TypeScript 5.x strict
- **Runtime** : Node.js 20+
- **Tests** : Vitest
- **Package manager** : pnpm
- **Aucune dependance runtime** — c'est une lib pure.

## Regles metier critiques (a NE JAMAIS casser)

1. Les **7 etats** sont : `cart | pending | confirmed | shipped | delivered | cancelled | refunded`. JAMAIS un etat invente ailleurs.
2. Les **transitions legales** sont definies dans `TRANSITIONS` dans `src/lib/order-state/order-machine.ts`. Aucune transition n'existe en dehors de cette table.
3. `cancelled` et `refunded` sont des **etats terminaux** : aucun event n'en sort.
4. La fonction `transition()` **NE THROW PAS** : elle renvoie un `TransitionResult` discriminant (`ok: true | false`). L'appelant DOIT gerer le cas d'erreur.
5. Aucun **setState libre** nulle part dans le code. Toute mutation d'etat passe par `transition()`.
6. Tout nouvel etat ou nouvel event => mise a jour de **types.ts ET de la table** dans le meme commit. JAMAIS l'un sans l'autre.

## Conventions de code

- **Nommage fichiers** : kebab-case (`order-machine.ts`)
- **Nommage variables** : camelCase
- **Pas de `any`**. Pas de `// @ts-ignore`.
- **Pas de `try/catch` silencieux**.
- **Un fichier = une responsabilite**. Max 250 lignes.
- **Imports relatifs avec extension `.js`** (ESM strict).

## Scripts deterministes a appeler

Pour toute manipulation du cycle de vie d'une commande dans ce projet :

- `src/lib/order-state/order-machine.ts` → `transition(currentState, event)` : seule porte d'entree pour faire avancer une commande.
- `legalEventsFrom(state)` → utile pour generer les boutons d'action UI (au lieu de coder en dur "si pending, alors afficher Cancel").
- `isTerminal(state)` → indique si une commande est figee.
- `src/lib/order-state/types.ts` → source unique des `OrderState` et `OrderEvent`.

## Anti-patterns SPECIFIQUES au projet

- Ne JAMAIS faire un `if (order.state === "pending") { order.state = "shipped"; }` quelque part. Toujours `transition()`.
- Ne JAMAIS ajouter un `case "weird_state":` dans un switch sans l'avoir ajoute a `OrderState` ET a la table de transitions.
- Ne JAMAIS demander au LLM "quel est le prochain etat ?". Le LLM appelle `transition()` et lit le resultat.
- Ne JAMAIS implementer une transition en parallele dans une route API "pour gagner du temps". Source unique : `order-machine.ts`.

## Anti-patterns d'INGENIERIE (les 7 commandements transverses)

1. **Big bang refacto** : pas de feature flag, pas de coexistence. Remplace, nettoie, commit.
2. **No stub / no TODO** : pas de `return null; // TODO`. Si commite, ca MARCHE.
3. **No silent fail** : pas de `try/catch` qui avale. Ici on renvoie un `Result` typed, pas de throw cache.
4. **No revert** : on corrige forward.
5. **No god file** : >250 lignes = decoupe.
6. **No magic number** : valeurs business → typage strict + constantes.
7. **No vibe-prompt** : prompt precis ou pas de prompt.

## Commandes utiles

- `pnpm install`
- `pnpm test`
- `pnpm test:watch`
- `pnpm typecheck`

## Fichiers de reference

