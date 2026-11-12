# Risk register — limitations found, and what we did about them

Built from the Official Rules, a study of the 2025 winners, and a survey of 2026
competition. Each risk has a concrete fix and an owner. `[[FILL]]` items need
Jayant's action.

## A. Eligibility / compliance risks (can disqualify outright)

| # | Risk | Severity | Fix in this repo | Owner action |
| --- | --- | --- | --- | --- |
| A1 | `/.kiro` gitignored or missing | **FATAL** | Committed at root; `.gitignore` has an explicit warning comment; `tools/audit-submission.mjs` fails CI and Kiro hooks if ignored | Verify on GitHub after push |
| A2 | Project deemed not new | **FATAL** | `docs/PROVENANCE.md` dates everything to 12 Nov 2026; no reused project | `[[FILL: confirm no earlier DEAD LETTER repo existed]]` |
| A3 | Insufficient Kiro usage ("Judges' sole discretion") | **FATAL** | 2 specs, 5 steering files, 4 hooks, MCP server, 2 agents, 1 power, CLI headless workflow, PBT suite | **Must run real Kiro sessions** and log them in `docs/KIRO_EVIDENCE.md` |
| A4 | No license / license not detectable | High | MIT `LICENSE` at root | Check GitHub "About" shows MIT |
| A5 | Video >3 min / private / copyrighted audio | High | `docs/VIDEO_SCRIPT.md` timed to 2:45, silence or original audio only | `[[FILL: record + upload]]` |
| A6 | Missing live URL or credentials | High | Static Pages app, zero login, judge instructions in `docs/SUBMISSION_COPY.md` | Add real URL after deploy |
| A7 | Student prize details incomplete | Medium | Field-by-field checklist | `[[FILL: LinkedIn, student email, year/degree, enrolment proof]]` |
| A8 | ~~"Ghost of Kiroween Past" claimed without 2025 registration~~ | **RESOLVED** | You confirmed on 12 Nov 2026 that you did **not** register for Kiroween 2025. Bonus marked ❌ NOT ELIGIBLE in `docs/SUBMISSION_COPY.md`; leave unchecked | None |
| A9 | Bank/tax/identity verification on winning | Low (post-win) | Rules §4/§8: affidavit, W-8BEN for non-US residents, 10 business days to return forms | Keep ID/address consistent with Devpost profile |

## B. Competitive risks

| # | Risk | Evidence | Mitigation |
| --- | --- | --- | --- |
| B1 | 12,422 participants already registered vs 4,958 in 2025 (2.5×); 2025 had 747 submitted projects | Devpost overview + 2025 gallery | Stack **bonus prizes** (Student, Blog, Social, Demo) which are far less contested than the 3 overall prizes. A top-10% + best Presentation score also unlocks Best Demo. |
| B2 | Resurrection is crowded in 2026: dial-up BBS, tape answering machine, SMS AI server, wax-seal signing, Laundroid sim | GitHub search of 2026 entries | DEAD LETTER is a *data-transport* tool with a mathematical guarantee and a real Indian audience — not nostalgia UI, not another "dead tech + LLM" bridge. |
| B3 | 2025 winner Faxi already did "old tech + AI for excluded people"; Lazarus 2026 does "old phone + SMS + AI" | Devpost Faxi page; GitHub search | We deliberately do **no AI at runtime** and no telephony; the novelty is erasure coding on a physical medium. |
| B4 | 2025 grand winner InteractionKit was a Skeleton Crew template with 2 demo apps — many 2026 entries copy that structure | Devpost InteractionKit page; 2026 skeleton repos | We did NOT choose Skeleton Crew (avoids a crowded, double-the-work category) but kept its lesson: solve a *specific developer/human pain* and show two polished demos (one-click demo + manual flow). |
| B5 | 2026 competitors are extremely rigorous (GhostBridge discloses 324 CI checks, 14 screenshots, exact Kiro provenance, PR-by-PR attribution) | Devpost GhostBridge page | Match the rigour: 23 automated tests, 6 properties, DOM smoke, compliance gate, MCP CI smoke, evidence log with honest "not Kiro" attribution. |
| B6 | Judges may test on a phone / no camera permission / sandboxed iframe | Rules: functional app required; judges may judge from video alone | Classic IIFE bundle, 4 intake fallbacks, 390px layout, reduced motion, offline service worker, one-click demo that needs nothing. |
| B7 | "Real impact" criterion (20%) usually punishes toys | 2026 judging criteria | Concrete audience (ASHA workers, rural teachers, disaster relays), printable output, no infrastructure, no cost, no accounts; explicit non-claims (not encryption). |

