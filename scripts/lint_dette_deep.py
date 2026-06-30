#!/usr/bin/env python3
"""
Mode "deep" du linter de dette IA : lance des outils EXTERNES deterministes
(toujours zero LLM) que le regex ne peut pas faire de facon fiable.

- secrets-gitleaks   : gitleaks + trivy (detection de secrets par entropie)
- type-errors        : tsc (erreurs de typage TypeScript)
- duplication        : jscpd (copier-coller, vrai tokenizer)
- fonction-trop-longue / imbrication-profonde / import-inutilise : tree-sitter
  (vrai parseur AST TS/TSX/JS)

Chaque check degrade proprement : si l'outil manque, on le marque "absent" au
lieu de crasher. Tout reste deterministe (meme version d'outil + meme code =
meme resultat).

Expose :
    run_deep_checks(repo: Path, files: list[Path], is_generated) -> dict
        {'findings': [(rule, file, line, detail)], 'status': {outil: etat}}
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

# --- Seuils AST ---
LONG_FUNCTION_LINES = 50      # corps de fonction au-dela = trop longue
DEEP_NESTING = 5              # blocs imbriques au-dela = trop profond
TSC_TIMEOUT = 120
TOOL_TIMEOUT = 180

# Erreurs tsc dues a des deps non installees (bruit, pas de la dette de typage)
TSC_MODULE_ERRORS = {'TS2307', 'TS2305', 'TS2306', 'TS6053', 'TS2688', 'TS7016'}

AST_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'}
TS_LANG_BY_EXT = {
    '.ts': 'typescript', '.tsx': 'tsx', '.mts': 'typescript', '.cts': 'typescript',
    '.js': 'javascript', '.jsx': 'tsx', '.mjs': 'javascript', '.cjs': 'javascript',
}


def _run(cmd: list[str], cwd: Path | None = None, timeout: int = TOOL_TIMEOUT):
    """Lance une commande, renvoie (returncode, stdout, stderr) ou None si absente."""
    if shutil.which(cmd[0]) is None:
        return None
    try:
        proc = subprocess.run(
            cmd, cwd=str(cwd) if cwd else None, capture_output=True,
            text=True, timeout=timeout,
        )
        return proc.returncode, proc.stdout, proc.stderr
    except subprocess.TimeoutExpired:
        return -1, '', 'timeout'
    except OSError as exc:
        return -1, '', str(exc)


# --------------------------------------------------------------------------
# Secrets : gitleaks + trivy
# --------------------------------------------------------------------------

def check_gitleaks(repo: Path) -> tuple[list, str]:
    findings = []
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / 'gitleaks.json'
        # gitleaks 8.18+ : "dir" ; fallback "detect --no-git" pour versions plus vieilles
        res = _run(['gitleaks', 'dir', str(repo), '--report-format', 'json',
                    '--report-path', str(out), '--redact', '--exit-code', '0',
                    '--no-banner'])
        if res is None:
            return [], 'absent'
        if not out.exists():
            res = _run(['gitleaks', 'detect', '--source', str(repo), '--no-git',
                        '--report-format', 'json', '--report-path', str(out),
                        '--redact', '--exit-code', '0', '--no-banner'])
            if res is None or not out.exists():
                return [], 'erreur'
        try:
            data = json.loads(out.read_text() or '[]')
        except (json.JSONDecodeError, OSError):
            return [], 'erreur'
        for item in data or []:
            rel = _rel(item.get('File', ''), repo)
            findings.append((rel, item.get('StartLine', 1),
                             f"secret ({item.get('RuleID', 'gitleaks')})"))
    return findings, 'ok'


def check_trivy(repo: Path) -> tuple[list, str]:
    res = _run(['trivy', 'fs', '--scanners', 'secret', '--format', 'json',
                '--quiet', str(repo)])
    if res is None:
        return [], 'absent'
    rc, out, _ = res
    try:
        data = json.loads(out or '{}')
    except json.JSONDecodeError:
        return [], 'erreur'
    findings = []
    for result in data.get('Results', []) or []:
        rel = _rel(result.get('Target', ''), repo)
        for sec in result.get('Secrets', []) or []:
            findings.append((rel, sec.get('StartLine', 1),
                             f"secret ({sec.get('RuleID', 'trivy')})"))
    return findings, 'ok'


# --------------------------------------------------------------------------
# Duplication : jscpd
# --------------------------------------------------------------------------

def check_jscpd(repo: Path) -> tuple[list, str]:
    with tempfile.TemporaryDirectory() as tmp:
        # Sources JS/TS uniquement (pas JSON/CSS/config/lock) + seuil consequent,
        # sinon le boilerplate Next.js identique entre projets gonfle le compteur.
        res = _run(['jscpd', str(repo), '--silent', '--reporters', 'json',
                    '--output', tmp, '--min-lines', '10', '--min-tokens', '80',
                    '--format', 'javascript,jsx,typescript,tsx',
                    '--ignore', '**/node_modules/**,**/.next/**,**/dist/**,'
                                '**/build/**,**/*.min.*,**/.git/**,**/prisma/**,'
                                '**/generated/**,**/*.config.*,**/*.d.ts'],
                   timeout=TOOL_TIMEOUT)
        if res is None:
            return [], 'absent'
        report = Path(tmp) / 'jscpd-report.json'
        if not report.exists():
            return [], 'erreur'
        try:
            data = json.loads(report.read_text())
        except (json.JSONDecodeError, OSError):
            return [], 'erreur'
    findings = []
    for dup in data.get('duplicates', []) or []:
        first = dup.get('firstFile', {})
        second = dup.get('secondFile', {})
        rel = _rel(first.get('name', ''), repo)
        lines = dup.get('lines', dup.get('fragment', '').count('\n') or 0)
        other = _rel(second.get('name', ''), repo)
        findings.append((rel, first.get('start', 1),
                         f'{lines} lignes dupliquees avec {other}'))
    return findings, 'ok'


# --------------------------------------------------------------------------
# Typecheck : tsc (best-effort)
# --------------------------------------------------------------------------

def _tsc_project_dirs(repo: Path) -> list[Path]:
    """Repertoires de projet TS : racine + sous-dossiers directs (monorepo)."""
    skip = {'node_modules', '.git', '.next', 'dist', 'build', 'out'}
    dirs = []
    if (repo / 'tsconfig.json').exists():
        dirs.append(repo)
    for sub in sorted(repo.iterdir()):
        if sub.is_dir() and sub.name not in skip and (sub / 'tsconfig.json').exists():
            dirs.append(sub)
    return dirs


def check_tsc(repo: Path) -> tuple[list, str]:
    projects = _tsc_project_dirs(repo)
    if not projects:
        return [], 'pas de tsconfig'
    pattern = re.compile(r'^(.+?)\((\d+),\d+\):\s*error\s+(TS\d+):\s*(.+)$',
                         re.MULTILINE)
    findings = []
    ran, skipped = False, []
    for proj in projects:
        if not (proj / 'node_modules').exists():
            skipped.append(proj.name)
            continue
        # IMPORTANT : --package typescript (sinon npx installe un paquet "tsc" bidon)
        res = _run(['npx', '--yes', '--package', 'typescript', 'tsc',
                    '--noEmit', '--pretty', 'false'],
                   cwd=proj, timeout=TSC_TIMEOUT)
        if res is None:
            return [], 'absent (node/npx manquant)'
        rc, out, err = res
        if err == 'timeout':
            skipped.append(proj.name + ':timeout')
            continue
        ran = True
        for m in pattern.finditer(out + '\n' + err):
            code = m.group(3)
            if code in TSC_MODULE_ERRORS:
                continue
            full = (proj / m.group(1)).resolve()
            findings.append((_rel(str(full), repo), int(m.group(2)),
                             f'{code}: {m.group(4)[:120]}'))
    if not ran:
        return [], f'node_modules absent (npm install requis) : {",".join(skipped)}'
    status = 'ok' + (f' (skip: {",".join(skipped)})' if skipped else '')
    return findings, status


# --------------------------------------------------------------------------
# AST (tree-sitter) : fonctions trop longues, imbrication, imports inutilises
# --------------------------------------------------------------------------

def _get_parsers():
    try:
        from tree_sitter import Parser
        from tree_sitter_language_pack import get_language
    except ImportError:
        return None
    cache: dict = {}

    def parser_for(ext: str):
        lang_name = TS_LANG_BY_EXT.get(ext)
        if not lang_name:
            return None
        if lang_name not in cache:
            cache[lang_name] = Parser(get_language(lang_name))
        return cache[lang_name]

    return parser_for


FUNCTION_NODES = {
    'function_declaration', 'function_expression', 'arrow_function',
    'method_definition', 'generator_function_declaration',
}


def _max_block_depth(node, current=0):
    """Profondeur maximale de blocs/instructions imbriques dans une fonction."""
    is_block = node.type in ('statement_block', 'if_statement', 'for_statement',
                             'while_statement', 'switch_statement', 'try_statement')
    depth = current + (1 if is_block else 0)
    best = depth
    for child in node.children:
        best = max(best, _max_block_depth(child, depth))
    return best


def check_ast(repo: Path, files, is_generated) -> tuple[list, str]:
    parser_for = _get_parsers()
    if parser_for is None:
        return [], 'tree-sitter absent'
    findings = []
    for path in files:
        ext = path.suffix.lower()
        if ext not in AST_EXTENSIONS:
            continue
        parser = parser_for(ext)
        if parser is None:
            continue
        try:
            raw = path.read_bytes()
        except OSError:
            continue
        text = raw.decode('utf-8', errors='ignore')
        if is_generated(text):
            continue
        rel = str(path.relative_to(repo))
        tree = parser.parse(raw)
        root = tree.root_node

        # Fonctions trop longues + imbrication profonde
        for node in _iter(root):
            if node.type in FUNCTION_NODES:
                span = node.end_point[0] - node.start_point[0] + 1
                if span > LONG_FUNCTION_LINES:
                    findings.append(('fonction-trop-longue', rel,
                                     node.start_point[0] + 1,
                                     f'fonction de {span} lignes'))
                depth = _max_block_depth(node)
                if depth >= DEEP_NESTING:
                    findings.append(('imbrication-profonde', rel,
                                     node.start_point[0] + 1,
                                     f'{depth} niveaux imbriques'))

        # Imports inutilises (nom importe jamais reference ailleurs)
        findings.extend(_unused_imports(root, text, rel))
    return findings, 'ok'


def _iter(node):
    yield node
    for child in node.children:
        yield from _iter(child)


def _unused_imports(root, text: str, rel: str):
    """Detecte les identifiants importes jamais utilises dans le fichier."""
    out = []
    imported: dict[str, int] = {}      # nom -> ligne
    import_spans = []                  # (start_byte, end_byte) des import statements
    for node in _iter(root):
        if node.type == 'import_statement':
            import_spans.append((node.start_byte, node.end_byte))
            for ident in _iter(node):
                if ident.type == 'identifier':
                    name = text[ident.start_byte:ident.end_byte]
                    # ignore les mots-cles de chemin / 'from'
                    if name and name not in ('from',):
                        imported.setdefault(name, ident.start_point[0] + 1)
    if not imported:
        return out
    # Compte les usages hors des lignes d'import
    for name, line in imported.items():
        used = False
        for m in re.finditer(r'\b' + re.escape(name) + r'\b', text):
            pos = m.start()
            if any(s <= pos < e for s, e in import_spans):
                continue
            used = True
            break
        if not used:
            out.append(('import-inutilise', rel, line, f"import inutilise : {name}"))
    return out


# --------------------------------------------------------------------------
# Orchestration
# --------------------------------------------------------------------------

def _rel(path_str: str, repo: Path) -> str:
    if not path_str:
        return '.'
    try:
        return str(Path(path_str).resolve().relative_to(repo.resolve()))
    except (ValueError, OSError):
        return path_str


def run_deep_checks(repo: Path, files, is_generated) -> dict:
    """Lance tous les checks deep. Renvoie findings + statut par outil."""
    repo = repo.resolve()
    findings: list = []
    status: dict = {}

    # Secrets : gitleaks + trivy, dedupe par (fichier, ligne)
    gl, status['gitleaks'] = check_gitleaks(repo)
    tv, status['trivy'] = check_trivy(repo)
    seen = set()
    for rel, line, detail in gl + tv:
        key = (rel, line)
        if key in seen:
            continue
        seen.add(key)
        findings.append(('secrets-gitleaks', rel, line, detail))

    # Duplication
    dup, status['jscpd'] = check_jscpd(repo)
    for rel, line, detail in dup:
        findings.append(('duplication', rel, line, detail))

    # Typecheck
    tsc, status['tsc'] = check_tsc(repo)
    for rel, line, detail in tsc:
        findings.append(('type-errors', rel, line, detail))

    # AST (tree-sitter)
    ast, status['ast'] = check_ast(repo, files, is_generated)
    findings.extend(ast)

    return {'findings': findings, 'status': status}
