#!/usr/bin/env bash
set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=""
FORCE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)   FORCE=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --target)  TARGET="$2"; shift 2 ;;
    --help|-h) echo "Usage: $0 [--target <dir>] [--force] [--dry-run]"; exit 0 ;;
    *)         TARGET="$1"; shift ;;
  esac
done
[ -z "$TARGET" ] && TARGET="$(pwd)"

log()  { echo ">> $*"; }
warn() { echo "!! $*" >&2; }
err()  { echo "ERROR: $*" >&2; exit 1; }

DIRS_TO_COPY=(
  ".opencode/skills"
  ".opencode/tools"
  ".opencode/plugins"
  ".aiox-core"
)

FILES_TO_COPY=(
  ".opencode/AGENTS.md"
  ".opencode/package.json"
  ".opencode/package-lock.json"
  "opencode.json"
)

DIRS_TO_CREATE=(
  "$TARGET/.opencode/logs"
  "$TARGET/docs/designs"
  "$TARGET/docs/plans"
  "$TARGET/.agent/workflows"
)

copy_if_newer() {
  local src="$1" dst="$2"
  if [ -e "$dst" ] && [ "$src" -ot "$dst" ] && [ "$FORCE" = false ]; then
    return 1
  fi
  mkdir -p "$(dirname "$dst")"
  if [ "$DRY_RUN" = true ]; then
    log "[DRY-RUN] cp -r $src $dst"
    return 0
  fi
  cp -r "$src" "$dst" 2>/dev/null || cp -r "$src"/* "$dst"
  return 0
}

merge_opencode_json() {
  local src="$1" dst="$2"
  if [ ! -f "$dst" ]; then
    if [ "$DRY_RUN" = true ]; then
      log "[DRY-RUN] cp $src $dst (new)"
      return
    fi
    cp "$src" "$dst"
    log "Created $dst"
    return
  fi

  if command -v node &>/dev/null; then
    if [ "$DRY_RUN" = false ]; then
      node -e "
        const fs = require('fs');
        const src = JSON.parse(fs.readFileSync('$src','utf8'));
        const dst = JSON.parse(fs.readFileSync('$dst','utf8'));
        if (!dst.instructions) dst.instructions = [];
        if (!dst.instructions.includes('.opencode/AGENTS.md'))
          dst.instructions.push('.opencode/AGENTS.md');
        Object.keys(src.agent||{}).forEach(k => { if(!dst.agent||!dst.agent[k]) { if(!dst.agent) dst.agent={}; dst.agent[k]=src.agent[k]; console.log('  Agent added: @'+k); }});
        Object.keys(src.command||{}).forEach(k => { if(!dst.command||!dst.command[k]) { if(!dst.command) dst.command={}; dst.command[k]=src.command[k]; console.log('  Command added: /'+k); }});
        fs.writeFileSync('$dst', JSON.stringify(dst, null, 2)+'\n');
      "
      log "Merged $dst"
    fi
  else
    warn "Node.js not found, skipping opencode.json merge"
    warn "Manually add: 'instructions': ['.opencode/AGENTS.md'] to your opencode.json"
  fi
}

show_summary() {
  echo ""
  echo "========================================"
  echo " AIOX Superpowers instalado com sucesso!"
  echo "========================================"
  echo ""
  echo " Projeto : $TARGET"
  echo ""
  echo " Estrutura adicionada:"
  echo "   .opencode/AGENTS.md   - Instrucoes mestre"
  echo "   .opencode/skills/     - 21 skills"
  echo "   .opencode/tools/      - 4 tools"
  echo "   .opencode/plugins/    - Plugin bootstrap"
  echo "   .aiox-core/workflows/ - 6 workflows"
  echo ""
  echo " Proximos passos:"
  echo "   1. Abra o projeto:  opencode"
  echo "   2. Execute:         /aiox-init"
  echo "   3. Veja ajuda:      /aiox-help"
  echo ""
  echo " Comandos: /aiox-help, /aiox-brainstorm, /aiox-plan,"
  echo "           /aiox-workflow, /aiox-story, /aiox-review, /aiox-status"
  echo "========================================"
}

# ---- Main ----
log "AIOX Superpowers Installer"
log "Source: $SOURCE"
log "Target: $TARGET"
echo ""

[ -f "$SOURCE/.opencode/AGENTS.md" ] || err "Source does not look like aiox-superpowers. Run from framework root."
[ "$DRY_RUN" = true ] && log "DRY-RUN mode - no files will be written"

log "Creating directories..."
for d in "${DIRS_TO_CREATE[@]}"; do
  if [ ! -d "$d" ]; then
    if [ "$DRY_RUN" = true ]; then
      log "[DRY-RUN] mkdir -p $d"
    else
      mkdir -p "$d"
    fi
  fi
done

log "Copying directories..."
for d in "${DIRS_TO_COPY[@]}"; do
  src="$SOURCE/$d"
  dst="$TARGET/$d"
  if [ -d "$src" ]; then
    if copy_if_newer "$src" "$dst"; then
      log "  $d -> $d"
    fi
  fi
done

log "Copying files..."
for f in "${FILES_TO_COPY[@]}"; do
  src="$SOURCE/$f"
  dst="$TARGET/$f"
  if [ -f "$src" ]; then
    if [ "$f" = "opencode.json" ]; then
      merge_opencode_json "$src" "$dst"
    elif copy_if_newer "$src" "$dst"; then
      log "  $f -> $f"
    fi
  fi
done

if [ "$DRY_RUN" = false ]; then
  log "Installing .opencode dependencies..."
  (cd "$TARGET/.opencode" && npm install) && log "  npm install OK" || warn "  npm install failed, run: cd .opencode && npm install"
fi

show_summary
