---
name: accounting
description: >
  OPERATIONAL — Toolkit de comptabilité light pour une PME ou une association.
  Calcule les factures françaises (TVA standard/reduit/super-reduit + codes promo),
  résume les factures d'un mois donné (encaissé, TVA à reverser, top clients),
  détecte les impayés avec sévérité graduée, et rédige un rapport mensuel en
  français pour le bureau/la direction.
  Utiliser quand : émettre une facture, préparer un bilan de fin de mois,
  identifier les retards de paiement, rédiger un rapport financier lisible
  pour une AG ou un client. Ne PAS utiliser pour de la compta analytique,
  de la TVA UE cross-border, de la facturation récurrente automatisée
  ou de l'intégration bancaire — hors scope.
---

> **Tier**: OPERATIONAL · **Domain**: finance / accounting · **Pattern**: mixte (scripts déterministes + prose LLM)

# Accounting — comptabilité light

## WHY

Toute app qui gère de l'argent doit exposer les mêmes 4 capacités : calculer une facture, résumer un mois, détecter les impayés, rédiger un rapport lisible. Sans skill, chaque feature réinvente son calcul de TVA (voir les hallucinations classiques : 19,6 % au lieu de 20 %, remise appliquée sur TTC au lieu de HT, etc.). Ce skill centralise tout ça.

## SCOPE

### Couvert
- Facturation France : TVA standard (20 %), réduit (10 %), super-réduit (5,5 %)
- Codes promo simples avec plafond de remise à 50 %
- Bilan mensuel : totaux HT/TVA/TTC, top 5 clients, répartition par TVA
- Détection d'impayés avec période de tolérance graduée selon le montant
- Rédaction d'un rapport client/bureau en prose

### PAS couvert (out of scope)
- Extraction PDF → JSON (à faire par un autre skill amont)
- Compta analytique / centres de coûts
- TVA UE cross-border, exonération, autoliquidation
- Facturation récurrente (abonnements)
- Intégration bancaire / rapprochement

## INPUTS

### Toujours demander le fichier à l'utilisateur

**RÈGLE CARDINALE** : Avant toute exécution, demander à l'utilisateur son fichier de factures. **Ne PAS aller piocher dans `fixtures/` par défaut** — ce dossier existe pour le développement et les tests uniquement.

Formulation type :
> *« Pour faire ta compta, envoie-moi ton fichier de factures (JSON au format `Invoice`). Tu peux aussi pointer un chemin existant si tu l'as déjà sur disque. »*

Si l'utilisateur ne sait pas quel format fournir, expliquer le format `Invoice` ci-dessous et proposer :
1. Le poser en JSON (schéma ci-dessous)
2. Si c'est un CSV : proposer un script d'import à écrire (out of scope de ce skill)
3. Si c'est un PDF : renvoyer vers `pdf-invoice-extractor` (skill séparé à créer si besoin)

### Format Invoice

Les scripts consomment des **factures JSON** au format `Invoice` (voir `scripts/types.ts`). L'extraction depuis un PDF est **hors scope de ce skill** : c'est le rôle d'un autre skill (par exemple `pdf-invoice-extractor`) que tu chaînes en amont.

Format `Invoice` :
```typescript
{
  id: string;
  issuedAt: string;  // ISO YYYY-MM-DD
  dueAt: string;
  client: { name: string; email: string };
  lines: [{ label, quantity, unitPriceHt, tvaType: 'standard'|'reduit'|'super-reduit' }];
  promoCode?: string;
  paidAt: string | null;
}
```

## HOW TO INVOKE

Deux modes possibles.

### Mode auto (souhaité si la description est précise)
Claude Code lit ma description au démarrage. Face à des demandes utilisateur du type :
- "résume les factures de juin"
- "combien j'ai encaissé ce mois-ci"
- "qui n'a pas payé"
- "rédige-moi le rapport mensuel"
- "calcule cette facture"

il matche et charge ce skill automatiquement. C'est le mode par défaut.

### Mode explicite (fiable, préféré en production)
Si tu n'es pas sûr que l'auto-detection marche (contexte ambigu, session fraîche), invoque directement :
- "utilise le skill accounting pour résumer juin 2026"
- ou lance direct le script : `pnpm tsx scripts/summarize-month.ts fixtures/invoices-2026-06.json 2026-06`

## PROCESS — les 4 capacités

### 1. `calculate-invoice.ts` — calcul unitaire
**Input** : une `Invoice`.
**Output** : `{ ht, discount, htAfterDiscount, tva, ttc, perTvaType }`.
**Règle métier critique** : la remise s'applique sur le HT AVANT calcul de la TVA (règle fiscale française). C'est ce que Claude confond souvent. Le script le fait correctement.

