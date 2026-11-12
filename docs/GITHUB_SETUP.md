# Push to GitHub — exact steps (agent-push option)

You asked me to push from this sandbox. I can do that, but I need three things
from you first. Everything is prepared in `tools/push-to-github.sh`.

## Step 1 — create the EMPTY public repo yourself (30 seconds)

Go to https://github.com/new and create:

- **Name:** `deadletter-kiroween-2026` (or tell me another name)
- **Visibility:** Public
- **Do NOT** add a README, .gitignore or license — the repo must be empty,
  otherwise the push will be rejected as non-fast-forward.
- **Description:** `DEAD LETTER — a tear-tolerant paper telegram. Kiroween 2026, Resurrection.`

Why you create it: a fine-grained token can be scoped to *one existing repo*,
which is much safer than a broad token. GitHub's REST API also requires either
"Repository creation: write" or "Administration: write" to create a repo with a
fine-grained token ([GitHub docs](https://docs.github.com/en/rest/repos/repos));
creating it in the browser avoids that permission entirely. The script's
create-repo call is harmless if the repo already exists.

## Step 2 — create a short-lived fine-grained token

GitHub → Settings → Developer settings → Personal access tokens →
**Fine-grained tokens** → Generate new token:

| Setting | Value |
| --- | --- |
| Token name | `deadletter-push` |
| Expiration | **7 days** (shortest practical) |
| Repository access | **Only select repositories** → `deadletter-kiroween-2026` |
| Permissions → Repository | **Contents: read & write**, **Pages: read & write**, **Actions: read & write**, **Metadata: read** (mandatory) |
| Account permissions | none |

Use `Authorization: Bearer …` for fine-grained tokens — the script already does
([GitHub community note](https://github.com/orgs/community/discussions/183370)).

## Step 3 — send me these three values

1. Your **GitHub username**
2. The **repo name** (or just say "default")
3. The **token** (`github_pat_…`)

Then I run, from `/home/user/kiroween-2026`:

```bash
GITHUB_TOKEN='…' GITHUB_USERNAME='…' REPO_NAME='deadletter-kiroween-2026' \
  bash tools/push-to-github.sh
```

It verifies auth, pushes `main`, enables GitHub Pages with `build_type: workflow`,
and immediately strips the token from the git remote URL. It never writes the
token to a file or a commit.

## Step 4 — REVOKE THE TOKEN IMMEDIATELY

https://github.com/settings/personal-access-tokens → delete `deadletter-push`.
Treat the token as exposed because it appeared in this conversation. Revoke it
as soon as I confirm the push, and never reuse it.

## What happens next

- `.github/workflows/pages.yml` runs automatically on the push to `main`:
  `npm ci` → tests → build → compliance gate → deploy `public/`.
- Live URL: `https://<username>.github.io/deadletter-kiroween-2026/`
- If Pages doesn't appear after ~2 minutes: repo → Settings → Pages → set
  **Source = GitHub Actions**, then re-run the workflow from the Actions tab.
- Paste the live URL into `docs/SUBMISSION_COPY.md` (`[[LIVE_URL]]`) and into
  the Devpost form. Also update the two `[[USERNAME]]` placeholders in
  `README.md` and `docs/SUBMISSION_COPY.md`.

## Alternative (no token in chat at all)

Run the same script on your own machine with `GITHUB_TOKEN` in your shell, or
just `git remote add origin … && git push` with your normal SSH/credential
helper. Then tell me the URLs and I'll update the docs. This is the safest path.
