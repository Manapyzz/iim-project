# DEMO en classe — Gates pre-commit (15 min)

> Script minute par minute pour la demo n°4 du J2.
> A jouer apres les 3 premieres demos (calcul, machine d'etat, data lookup).

---

## Setup avant la demo (2 min, en silence)

```bash
cd /Users/mnpcorp/mnplab/iim-project/iim-examples/04-gates-demo
pnpm install  # ou : npm install
# verifier que `pnpm lint:dette` existe bien
```

Ouvrir 3 onglets dans le terminal :
1. Projection du code (`bad-code.ts` ouvert dans l'editeur projete)
2. Terminal pour lancer le linter
3. Terminal pour git commit (optionnel)

---

## Etape 1 — Le pitch (1 min)

**Phrase d'ouverture** :
> *"Vous avez vu : CLAUDE.md cadre le LLM, les scripts deterministes execute la logique, le data file empeche les hallu. MAIS — qu'est-ce qui empeche que demain, un PR rapide, un agent qui fait un stub, un copie-colle de Stack Overflow, REINTRODUISENT la dette ?"*

> *"Reponse : une gate. Un mur deterministe en pre-commit qui dit NON."*

---

## Etape 2 — Montrer le mauvais eleve (3 min)

Projette `src/bad-code.ts`. Scrolle. Commente avec bienveillance :

> *"Regardez. 300+ lignes. Un god file. Magic numbers partout (`99.99`, `0.196`, `0.85`). Un `try/catch` qui avale en silence. Un TODO restant. Une fonction stub qui renvoie 0 sans raison. C'est PILE le code que vous avez tous produit hier."*

Pointe specifiquement :
- Ligne avec `// TODO: implement validation`
- Le `catch { /* swallow */ }`
- Le `return 0; // TODO: real calculation`
- Le `* 1.196` (vieux taux TVA)

---

## Etape 3 — Lancer le linter (3 min)

```bash
pnpm lint:dette
```

Le terminal explose en rouge :
```
[TODO] N occurrence(s)
[SILENT_CATCH] N occurrence(s)
[STUB] N occurrence(s)
[GOD_FILE]
    src/bad-code.ts (300+ lignes)
============================================================
  KO — N probleme(s) detecte(s)
============================================================
```

**Phrase clé** :
> *"Ce linter, c'est 50 lignes de bash. ZERO appel LLM. Juste des regex. Vitesse : moins de 100ms. Cout : zero. Et il VOIT TOUT."*

> *"C'est PAS une opinion. C'est PROUVE. Le linter dit : il y a N problemes. Personne ne peut nier."*

---

## Etape 4 — Montrer le bon eleve (2 min)

Projette `src/good-code.ts`. Plus court (< 100 lignes). Pointe :
- La section `BUSINESS_CONFIG` qui centralise les seuils
- Les fonctions petites avec doc claire
- `validateUser` qui renvoie un `ValidationResult` au lieu d'un `try/catch` silencieux
- `applyPromoCode` qui `throw` sur code inconnu (pas de fallback silencieux)

```bash
bash scripts/lint-dette.sh src/good-code.ts
```

Le terminal repasse en vert :
```
============================================================
  OK — aucune dette detectee
============================================================
```

> *"Meme intention metier. Code propre. Linter content."*

---

## Etape 5 — Brancher la gate (4 min)

```bash
pip install pre-commit
pre-commit install
```

Modifie temporairement `src/good-code.ts` pour ajouter un `// TODO: fix later` au hasard. Puis :

```bash
git add src/good-code.ts
git commit -m "test"
```

Le commit est **REFUSE** par le hook :
```
Linter de dette IA (scan deterministe)............Failed
- hook id: lint-dette-ia
- exit code: 1
[TODO] 1 occurrence(s)
```

**Phrase de cloture** :
> *"A partir de maintenant, dans CE repo, si vous essayez de committer du code endette, votre repo le refuse. Pas un humain qui rale en PR. Le repo. Automatique. Silencieux. Inarretable."*

> *"Et c'est PAS une opinion. C'est un fait deterministe."*

> *"VOILA pourquoi on a fait un linter regex et pas un linter LLM : on veut une regle, pas un avis."*

Annule la modif temporaire :
```bash
git checkout src/good-code.ts
```

---

## Punchline finale (30 sec)

> *"Recap des 4 piliers du J2 :"*
> 1. *"**CLAUDE.md** : le LLM applique TES regles, pas son corpus moyen."*
> 2. *"**Calcul deterministe** : le LLM ne calcule pas, il APPELLE."*
> 3. *"**Data lookup** : le LLM ne sait pas, il LIT."*
> 4. *"**Gates** : si malgre tout la dette tente d'entrer, la gate REFUSE."*

> *"Pas un de ces 4 piliers ne suffit. Les 4 ensemble, vous avez un projet IA-sain."*
