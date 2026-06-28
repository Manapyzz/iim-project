# Guide d'installation : Claude Code (Formation IIM)

Bienvenue ! On installe **Claude Code** ensemble au début de la formation (J1), en suivant ce guide.
Ça prend **5 à 10 minutes**. Suis les étapes dans l'ordre, ne saute rien.

À la fin tu auras :
- Claude Code installé
- Ta clé personnelle configurée (elle te sera donnée séparément)
- Un test qui confirme que tout marche

> [!info] C'est quoi le principe
> Tu utilises Claude Code normalement, mais tes requêtes passent par un **proxy** géré par le formateur. Tu n'as donc **pas besoin de compte Claude payant** : ta clé personnelle suffit. Chaque étudiant a un budget plafonné.

---

## Étape 1 : Installer Claude Code

Choisis **ta** section selon ton ordinateur.

### 🍎 Sur Mac / 🐧 Sur Linux (Ubuntu, etc.)

La commande d'installation est la **même** sur Mac et Linux.

1. Ouvre un **terminal** :
   - **Mac** : cherche "Terminal" dans Spotlight (`Cmd + Espace`).
   - **Linux/Ubuntu** : raccourci `Ctrl + Alt + T`, ou cherche "Terminal" dans tes applications.
2. Copie-colle cette ligne, puis appuie sur **Entrée** :

   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

3. Attends la fin de l'installation. Si on te demande ton mot de passe, c'est normal, tape-le (il reste invisible) et Entrée.
4. **Ferme et rouvre le terminal** (important, pour qu'il reconnaisse la commande).

### 🪟 Sur Windows

1. Ouvre **PowerShell** (cherche "PowerShell" dans le menu Démarrer, clic → **Ouvrir**).
2. Copie-colle cette ligne, puis **Entrée** :

   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

3. Attends la fin de l'installation.
4. **Ferme et rouvre PowerShell.**

> [!tip] Vérifier que c'est installé
> Tape `claude --version` puis Entrée. Si un numéro de version s'affiche, c'est bon. Si tu vois "command not found" / "n'est pas reconnu", ferme/rouvre le terminal et réessaie.

---

## Étape 2 : Configurer ta clé personnelle

On va donner 2 informations à Claude Code : **l'adresse du proxy** et **ta clé**.

⚠️ Remplace `COLLE_TA_CLÉ_ICI` par la clé personnelle que le formateur t'a donnée (elle ressemble à `sk-xxxxxxxxxxxx`).

### 🍎 Mac / 🐧 Linux (dans le terminal)

```bash
export ANTHROPIC_BASE_URL=https://78-47-61-209.sslip.io
export ANTHROPIC_API_KEY=COLLE_TA_CLÉ_ICI
```

### 🪟 Sur Windows (dans PowerShell)

```powershell
$env:ANTHROPIC_BASE_URL = "https://78-47-61-209.sslip.io"
$env:ANTHROPIC_API_KEY = "COLLE_TA_CLÉ_ICI"
```

> [!warning] Ces lignes ne durent que le temps de la fenêtre
> Si tu fermes le terminal, tu devras **les retaper** la prochaine fois (avant de relancer `claude`).
> Voir tout en bas pour les rendre permanentes (optionnel).

---

## Étape 3 : Lancer Claude Code et tester

1. Dans le **même** terminal (celui où tu viens de coller ta clé), tape :

   ```bash
   claude
   ```

2. La première fois, Claude Code peut poser quelques questions de configuration (thème, etc.) → choisis ce que tu veux, ça n'a pas d'importance.

   > [!warning] S'il te propose de te connecter à un compte Claude
   > **Ne te connecte PAS** avec un compte Claude/Anthropic. Ta clé personnelle (Étape 2) gère déjà l'authentification. Si un écran de login apparaît, cherche une option pour passer/annuler, ou ferme et vérifie que tu as bien collé ta clé à l'étape 2.

3. Une fois dans Claude Code, écris par exemple :

   ```
   Bonjour, réponds juste "OK ça marche".
   ```

4. S'il te répond → **tout est bon, tu es prêt pour la formation.** 🎉

Pour quitter Claude Code : tape `/exit` ou fais `Ctrl + C` deux fois.

---

## 🆘 Problèmes fréquents

| Symptôme | Solution |
|----------|----------|
| `command not found: claude` (Mac/Linux) / `claude n'est pas reconnu` (Windows) | Ferme et rouvre le terminal. Si ça persiste, refais l'Étape 1. |
| Erreur **401 / Authentication** | Ta clé est mal collée (espace en trop, guillemets, clé incomplète). Refais l'Étape 2 proprement. |
| Erreur **429 / budget exceeded** | Ton budget est épuisé, préviens le formateur. |
| Erreur **model not allowed** | Tu as demandé un modèle non autorisé (ex : Opus). Reste sur le modèle par défaut. |
| Ça marchait, puis plus rien après avoir fermé le terminal | Normal : retape les 2 lignes de l'Étape 2 avant de relancer `claude`. |

---

## (Optionnel) Rendre ta clé permanente

Pour ne plus avoir à retaper les 2 lignes à chaque fois :

### 🍎 Mac

Dans le Terminal, colle ceci (avec **ta** clé à la place de `COLLE_TA_CLÉ_ICI`) :

```bash
echo 'export ANTHROPIC_BASE_URL=https://78-47-61-209.sslip.io' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY=COLLE_TA_CLÉ_ICI' >> ~/.zshrc
```

Puis ferme/rouvre le terminal. C'est mémorisé.

### 🐧 Linux (Ubuntu, etc.)

Pareil, mais dans `~/.bashrc` (le fichier de config par défaut sur Ubuntu) :

```bash
echo 'export ANTHROPIC_BASE_URL=https://78-47-61-209.sslip.io' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY=COLLE_TA_CLÉ_ICI' >> ~/.bashrc
```

Puis ferme/rouvre le terminal. C'est mémorisé.

### 🪟 Windows

Dans PowerShell, colle ceci (avec **ta** clé) :

```powershell
setx ANTHROPIC_BASE_URL "https://78-47-61-209.sslip.io"
setx ANTHROPIC_API_KEY "COLLE_TA_CLÉ_ICI"
```

Puis ferme/rouvre PowerShell. C'est mémorisé.

---

Une question ou un blocage ? Contacte le formateur. À lundi ! 🚀
