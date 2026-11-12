# 🕯️ THE DEAD LETTER OFFICE

> **Send a message where the internet cannot go. Print it. Tear it. Resurrect it.**

A **Kiroween 2026** submission in the **Resurrection** category by **Jayant Kumar**
(Marwari College, Ranchi, Jharkhand, India). Built with **Kiro**.

[![Kiroween 2026](https://img.shields.io/badge/Kiroween-2026-ffb454)](https://kiroween.devpost.com/)
[![Category](https://img.shields.io/badge/category-Resurrection-83e5bd)](https://kiroween.devpost.com/)
[![License](https://img.shields.io/badge/license-MIT-efe4cd)](LICENSE)

---

## The idea, in 30 seconds

The telegraph paper tape carried the world's messages before networks existed.
DEAD LETTER resurrects it: a message becomes **n printed QR strips** with a
human-readable telegram fallback. A systematic **Cauchy Reed–Solomon code over
GF(2⁸)** makes the tape MDS — **any k of the n strips** rebuild the message, even
if the rest are torn, stained, lost or unreadable.

Real audience: community health workers, rural teachers and disaster-relief
volunteers who already move paper between connected and disconnected places in
Bihar/Jharkhand. They have a cheap printer and a phone camera. They do not have
a backend, an API key, or reliable data.

**Zero servers. Zero accounts. Zero API keys. Zero telemetry. Works offline.**

---

## Try it (judges: 60 seconds, no install)

1. Open the live app → **https://&lt;your-username&gt;.github.io/deadletter-kiroween-2026/**
   *(add the real URL to `docs/SUBMISSION_COPY.md` after Pages deploys)*
2. Press **▶ One-click demo** in the top-right of the tabs.
3. Watch: message → printable tape → 6 strips torn → **VERIFIED · SHA-256**.
4. Or do it by hand: write a message → **Commit to the paper tape** → click a few
   strips to tear them → **Resurrect from surviving strips** → **Resurrect**.

No login, no credentials, no network required after the first load. Print the
tape with 🖨 Print tape; scan strips with a camera, upload a QR image, paste the
telegram letters, or load a `.deadletter` file.

---

## Quick start (local)

```bash
git clone https://github.com/<your-username>/deadletter-kiroween-2026.git
cd deadletter-kiroween-2026
npm ci
npm test                 # unit + property-based + DOM smoke tests
npm run build            # web/ -> public/
npm run serve            # http://localhost:8000  (binds 0.0.0.0)
npm run audit:submission # Kiroween Official Rules gate
```

`public/index.html` also opens directly as a static file — no server needed.
Node 20+ is only required for tooling; the app itself is plain browser JavaScript.

---

## How it works

```
message (UTF-8) → k source chunks → G = [ I_k ; C_(n−k)×k ] → n strips
strip = DL1|id|k|n|idx|len|sha16|chunkSize|base64(chunk)|crc32
QR SVG + human telegram groups → print / carry / tear
any k strips → invert k×k matrix over GF(2⁸) → SHA-256 verify → original
```

`C[i][j] = 1/(x_i ⊕ y_j)` with `x_i = i` and `y_j = (n−k)+j`. Every square
submatrix of a Cauchy matrix is invertible, so **any** k rows of G are solvable.
That is a mathematical guarantee, not a probabilistic "usually works".

Limits: 2 ≤ k ≤ 24, k < n ≤ 32, ≤ 8 KB per tape, ≤ 900 bytes per strip so cheap
printers stay scannable. See `.kiro/specs/deadletter-codec/design.md`.

**Integrity, not confidentiality.** Tiles are not encrypted. Say so honestly.

---

## Repository map

| Path | What it is |
| --- | --- |
| `web/index.html`, `web/styles.css` | Spectral telegraph UI, print + reduced-motion + 390px layout |
| `web/src/gf256.mjs` | GF(2⁸) arithmetic, Cauchy coefficients, matrix inversion |
| `web/src/codec.mjs` | Tape encode/decode, CRC-32, SHA-256, `.deadletter` format |
| `web/src/tape.mjs` | QR SVG + human-readable telegram groups |
| `web/src/app.mjs` | UI controller, camera/file/paste intake, one-click demo |
| `web/sw.js` | Offline app-shell cache |
| `public/` | Built static site deployed to GitHub Pages |
| `tests/` | 23 tests: unit, 6 correctness properties, headless DOM smoke |
| `tools/build.mjs`, `tools/serve.mjs` | Zero-config build and preview |
| `tools/audit-submission.mjs` | Official Rules as executable checks |
| `tools/mcp/deadletter-mcp.mjs` | Local MCP server for Kiro (5 project tools) |
| `.kiro/` | **Specs, steering, hooks, MCP config, custom agents — committed** |
| `powers/deadletter-codec/` | Local Kiro power (POWER.md + 2 steering files) |
| `crew-app/` | Optional Kiro Crew app for the $1,000 bonus prize |
| `docs/` | Kiro write-up, evidence log, submission copy, video script, blog/social drafts, credits guide, GitHub push guide, 6 real browser screenshots |

---

## Kiro usage (the judges' criterion)

| Kiro surface / feature | Where in this repo | Evidence |
| --- | --- | --- |
| Spec-driven development | `.kiro/specs/deadletter-codec/{requirements,design,tasks}.md`, `.kiro/specs/haunted-ui/*` | EARS requirements, 6 correctness properties, 3-phase tasks |
| Correctness / PBT | `tests/pbt.test.mjs` (P1–P6 with fast-check) | `npm run test:pbt` output + IDE "Correctness" screenshot |
| Steering | `.kiro/steering/*.md` (5 files, 3 inclusion modes) | Product, tech, codec invariants, design system, rules |
| Agent hooks | `.kiro/hooks/*.json` (4 files) | Tests on save, PBT on codec change, compliance gate, docs sync |
| MCP | `.kiro/settings/mcp.json` + `tools/mcp/deadletter-mcp.mjs` | 5 real tools; CI smoke test calls the server |
| Powers | `powers/deadletter-codec/POWER.md` | Local power, activates on codec keywords |
| Custom agents | `.kiro/agents/*.md` | Read-only codec reviewer + submission auditor |
| CLI headless in CI (optional, needs a paid-plan `KIRO_API_KEY`) | `.github/workflows/kiro-headless.yml` | `/kiro` comment → real PR; otherwise use `kiro-cli login` locally with the free credits |
| Kiro Crew | `crew-app/` | Optional separate app for Best Kiro Crew App |
| IDE vs CLI vs Web vs Crew | `docs/KIRO_USAGE.md` | Fill with real observations |

**Read `docs/KIRO_USAGE.md` before submitting.** It contains the write-up, and
`docs/KIRO_EVIDENCE.md` is where every real Kiro session must be logged. Do not
claim Kiro did work it did not do — verifiable provenance wins points.

---

## CI / deployment

- `.github/workflows/ci.yml` — `npm ci`, tests, PBT, build, compliance gate, MCP smoke, artifact.
- `.github/workflows/pages.yml` — builds `public/` and deploys to GitHub Pages.
- `.github/workflows/kiro-headless.yml` — optional real Kiro CLI sessions in Actions.
- `tools/push-to-github.sh` — creates the public repo, pushes, enables Pages.
  Read its security notes: use a short-lived fine-grained token and revoke it.

---

## Disclosure & provenance

All original code, design and copy were created **inside** the Kiroween 2026
Submission Period (30 Oct – 4 Dec 2026); no prior project was reused. Third-party
libraries are disclosed in `NOTICE` and `docs/PROVENANCE.md`:
qrcode-generator (MIT), jsQR (Apache-2.0), fast-check / esbuild / jsdom (MIT,
dev-only). No external images, audio, datasets or trademarks. The only bundled
font is a locally hosted Noto Sans Devanagari subset (SIL OFL 1.1) so Hindi and
Nagpuri messages render on any machine — nothing is fetched over the network.

## License

MIT — see [LICENSE](LICENSE). The license is detectable in the GitHub About section.
