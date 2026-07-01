# Jour 3 — Skills

Passage de la théorie et du cadrage (J1, J2) à la construction de vrais skills utilisables en production.

## Programme

1. Récap J2 : cadrage, scripts déterministes, gates humains.
2. Modèle + harness = agent. Ce qu'est vraiment Claude Code.
3. SKILL + contexte + objectif = un agent au sens ingénierie (recette TPB).
4. Anatomie d'un skill : SKILL.md, scripts, config, prose, sessions.
5. Le SSS Framework : SKILL.md + Scripts + Sessions.
6. WLGW (What LLMs Get Wrong) : la table d'anti-patterns qui fait grandir un skill.
7. Tier de maturité : DRAFT, OPERATIONAL, PROVEN.
8. Mono-agent vs multi-agent orchestré : pourquoi TPB préfère mono-agent.
9. Démo live : `demo-accounting-app` avec 2 skills (accounting + task-journal).

## Concepts clés à retenir

- **Un skill = une doctrine**. Le SKILL.md décrit quoi, quand, pourquoi. Sans doctrine claire, le LLM improvise.
- **Un skill peut être 100 % prose**, avec ou sans script. Un skill sans script (`task-journal`) est parfaitement valide.
- **Le LLM décide, le script exécute, la session logue.** Trois responsabilités, trois endroits.
- **Config vs code.** Les taux, seuils, secrets vivent dans `config/`. Zéro magic number.
- **WLGW à jour.** Chaque plantage observé devient un anti-pattern ajouté au SKILL.md. Le skill grandit avec l'usage.
- **Auto-detection dépend de la `description`.** Une description précise déclenche le skill au bon moment. Une description floue le rend invisible.

## Projet démo utilisé en cours

Repo : [`iim-examples/demo-accounting-app`](../iim-examples/demo-accounting-app/)

Deux skills chargés dans le même projet :
- `accounting` : skill mixte (3 scripts déterministes + 1 prose LLM pour le rapport, 31 tests verts).
- `task-journal` : skill 100 % prose, aucun code.

Structure à observer :

```
demo-accounting-app/
├── .claude/skills/
│   ├── accounting/
│   │   ├── SKILL.md
│   │   ├── scripts/     (calculate-invoice, summarize-month, detect-overdue + tests)
│   │   ├── config/      (tva, promo-codes, overdue-thresholds)
│   │   ├── prose/       (format-monthly-report.md)
│   │   └── sessions/    (log.jsonl par mois)
│   └── task-journal/
│       └── SKILL.md
├── fixtures/            (25 factures fictives IIMPACT)
└── CLAUDE.md
```

## À appliquer avant la soutenance J4

Chaque étudiant doit avoir, dans son propre projet :

- Un dossier `.claude/skills/` avec au moins deux skills définis : un skill transverse (par exemple `task-journal`, `doc-writer`, `meeting-notes`) et un skill métier propre à son appli.
- Un `SKILL.md` par skill, avec la description qui déclenche l'auto-detection.
- Un `CLAUDE.md` à la racine du projet avec les règles applicables partout.
- Une capacité à raconter chaque choix : pourquoi ce skill, pourquoi ce script, pourquoi cette config.

Consignes complètes de la soutenance : [`../jour-4/soutenances-consignes.md`](../jour-4/soutenances-consignes.md).

## Ressources

- Slides du jour : `slides/src/J3Slides.tsx` (déployées sur le site du workshop).
- Verbatim du déroulé : [`notes-deroule-j3.md`](./notes-deroule-j3.md).
- Checklist de test de la démo : [`notes-test-demo-accounting-app.md`](./notes-test-demo-accounting-app.md).
- Repo démo complet : [`../iim-examples/demo-accounting-app/`](../iim-examples/demo-accounting-app/).
