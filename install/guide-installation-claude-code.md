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

## Étape 0 : as-tu déjà Claude Code ?

Avant d'installer, vérifie. Ouvre ton terminal (Terminal sur Mac/Linux, PowerShell sur Windows) et tape :

```bash
claude --version
```

- **Un numéro de version s'affiche** (ex : `2.1.195`) → tu l'as déjà, **saute l'Étape 1** et va directement à l'Étape 2.
- **"command not found" / "n'est pas reconnu"** → tu ne l'as pas (ou pas dans le PATH), continue à l'Étape 1.

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

Ouvre **PowerShell** (cherche "PowerShell" dans le menu Démarrer). Deux méthodes, prends la **A** en priorité.

**Méthode A (recommandée) : WinGet.** C'est le gestionnaire d'applications de Windows, il s'occupe de tout (PATH compris), donc moins de soucis.

```powershell
winget install Anthropic.ClaudeCode
```

**Méthode B (si WinGet n'existe pas ou échoue) : le script officiel.**

```powershell
irm https://claude.ai/install.ps1 | iex
```

Ensuite, dans les deux cas :
1. Attends la fin de l'installation.
2. **Ferme et rouvre PowerShell** (obligatoire pour que `claude` soit reconnu).
3. Vérifie : `claude --version` doit afficher un numéro.

> [!warning] "claude n'est pas reconnu" même après installation (surtout méthode B)
> Ça veut dire que le programme est installé mais Windows ne sait pas où le trouver (problème de PATH). Vérifie d'abord qu'il est bien là :
> ```powershell
> & "$env:USERPROFILE\.local\bin\claude.exe" --version
> ```
> Si ça affiche un numéro, ajoute le dossier au PATH une bonne fois :
> ```powershell
> $p = [Environment]::GetEnvironmentVariable('PATH','User')
> [Environment]::SetEnvironmentVariable('PATH', "$p;$env:USERPROFILE\.local\bin", 'User')
> ```
> Puis **ferme et rouvre PowerShell** (le PATH ne se met à jour que dans les nouvelles fenêtres). `claude --version` marchera alors sans le chemin complet.

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
| `command not found: claude` (Mac/Linux) / `claude n'est pas reconnu` (Windows) | Ferme et rouvre le terminal. Sur Windows si ça persiste, c'est le PATH : voir l'encadré ⚠️ de l'Étape 1 (Windows). Sinon refais l'Étape 1. |
| (Windows) j'ai modifié le PATH mais `claude` n'est toujours pas reconnu | Une modif du PATH ne s'applique qu'aux **nouvelles** fenêtres PowerShell. Ferme celle-ci et rouvre-en une neuve. |
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
