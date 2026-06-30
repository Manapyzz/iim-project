#!/usr/bin/env bash
# =====================================================================
# lint-dette.sh — wrapper pedagogique pour le linter de dette IA.
#
# Dans le repo principal /Users/mnpcorp/mnplab/iim-project/ il existe un
# vrai linter de dette IA en Python : scripts/lint_dette_ia.py.
# Ce wrapper l'appelle si disponible, sinon il fait un mini-scan local
# 100 % regex pour la demo (zero dependance).
#
# Sortie : code 0 si propre, code 1 si dette detectee.
# =====================================================================

set -uo pipefail

# Couleurs ANSI pour la demo en classe
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="${1:-$PROJECT_ROOT/src}"

# Linter "officiel" du repo principal (s'il est present)
MAIN_LINTER="/Users/mnpcorp/mnplab/iim-project/scripts/lint_dette_ia.py"

echo ""
echo "============================================================"
echo "  LINTER DE DETTE IA — scan de $TARGET_DIR"
echo "============================================================"
echo ""

if [ -f "$MAIN_LINTER" ]; then
  echo "Utilisation du linter principal : $MAIN_LINTER"
  python3 "$MAIN_LINTER" "$TARGET_DIR"
  exit $?
fi

# --- Fallback : mini-scan local 100 % regex ---
echo "Linter principal absent. Utilisation du mini-scan local."
echo ""

total_issues=0

scan_pattern() {
  local label="$1"
  local pattern="$2"
  local color="$3"
  local hits
  hits=$(grep -rEn "$pattern" "$TARGET_DIR" --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null || true)
  if [ -n "$hits" ]; then
    local count
    count=$(echo "$hits" | wc -l | tr -d ' ')
    total_issues=$((total_issues + count))
    echo -e "${color}[$label] $count occurrence(s)${NC}"
    echo "$hits" | sed 's/^/    /'
    echo ""
  fi
}

# 1. TODO restants
scan_pattern "TODO" 'TODO[: ]' "$YELLOW"

# 2. try/catch silencieux (catch vide ou commentaire "swallow")
scan_pattern "SILENT_CATCH" 'catch[[:space:]]*\{[[:space:]]*(/\*|\}|$)' "$RED"
scan_pattern "SILENT_CATCH_COMMENT" 'swallow' "$RED"

# 3. Magic numbers business (heuristique : nombres a virgule au milieu du code)
scan_pattern "MAGIC_NUMBER" '\* [0-9]+\.[0-9]+' "$YELLOW"

# 4. Stub functions (return 0 + TODO)
scan_pattern "STUB" 'return 0; // TODO' "$RED"

# 5. God file detection
echo "--- Detection god files (>250 lignes) ---"
god_files=$(find "$TARGET_DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) -exec wc -l {} \; 2>/dev/null \
  | awk '$1 > 250 { print $2 " (" $1 " lignes)" }')
if [ -n "$god_files" ]; then
  echo -e "${RED}[GOD_FILE]${NC}"
  echo "$god_files" | sed 's/^/    /'
  god_count=$(echo "$god_files" | wc -l | tr -d ' ')
  total_issues=$((total_issues + god_count))
  echo ""
fi

echo "============================================================"
if [ $total_issues -eq 0 ]; then
  echo -e "  ${GREEN}OK — aucune dette detectee${NC}"
  echo "============================================================"
  exit 0
else
  echo -e "  ${RED}KO — $total_issues probleme(s) detecte(s)${NC}"
  echo "============================================================"
  exit 1
fi
