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

## Update — after the first real Kiro session (2026-11-23, 12:16)

**Closed:**
- Kiro IDE session on the Free plan: **0.76 credits, 1m 16s, 1 file changed**.
- Evidence uploaded and committed: `docs/evidence/kiro-01-chat-and-credits.png`,
  `kiro-02-diff.png`, `kiro-03-settings.png`.
- Kiro's review claim is **correct**: the `sha16` fingerprint covers the
  un-padded message bytes (`codec.mjs:156`); padding happens at line 149.
- Kiro's test is in `tests/codec.test.mjs`, reconstructed from the diff
  screenshot, and passes. `npm test` → **27/27**.
- A second test was added (by Jayant, not Kiro) that drops 4 source tiles too,
  forcing 4 parity tiles into the Cauchy solve. Kiro's version only kept the 8
  systematic tiles, which needs no matrix inversion — so the "worst case" it
  described is actually the *easiest* numeric path.

**New finding, and now the top priority:**
> `kiro-03-settings.png` shows **Specs empty, Agent Hooks empty, MCP Servers
> empty, steering listing only Global**. The repo's `.kiro/` was not loaded, so
> that session was not spec-driven development. Nothing about the specs,
> steering, hooks or MCP server has been *observed working inside Kiro* yet.

**Next session:** follow [`docs/KIRO_LAB_RUNBOOK.md`](KIRO_LAB_RUNBOOK.md) — a 45–60 min
checklist written to be readable on a phone at the lab. Summary of the gate:
1. Open the folder that **directly contains** `.kiro/` as the workspace root
   (not a parent folder with the repo nested inside it).
2. Prefer `git clone` over a ZIP download — it also gives you the git CLI that
   was missing, which is what allows Kiro's work to land as a real PR.
3. After trusting the folder, check the Kiro pane lists: `Test Reed-Solomon`
   (and the UI spec) under **Specs**, four hooks under **Agent Hooks**, five
   steering docs under **Agent Steering & Skills**, and `deadletter-codec` under
   **MCP Servers**. If any are missing, fix that first — do not proceed and do
   not describe the session as spec-driven.
4. Screenshot that populated pane. It is the evidence that everything else
   depends on.
5. Then run one spec task on a `kiro/…` branch, commit, open a PR.

**Still open:**
1. **A Kiro PR on GitHub** — there are still zero Kiro-authored commits.
2. **Public YouTube demo (<3 min)** — the lab screen recording is raw material;
   it is not yet a public URL.
3. Correctness (PBT), hook firing, MCP tool calls, powers activation, Crew —
   either run them or delete those rows and say plainly they were not run.
4. Done-with-dates check: the session clock reads 23 Nov 2026, so the
   **credit-request deadline (1 Dec 12:00 PM PT = 2 Dec 1:30 AM IST)** is close.
