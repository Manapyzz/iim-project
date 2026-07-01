# demo-accounting-app

> Démo J3 workshop IIM — un projet qui charge et utilise **deux skills** : `accounting` (mixte : scripts + prose) et `task-journal` (sans script).

## Ce que ça illustre

- Un projet Claude Code réel a un dossier `.claude/skills/` qui contient les capacités du LLM.
- Un skill **avec script** = doctrine (SKILL.md) + code testable + logs.
- Un skill **sans script** = pure doctrine que le LLM applique par lui-même.
- Les scripts loguent dans `sessions/` — auditabilité complète.
- Chaque exécution d'un script du skill `accounting` append une ligne dans `.claude/skills/accounting/sessions/YYYY-MM/log.jsonl`.

## 🎯 Les 2 skills chargés dans ce projet

Ce projet illustre **deux skills complémentaires** dans le même `.claude/skills/` :

### 1. Skill `accounting` — MIXTE (scripts + prose)

Compta light : calcul de facture, résumé mensuel, détection d'impayés, rédaction du rapport client.

### 2. Skill `task-journal` — SANS SCRIPT (pure doctrine)

Clôture propre d'une conversation : écrit un récap PM-style dans `docs/journal/YYYY-MM.md`.

📄 [`.claude/skills/task-journal/SKILL.md`](./.claude/skills/task-journal/SKILL.md) — 100 % prose, aucun code. Le LLM lit la doctrine et applique.

---

## 🎯 Le SSS Framework (pattern TPB) appliqué

Chaque skill mature suit le **SSS Framework**. Voici comment il est incarné dans les 2 skills :

| Lettre | Composant | Skill `accounting` | Skill `task-journal` |
|---|---|---|---|
| **S**KILL.md | Doctrine : WHAT · WHEN · HOW + WLGW | [`accounting/SKILL.md`](./.claude/skills/accounting/SKILL.md) | [`task-journal/SKILL.md`](./.claude/skills/task-journal/SKILL.md) |
| **S**CRIPTS | Logique déterministe testée | [`accounting/scripts/`](./.claude/skills/accounting/scripts/) — 3 scripts + tests | ❌ pas de script (skill 100 % prose) |
| **S**ESSIONS | Logs d'exécution auditables | `accounting/sessions/YYYY-MM/log.jsonl` | ❌ pas de logs (pas d'exécution scriptée) |

→ **Pédagogie forte** : un skill SANS script (task-journal) n'a pas besoin des 3 S — il n'a que le S de SKILL.md. C'est OK, c'est même préféré quand la capacité est purement rédactionnelle. Le SSS Framework est un modèle de MATURITÉ, pas une obligation.

En plus des 3 S, `accounting` utilise :
- `config/` — SSOT pour taux, seuils, codes promo (pas de magic number)
- `prose/` — doctrine LLM pour la rédaction du rapport

**Les 3 règles de maturité TPB appliquées aux 2 skills** :
1. **Tier** — `OPERATIONAL` en début de description dans les 2 SKILL.md
2. **Sessions logs** — appliqué à `accounting` (skill avec scripts) ; sans objet pour `task-journal` (pas de scripts)
3. **What LLMs Get Wrong** — table AP1 → AP6 dans `accounting/SKILL.md`, AP1 → AP6 aussi dans `task-journal/SKILL.md`

## Le scénario fictif

