# iim-examples — Demos pour le J2 du workshop Claude Code

Depot d'exemples pedagogiques pour le **Jour 2 — Cadrage** du workshop Claude Code a l'IIM (M1 IWID).

> Repo principal du workshop : https://github.com/Manapyzz/iim-project

---

## C'est quoi ce depot ?

4 mini-projets TypeScript independants, chacun illustrant **un pattern de cadrage** different pour empecher Claude Code de produire de la dette technique IA.

Chaque projet est :
- Auto-suffisant (`pnpm install && pnpm test`)
- Equipe d'un `CLAUDE.md` adapte
- Couvert par des tests Vitest

---

## Les 4 patterns

| Demo | Pattern | Cas d'usage |
|---|---|---|
| [01-calcul-metier/](./01-calcul-metier/) | **Calcul Metier deterministe** | Calcul de prix HT/TVA/promo |
| [02-state-machine/](./02-state-machine/) | **Machine d'etat explicite** | Cycle de vie d'une commande e-commerce |
| [03-data-lookup/](./03-data-lookup/) | **Data lookup anti-hallu** | Recherche ville par code postal francais |
| [04-gates-demo/](./04-gates-demo/) | **Gates pre-commit** | Hook qui refuse le code endette |

---

## Le fil rouge pedagogique

Les 4 patterns s'enchainent comme une fortification :

```
[CLAUDE.md]               ← demo 1, 2, 3 ont chacun le leur
     ↓
[CALCUL DETERMINISTE]     ← demo 1 : le LLM n'invente plus le calcul
     ↓
[MACHINE D'ETAT]          ← demo 2 : le LLM ne peut plus violer le flow
     ↓
[DATA LOOKUP]             ← demo 3 : le LLM ne peut plus inventer une donnee
     ↓
[GATES]                   ← demo 4 : si dette malgre tout, le repo refuse
```


---

## Comment jouer une demo

```bash
cd 01-calcul-metier
pnpm install
pnpm test           # tests Vitest
pnpm typecheck      # verification TS
```

Meme protocole pour `02-state-machine`, `03-data-lookup`.

Pour la demo 4 (gates) :

```bash
cd 04-gates-demo
pnpm install
pnpm lint:dette                 # scan : KO (bad-code.ts est endette)
bash scripts/lint-dette.sh src/good-code.ts  # scan ciblé : OK
```

Voir [`04-gates-demo/DEMO.md`](./04-gates-demo/DEMO.md) pour le script minute par minute en classe.

---

## Stack technique commune

- **Langage** : TypeScript 5.x strict (`"strict": true`, `"noUncheckedIndexedAccess": true`)
- **Runtime** : Node.js 20+
- **Tests** : Vitest
- **Package manager** : pnpm (mais `npm` fonctionne aussi)
- **Aucune dependance runtime** : tout est local, pas de DB, pas d'API

---

## Comment lire le repo dans l'ordre

Pour quelqu'un qui decouvre :

1. Ce `README.md` (tu y es)
5. [04-gates-demo/README.md](./04-gates-demo/README.md) puis [DEMO.md](./04-gates-demo/DEMO.md)

---

## Pour les etudiants

Vous pouvez :
- Cloner ce repo en local
- Forker pour faire vos propres versions
- Reutiliser les patterns dans vos projets perso

Les 4 `CLAUDE.md` sont des **templates concrets** que vous pouvez adapter — pas du contenu abstrait. Lisez-les en parallele du code.

---

## Pour le formateur

Le timing en classe (J2, apres-midi 13h30-14h00) :
- Demo 1 (calcul-metier) : 7 min
- Demo 2 (state-machine) : 7 min
- Demo 3 (data-lookup) : 7 min
- Demo 4 (gates) : 8-10 min (avec branchement pre-commit live)

Total : ~30 min de demos enchaainees. enchainees pendant le bloc Scripts du matin J2.
