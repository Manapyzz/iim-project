# Workshop "Stratégie de l'Innovation & IA générative avec Claude Code"

## M1 IWID — 29 juin → 2 juillet 2026

Bienvenue. Cette semaine vous n'apprenez pas à **fabriquer** une IA. Vous apprenez à **piloter** une IA en production avec Claude Code.

---

## Format de la semaine

- **80% pratique, 20% théorie**
- Vous codez dès le J1 après-midi
- Chacun travaille sur **son propre projet** (format **solo**)
- Vous choisissez votre sujet, validé par moi le J1 matin
- Le projet **grandit en qualité** chaque jour avec les nouveaux principes appris

---

## Votre projet — contraintes

| Contrainte | Détail |
|---|---|
| **Stack** | JavaScript / TypeScript (Next.js, Vite, ou autre framework moderne au choix) |
| **Complexité minimale** | 3+ entités, 5+ fonctionnalités distinctes, interactions entre les entités |
| **Persistance** | Obligatoire (SQLite, Postgres, ou fichiers JSON) |
| **UI** | Interface utilisable (web ou app), pas un script CLI |
| **Type** | Vrai produit utilisable et démontrable, pas un POC théorique |
| **IA en runtime** | Autorisée mais pas obligatoire (attention au coût si vous en mettez partout) |
| **Validation** | Sujet validé par Alex le **J1 entre 11h00 et 11h30** |

**Quelques pistes pour s'inspirer (non imposées)** : tracker de candidatures, mini Tricount, mini Kanban, mini CRM, lecteur RSS, bookmark manager, mini eshop, dashboard de stats perso, etc.

---

## 3 niveaux d'exigence — vous visez ce qui est réaliste pour vous

### Niveau 1 — note baseline (~12/20)
- v1 fonctionnelle (CRUD basique + UI utilisable)
- Un `CLAUDE.md` basique avec conventions de nommage et intent
- Au moins **1 skill démonstratif** : `SKILL.md` + script déterministe

### Niveau 2 — note solide (14-16/20)
- + 2-3 fonctionnalités cadrées (skills + scripts)
- + `DECISIONS.md` à jour
- + Workflow Git "plan = contrat" : au moins 1 `.plan.md` validé puis exécuté
- + Au moins **1 gate déterministe** (validation input/output)

### Niveau 3 — note excellence (18-20/20)
- Tout du niveau 2, plus :
- + Intégration **MCP** ou tool externe
- + **Audit de dette technique** réalisé sur votre propre repo
- + Tests + lint + README propre
- + Analyse critique avancée de votre collaboration humain/IA

---

## Skills obligatoires — minimum 2

Vous devez livrer au moins **2 skills** documentés (`SKILL.md` + script déterministe) :

1. **1 skill métier** lié à votre projet (ex : valider un email, calculer un total avec taxe, générer un slug à partir d'un titre…)
2. **1 skill transverse** réutilisable (ex : auditer la dette du projet, formater une sortie, exporter en CSV/JSON…)

Optionnel pour le niveau 3 :
- **1 skill d'intégration externe** (envoyer une notification, fetcher une API tierce, uploader vers un storage…)

---

## Milestones — qu'est-ce qu'on attend à chaque fin de journée

### 🚩 J1 (lundi 29/06) fin
- Sujet validé
- v1 "vibe codée" qui marche, même cassée
- Premier mur identifié : vous avez vu votre code dérailler

### 🚩 J2 (mardi 30/06) fin
- `CLAUDE.md` ou `PROJECT_RULES.md` posé
- Au moins 1 skill documenté
- `DECISIONS.md` tenu à jour
- Au moins 1 `.plan.md` exécuté

### 🚩 J3 (mercredi 01/07) fin
- Au moins 2 fonctionnalités refactorées avec cadrage
- Au moins 1 gate déterministe
- Niveau 3 : MCP ou tool externe intégré
- Mémoire externe utilisée (CLAUDE.md, MEMORY.md ou journal)
- Audit dette technique réalisé

### 🚩 J4 (jeudi 02/07) midi
- Tests basiques présents
- README propre
- Repo GitHub partagé avec Alex (collaborateur) avant 12h30

---

## Soutenance — jeudi 02/07 après-midi

### Format individuel
- **8 minutes par étudiant** : 5 min présentation + 3 min Q&A
- Démo live de votre projet
- Vous expliquez vos choix méthodologiques, pas votre code ligne à ligne
- Vous montrez vos patterns appliqués (skills, scripts, cadrage)

### Ce qu'on attend dans la présentation
1. Le sujet et la complexité de votre projet (30 sec)
2. Votre `CLAUDE.md` et conventions posées (1 min)
3. Démo d'au moins 1 skill avec son script (2 min)
4. Analyse critique : ce qui a marché / cassé / pourquoi (1 min 30)

---

## Notation — décomposition

| Composante | % | Évalué |
|---|---|---|
| Présentation orale + Q&A | 30% | En direct pendant la soutenance |
| Code, cadrage, skills | 50% | Analyse de votre repo après la formation |
| Méthode / workflow Git / journal décisions | 20% | Analyse des commits et plans après la formation |

→ Délai de rendu des notes : 15 jours après fin de formation (≈ 17 juillet).

---

## Ressources

- **Claude Code** : à installer chez vous avant le J1 si possible — détails au J1 matin
- **Proxy LiteLLM** : URL et clé virtuelle distribuées au J1 matin
- **Dashboard de consommation** : projeté en classe, vous voyez votre conso en live
- **Fiche des 15 commandements de l'agentique en production** : distribuée au J1, à appliquer tout au long de la semaine
- **GitHub** : créez un repo et invitez **Alex Picard (alexptpb)** en collaborateur dès que votre sujet est validé

---

## Une dernière chose

Cette semaine, **vous codez avec un collaborateur IA**, pas avec un générateur de code. Le LLM va vous obéir, écrire vite, sembler avoir raison. **Et il va dériver, halluciner, créer de la dette technique invisible**. Votre travail c'est de le cadrer.

À mercredi pour célébrer ce que vous aurez bâti.

— Alex Picard, Head of Engineering The Play Button (transition CTO)
