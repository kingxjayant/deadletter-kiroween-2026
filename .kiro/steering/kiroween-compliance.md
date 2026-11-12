---
inclusion: always
---

# Kiroween 2026 Official Rules — hard constraints

Derived from https://kiroween.devpost.com/rules and /details/faqs (read 12 Nov 2026).

## Eligibility
- Submission window: **30 Oct 2026 9:00 AM PT – 4 Dec 2026 2:00 PM PT**
  (= 5 Dec 2026, 3:30 AM IST). No edits after the deadline.
- Only **new** projects created in that window. Do not reuse prior work.
  Disclose all pre-existing code in `docs/PROVENANCE.md` (vendored libraries).
- Entrant: Jayant Kumar, 20, student, Marwari College Ranchi, Jharkhand, India.
  India is not on the excluded-territory list. Teams ≤ 3.
- All materials in English. Demo video: < 3 min, public on YouTube, no
  third-party trademarks or copyrighted music.

## Repository (disqualification risks)
- Public **GitHub** repo only (not GitLab/Bitbucket).
- Root must contain **`/.kiro`**, committed. **NEVER add `.kiro` or any subfolder
  to `.gitignore`.** `tools/audit-submission.mjs` enforces this in CI and hooks.
- Detectable open-source license file (MIT) visible in the GitHub About section.
- All source, assets and run instructions must be in the repo.

## Submission form
- Category: **Resurrection** (one category only).
- Live app URL (GitHub Pages), GitHub repo URL, text description, YouTube demo link.
- Write-up on how Kiro was used: IDE/CLI/Web/Crew differences, custom agents,
  hooks, spec-driven development vs vibe coding, steering, MCP, PBT, powers.
- Bonus prizes to enter: **Best Student Project: Resurrection** (LinkedIn,
  student email, year/degree, school for every member; proof may be requested),
  **Bonus Blog**, **Social Blitz** (`#KiroweenHackathon26` at the very START of
  the post), **Best Demo** (automatic).
- **Best Ghost of Kiroween Past** ONLY if Jayant actually registered for
  Kiroween 2025 — verify before ticking, never guess.
- **Best Kiro Crew App** requires a separate public GitHub repo for a Crew app.

## Honesty
The write-up must describe Kiro sessions that really happened. Log them in
`docs/KIRO_EVIDENCE.md` (PRs, commands, outputs, screenshots). Do not attribute
human or other-tool work to Kiro. GhostBridge (a 2026 entry) explicitly discloses
exactly this, and judges reward verifiable provenance.
