# Guide d'installation : Claude Code (Formation IIM)

Bienvenue ! On installe **Claude Code** ensemble au début de la formation (J1), en suivant ce guide.
Ça prend **5 à 10 minutes**. Suis les étapes dans l'ordre, ne saute rien.

> [!info] C'est quoi le principe
> Tu utilises Claude Code normalement, mais tes requêtes passent par un **proxy** géré par le formateur. Tu n'as donc **pas besoin d'un compte Claude payant** : ta clé personnelle suffit. Chaque étudiant a un budget plafonné.

## Deux façons de l'utiliser (tu choisis)

| Mode | Pour qui | Interface |
|------|----------|-----------|
| **Terminal** | Le plus simple, recommandé pour démarrer | Dans une fenêtre de terminal |
| **Extension VS Code** | Si tu codes déjà dans VS Code | Intégré à ton éditeur |

Les deux passent par le proxy. Tu peux même faire les deux : **la configuration de ta clé (Étape 2) est commune aux deux.**

---

## Étape 0 : as-tu déjà Claude Code ?

Avant d'installer, vérifie. Ouvre un terminal (Terminal sur Mac/Linux, PowerShell sur Windows) et tape :

```bash
claude --version
```

- **Un numéro s'affiche** (ex : `2.1.195`) → déjà installé, **saute l'Étape 1**, va directement à l'Étape 2.
- **"command not found" / "n'est pas reconnu"** → pas encore installé, continue à l'Étape 1.

---

## Étape 1 : Installer Claude Code

Choisis **l'Option A** (terminal) ou **l'Option B** (VS Code), selon le mode que tu veux.

### Option A : en terminal (CLI)

#### 🍎 Mac / 🐧 Linux (Ubuntu, etc.)

1. Ouvre un **terminal** :
   - **Mac** : Spotlight (`Cmd + Espace`), tape "Terminal".
   - **Linux/Ubuntu** : `Ctrl + Alt + T`.
2. Colle cette ligne, puis **Entrée** :

   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

3. Attends la fin. Si on te demande ton mot de passe, c'est normal (il reste invisible), tape-le et Entrée.
4. **Ferme et rouvre le terminal**, puis vérifie : `claude --version` doit afficher un numéro.

> [!warning] "command not found: claude" après installation (Mac/Linux)
> Le programme est installé dans `~/.local/bin` mais ce dossier n'est pas dans ton PATH. Ajoute-le une bonne fois :
> - **Mac (zsh)** :
>   ```bash
>   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
>   ```
> - **Linux (bash)** :
>   ```bash
>   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
>   ```
> Puis `claude --version`.

#### 🪟 Windows

Ouvre **PowerShell** (menu Démarrer). Deux méthodes, prends la **A** en priorité.

**Méthode A (recommandée) : WinGet.** Le gestionnaire d'applications de Windows, il gère le PATH tout seul.

```powershell
winget install Anthropic.ClaudeCode
```

**Méthode B (si WinGet échoue) : le script officiel.**

```powershell
irm https://claude.ai/install.ps1 | iex
```

Ensuite, dans les deux cas : **ferme et rouvre PowerShell**, puis vérifie `claude --version`.

> [!warning] "claude n'est pas reconnu" même après installation (surtout méthode B)
> Le programme est installé mais Windows ne le trouve pas (PATH). Vérifie d'abord qu'il est là :
> ```powershell
> & "$env:USERPROFILE\.local\bin\claude.exe" --version
> ```
> Si un numéro s'affiche, ajoute le dossier au PATH :
> ```powershell
> $p = [Environment]::GetEnvironmentVariable('PATH','User')
> [Environment]::SetEnvironmentVariable('PATH', "$p;$env:USERPROFILE\.local\bin", 'User')
> ```
> Puis **ferme et rouvre PowerShell** (le PATH ne se met à jour que dans une nouvelle fenêtre).

### Option B : dans VS Code (extension)

1. Ouvre **VS Code**.
2. Ouvre le panneau Extensions (`Cmd + Shift + X` sur Mac, `Ctrl + Shift + X` sur Windows/Linux).
3. Cherche **"Claude Code"** (éditeur : **Anthropic**) et clique **Install**.
   *(Alternative en ligne de commande : `code --install-extension anthropic.claude-code`)*

> [!info] Pas besoin du CLI séparé
> L'extension embarque sa propre version de Claude Code. Tu peux donc utiliser l'Option B sans faire l'Option A. (Si tu veux quand même taper `claude` dans le terminal intégré de VS Code, fais aussi l'Option A.)

---

## Étape 2 : Configurer ta clé (commun terminal + VS Code)

C'est l'étape clé. On écrit ta clé une bonne fois dans un fichier de config. **C'est permanent** (rien à retaper à chaque session) et **ça marche pour le terminal comme pour VS Code**.

⚠️ Dans la commande ci-dessous, remplace `COLLE_TA_CLÉ_ICI` par la clé personnelle que le formateur t'a donnée (`sk-...`) **avant** de l'exécuter.

### 🍎 Mac / 🐧 Linux

Colle ceci dans le terminal (après avoir mis ta clé) :

```bash
mkdir -p ~/.claude
cat > ~/.claude/settings.json <<'EOF'
{
  "model": "claude-sonnet-4-6",
  "env": {
    "ANTHROPIC_BASE_URL": "https://78-47-61-209.sslip.io",
    "ANTHROPIC_API_KEY": "COLLE_TA_CLÉ_ICI",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5"
  }
}
EOF
```

