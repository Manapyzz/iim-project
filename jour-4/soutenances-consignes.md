# Soutenances J4 — jeudi 02/07 après-midi

## Format

- **10 minutes par personne.** Votre présentation peut être courte : 5 minutes suffisent si vous êtes clairs. Ensuite je pose mes questions et on échange sur le temps restant. Mieux vaut 5 minutes nettes qu'un remplissage de 10.
- **Écran partagé, à l'oral.** Pas de slides obligatoires : vous ouvrez votre projet et vous montrez.
- Enchaînement continu, sans pause.
- Ordre de passage aléatoire (voir tableau en fin de doc).
- Présents dès 14h00.

## Le déroulé de votre présentation

Trois blocs, dans cet ordre. C'est le squelette attendu, pas un chrono au cordeau.

### 1. Démo live (~2-3 min)

Votre app tourne. Vous faites le tour des fonctionnalités qui font la valeur du projet, en mode utilisateur. Chemin nominal, pas d'écran de setup ni de scroll dans le README : l'app parle.

### 2. Votre cadrage (~2 min)

Vous ouvrez votre `CLAUDE.md`, vos skills, vos scripts. Vous expliquez pourquoi ces choix. Exemple attendu : « ce script existe parce que sinon Claude reformulait la logique à chaque prompt et je perdais du temps à revalider. »

### 3. Votre pilotage (~2 min)

Un piège concret rencontré cette semaine : bug bizarre, IA qui part en vrille, décision retournée, boucle qui n'en finit pas. Comment vous l'avez géré, et ce que vous en avez tiré : un skill, un anti-pattern dans le `SKILL.md`, une règle dans le `CLAUDE.md` ?

## Livrables

Le détail est dans `projet/projet-individuel.md`. L'essentiel pour jeudi : un `CLAUDE.md` de cadrage, **deux skills** (un skill métier propre à votre projet + un skill transverse réutilisable, type `task-journal`), au moins un script déterministe qui fait le travail fiable à la place de l'IA, et une app qui tourne avec des données qui persistent.

## Sur quoi je vous évalue

Pendant que vous parlez, je regarde quatre choses :

1. **CONTRÔLE.** Vous maîtrisez votre appli, pas l'inverse. Si je pointe un fichier au hasard, vous savez ce qu'il fait et pourquoi il est là.
2. **DETTE.** Vous nommez les parties solides et les parties fragiles ou bricolées. « Cette partie marche mais je sais qu'elle casse si X » est un signal fort de maturité.
3. **PILOTAGE.** LLM utilisé à fond, et vous savez comment ça marche : quel skill se déclenche, pourquoi ce prompt, ce que vous avez refusé de laisser faire au modèle.
4. **RÉCIT.** Vous ouvrez votre projet et vous savez le raconter : problème, décision, arbitrages, état actuel, dette identifiée.

> La grille de notation complète (niveaux ~12 / 14-16 / 18-20) est dans `projet/projet-individuel.md`. Ces 4 axes sont ce que je regarde en direct pendant la soutenance.

## Ce qui fait la différence

Pas la taille du projet. Votre **lucidité** : vous comprenez ce que l'IA a produit, vous l'avez cadrée, vous savez où sont les pièges.

**Le critère décisif : vous comprenez votre code.** Personne ne vous demande de le réciter, mais de savoir ce que fait chaque partie et pourquoi. C'est ça, piloter l'IA plutôt que la laisser faire.

## Ordre de passage

Départ 14h00, fin 16h20, enchaînement continu.

| # | Créneau | Étudiant |
|---|---|---|
| 1 | 14h00 – 14h10 | JANUS Alexis |
| 2 | 14h10 – 14h20 | GRAMONT Arthur |
| 3 | 14h20 – 14h30 | GUILLEMIN Mathéo |
| 4 | 14h30 – 14h40 | PETIT Arnaud |
| 5 | 14h40 – 14h50 | GARNIER Quentin |
| 6 | 14h50 – 15h00 | TRAN Annam |
| 7 | 15h00 – 15h10 | BAIGNÈRES Louca |
| 8 | 15h10 – 15h20 | DELARUE Luca |
| 9 | 15h20 – 15h30 | DIMECH Aurore |
| 10 | 15h30 – 15h40 | VERVERT-RIGA Fiona |
| 11 | 15h40 – 15h50 | CANDILLE Thomas |
| 12 | 15h50 – 16h00 | RENOU Nicolas |
| 13 | 16h00 – 16h10 | CHARLERY Malcolm |
| 14 | 16h10 – 16h20 | TETARD Hermione |
