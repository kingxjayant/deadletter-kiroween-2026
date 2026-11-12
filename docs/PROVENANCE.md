# Provenance & disclosure

Required by the Kiroween 2026 Official Rules: "Participants may use standard
development resources, including frameworks, libraries, starter templates, but
must disclose any other pre-existing code or work incorporated into the Project."

## Timeline
- **Kiroween 2026 Submission Period:** 30 Oct 2026 9:00 AM PT – 4 Dec 2026 2:00 PM PT.
- **This project was created on 12 November 2026**, inside that window.
- No code, repository, design or write-up from Kiroween 2025 or from any earlier
  personal/project work was reused. There is no prior DEAD LETTER project.
- No part of the project received financial or preferential support from AWS or
  Devpost before the end of the Submission Period.

## Authorship
- Entrant / owner: **Jayant Kumar**, 20, student, Marwari College, Ranchi,
  Jharkhand, India. Email: `jayant.explains.ai@gmail.com`.
- Original source, mathematical design, UI, copy, specs, tests and documentation
  in this repository were produced for this hackathon with AI assistance, in
  accordance with the hackathon's premise (building with Kiro and other agents).
- All AI-assisted work is reviewed, run and owned by the entrant. The Kiro
  sessions that actually happened are logged in `docs/KIRO_EVIDENCE.md` and
  described in `docs/KIRO_USAGE.md`; work by other tools is explicitly disclosed
  there rather than attributed to Kiro.
- The entrant owns all rights to the submission and grants MIT license to the
  original code.

## Pre-existing code incorporated (all disclosed in `NOTICE`)
| Component | Version | License | Use |
| --- | --- | --- | --- |
| qrcode-generator (Kazuhiko Arase) | 2.0.4 | MIT | QR SVGs, bundled at build time |
| jsQR (Cosmo Wolfe et al.) | 1.4.0 | Apache-2.0 | Optional camera / QR-image decoding, vendored verbatim |
| fast-check | ^4.3.0 | MIT | Property-based tests, dev-only |
| esbuild | latest | MIT | Static bundling, dev-only |
| jsdom | latest | MIT | Headless DOM smoke tests, dev-only |

No third-party fonts, images, icons, audio, music, video, datasets,
trademarks or logos are included. The ghost sigil, paper-tape styling, all SVG
artwork and all written copy are original. All demo-video music (if any) will be
original or explicitly licensed; the default is silence + on-screen captions.

## Mathematical sources
The systematic Cauchy Reed–Solomon construction and the super-regularity (MDS)
property are standard coding theory; the implementation in `web/src/gf256.mjs`
and `web/src/codec.mjs` is original. Kiro's documentation on spec-driven
development and property-based testing informed the workflow, not the maths.

## Honesty about capability claims
- DEAD LETTER provides **integrity verification** (CRC-32 + SHA-256), not
  confidentiality. Tiles are not encrypted.
- It does not use machine learning, a cloud service or an LLM at runtime.
- Camera scanning requires HTTPS and user permission; paste/file/QR-image paths
  work without either.
- Capacity is 8 KB per tape; larger payloads need multiple tapes.
