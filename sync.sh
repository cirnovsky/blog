#!/usr/bin/env bash
set -euo pipefail

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" != "main" ]]; then
  echo "Refusing to push: current branch is '$current_branch' (expected 'main')."
  exit 1
fi

uv run sync.py

if [[ -n "$(git status --porcelain)" ]]; then
  git commit -am "[post] sync"
  git push origin main
else
  echo "No changes to commit after sync."
fi