Une association étudiante appelée **IIMPACT** (fictive, clin d'œil au projet de Thomas) gère ses factures. Elle vend des tickets d'event, des goodies, des adhésions. Le trésorier veut :
1. Émettre une facture propre (avec TVA + code promo éventuel)
2. Voir le bilan financier de fin de mois (encaissé, TVA à reverser, top clients)
3. Détecter les impayés (avec période de tolérance graduée)
4. Rédiger le rapport mensuel pour le bureau

## Setup

```bash
pnpm install
pnpm test        # → 25+ tests verts sur les 3 scripts déterministes
pnpm typecheck   # → 0 erreur TypeScript
```

## Démo en ligne de commande

### 1. Calculer une facture individuelle

```bash
pnpm cli:invoice fixtures/invoices-2026-06.json INV-2026-06-010
```
Sortie (extrait) :
```json
{
  "ht": 800,
  "discount": 240,
  "htAfterDiscount": 560,
  "tva": 112,
  "ttc": 672,
  ...
}
```
→ Une facture de 800 € HT avec `BLACKFRIDAY -30 %` = 240 € de remise, TVA sur le HT remisé (règle fiscale FR).

Ou en calcul inline :
```bash
pnpm cli:invoice --amount 150 --tva standard --promo WELCOME10
```

### 2. Résumer un mois de factures

```bash
pnpm cli:summary fixtures/invoices-2026-06.json 2026-06
```
Sortie (extrait) :
```json
{
  "month": "2026-06",
  "count": 25,
  "countPaid": 17,
  "countUnpaid": 8,
  "totalHt": 3200,
  "totalTva": 570,
  "totalTtc": 3770,
  "topClients": [
    {"name": "Louis Martin", "totalTtc": 250, "invoices": 4},
    ...
  ],
  ...
}
```

### 3. Détecter les impayés à une date donnée

```bash
pnpm cli:overdue fixtures/invoices-2026-06.json 2026-07-15
```
Sortie (extrait) :
```json
[
  {
    "invoiceId": "INV-2026-06-003",
    "clientName": "Sophie Leclerc",
    "amountTtc": 48,
    "daysOverdue": 27,
    "severity": "warning"
  },
  ...
]
```

## Démo dans Claude Code

Lance Claude Code dans ce dossier :

```bash
claude
```

Les 2 skills sont chargés depuis `.claude/skills/`. Essaie ces prompts :

- **Mode auto-detect** :
  > *« Résume-moi les factures de juin 2026. »*

- **Mode explicite (préféré en prod)** :
  > *« Utilise le skill accounting pour préparer le rapport mensuel de juin 2026, puis lance detect-overdue pour lister les retards à la date du 15 juillet. Rédige ensuite le rapport en suivant `prose/format-monthly-report.md`. »*

- **Clôture avec task-journal** :
  > *« Clôture cette conversation avec task-journal. »*
  → Claude écrit un récap PM-style dans `docs/journal/YYYY-MM.md`.

## Structure du projet

```
demo-accounting-app/
├── .claude/skills/
│   ├── accounting/                          skill mixte (scripts + prose)
│   │   ├── SKILL.md                         doctrine + WHY + AP
│   │   ├── scripts/                         🟠 déterministes
│   │   │   ├── calculate-invoice.ts + .test
│   │   │   ├── summarize-month.ts + .test
│   │   │   ├── detect-overdue.ts + .test
│   │   │   ├── log.ts                       helper sessions
│   │   │   └── types.ts
│   │   ├── config/                          valeurs (pas de magic number)
│   │   │   ├── tva.ts
│   │   │   ├── promo-codes.ts
│   │   │   └── overdue-thresholds.ts
│   │   ├── prose/                           🔵 doctrine LLM
│   │   │   └── format-monthly-report.md
│   │   └── sessions/                        📝 logs runtime
│   └── task-journal/                        skill SANS script
│       └── SKILL.md
├── fixtures/
│   └── invoices-2026-06.json                25 factures fictives
├── docs/journal/                            cible task-journal
├── CLAUDE.md                                règles projet (lu auto)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Points pédagogiques à faire ressortir en classe

1. **`description` du skill** = LE truc qui déclenche (ou non) l'auto-detection.
2. **Pattern mixte** : dans `accounting`, 3 scripts déterministes + 1 prose LLM cohabitent. Chacun sa responsabilité.
3. **Config vs code** : les taux TVA sont dans `config/`, pas dans le calcul. Zéro magic number.
4. **Sessions logs** = auditabilité. Après une démo en classe, ouvrir `.claude/skills/accounting/sessions/` et montrer les traces.
5. **"What LLMs get wrong"** dans le SKILL.md = mécanisme d'auto-apprentissage. Chaque erreur observée → un AP nouveau. Le skill grandit.
6. **Task-journal sans script** = tous les skills n'ont pas besoin de code. Parfois c'est juste une doctrine bien cadrée.
