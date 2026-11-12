---
inclusion: always
---

# Technical conventions

## Stack
- Vanilla ES modules in `web/src/*.mjs`, bundled to ONE classic IIFE script by esbuild.
  Classic scripts (not `<script type="module">`) are used so the app also works when
  embedded in a sandboxed iframe with an opaque origin.
- No runtime dependencies. Vendored offline libraries live in `web/vendor/`
  (jsQR, Apache-2.0) and are bundled at build time (qrcode-generator, MIT).
- Node 20+ for tooling: `node:test`, `fast-check` (PBT), `jsdom` (DOM smoke),
  `esbuild` (bundle). CI installs with `npm ci` from the committed lockfile.
- Deployable as pure static files to GitHub Pages via GitHub Actions.

## File map
| Path | Purpose |
| --- | --- |
| `web/src/gf256.mjs` | GF(2^8) field, Cauchy coefficients, matrix inversion |
| `web/src/codec.mjs` | Tape encoding, tile format, checksum, MDS decoding, file format |
| `web/src/tape.mjs` | QR SVG generation, human-readable telegram groups, downloads |
| `web/src/app.mjs` | UI controller: compose, tear, scan, resurrect, one-click demo |
| `tests/*.test.mjs` | Unit, property-based and headless-DOM tests |
| `tools/build.mjs` | Bundles `web/` into `public/` for Pages |
| `tools/audit-submission.mjs` | Hard gate for the Official Rules |
| `tools/mcp/deadletter-mcp.mjs` | Local MCP server exposing codec + compliance tools |
| `docs/KIRO_USAGE.md` | The write-up judges read |

## Hard rules for generated code
- Duck-type byte arrays (`ArrayBuffer.isView(x) && x.BYTES_PER_ELEMENT === 1`);
  `instanceof Uint8Array` fails across realms (jsdom, workers, CLI headless).
- Every public function is pure or explicitly `async`; no hidden globals.
- All text is UTF-8; tile payloads are ASCII base64 so QR Byte mode is safe.
- No `eval`, no `innerHTML` with untrusted user text into executable contexts.
  User messages are rendered with `textContent`.
- Prefer Web Crypto over hand-rolled hashes. SHA-256 fingerprint is authoritative.
- Add a test for every bug fixed. Never weaken a property to make a test pass.

## Commands
```
npm ci && npm test        # unit + PBT + DOM smoke
npm run test:pbt          # correctness properties only
npm run build             # web/ -> public/
npm run audit:submission  # eligibility gate
npm run serve             # local preview on 0.0.0.0:8000
```