## C. Technical risks found during the build (and fixed)

| # | Limitation found | Fix |
| --- | --- | --- |
| C1 | A random-XOR fountain code only *usually* recovers; unlucky subsets fail | Replaced with systematic Cauchy Reed–Solomon (MDS). Any k strips mathematically suffice. |
| C2 | `instanceof Uint8Array` fails across realms (jsdom / headless CLI / workers) — found by the DOM smoke test | Duck-typing via `ArrayBuffer.isView` + `BYTES_PER_ELEMENT === 1`. |
| C3 | ES module `<script type="module">` can fail in sandboxed iframes with opaque origin | esbuild bundles to one classic IIFE script; no CDN, no external fonts. |
| C4 | Camera / clipboard permissions may be denied | Paste, `.deadletter` file and QR-image paths are fully functional; clear fallback message. |
| C5 | Cheap printers produce unscannable dense QR codes | `planTape` caps tile payload at 900 bytes and raises k automatically; 8 KB per tape. |
| C6 | A corrupted tile could silently poison the decode | CRC-32 per tile + SHA-256 fingerprint of the final message; REFUSED on mismatch. |
| C7 | jsQR only detects one QR per frame | Sequential sweep with dedupe, plus a "virtual scanner" (paste/file) path that needs no camera at all. |
| C8 | Integrity could be mistaken for confidentiality | Explicit "not encrypted / not anonymous / no AI at runtime" in UI copy, README, provenance and submission copy. |
| C9 | `/.kiro` formats change between Kiro 0.x / 1.x / CLI v3 | Hooks use the current `v1` JSON schema (`trigger`, `matcher`, `action`), steering front matter is the literal first line, specs use the 3-file structure; verified against kiro.dev docs on 12 Nov 2026. |
| C10 | GitHub Pages build could break silently | `ci.yml` and `pages.yml` both run tests, build and the compliance gate before deploying; `public/` is also committed as a fallback. |
| C11 | Devanagari/Hindi message text rendered as tofu boxes on a headless browser with no Indic system font — found during real Chromium screenshot verification | Bundled a 61 KB **self-hosted subset** of Noto Sans Devanagari (SIL OFL 1.1) with `unicode-range`, shipped in `web/assets/`. No remote font, no CDN. License in `web/assets/Noto-LICENSE.txt`, disclosed in `NOTICE` and `docs/PROVENANCE.md`. |
| C12 | Visual claims unverified until a real browser ran | Headless Chromium verification on desktop 1440×1000 and mobile 390×844: zero console/page errors, one-click demo VERIFIED, 6 torn tiles. Six real screenshots in `docs/evidence/`. |
| C13 | The empty-state ouija panel stayed visible after a successful resurrection (author CSS `display:grid` beats the UA `[hidden]` rule) — found in the first real browser screenshot | Added a global `[hidden] { display: none !important; }` and re-verified with `getComputedStyle(#result-empty).display === 'none'`. |

## D. Schedule risks

| # | Risk | Fix |
| --- | --- | --- |
| D1 | Only ~22 days left (12 Nov → 4 Dec 2026); deadline is 3:30 AM IST on 5 Dec | `docs/ROADMAP.md` front-loads the video, blog and social posts; final submission targeted 3 Dec. |
| D2 | Kiro credits require ID verification and a request before 1 Dec 12:00 PM PT | Action item for week 1; Devpost name must match ID exactly. |
| D3 | YouTube upload + blog + social + student proof all take time | Drafts are pre-written in `docs/`; only publishing/filling is left. |
| D4 | No edits after the deadline | Submit 24 h early; save drafts often; re-run the full gate on 3 Dec. |
