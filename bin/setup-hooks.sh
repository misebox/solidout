#!/bin/sh
set -e

HOOK_DIR="$(git rev-parse --show-toplevel)/.git/hooks"

ln -sf ../../bin/pre-commit "$HOOK_DIR/pre-commit"
ln -sf ../../bin/pre-push "$HOOK_DIR/pre-push"

echo "Git hooks installed."
