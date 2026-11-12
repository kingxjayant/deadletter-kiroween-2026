---
inclusion: always
---

# Product intent — DEAD LETTER OFFICE

**Hackathon:** Kiroween 2026 (AWS Kiro / Devpost). **Category:** Resurrection.
**Tagline:** Send a message where the internet cannot go. Print it. Tear it. Resurrect it.

## The real problem
People who move between connected and disconnected places — ASHA/community health
workers, rural teachers, disaster-relief volunteers, families during an internet
shutdown in Bihar/Jharkhand — already move *paper*. They have a cheap printer and
a phone camera. They do not have a backend, an API key, or reliable data.

## What we resurrect
The 19th-century telegraph paper tape. A message becomes n printed strips, each
carrying a QR code and a human-readable telegram fallback. A systematic Cauchy
Reed–Solomon code over GF(2^8) makes the tape **MDS**: any k of the n strips
rebuild the message. Torn, stained, lost or unreadable strips are expected, not
exceptional.

## Non-negotiable constraints
- **Zero network at runtime.** No fetch, no analytics, no CDN, no remote fonts, no login.
- **Zero cost.** No server, no database, no paid API, no secrets for judges.
- **Judges must succeed in under 60 seconds** without installing anything. One-click demo.
- **Never guess.** A strip with a bad checksum is discarded; a decoded message that
  fails its SHA-256 fingerprint is refused rather than shown.
- Everything is created inside the Submission Period (30 Oct – 4 Dec 2026).

## Audience & tone
Judges are AWS/Kiro engineers and developer advocates. Copy is precise, slightly
macabre, and never overclaims. Spooky visuals must encode real state (torn strips,
loss budget, verification verdict), not decoration.

## Definition of done
1. A judge can click "One-click demo" and watch compose → print → tear → verified revival.
2. `npm test` passes unit, property-based and DOM smoke tests.
3. `node tools/audit-submission.mjs` reports all compliance checks passed.
4. Live URL works on desktop and a 390px phone, with reduced-motion support.
