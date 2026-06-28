# Les 15 commandements de l'agentique en production

> **Support de cours — Stratégie de l'Innovation & IA générative avec Claude Code (M1 IWID)**
> Version 1 — 2026-05-13 — Alexandre PICARD

---

## Pourquoi cette fiche

Les LLM sont entraînés sur "tout l'Internet". Cela inclut **les bonnes pratiques**, mais aussi **les anti-patterns du junior moyen, du tutoriel rapide, de la solution facile**. Quand vous laissez un LLM coder sans cadre, il va statistiquement vers la médiane d'Internet — pas vers le code de production exigeant.

Un projet IA réussi en production ne se distingue pas par la **puissance du modèle**, mais par la **qualité du cadre** que l'humain pose autour. Ce cadre se matérialise par :

- **Des règles explicites** (un `CLAUDE.md` / `PROJECT_RULES.md` qui dit ce qu'on ne fait JAMAIS)
- **Des scripts déterministes** qui exécutent ce qui peut l'être (le LLM décide, le script fait)
- **Des skills documentés** qui cadrent le LLM par fonction (un fichier par capacité)
- **Une discipline d'équipe** qui refuse la dette silencieuse

Les 15 commandements ci-dessous sont des **règles validées par une vraie expérience de production**. Chacun combat un anti-pattern réel et documenté. Ils ne sont pas théoriques : ils sont le résultat de bugs vécus, de dérives observées, de dette nettoyée.

---

## Structure — 3 piliers

| Pilier | Nb | Idée centrale |
|---|---|---|
| **I. Poser le cadre** | 5 | Avant que le LLM touche un fichier, il faut un cadre. Tout commence par là. |
| **II. Refuser la dette** | 7 | Le LLM est tenté en permanence par la solution facile qui crée de la dette. On résiste. |
| **III. Tenir dans la durée** | 3 | Un projet IA-piloté qui reste sain à 6 mois, pas seulement au sprint 1. |

---

# 🏛️ PILIER I — POSER LE CADRE

## 1. Écouter d'abord, exécuter sans pause

> *"Chaque message de l'utilisateur est la donnée la plus précieuse de la conversation."*

**Anti-pattern combattu** :
- Le LLM continue à implémenter une solution que l'utilisateur vient de signaler comme cassée
- Le LLM demande "tu veux que je continue ?" entre chaque étape d'un plan validé
- Le LLM ignore une objection en disant "je note" puis fait autre chose

**Pourquoi** : si l'utilisateur doit se répéter, c'est que le LLM a échoué à intégrer son message la première fois. Et un LLM qui demande validation à chaque étape transfère sa charge cognitive à l'humain.

**Pattern correct** :
1. Lire le message
2. Reformuler en 1 phrase ce que l'utilisateur a dit
3. Intégrer immédiatement dans le plan/code, pas "au prochain tour"
4. Quand un plan est validé, l'enchaîner jusqu'au bout sans pause

> **Règle d'or** : si l'utilisateur dit *"ça casse"*, **STOP IMMÉDIAT**. Comprendre. Agir. Ne PAS continuer à implémenter ce qu'il vient de signaler comme problématique.

---

## 2. Chercher dans le repo avant de demander

> *"90% des questions du LLM ont leur réponse dans le code, les skills, ou les décisions passées."*

**Anti-pattern combattu** :
- Le LLM pose 4 questions dans un `.partial.md`, dont 3 ont leur réponse dans un fichier voisin
- "Tu veux que j'utilise tel framework ?" alors que 5 modules adjacents utilisent déjà telle convention
- Demander à l'humain une convention qui est documentée 2 dossiers plus haut

**Pourquoi** : un projet IA-first repose sur la SSOT (Single Source of Truth) documentaire. Si le LLM ne sait pas chercher, il refait, duplique, et casse la cohérence.

**Pattern correct** :
1. Avant toute question : `grep`, `find`, lecture des skills, lecture des `DECISIONS.md`
2. Si une autre partie du projet a résolu le même problème → utiliser le même pattern
3. Question légitime UNIQUEMENT si : décision business, choix produit, intention non-dérivable du code

**Questions interdites** (réponses dans le repo) :
- "Quelle stack utilises-tu ?" → `package.json`
- "Où mettre ce fichier ?" → où sont les fichiers similaires existants
- "Quelle convention de nommage ?" → grep les noms existants

---

## 3. Plan = contrat

> *"Un plan validé est un contrat. Pas une suggestion."*

**Anti-pattern combattu** :
- Le LLM dump un plan dans le chat, l'utilisateur valide, le LLM oublie 30% des étapes en l'exécutant
- Le LLM ajoute des "améliorations bonus" non prévues dans le plan
- Le LLM "réinterprète" le plan en cours d'exécution

**Pourquoi** : sans contrat écrit et engagé, le LLM dérive. Un plan validé doit être figé : déviation = STOP et `.partial.md` qui explique pourquoi.

**Pattern correct (workflow obligatoire)** :
1. **Exploration** en lecture seule (Grep, Read, Glob) pour comprendre le sujet
2. **Écrire** le plan dans un fichier `{nom}.plan.md` (pas dans le chat)
3. **Présenter** un résumé court (5-10 lignes) + chemin du fichier
4. **Attendre validation** explicite ("ok", "go", "validé")
5. **Exécuter** uniquement ce qui est listé dans le plan
6. **Clôturer** avec `{nom}.plan.done.md` ou `{nom}.plan.partial.md` si blocage

> Le plan, c'est le seul moment où l'humain peut **vraiment** contrôler ce que va faire le LLM. Tout ce qui se passe APRÈS validation se fait sans humain dans la boucle.

---

## 4. Nommage autoporteur, zéro abréviation

> *"Un nom doit livrer son contexte en lecture, sans qu'on ait à fouiller."*

**Anti-pattern combattu** :
- `config.json`, `utils.py`, `helpers.ts`, `key.pem`, `setup.sh`
- Alias CLI courts dans la doc officielle (`deploy br` au lieu de `deploy build-and-release`)
- Variables `usr`, `cfg`, `tmp`, `da`, `dr`, `Mkt`, `Mgmt`

**Pourquoi** : un nom court est "lisible" mais **pas maintenable**. 6 mois plus tard, ni vous ni un autre LLM ne savez à quoi il sert sans grep. Pire : un LLM entraîné sur du code mal nommé reproduit le pattern.

**Pattern correct** :
- `config.json` → `idp_organizations_config.json`
- `setup.sh` → `setup_ovh_vps_docker.sh`
- `key.pem` → `dkim_company_ai_private.pem`
- `--ws` → `--workspace`
- Pas d'alias courts dans la doc : `gh pr create` et `kubectl get pods` sont longs **par design**

**Tentation à résister** : *"on raccourcit pour l'ergonomie quotidienne"*. NON. L'utilisateur peut définir ses propres alias dans son shell. La doc officielle reste longue et explicite.

---

## 5. SSOT — une seule source de vérité

> *"Si l'info existe quelque part, ne la recopie pas. Dérive-la."*

**Anti-pattern combattu** :
- Liste des repos copiée à la main dans un `repos.yaml`
- Constantes recopiées du schéma DB dans un `constants.ts`
- README qui décrit l'arborescence (qui dérive au premier `mkdir`)
- Plusieurs fichiers de config qui répètent la même valeur

**Pourquoi** : un duplicata statique = un cache sans invalidation = un bug silencieux qui apparaîtra dans 3 mois.

**Pattern correct** :
- L'info existe sur le FS → script qui scanne
- L'info existe en DB → query au runtime
- L'info existe en `.env` → variable, pas copie
- L'info existe dans un schéma → dérivation (TypeScript `z.infer`, Python `dataclass`)

**Test** : si vous modifiez la source mais le duplicata reste obsolète sans erreur → c'est de la dette qui pourrira.

---

# ⚔️ PILIER II — REFUSER LA DETTE

## 6. Script déterministe > LLM ⭐ (commandement central)

> *"Le LLM orchestre et décide. Les scripts exécutent et loguent."*

**Anti-pattern combattu** :
- Faire boucler le LLM sur 30 fichiers similaires (génération répétitive lente, coûteuse, non-reproductible)
- Demander au LLM de "parser un CSV et calculer une moyenne" alors qu'un `pandas.read_csv().mean()` le fait en déterministe
- Réécrire 5 fois la même logique d'extraction parce que le LLM "improvise" différemment chaque fois

**Pourquoi** : un LLM est non-déterministe par construction. Chaque exécution peut différer. Pour toute opération qui DOIT donner le même résultat, c'est de la **logique exécutable**, pas de la logique LLM.

**Pattern correct** — la règle cardinale d'un projet IA-first :

```
Toute logique répétable = script déterministe (Python, JS, shell).
Le LLM appelle le script avec des arguments. Le script renvoie un résultat structuré.
```

**Architecture conséquente** :
- `skills/<nom>/SKILL.md` = doc qui cadre le LLM sur QUAND et POURQUOI utiliser une capacité
- `scripts/<nom>.py` = code déterministe, idempotent, testable, qui FAIT la chose
- Le LLM lit le SKILL.md → décide → appelle le script → reçoit un résultat propre

**Bénéfices immédiats** :
- Tests unitaires possibles (vous ne pouvez pas tester un prompt, vous pouvez tester un script)
- Coût stable et prédictible
- Reproductibilité parfaite
- Audit possible (les scripts loguent)
- Réutilisation entre projets

> Ce commandement à lui seul résout 70% de la dette technique générée par IA.

---

## 7. Décider toi-même, pas d'options A/B

> *"Quand un LLM pose '2 options', c'est souvent qu'il a la flemme d'assumer un choix."*

**Anti-pattern combattu** :
- "Tu préfères Option 1 (X) ou Option 2 (Y) ?" → transfert de charge cognitive à l'humain
- "C'est gros scope, tu confirmes ?" → la réponse est presque toujours oui
- "Je peux neutraliser temporairement ?" → non, on supprime ou on répare proprement

**Pourquoi** : un projet a un cap (qualité, dette, conventions). Le LLM doit pouvoir lire le cap et trancher. Renvoyer la question à l'humain à chaque carrefour = paralysie + dilution de la responsabilité.

**Pattern correct** :
1. Quand le LLM hésite entre 2 options, il applique 4 critères dans l'ordre :
   - La plus **ambitieuse** (gros scope assumé, pas de shortcut)
   - Celle qui **supprime le plus de dette** (code mort → suppression)
   - Celle qui **aligne avec les conventions** du projet (skills, autres modules)
   - **Big Bang** plutôt que migration progressive (sauf contrainte réelle)
2. Le LLM agit et rend compte en 1 phrase : *"J'ai décidé X parce que Y"*
3. L'utilisateur corrige en 1 mot s'il s'est trompé. Coût d'aller-retour minimal.

**Exception** : vraies décisions produit/business (priorité roadmap, UX non-implicite, trade-off légal). Pas les choix techniques.

---

## 8. Big Bang — jamais de backward compat

> *"Zéro legacy. Zéro mode `legacy=True`. Zéro fonction compagnon."*

**Anti-pattern combattu** :
- `iter_foo()` ne couvre pas le cas X → on crée `iter_foo_extended()` à côté
- Ajouter un paramètre `legacy_mode=True` à une fonction existante
- "Backward-compatible extension" — terme **banni du vocabulaire**
- Renommer l'ancien en `_deprecated_foo()` et créer le nouveau `foo()`
- "On garde l'ancien chemin au cas où"
- **Feature flag** comme moyen de garder 2 comportements simultanés

**Pourquoi** : la dette adore se cacher dans la "prudence". Tout chemin double = surface de bug doublée + entropie qui croît. Le code mort est plus toxique que le code absent.

**Pattern correct** : quand une fonction existante ne couvre pas un cas nouveau → on **refactorise la fonction en place**. Un seul chemin survit. L'ancien meurt.

> **Mantra** : un seul chemin. Toujours.

---

## 9. Always fail hard — zéro fallback

> *"Une erreur cachée est une erreur qui te ronge plus tard."*

**Anti-pattern combattu** :
- `try/except: pass` qui masque une erreur "au cas où"
- Fallback silencieux qui retourne `null` au lieu de lever l'erreur
- `Array.isArray(data) ? data[0] : data` au consumer pour "tolérer" une corruption de cache
- 2 chemins de code dont un "au cas où l'autre fail"

**Pourquoi** :

```
2 chemins = masquage d'erreur + entropie
1 chemin = erreur visible
```

Un bug silencieux est cent fois plus coûteux qu'un bug bruyant. Le silence empêche le diagnostic.

**Pattern correct** :
- Pas de fallback "défensif" sauf au boundary système (réseau, API tierce)
- Une erreur = un crash visible avec stack trace claire
- Si le code "tolère" une donnée corrompue → on répare la source, pas le consumer
- Validation au boundary (Zod, Pydantic) avec FAIL LOUD, pas FAIL SILENT

---

## 10. Pas d'exception pour cacher la dette

> *"Le 'vert' n'est pas l'objectif. Le code propre l'est. Le vert est une conséquence."*

**Anti-pattern combattu** :
- 134 violations détectées par le linter → on ajoute 134 exceptions YAML pour faire passer au vert
- "Ce fichier a 800 lignes ? J'ajoute une exception `god_file` au lieu de le splitter"
- "62 fichiers ont des `console.log` ? J'exclus la règle au lieu de les remplacer par un logger"

**Pourquoi** : un LLM est entraîné à "résoudre les problèmes visibles". Une exception YAML résout le **problème visible** en 2 secondes. C'est exactement de la triche.

**Pattern correct** :
- Une exception est **légitime** UNIQUEMENT pour un faux positif du checker (le code est correct, l'outil se trompe)
- Une exception est **interdite** pour de la vraie dette technique
- Si > 3-4 exceptions sur le même type → signal qu'on cache de la dette
- Avant d'ajouter une exception : *"le checker a tort, ou le code a tort ?"*

**Principe** : 134 violations rouges qui reflètent la réalité > 0 violations avec 134 exceptions qui cachent la réalité.

---

## 11. Warnings = signal, pas bruit

> *"Si un warning est vraiment inutile, on le supprime. Sinon, on le traite."*

**Anti-pattern combattu** :
- "C'est cosmétique, on laisse"
- Logs avec 200 warnings au démarrage que personne ne lit
- Build qui finit "successful" malgré 47 deprecation warnings

**Pourquoi** : 200 warnings = 0 warnings (personne ne lit). Zéro bruit = chaque alerte compte vraiment.

**Pattern correct** :
- Soit le warning est utile → on corrige la cause
- Soit le warning est un faux positif → on le supprime via config + commentaire qui explique POURQUOI
- Jamais "on laisse pour plus tard sans annotation"

---

## 12. Pas de setTimeout magique

> *"`setTimeout(fn, 100)` pour résoudre un problème de timing = anti-pattern."*

**Anti-pattern combattu** :
- `setTimeout(() => focusInput(), 50)` parce que "ça marche avec 50ms"
- `await sleep(200)` avant de vérifier qu'un élément existe
- Race condition résolue par "attendre un peu"

**Pourquoi** : un timeout magique est **non-déterministe**. Ça casse entre navigateurs, OS, charges CPU, machines lentes. Le bug réapparaîtra chez quelqu'un.

**Pattern correct** — chercher le signal déterministe :
- Focus → `document.hasFocus()` + `addEventListener('focus')`
- Élément pas encore dans le DOM → `MutationObserver`
- Donnée pas prête → événement, Promise, callback
- Animation → `transitionend` / `animationend`
- Layout pas calculé → `requestAnimationFrame` (1 frame, pas N ms arbitraires)

**Test** : si vous retirez le `setTimeout` et le code casse → vous n'avez pas résolu le problème, vous l'avez masqué avec du temps.

---

# ⏳ PILIER III — TENIR DANS LA DURÉE

## 13. Pas de TODO orphelin — convertir en garde-fou automatique

> *"Pour plus tard = pour personne."*

**Anti-pattern combattu** :
- `// TODO: monitorer si la métrique X dérive`
- "À traiter au prochain cycle si on observe Y"
- "Follow-up si nécessaire"

**Pourquoi** : un TODO transfère implicitement la dette à un humain ou un agent futur qui n'a aucune raison de remonter ce contexte. Résultat : la dette pourrit pendant des mois.

**Pattern correct** : au lieu d'un TODO, **wire un cron / job automatique** qui :
1. Vérifie la condition à intervalles réguliers
2. Auto-propose sa propre suppression quand la condition est OK pendant N runs
3. Produit un rapport actionnable sinon

**Convention** : nommer ces jobs `watch-and-retire-{slug}` (cherchable, inventoriable).

**Bénéfice** : la dette qui devait être surveillée par "quelqu'un un jour" devient **un système qui se surveille lui-même** et propose son auto-retrait.

> **Mantra** : tout TODO temporel devient un système actif, jamais un commentaire passif.

---

## 14. Git commit tout ou rien

> *"On part toujours d'un état propre. Toujours."*

**Anti-pattern combattu** :
- `git add fichier1 fichier2 && git commit` en ignorant le reste du dirty
- "Je commit ça pour l'instant, je ferai le reste plus tard"
- Commencer un chantier sur un repo qui a du dirty non-commité

**Pourquoi** : un commit partiel introduit de la dette silencieuse. "Le reste plus tard" n'arrive jamais. Un repo dirty crée des conflits cognitifs et techniques au prochain chantier.

**Pattern correct** :
1. **Avant** de commencer un chantier : `git add -A && git commit` sur tout le dirty existant (même si c'est WIP — on commit avec un message clair)
2. **Quand** on commit, on commit TOUT (`git add -A`)
3. Si un fichier ne devrait pas être commité (secret, tmp, pid) → `.gitignore` AVANT le commit
4. Dans un workspace multi-repo : commiter dans CHAQUE repo qui a des changements

---

## 15. Pas de "c'est pas mon scope"

> *"Tu vois un dirty pendant que tu travailles à côté ? Tu agis ou tu escalades. Jamais tu ne passes."*

**Anti-pattern combattu** :
- "Ce fichier n'est pas dans mon scope, je laisse"
- "Un autre agent a fait ça, je ne touche pas"
- "Je vais commit juste mes changements pour rester propre" (NON — on commit tout)
- Voir un bug / une convention cassée / un warning et **passer son chemin** sans rien dire

**Pourquoi** : un repo où chaque agent ne touche que "ses" fichiers accumule de la dette silencieuse à la jointure. L'humain finit par devoir nettoyer ce que personne n'a voulu assumer.

**Pattern correct** :
- Tu trouves du dirty stable et cohérent ? → tu **l'inclus** dans ton commit
- Tu vois un fichier mal nommé pendant que tu travailles à côté ? → **refacto opportuniste**
- Un `.partial.md` orphelin qui bloque ton travail ? → tu lis, tu décides (continuer / clore / escalader)
- Tu vois un warning, un test flaky → tu traites ou tu mets un TODO **structuré et explicite**

**Seule exception** : un dirty que tu **ne comprends pas** ou qui touche un domaine où un autre agent travaille en parallèle (l'utilisateur l'a dit explicitement). Dans ce cas, tu le DIS, tu ne l'ignores pas silencieusement.

---

# 🎯 Synthèse — comment apprendre ces 15 commandements

## En tant qu'étudiant

Ne cherchez pas à les apprendre par cœur. Cherchez à reconnaître **l'anti-pattern** que chacun combat dans VOTRE propre code, VOTRE propre dialogue avec le LLM, VOTRE propre repo.

**Pour chacun, posez-vous** :
- *Quel est le piège qu'il combat ?*
- *Ai-je vu ce piège dans le code que j'ai écrit avec Claude Code cette semaine ?*
- *Comment je me serais protégé ?*

## En tant que projet d'équipe

Votre projet fil rouge doit avoir, à la fin de la semaine, ses propres **fichiers de cadrage** :

- Un `CLAUDE.md` ou `PROJECT_RULES.md` qui adapte ces 15 commandements à votre contexte
- Des `skills/<nom>/SKILL.md` pour chaque capacité
- Des `scripts/<nom>.py` (ou `.ts`) déterministes pour chaque logique répétable
- Un `DECISIONS.md` qui trace vos arbitrages
- Un `ARCHITECTURE.md` qui décrit votre découpe

L'évaluation porte sur **la qualité du cadre** que vous avez posé. Pas sur la complétude du produit final.

## Lecture associée

- [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) (article fondateur, en anglais)
- [Anthropic — Best practices for agents](https://docs.anthropic.com/en/docs/agents-and-tools) (doc officielle)
- [Le pattern skill + script](https://github.com/anthropics/anthropic-cookbook) (Anthropic Cookbook)

---

*Fiche v1 — 2026-05-13. Toute remarque, contre-exemple, ou expérience contraire de votre part bienvenue : ces commandements ne sont pas figés, ils évoluent à mesure que la pratique se précise.*
