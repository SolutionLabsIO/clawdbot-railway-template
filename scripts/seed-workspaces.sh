#!/usr/bin/env bash
# Seed agent workspace files from the Docker image into the persistent volume.
# - New files: created automatically
# - Existing files: updated only if the image version is newer (checksum differs)
# - Manual edits on the volume will be overwritten on next deploy if the image file changed.
#   To preserve local edits, make the change in the repo instead.

set -e

CLAWDIO_WS="${OPENCLAW_WORKSPACE_DIR:-/data/workspace}"
KIMI_WS="${KIMI_WORKSPACE_DIR:-/data/.openclaw/workspace-kimi}"
SEED_DIR="/app/workspaces"

seed_file() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"

  if [ ! -f "$dst" ]; then
    cp "$src" "$dst"
    echo "[seed] Created $dst"
    return
  fi

  # Update if content differs (image has a newer version)
  local src_hash dst_hash
  src_hash=$(md5sum "$src" 2>/dev/null | awk '{print $1}') || src_hash=$(md5 -q "$src" 2>/dev/null)
  dst_hash=$(md5sum "$dst" 2>/dev/null | awk '{print $1}') || dst_hash=$(md5 -q "$dst" 2>/dev/null)

  if [ "$src_hash" != "$dst_hash" ]; then
    cp "$src" "$dst"
    echo "[seed] Updated $dst (content changed)"
  else
    echo "[seed] Up to date $dst"
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
