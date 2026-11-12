---
name: "deadletter-codec"
displayName: "Dead Letter Tape Codec"
description: "Expertise for the DEAD LETTER paper-tape codec: GF(256) arithmetic, systematic Cauchy Reed–Solomon erasure coding, tile checksums and Kiroween 2026 submission compliance. Activate when working on tapes, tiles, erasure codes, or the hackathon write-up."
keywords: ["erasure coding", "reed solomon", "cauchy matrix", "gf256", "paper tape", "kiroween", "submission audit"]
author: "Jayant Kumar"
---

# Dead Letter Tape Codec

## Overview
DEAD LETTER resurrects the telegraph paper tape for places without a network.
A message becomes n printed QR strips; a systematic Cauchy Reed–Solomon code over
GF(2^8) guarantees that ANY k of them rebuild the message exactly. This power
bundles the maths, the tile format, the correctness properties and the hackathon
compliance rules so Kiro loads them only when a task mentions tapes, tiles,
erasure coding, GF(256) or the submission.

Install from a local folder: Kiro IDE → Powers panel → Add Custom Power →
Import power from a folder → select `powers/deadletter-codec`. It activates
on the keywords above instead of occupying context on unrelated tasks.

## Onboarding
1. `npm ci` in the repo root (Node 20+).
2. `npm test` — unit, property-based and DOM smoke tests must pass.
3. `npm run build` — produces `public/`; `npm run serve` previews it.
4. `node tools/audit-submission.mjs` — the Official Rules gate.
5. Workspace MCP server `deadletter-codec` is configured in
   `.kiro/settings/mcp.json`; it exposes `encode_message`, `decode_tiles`,
   `gf_explain`, `audit_submission`, `list_correctness_properties`.

## Common workflows

### Add or change a correctness property
1. Edit `.kiro/specs/deadletter-codec/requirements.md` (EARS + property table).
2. Update `tests/pbt.test.mjs` with the new property.
3. Run `npm run test:pbt`. The `pbt-on-codec-change` hook also does this on save.
4. Update the property table in `docs/KIRO_USAGE.md`.

### Verify a claimed loss tolerance
Use the `encode_message` MCP tool with k=8, n=14; pass ANY 8 returned tile
strings to `decode_tiles`. A correct implementation returns the original text,
`verified: true`, `tilesLost: 6`.

### Debug a decoding failure
- `crc32` mismatch → the strip is unreadable; discard, do not repair.
- "<k tiles" → collect more strips; the error states exactly how many.
- SHA-256 mismatch → refuse; never display a partially correct message.
- `singular matrix` → check `cauchyCoefficient` x/y sets are disjoint.

## Available Steering Files
- **gf256** — field arithmetic, Cauchy matrix, MDS proof sketch, worked example.
- **submission-checklist** — every disqualification trap from the Official Rules.

## Hard rules
- Never weaken a property to make a test pass.
- Never claim encryption, anonymity or AI inference.
- Never attribute a change to Kiro without real session evidence.

## License & Attribution
**License:** MIT (same as the project).
**Power Author:** Jayant Kumar.
**Original Work:** Created for Kiroween 2026, November 2026; no third-party content.
