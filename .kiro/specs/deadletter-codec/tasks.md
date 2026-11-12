# Implementation tasks — DEAD LETTER codec

> Kiro spec workflow: requirements → design → tasks → execute. Tick a task only
> when its outcome is verified by a passing test. Linked properties are in
> `requirements.md`.

## Wave 1 — foundations (no dependencies between these)
- [x] **1.1** Implement `web/src/gf256.mjs`: EXP/LOG tables, gfAdd/gfMul/gfInv/gfDiv,
      `cauchyCoefficient`, `invertMatrix`, `matrixTimesChunks`. *(P4, P5)*
- [x] **1.2** Implement byte/base64 and CRC-32 helpers in `web/src/codec.mjs`. *(P6)*
- [x] **1.3** Define `LIMITS` and `planTape` so tiles stay ≤ 900 bytes. *(R1.4)*
- [x] **1.4** Write `tests/gf256.test.mjs` (field axioms, inverse, matrix inverse).

## Wave 2 — codec
- [x] **2.1** Implement `makeTape`: padding, systematic + parity chunks, tile text,
      fingerprint, human-readable groups. *(R1.1–R1.5)*
- [x] **2.2** Implement `parseTile` with full header validation and CRC enforcement. *(R2.3)*
- [x] **2.3** Implement `decodeTape`: grouping, dedupe, k-tile selection, GF inversion,
      SHA-256 verification, actionable errors. *(R2.1–R2.5)*
- [x] **2.4** Implement `.deadletter` pack/unpack. *(R3.2)*
- [x] **2.5** Write `tests/codec.test.mjs` (round-trips, 8-of-14 subsets, corruption,
      too-few-tiles, file format, limits).
- [x] **2.6** Write `tests/pbt.test.mjs` with P1–P6 using fast-check. *(all properties)*

## Wave 3 — presentation
- [x] **3.1** Implement `web/src/tape.mjs`: QR SVG, telegram letter groups, download. *(R1.6)*
- [x] **3.2** Implement `web/index.html` + `web/styles.css` (spectral telegraph
      design system, print stylesheet, reduced motion, 390px layout).
- [x] **3.3** Implement `web/src/app.mjs`: compose, tear, restore, print, copy,
      file/QR/camera intake, verified revival, one-click demo. *(R3.3, R3.4)*
- [x] **3.4** Add `web/sw.js` offline app-shell cache. *(R3.1)*
- [x] **3.5** Add esbuild build (`tools/build.mjs`) and static preview server.

## Wave 4 — evidence & compliance
- [x] **4.1** Add `tools/audit-submission.mjs` and `tests/submission.test.mjs`.
- [x] **4.2** Add `.kiro/hooks/*.json` (tests on save, PBT on codec change,
      compliance gate, docs sync, session-start audit).
- [x] **4.3** Add the local MCP server `tools/mcp/deadletter-mcp.mjs` and
      `.kiro/settings/mcp.json`.
- [x] **4.4** Add custom agents, a local Kiro power, and the Kiro CLI headless
      GitHub Actions workflow.
- [x] **4.5** Add `docs/KIRO_USAGE.md`, `docs/KIRO_EVIDENCE.md`,
      `docs/PROVENANCE.md`, `docs/SUBMISSION_COPY.md`, `docs/VIDEO_SCRIPT.md`,
      `docs/BLOG_DRAFT.md`, `docs/SOCIAL_BLITZ.md`, `docs/RISK_REGISTER.md`.
- [x] **4.6** Add CI + GitHub Pages workflows, LICENSE, NOTICE, README.

## Remaining (owner: Jayant Kumar — real Kiro sessions required)
- [ ] **5.1** Open the repo in Kiro IDE, run the spec tasks above from a fresh
      branch, and record real session/PR evidence in `docs/KIRO_EVIDENCE.md`.
- [ ] **5.2** Run Kiro's spec "Correctness" (PBT) in the IDE and paste the real
      output/screenshot into `docs/KIRO_EVIDENCE.md`.
- [ ] **5.3** Register on Devpost, request the 4,000 Kiro credits before
      1 Dec 2026 12:00 PM PT (requires ID verification).
- [ ] **5.4** Record the < 3 min public YouTube demo and add its URL to
      `docs/SUBMISSION_COPY.md` and the Devpost form.
- [ ] **5.5** Publish the blog post and the `#KiroweenHackathon26` social post
      during the Submission Period; add both URLs to the form.
- [ ] **5.6** Fill in student details (LinkedIn, student email, year/degree,
      Marwari College Ranchi) and confirm 2025 registration only if true.
- [ ] **5.7** Final `npm ci && npm test && npm run build && npm run audit:submission`
      on 3 Dec 2026, then submit 24 h before the deadline.
