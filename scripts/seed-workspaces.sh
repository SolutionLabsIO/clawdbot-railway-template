#!/usr/bin/env bash
# Seed agent workspace files from the Docker image into the persistent volume.
# Only copies files that don't already exist (so manual edits on the volume are preserved).
# To force-update, delete the file on the volume and redeploy.

set -e

CLAWDIO_WS="${OPENCLAW_WORKSPACE_DIR:-/data/workspace}"
KIMI_WS="${KIMI_WORKSPACE_DIR:-/data/.openclaw/workspace-kimi}"
SEED_DIR="/app/workspaces"

seed_file() {
  local src="$1" dst="$2"
  if [ ! -f "$dst" ]; then
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "[seed] Created $dst"
  else
    echo "[seed] Exists, skipping $dst"
  fi
}

# Clawdio workspace
for f in "$SEED_DIR/clawdio"/*; do
  [ -f "$f" ] || continue
  seed_file "$f" "$CLAWDIO_WS/$(basename "$f")"
done

# Kimi workspace
for f in "$SEED_DIR/kimi"/*; do
  [ -f "$f" ] || continue
  seed_file "$f" "$KIMI_WS/$(basename "$f")"
done

echo "[seed] Workspace seeding complete."
