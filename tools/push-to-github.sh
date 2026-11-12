#!/usr/bin/env bash
# Push DEAD LETTER to a public GitHub repo and enable GitHub Pages (Actions build).
#
# SECURITY: the token is read ONLY from an environment variable, never written
# to a file, never committed, never printed. Use a fine-grained token scoped to
# this one repo (Contents: read/write, Pages: read/write, Actions: read/write,
# Metadata: read), set an expiry of 7 days, and REVOKE IT right after this runs.
#
# Usage (on your own machine):
#   export GITHUB_TOKEN='github_pat_...'
#   export GITHUB_USERNAME='your-username'
#   export REPO_NAME='deadletter-kiroween-2026'   # optional
#   bash tools/push-to-github.sh
#
# Prefer `git remote -v` + a normal `git push` with SSH/credential helper if you
# already have GitHub set up — that avoids handling a token altogether.

set -euo pipefail

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN to a short-lived fine-grained token}"
: "${GITHUB_USERNAME:?Set GITHUB_USERNAME to your GitHub login}"
REPO_NAME="${REPO_NAME:-deadletter-kiroween-2026}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

api() {
  curl -sS -X "${1}" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "${@:2}"
}

echo "==> Checking GitHub authentication (response is not printed)"
STATUS="$(curl -sS -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user)"
if [[ "$STATUS" != "200" ]]; then
  echo "Authentication failed (HTTP $STATUS). Check the token." >&2
  exit 1
fi

echo "==> Creating public repo ${GITHUB_USERNAME}/${REPO_NAME} if it does not exist"
api POST https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO_NAME}\",\"description\":\"DEAD LETTER — a tear-tolerant paper telegram. Kiroween 2026, Resurrection.\",\"private\":false,\"license_template\":\"mit\"}" \
  >/dev/null || true

if [[ ! -d .git ]]; then
  git init -b main
fi
git add -A
git -c user.name="Jayant Kumar" -c user.email="jayant.explains.ai@gmail.com" \
  commit -m "Initial DEAD LETTER submission scaffold — Kiroween 2026" || echo "(nothing new to commit)"

REMOTE="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi
echo "==> Pushing"
git push -u origin main

echo "==> Enabling GitHub Pages with the Actions build type"
api POST "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/pages" \
  -d '{"build_type":"workflow"}' >/dev/null || \
api PUT "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/pages" \
  -d '{"build_type":"workflow"}' >/dev/null || true

# Remove the credential-bearing remote URL from local git config immediately.
git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "==> Done. Live URL will be https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo "==> Revoke the token NOW at https://github.com/settings/personal-access-tokens"
