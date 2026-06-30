# Linter de dette IA

Un petit outil qui **analyse ton code et compte les anti-patterns de dette technique** typiques du code genere par IA (catch vides, secrets en clair, fonctions trop longues, pas de tests, boilerplate non touche, etc.), puis les affiche dans un tableau de bord.

> 100 % **deterministe** : que du regex et de l'analyse de fichiers, **aucun appel a une IA**. Tout tourne en local sur ta machine, rien n'est envoye nulle part. C'est exactement le principe du cours : *un script deterministe vaut mieux qu'un LLM pour ce qui peut etre execute.*

Formation IIM, M1 IWID, juin 2026.

---

## Prerequis

- **Python 3** (rien d'autre pour le mode standard, aucune librairie a installer).
  - Verifie : `python3 --version` (Mac/Linux) ou `python --version` (Windows).
  - Pas de Python ? https://www.python.org/downloads/

## Lancer l'analyse en 2 etapes

### 1. Generer ton rapport

Depuis le dossier de ce repo, lance le scan sur ton projet :

```bash
# Mac / Linux
python3 lint_dette_ia.py /chemin/vers/ton/projet > rapport.json

# Windows
python lint_dette_ia.py C:\chemin\vers\ton\projet > rapport.json
```

Astuce : si tu copies ton projet a cote, ce sera juste `python3 lint_dette_ia.py ./mon-projet > rapport.json`.

### 2. Ouvrir le tableau de bord

Le plus simple, **hors-ligne** : double-clique sur `index.html`, puis **glisse-depose** ton `rapport.json` dans la page.

Ou, si tu preferes, sers le dossier et le rapport se charge tout seul :

```bash
python3 -m http.server 8000      # (python -m http.server 8000 sous Windows)
# puis ouvre http://localhost:8000
```

Tu verras : ton **score de dette**, le detail **par gravite** (critique / majeur / mineur), et pour chaque souci le **code fautif surligne** facon GitHub. L'onglet **Par type d'erreur** explique chaque regle en une phrase.

## Suivre ton evolution (optionnel mais motivant)

Ajoute `--history historique.json` a ton scan : chaque analyse empile un point. Tu verras alors un onglet **Evolution** avec ta courbe de score et le delta depuis la derniere fois (objectif : faire baisser).

```bash
python3 lint_dette_ia.py ./mon-projet --history historique.json > rapport.json
```

Relance-le au fil de tes corrections : tu verras ta dette descendre. (L'onglet Evolution apparait quand tu sers le dossier avec `python -m http.server`, ou en glissant `historique.json` dans la page en plus de `rapport.json`.)

---

## Ce que l'outil detecte (extrait)

| Gravite | Exemples de regles |
|---------|--------------------|
| Critique | secret en clair, `catch` vide, XSS (`innerHTML`), `eval`, pas de `CLAUDE.md`, boilerplate non modifie |
| Majeur | `setTimeout` magique, god file (>300 lignes), donnees mockees, aucun test, `: any`, hook React sans deps |
| Mineur | TODO orphelin, `console.log` oublies, code commente, `var`, `==` non strict |

Le **score** = somme ponderee : un secret pese plus qu'un `console.log`.

---

## (Optionnel, avance) Le mode `--deep`

En plus du regex, le mode `--deep` lance de vrais outils d'analyse statique (toujours zero IA) : detection de secrets par entropie, erreurs de typage, code duplique, et analyse AST (fonctions trop longues, imports inutilises).

```bash
python3 lint_dette_ia.py /chemin/vers/ton/projet --deep > rapport.json
```

Il faut alors avoir installe ces outils (sinon chaque check absent est juste ignore, pas de crash) :
- [gitleaks](https://github.com/gitleaks/gitleaks) et [trivy](https://github.com/aquasecurity/trivy) (secrets)
- [jscpd](https://github.com/kucherenko/jscpd) : `npm i -g jscpd` (duplication)
- Node/npx (pour `tsc`, les erreurs de typage)
- `pip install tree-sitter tree-sitter-language-pack` (analyse AST)

Le mode standard (sans `--deep`) suffit largement pour voir ta dette.

---

## Bon a savoir

- L'outil **ne modifie jamais ton code**, il ne fait que le lire.
- `rapport.json` contient ton analyse : pas besoin de le commiter (il est dans le `.gitignore`).
- Un fichier de plus de 300 lignes, un `catch {}` vide, un projet sans test : ce ne sont pas des "erreurs" qui empechent de tourner, ce sont de la **dette** qui te ralentira plus tard. Le but de l'outil est de la rendre visible.
