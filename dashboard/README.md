# Dashboard du linter de dette IA

Page HTML statique qui affiche le **rapport.json** généré par `scripts/lint_dette_ia.py`.

## Comment l'utiliser en classe

### 1. Générer un rapport sur des repos

```bash
# Scanner un seul repo
.venv/bin/python3 scripts/lint_dette_ia.py /chemin/vers/repo --pretty

# Scanner tous les repos d'un dossier -> rapport agrege
.venv/bin/python3 scripts/lint_dette_ia.py --all ./repos-etudiants-clones > dashboard/rapport.json
```

### 2. Lancer le dashboard

```bash
cd dashboard/
python3 -m http.server 8000
```

Puis ouvrir : http://localhost:8000

→ Le dashboard charge automatiquement `rapport.json` et affiche le classement.

## Pourquoi PAS de déploiement public

Le `rapport.json` contient les noms d'étudiants + leurs scores de dette. Il reste **STRICTEMENT LOCAL** (gitignored).

Si tu veux le projeter en classe : `python3 -m http.server` local + projeter le navigateur. Pas besoin du VPS.

## Pourquoi c'est cool

L'outil est **100% déterministe — ZÉRO appel LLM**. Que du regex. C'est l'incarnation du commandement #6 ("script déterministe > LLM") : le LLM produit la dette, le script déterministe la mesure objectivement.
