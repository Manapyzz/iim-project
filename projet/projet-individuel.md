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
- **Du cadrage, pas du vibe coding.** Ton projet doit montrer la méthode qu'on apprend cette semaine :
  - un **`CLAUDE.md`** qui pose les règles à l'IA,
  - au moins **2 skills** : 1 "métier" (propre à ton domaine) + 1 "transverse" (réutilisable),
  - et des **scripts déterministes** : du code qui fait une tâche précise et fiable (un calcul, un parsing, une validation), que tu écris **une fois** au lieu de laisser l'IA la refaire (différemment) à chaque prompt. C'est le cœur de la méthode : tout ce qui doit être fiable et reproductible passe par un script, pas par l'IA.

  *(Ces termes seront clairs à partir du J2, pas de panique au J1.)*

---

## Étape 1 : ton idée (aujourd'hui, ~20-30 min)

Prends un papier et note :

1. **Le nom** du projet
2. **Le problème** qu'il résout (1-2 phrases)
3. **Tes entités principales** : les "objets" que ton app manipule. Mets-en au moins 3, et plus si ton idée le demande. *(ex : pour un calculateur d'empreinte carbone → Entreprise, Source d'émission, Rapport.)*
4. **Tes fonctionnalités clés** (vise environ 5) : des **vraies fonctionnalités qui rendent un service**, pas des briques techniques de base.
   - ❌ trop basique : "créer un utilisateur", "se connecter", "ajouter une ligne"
   - ✅ une vraie fonctionnalité : "permettre à une entreprise de calculer son empreinte carbone complète (véhicules, flotte, parc informatique...)"

   Vise des **workflows** qui apportent de la valeur, pas des opérations CRUD isolées.

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

## La soutenance (jeudi après-midi)

**8 minutes par personne** : ~6 min de présentation + ~2 min de questions. Écran partagé, à l'oral, pas de slides obligatoires. Tu montres :

1. **Démo live (~2 min)** : ton app tourne, tu fais le tour des fonctionnalités.
2. **Ton cadrage (~2 min)** : tu ouvres ton `CLAUDE.md`, tu montres tes skills et tes scripts. Pourquoi ces choix ?
3. **Ton pilotage (~2 min)** : un **piège** que tu as rencontré (un bug bizarre, une IA qui part en vrille), comment tu l'as géré, et ce que tu en retiens.

> [!tip] Ce qui impressionne
> Pas la taille du projet, mais ta **lucidité** : montrer que tu comprends ce que l'IA a produit, que tu l'as cadrée, et que tu sais où sont les pièges.

---

## La notation

Trois blocs : **40% le code, 30% ta méthode, 30% la soutenance.** La méthode pèse lourd, parce que c'est le vrai sujet du cours : **piloter** l'IA, pas juste générer du code.

> [!info] Certains mots ne te parlent pas encore ?
> "Skills", "scripts déterministes", "dette IA"... c'est normal au J1, tu ne connais pas encore tout. On les voit ensemble au fil de la semaine. Garde juste l'esprit en tête, la grille deviendra claire au fur et à mesure.

### 40% : ton code

On ne note **pas** "est-ce que l'IA écrit bien" (elle écrit pour tout le monde pareil). On note **ce que ton pilotage en a fait**. Avec le même outil, deux personnes rendent des projets très différents. Concrètement on regarde :

- **Ça marche** : ton app tourne, les fonctionnalités annoncées fonctionnent, et les cas bizarres (champ vide, mauvaise saisie) ne cassent pas tout.
- **C'est rangé** : du code structuré, des fichiers de taille raisonnable, pas un seul fichier fourre-tout de 500 lignes.
- **Peu de "rustines"** : pas d'erreurs masquées, de délais magiques, de code mort, de copier-coller, de noms incohérents d'un fichier à l'autre. On t'apprend à repérer ces pièges dès le J1.
- **Tu comprends ton code** : tu peux expliquer n'importe quel morceau. C'est LE critère central : si tu sais l'expliquer, tu as piloté ; si tu ne sais pas, tu as juste laissé faire.

### 30% : ta méthode (workflow)

C'est le cœur du cours. Comment tu as cadré l'IA, pas juste ce que tu lui as fait produire :

- un **`CLAUDE.md`** qui pose les règles et les conventions à l'IA,
- des **skills** (au moins 2) et surtout des **scripts déterministes** qui tiennent la route : tout ce qui doit être fiable passe par du code écrit une fois, pas par l'IA à chaque prompt,
- des **commits réguliers** (pas un seul gros dépôt à la fin) qui montrent que tu as travaillé en petites étapes,
- un **repo propre** (README, `.gitignore`, pas de secrets).

*(Tout ça s'apprend à partir du J2.)*

### 30% : ta soutenance

La clarté de ta démo, ta capacité à expliquer ta méthode, et le recul que tu as sur ce que tu as construit.

### Les niveaux, en clair

- **~12 (correct)** : une app qui marche, avec de la persistance et une interface utilisable.
- **~14-16 (bien)** : en plus, un code propre et cadré, des cas limites gérés, peu de dette.
- **~18-20 (excellent)** : en plus, une vraie rigueur de méthode, des garde-fous, les pièges évités, et tu maîtrises ton projet de bout en bout.

---

## Conseils pour réussir (et maîtriser ton budget)

- **Boucles courtes** : demande une petite chose, regarde, teste, ajuste. Évite les méga-prompts de 10 minutes.
- **`/clear` entre deux tâches sans rapport** : repart d'un contexte propre. C'est aussi ce qui fait baisser ta conso.
- **Relis toujours** ce que l'IA génère : tu dois pouvoir l'expliquer en soutenance.
- **Cadre tôt** : un bon `CLAUDE.md` dès le J2 t'évite des heures de dette.
- **Ton budget fait partie du jeu** : piloter une IA en prod, c'est aussi ne pas la laisser tourner pour rien. Surveille ta conso.

Bonne semaine, éclate-toi. 🚀