### 🪟 Windows (PowerShell)

Colle ceci (après avoir mis ta clé) :

```powershell
$dir = "$env:USERPROFILE\.claude"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
@'
{
  "model": "claude-sonnet-4-6",
  "env": {
    "ANTHROPIC_BASE_URL": "https://78-47-61-209.sslip.io",
    "ANTHROPIC_API_KEY": "COLLE_TA_CLÉ_ICI",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5"
  }
}
'@ | Set-Content -Encoding utf8 "$dir\settings.json"
```

> [!tip] Pourquoi cette méthode
> Le fichier `settings.json` est lu automatiquement par Claude Code (terminal ET extension VS Code), quel que soit la façon dont tu le lances. Plus de variables à recoller à chaque ouverture de fenêtre.

> [!info] Pourquoi la ligne `"model"`
> Par défaut, Claude Code démarre sur **Opus**, un modèle qui n'est **pas autorisé** sur le proxy de la formation (tu aurais une erreur à chaque message). La ligne `"model": "claude-sonnet-4-6"` te met d'office sur **Sonnet** (autorisé, et largement suffisant). La ligne `ANTHROPIC_DEFAULT_HAIKU_MODEL` fait pareil pour les petites tâches en arrière-plan (elles tournent sur Haiku). Tu n'as donc **jamais besoin de changer de modèle à la main.**

> [!warning] Si tu avais déjà un fichier `settings.json`
> La commande l'écrase. Si tu utilisais déjà Claude Code avec des réglages perso, préviens le formateur pour qu'on fusionne proprement au lieu d'écraser.

---

## Étape 3 : Lancer et tester

### En terminal (Option A)

Tape :

```bash
claude
```

### Dans VS Code (Option B)

1. **Une seule fois**, désactive la demande de connexion : ouvre les réglages (`Cmd/Ctrl + ,`), cherche **"Claude Code Disable Login Prompt"**, et **coche la case**. (Comme ta clé est dans `settings.json`, pas besoin de login compte.)
2. Ouvre le panneau **Claude Code** : clique sur l'icône Claude dans la barre latérale, ou `Cmd/Ctrl + Shift + P` puis tape "Claude Code".

### Le test (dans les deux cas)

Écris :

```
Bonjour, réponds juste "OK ça marche".
```

S'il te répond → **tout est bon, tu es prêt.** 🎉

> [!warning] S'il te propose quand même de te connecter à un compte Claude
> **Ne te connecte PAS.** Ça veut dire que ta clé n'a pas été lue. Vérifie l'Étape 2 (le fichier `settings.json` bien créé, ta clé bien collée, sans espace ni guillemet en trop). En VS Code, vérifie aussi que "Disable Login Prompt" est coché.

Pour quitter en terminal : `/exit` ou `Ctrl + C` deux fois.

---

## 🆘 Problèmes fréquents

| Symptôme | Solution |
|----------|----------|
| `command not found: claude` / `n'est pas reconnu` | Ferme et rouvre le terminal. Si ça persiste, c'est le PATH : voir l'encadré ⚠️ de l'Étape 1 (ton OS). |
| (Windows) PATH modifié mais toujours pas reconnu | Une modif du PATH ne s'applique qu'aux **nouvelles** fenêtres. Ferme celle-ci, rouvres-en une. |
| Erreur **401 / Authentication** | Clé mal collée (espace, guillemet, clé incomplète) dans `settings.json`. Refais l'Étape 2. |
| On me demande de me connecter à un compte | Ta clé n'est pas lue : vérifie `settings.json` (Étape 2). En VS Code, coche "Disable Login Prompt". |
| Erreur **429 / budget exceeded** | Ton budget est épuisé, préviens le formateur. |
| Erreur **model not allowed** | Tu as changé manuellement pour un modèle non autorisé (ex : Opus via `/model`). Reviens sur Sonnet : `/model claude-sonnet-4-6`. Avec le `settings.json` de l'Étape 2, ça n'arrive normalement pas. |
| (VS Code Mac) la clé n'est pas prise alors qu'elle marche en terminal | Normalement réglé par `settings.json`. Sinon, lance VS Code depuis un terminal avec `code .`. |

---

## Annexe : alternative par variables d'environnement

La méthode `settings.json` (Étape 2) est la plus simple et la recommandée. Si tu préfères les variables d'environnement, tu peux à la place les rendre permanentes :

- **Mac (zsh)** :
  ```bash
  echo 'export ANTHROPIC_BASE_URL=https://78-47-61-209.sslip.io' >> ~/.zshrc
  echo 'export ANTHROPIC_API_KEY=COLLE_TA_CLÉ_ICI' >> ~/.zshrc
  ```
- **Linux (bash)** : pareil dans `~/.bashrc`.
- **Windows (PowerShell)** :
  ```powershell
  setx ANTHROPIC_BASE_URL "https://78-47-61-209.sslip.io"
  setx ANTHROPIC_API_KEY "COLLE_TA_CLÉ_ICI"
  ```
  Puis ferme/rouvre PowerShell.

Ne mélange pas les deux méthodes : choisis `settings.json` **ou** les variables, pas les deux.

---

Une question ou un blocage ? Contacte le formateur. À lundi ! 🚀
