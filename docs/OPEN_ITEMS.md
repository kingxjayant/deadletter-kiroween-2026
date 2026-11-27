# Open items

Every `[[...]]` placeholder, grouped by who fills it.

> Registration answers, copy-paste text and the two form traps: see
> [`docs/DEVPOST_REGISTRATION.md`](DEVPOST_REGISTRATION.md).

Run `npm run open:items` for a live file/line listing. Placeholders are
intentional: they mark things that must come from **you**, from a **real Kiro
session**, or from a **published URL**. Never replace one with an invented claim.

## ✅ RESOLVED on 12 Nov 2026

| Item | Value |
| --- | --- |
| GitHub username | `kingxjayant` |
| GitHub repo | https://github.com/kingxjayant/deadletter-kiroween-2026 |
| Live app (Pages) | https://kingxjayant.github.io/deadletter-kiroween-2026/ *(verify the Pages workflow finished)* |
| LinkedIn | https://in.linkedin.com/in/jayant-kumar-a180a6362 |
| Institution | Marwari College, Ranchi (Ranchi University), Jharkhand, India |
| Year & degree | B.Sc. Artificial Intelligence & Machine Learning, 1st year / Semester 2, session 2025–2028 |
| Contact email | `jayant.explains.ai@gmail.com` (no institutional email issued) |
| Enrolment proof | **College ID card** `IDCARD.jpg` received and held privately (never committed). An admission receipt was mentioned as ready but not yet attached — add it when available. Upload only to Devpost if asked |
| Kiroween 2025 registration | **No** → Ghost of Kiroween Past bonus is NOT eligible |

Known already: Jayant Kumar · 20 · solo entrant · Resurrection category.

> **Privacy guard:** `IDCARD.jpg` lives in `/home/user/uploads/`, outside the
> repository, and `.gitignore` blocks admission/ID documents. It contains a
> phone number, father's name, blood group and a photo. Never add it to the
> public GitHub repo.

## A. URLs you create yourself (must be public, during 30 Oct – 4 Dec 2026)
| Placeholder | Requirement |
| --- | --- |
| `[[YOUTUBE_URL]]` | Public, < 3 min, no copyrighted music; script in `docs/VIDEO_SCRIPT.md` |
| `[[BLOG_URL]]` | Third-party platform, mentions Kiroween 2026; draft in `docs/BLOG_DRAFT.md` |
| `[[SOCIAL_URL]]` | Post must START with `#KiroweenHackathon26`; draft in `docs/SOCIAL_BLITZ.md` |
| Crew app repo URL | Only if you publish `crew-app/` separately and enter Best Kiro Crew App |

## B. Only real Kiro sessions can fill these (`docs/KIRO_USAGE.md`, `docs/KIRO_EVIDENCE.md`)
- Which Kiro surfaces you actually used, and how IDE/CLI/Web/Crew differed.
- PR links for spec tasks; the Correctness/PBT screenshot and output.
- One real hook log (deliberately break `cauchyCoefficient`, save, watch the PBT
  hook fail, fix it — save both outputs).
- One real MCP transcript (`encode_message` → `decode_tiles`).
- Confirmation that you installed the local power and where it activated.
- Your own comparison of spec-driven development vs vibe coding.
- Honest "what Kiro did NOT do" paragraph (disclose the 12 Nov scaffold).

> If a hook never fired, write "not observed" — GhostBridge 2026 does exactly
> this and judges reward it. Do not claim automation you did not see.

## C. Your own voice (2–3 sentences each)
- Inspiration paragraph in `docs/SUBMISSION_COPY.md` (a suggested Jharkhand
  framing is already written — adapt it so it's genuinely yours).
- "What we learned" in the Devpost description.
- One concrete detail in the Social Blitz post (the Kiro team scores
  "original thoughts vs AI writing").

## D. One confirmation
Confirm no earlier DEAD LETTER repo existed under any account. The GitHub API
confirmed `kingxjayant/deadletter-kiroween-2026` did not exist before 12 Nov 2026.

---

**Nothing else is blocking.** The app, tests, CI, Pages workflow, `/.kiro` kit,
licence, disclosure, video script, blog/social drafts and compliance gate are
all complete and verified.

---

## Update — 12 Nov 2026, after the first real Kiro session

**Done (verified here):**
- Kiro IDE session on the Free plan: 0.76 credits, 1m16s, one file changed.
- Kiro's review claim is **correct**: the `sha16` fingerprint is computed over
  the un-padded message bytes (`codec.mjs:156`), with zero-padding applied only
  afterwards (line 149).
- Kiro's test is in `tests/codec.test.mjs` and passes: `npm test` → **26/26**.
  It was reconstructed here because the lab PC had no git CLI.
- The test was **strengthened**: Kiro's version kept only source tiles, which
  needs no matrix inversion. A mixed case (4 source + 4 parity) now also has to
  recover the same Nagpuri string, so the Cauchy system is genuinely exercised.

**Newly open, in priority order:**
1. **Upload the Kiro screenshots** (chat, credit usage, diff, Settings sidebar)
   and the screen recording. They were captured on the lab PC and the local
   files were deleted — if they were not copied to your phone or cloud drive
   first, they are **gone** and the fastest fix is one more 5-minute Kiro IDE
   session on a machine you control, screenshotting as you go.
2. **Get a Kiro PR on GitHub.** No git CLI on the lab PC means the repo still has
   zero Kiro-authored commits. One `kiro/…` branch + PR closes the biggest
   remaining judging risk.
3. **Public YouTube demo (<3 min).** The lab screen recording is raw material,
   not the deliverable: it needs to be uploaded as a public YouTube video with
   the live app URL in the description.
4. Fill the remaining `[[FILL]]` rows for Correctness, hooks, MCP, powers and
   Crew — or delete those rows and say plainly what was not run.
