# Kiroween 2026 submission checklist

Read `.kiro/steering/kiroween-compliance.md` for the full source. This is the
short version Kiro should recall when the words "submit", "Devpost" or "prize"
appear.

**Disqualification traps**
1. `/.kiro` missing from the repo root or listed in `.gitignore`.
2. No detectable open-source license (MIT `LICENSE` at root).
3. Repo not on public GitHub; no run instructions or missing assets.
4. Project started before 30 Oct 2026, or reused Kiroween 2025 work.
5. Video ≥ 3 min, private, not on YouTube, or contains copyrighted music/logos.
6. Insufficient Kiro usage — "Insufficient use of Kiro will result in
   disqualification at the Judges' sole discretion". Show specs, hooks,
   steering, MCP, PBT, powers, custom agents and CLI/Crew experiments.
7. No live working-app URL, or judges need credentials that were not provided.

**Dates (PT)** — submission closes 4 Dec 2026 2:00 PM (= 5 Dec, 3:30 AM IST).
Credit request closes 1 Dec 2026 12:00 PM. Winners on/around 3 Feb 2027.

**Prize stacking for a student solo entrant**
- Category: Resurrection ($5,000) OR an Overall Prize (not both).
- Best Student Project: Resurrection — $1,500 + 1-year Kiro Pro Max.
- Bonus Blog Prize — 2,000 Kiro credits (100 winners).
- Social Blitz — 3-month Kiro Pro+ (5 winners); hashtag must START the post.
- Best Demo — $1,000, automatic, needs top-10% overall + top Presentation score.
- ❌ Best Ghost of Kiroween Past — **NOT ELIGIBLE** (confirmed no 2025 registration). Leave unchecked.
- Best Kiro Crew App — $1,000, needs a separate public Crew-app repo.

**Always run before submitting**
```
npm ci && npm test && npm run build && npm run audit:submission
```
