# Demo 04 — Gates (pre-commit anti-dette)

> **Pattern enseigne** : empecher la dette d'arriver dans le repo via un hook pre-commit deterministe.

## Le cas

Deux fichiers identiques en intention, opposes en qualite :
- `src/bad-code.ts` — un god file de 300+ lignes plein de TODO, try/catch silencieux, magic numbers, stubs
- `src/good-code.ts` — la version refactoree : config separee, fonctions petites, erreurs explicites, source unique

Et un linter `scripts/lint-dette.sh` qui :
- Detecte les TODO restants
- Detecte les `try/catch` silencieux
- Detecte les magic numbers business
- Detecte les stubs (`return 0; // TODO`)
- Detecte les god files (> 250 lignes)
- Sort code 1 si dette detectee → bloque le commit

## Pourquoi cette demo

Sans gate, meme avec un beau CLAUDE.md et de beaux scripts, la dette **revient**. Un PR oublie une regle, un dev presse copie-colle du code de prod, un agent LLM fait un stub "temporaire".

Avec une gate pre-commit deterministe :
- Le code endette ne passe meme pas `git commit`.
- Le scanner ne juge pas — il **mesure**. Zero LLM, juste des regex.
- Le repo reste sain. La dette ne s'accumule plus en silence.

## Comment jouer la demo

Voir [`DEMO.md`](./DEMO.md) — script minute par minute pour la classe.

```bash
cd 04-gates-demo
pnpm install

# 1. Scan du fichier endette : explose volontairement
pnpm lint:dette
# → KO — N probleme(s) detecte(s)

# 2. Scan du fichier propre uniquement
bash scripts/lint-dette.sh src/good-code.ts
# → OK — aucune dette detectee

# 3. Brancher le hook git (optionnel pour la demo)
pip install pre-commit
pre-commit install
git commit -m "test"  # → REFUSE par le hook
```

## Lecture pedagogique

1. [`DEMO.md`](./DEMO.md) — script de la demo en classe
2. [`CLAUDE.md`](./CLAUDE.md) — le cadre projet
3. [`src/bad-code.ts`](./src/bad-code.ts) — le code volontairement endette
4. [`src/good-code.ts`](./src/good-code.ts) — la version refactoree
5. [`scripts/lint-dette.sh`](./scripts/lint-dette.sh) — le scanner deterministe
6. [`.pre-commit-config.yaml`](./.pre-commit-config.yaml) — le hook git
