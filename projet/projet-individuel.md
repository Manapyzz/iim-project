# Projet individuel : ton app construite avec Claude Code

Pendant les 4 jours, tu construis **ton propre projet, en solo, entièrement avec Claude Code**. C'est le fil rouge de la semaine.

> [!info] Ce qu'on évalue vraiment
> Pas seulement le produit final, mais **la façon dont tu pilotes l'IA** : comment tu la cadres, comment tu structures ton code, comment tu évites la dette générée par l'IA. Un projet simple bien piloté vaut mieux qu'un projet ambitieux en vrac.

---

## Les contraintes

Ton projet doit cocher ces cases :

- **Solo** : un projet par personne.
- **Stack JS/TS moderne** (Next.js, TypeScript, etc.).
- **Plusieurs couches** : une interface (front) + une logique (back) + de la **persistance** (les données survivent à un rechargement).
- **Une UI réellement utilisable** : pas juste un script, une vraie petite app qu'on peut prendre en main.
- **100% construit avec Claude Code** : zéro ligne écrite à la main.
- **Au moins 2 skills** : 1 "métier" (propre à ton domaine) + 1 "transverse" (réutilisable), plus des scripts déterministes et un fichier `CLAUDE.md` de cadrage. *(On voit tout ça en détail à partir du J2, pas de panique aujourd'hui.)*

---

## Étape 1 : ton idée (aujourd'hui, ~20-30 min)

Prends un papier et note :

1. **Le nom** du projet
2. **Le problème** qu'il résout (1-2 phrases)
3. **Les 3 entités principales** (ex : pour un tracker de stages → Candidature, Entreprise, Relance)
4. **Les 5 fonctionnalités** prévues

Ensuite je passe voir chacun pour **valider ou réorienter** ton idée.

> [!tip] En panne d'idée ?
> Pars d'un irritant que tu vis vraiment. Quelques pistes : tracker de candidatures de stage, mini-Kanban de tâches, mini-Tricount (partage de dépenses), tracker d'habitudes, gestionnaire de recettes + liste de courses, générateur de fiches de révision, mini-CRM de contacts pro. Choisis ce qui te motive : c'est toi qui vas le coder toute la semaine.

---

## Le déroulé de la semaine

| Jour | Objectif |
|------|----------|
| **J1 (lundi)** | Sortir une **v1 qui marche**, même mal codée. Découvrir le "mur" de la dette IA. |
| **J2 (mardi)** | **Cadrer** : `CLAUDE.md`, premiers skills, scripts déterministes. Reprendre ton code avec la méthode. |
| **J3 (mercredi)** | Ajouter des **fonctionnalités** et des **garde-fous**, gérer les cas limites. |
| **J4 (jeudi)** | Finaliser le matin, **soutenance l'après-midi**. |

---

## Le rendu

- Un **repo GitHub privé** (tu le crées au J1), avec **Manapyzz** invité en collaborateur.
- Le repo doit contenir :
  - L'**app fonctionnelle** (code + de quoi la lancer)
  - Ton **`CLAUDE.md`** de cadrage
  - Tes **skills** (`.claude/skills/` ou équivalent) et tes **scripts déterministes**
  - Un **`README.md`** : ce que fait l'app, comment la lancer, ce que tu as appris

> [!warning] Jamais de secrets dans le repo
> Pas de clé API, pas de mot de passe en clair. Utilise un `.gitignore`. (On en reparle si besoin.)

---

## La soutenance (jeudi après-midi, ~8 min par personne)

Écran partagé, à l'oral. Pas de slides obligatoires. Tu montres :

1. **Démo live (2-3 min)** : ton app tourne, tu fais le tour des fonctionnalités.
2. **Ton cadrage (3 min)** : tu ouvres ton `CLAUDE.md`, tu montres tes skills et tes scripts. Pourquoi ces choix ?
3. **Ton pilotage (2-3 min)** : un **piège** que tu as rencontré (dette, hallucination, dérive), comment tu l'as cadré, et ce que tu en retiens.

> [!tip] Ce qui impressionne
> Pas la taille du projet, mais ta **lucidité** : montrer que tu comprends ce que l'IA a produit, que tu l'as cadrée, et que tu sais où sont les pièges.

---

## La notation

| Part | Sur quoi |
|------|----------|
| **50% : Code** | Qualité, architecture, cadrage, **peu de dette IA**, app qui marche. |
| **30% : Soutenance** | Clarté de la démo, recul sur ta méthode, compréhension de ce que tu as fait. |
| **20% : Workflow** | La méthode : skills + scripts déterministes + `CLAUDE.md`, commits réguliers, propreté du repo. |

### Les 3 niveaux d'exigence

- **~12 (correct)** : une app qui marche, persistance, UI utilisable, un `CLAUDE.md` basique, 2 skills.
- **~14-16 (bien)** : en plus, un cadrage propre, des scripts déterministes, des cas limites gérés, peu de dette.
- **~18-20 (excellent)** : en plus, une architecture soignée, des garde-fous, les anti-patterns évités, une méthode exemplaire et un projet abouti.

---

## Conseils pour réussir (et maîtriser ton budget)

- **Boucles courtes** : demande une petite chose, regarde, teste, ajuste. Évite les méga-prompts de 10 minutes.
- **`/clear` entre deux tâches sans rapport** : repart d'un contexte propre. C'est aussi ce qui fait baisser ta conso.
- **Relis toujours** ce que l'IA génère : tu dois pouvoir l'expliquer en soutenance.
- **Cadre tôt** : un bon `CLAUDE.md` dès le J2 t'évite des heures de dette.
- **Ton budget fait partie du jeu** : piloter une IA en prod, c'est aussi ne pas la laisser tourner pour rien. Surveille ta conso.

Bonne semaine, éclate-toi. 🚀