CLI :
```bash
pnpm cli:invoice fixtures/invoices-2026-06.json INV-2026-06-001
# ou
pnpm cli:invoice --amount 150 --tva standard --promo WELCOME10
```

### 2. `summarize-month.ts` — bilan mensuel
**Input** : `Invoice[]` + mois `YYYY-MM`.
**Output** : `MonthSummary` (totaux, top clients, répartition TVA, payé vs impayé).

CLI :
```bash
pnpm cli:summary fixtures/invoices-2026-06.json 2026-06
```

### 3. `detect-overdue.ts` — impayés
**Input** : `Invoice[]` + date de référence.
**Output** : `OverduePayment[]` trié par retard descendant, avec sévérité `warning` ou `critical` (> 30 j).
**Règle** : période de tolérance graduée selon le montant TTC (voir `config/overdue-thresholds.ts`).

CLI :
```bash
pnpm cli:overdue fixtures/invoices-2026-06.json 2026-07-15
```

### 4. `prose/format-monthly-report.md` — rédaction du rapport (sans script)
**Input** : résultat de `summarize-month` + `detect-overdue`.
**Output** : rapport en français, prose structurée (voir la doctrine complète dans `prose/format-monthly-report.md`).
**C'est le LLM qui rédige** — pas de script. Le fichier prose est LA doctrine à suivre à la lettre.

## SESSIONS

Chaque exécution des 3 scripts déterministes appende une ligne JSON dans `sessions/YYYY-MM/log.jsonl`. Format :
```json
{"timestamp":"2026-07-15T12:00:00Z","script":"summarize-month","input":{...},"output":{...}}
```

Pattern TPB : le SKILL décide (probabiliste), le script exécute (déterministe), la session logue (auditabilité). Consulter `sessions/` permet de retracer ce qui a été calculé quand, sans avoir à rejouer.

## WHAT LLMs GET WRONG (auto-apprentissage)

Chaque anti-pattern rencontré en vrai devient un AP ici. Ce skill grandit à chaque plantage.

| # | AP | BAD | GOOD | Why |
|---|---|---|---|---|
| AP1 | **TVA hardcodée** | `total = amount * 1.196` | `import { TVA_RATES } from '../config/tva.js'` | 19,6 % est l'ancien taux (avant 2014). Le taux vit dans la config, jamais dans le calcul. |
| AP2 | **Remise sur TTC** | `total * 0.9` après TVA | Remise sur HT AVANT TVA (règle fiscale FR) | La règle française : le client paie une TVA sur le HT REMISÉ, pas sur le HT plein. |
| AP3 | **LLM qui calcule au lieu d'appeler** | Claude "calcule" 150 × 1,20 = 180 en texte | Claude invoque `calculate-invoice()` | Le LLM n'est PAS un calculateur fiable. Un script testé le fait. |
| AP4 | **Rapport monolithique** | 1 script qui fait calcul + résumé + rapport | 3 scripts + 1 prose, chacun sa responsabilité | Single Responsibility appliqué aux skills. Testable, réutilisable. |
| AP5 | **Inventer une valeur manquante** | Claude complète un email vide par "n/a" | Refuse d'exécuter, demande la donnée | Ne jamais fabriquer une donnée pour un système externe (règle TPB). |
| AP6 | **Auto-detection foireuse** | Skill ne se charge pas quand l'user demande "combien" | Fallback : l'user tape "utilise skill accounting" | La description doit être précise. Si l'auto-detection rate, invoquer explicitement. |
| AP7 | **Piocher `fixtures/` sans demander** | Claude lance `pnpm cli:summary fixtures/invoices-2026-06.json` sans confirmer | Toujours demander à l'utilisateur son fichier de factures d'abord. `fixtures/` = dev/test uniquement. | L'utilisateur a SES données. Le repo contient des exemples de dev. Un skill mature ne substitue jamais l'un à l'autre en silence. |

## VALIDATION

Le skill est valide si :
- [ ] `pnpm test` retourne 100 % vert
- [ ] `pnpm cli:summary fixtures/invoices-2026-06.json 2026-06` sort un JSON structuré
- [ ] `pnpm cli:overdue fixtures/invoices-2026-06.json 2026-07-15` liste les impayés
- [ ] Le rapport rédigé par le LLM respecte le format `prose/format-monthly-report.md`
- [ ] `sessions/YYYY-MM/log.jsonl` contient une ligne par exécution

## Références

- Config valeurs : `config/tva.ts`, `config/promo-codes.ts`, `config/overdue-thresholds.ts`
- Types partagés : `scripts/types.ts`
- Logs runtime : `sessions/YYYY-MM/log.jsonl`
- Doctrine de rédaction : `prose/format-monthly-report.md`
