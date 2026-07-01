---
name: task-journal
description: >
  OPERATIONAL — Clôture propre d'une tâche/conversation. Écrit un récap
  "product manager style" (fonctionnel, pas technique) dans
  docs/journal/YYYY-MM.md du projet en cours.
  Utiliser quand : fin de conversation après une tâche complétée, l'utilisateur
  dit "clôture", "fin de journée", "note ce qu'on a fait", ou avant un /clear.
  Pas de script — c'est le LLM lui-même qui rédige et écrit le fichier
  en suivant la doctrine ci-dessous.
---

> **Tier**: OPERATIONAL · **Domain**: productivity / journaling · **Pattern**: sans script (pure doctrine)

# Task Journal — clôture de tâche

## WHY

En fin de conversation, il faut consigner ce qui a été fait. Objectif : préparer les dailies / weeklies / rétros SANS avoir à relire toute la conversation. Un fichier mensuel par mois, une entrée par tâche. Simple, versionnable, lisible.

Ce skill est **sans script** : il ne fait rien de calculable, il rédige. La discipline vient du respect des règles ci-dessous.

## OÙ ÉCRIRE (SSOT)

```
docs/journal/YYYY-MM.md
```

à la racine du projet en cours.

- `YYYY-MM` = année-mois de la **date de la tâche** (voir Étape 0), pas la date système.
- Si le fichier n'existe pas encore, le créer avec le header `# Journal — YYYY-MM`.
- Une seule source de vérité. Pas de recap ailleurs (chat + fichier = à l'identique).

## PROCESS

### Étape 0 — Déterminer la date de la tâche

**JAMAIS** la date système (`date`, `datetime.now()`, `new Date()`).

**Toujours** la date du **dernier message substantiel** de la conversation où la tâche a été faite.

Pourquoi : le skill est souvent exécuté après coup (lundi pour une tâche de vendredi, en batch pour rattraper plusieurs jours). La date système donnerait une mauvaise entrée dans le mauvais fichier mensuel.

Comment la trouver :
1. Regarde le timestamp du dernier message utilisateur substantiel (pas un simple "ok" du lendemain matin).
2. Si la conversation s'étale sur plusieurs jours, prends la date du dernier échange de travail réel.
3. Si impossible à déterminer, **demande à l'utilisateur** — ne devine pas.

Cette date détermine :
- Le fichier mensuel (`YYYY-MM.md`)
- La section jour (`## YYYY-MM-DD`)

### Étape 1 — Rédige le récap dans le chat

Règles impératives :

**Ton** : product manager. L'utilisateur veut comprendre ce qui a été fait, pas comment.

**Longueur** : 3 à 8 phrases. Bullet points uniquement si 3+ livrables distincts.

**INTERDIT** :
- Noms de fichiers, chemins, noms de fonctions
- Extraits de code, noms de variables
- Mots techniques inutiles ("j'ai refactoré le module `AuthService.ts` en cassant `login()`") → au lieu de ça : "j'ai simplifié le flux de connexion"

**OBLIGATOIRE** :
- Mentionner les tests s'ils ont été écrits/modifiés
- Mentionner le déploiement s'il a eu lieu
- Mentionner les régressions corrigées s'il y en a eu
- Décrire en termes fonctionnels : "l'endpoint d'envoi de mail", "la page profil utilisateur", "le moteur de calcul de facture"

### Étape 2 — Écris dans le fichier journal

Append une entrée dans le fichier mensuel identifié à l'Étape 0.

### Format d'une entrée

```markdown
### {titre court fonctionnel — pas technique}

{Le même récap que l'Étape 1, mot pour mot. Un seul SSOT.}
```

### Format du fichier mensuel

```markdown
# Journal — YYYY-MM

---

## YYYY-MM-DD (jour de la semaine)

### {titre tâche 1}

{récap 1}

### {titre tâche 2}

{récap 2}

---

## YYYY-MM-DD-1 (jour de la semaine)

### {...}
```

Règles de placement :
- Sections jour en **ordre ante-chronologique** : le jour le plus récent en haut, juste après le header et le `---`.
- Si le jour existe déjà, ajoute la nouvelle entrée sous les entrées existantes de ce jour.
- Si le jour n'existe pas, crée une nouvelle section jour **au-dessus** des jours précédents.

## VALIDATION

- [ ] Le fichier `docs/journal/YYYY-MM.md` existe (ou a été créé).
- [ ] Le récap du chat = le récap dans le fichier, mot pour mot.
- [ ] Pas de nom de fichier, pas de code, pas de chemin dans le récap.
- [ ] Ton PM, entre 3 et 8 phrases.
- [ ] La date utilisée = date de la tâche, pas date système.

## WHAT LLMs GET WRONG

| # | AP | BAD | GOOD | Why |
|---|---|---|---|---|
| AP1 | **Code, fichiers, chemins dans le récap** | *"j'ai modifié `src/auth/login.ts` pour appeler `refreshToken()`"* | *"j'ai renforcé le flux de connexion pour rafraîchir automatiquement la session"* | Le journal est un outil de communication, pas un changelog. |
| AP2 | **Utiliser la date système** | `date` → 2026-07-02 alors que la tâche a été faite le 30/06 | Détecter la date via le dernier message substantiel | Le skill est souvent exécuté APRÈS coup. |
| AP3 | **Récap différent chat vs fichier** | 2 versions divergentes | Écrire une fois, copier à l'identique | Un seul SSOT. |
| AP4 | **Récap trop long** | Paragraphes de 15 lignes | 3 à 8 phrases | L'utilisateur relit vite. |
| AP5 | **Écrire à la racine `journal.md`** | Fichier monolithique | Fichier par mois `docs/journal/YYYY-MM.md` | Plus facile à parcourir par période. |
| AP6 | **Deviner la date** au lieu de demander | Le LLM invente 2026-06-15 | Demande à l'utilisateur si ambigu | Ne jamais fabriquer une donnée. |
