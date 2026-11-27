# Real browser evidence

These screenshots were captured from the running app with headless Chromium
(desktop 1440×1000 and mobile 390×844) on 12 November 2026. They are genuine
renderings of `public/` served over HTTP — not mockups. They double as Devpost
gallery images and as the "app working on the device it was built for" proof.

| File | What it shows |
| --- | --- |
| `01-hero-desktop.png` | App shell, impact story, compose desk, one-click demo control |
| `02-verified-desktop.png` | Full page after the one-click demo: torn tape + `VERIFIED · SHA-256` result |
| `03-torn-tape.png` | Close-up of the printable paper tape with 6 TORN strips and the health badge |
| `04-verified-mobile.png` | The same verified flow on a 390px phone viewport |
| `05-devanagari-label.png` | Zoomed proof that the self-hosted Devanagari subset renders Hindi text |
| `06-result-zoom.png` | Zoomed recovered message: exact Unicode round-trip, including नमस्ते |
| `07-live-pages-verified.png` | **The public GitHub Pages deployment**, not the local preview: `https://kingxjayant.github.io/deadletter-kiroween-2026/` after the one-click demo |

Verification performed (no console/page errors on either viewport):
- `h1` = "THE DEAD LETTER OFFICE"
- one-click demo → `VERIFIED · SHA-256`
- tape health → `8/14 ALIVE · 6 LOST`
- 6 tiles carry the TORN state
- recovered message includes Devanagari text and matches the original byte-for-byte
- after a fix, `#result-empty` computes to `display: none` on success (the
  "Nothing has crossed over yet" placeholder no longer lingers above the result)

**Remote deployment verification (12 Nov 2026):** after pushing to
`kingxjayant/deadletter-kiroween-2026`, both GitHub Actions workflows completed
with `success` (CI + Pages deploy). A fresh headless Chromium visit to the
**public Pages URL** returned HTTP 200, `h1` = "THE DEAD LETTER OFFICE",
one-click demo → `VERIFIED · SHA-256`, `8/14 ALIVE · 6 LOST`, Devanagari text
present, service worker registered, and **zero console/page errors**. Screenshot
`07` is from that public URL.

> These are **app** screenshots, not Kiro session evidence. Kiro session
> evidence goes in the table in `docs/KIRO_EVIDENCE.md` with PR links and
> command output. Keep the two kinds of proof separate.

---

## First real Kiro session — 2026-11-23, 12:16 (Kiro IDE, Free plan)

Captured on a college lab PC (Windows, no git CLI, repo opened from a GitHub
ZIP). The clock in the taskbar reads **23-11-2026 12:16**, which is the date of
record for this session. Session meter: **0.76 credits, 1m 16s, 1 file changed**.

| File | What it shows |
| --- | --- |
| `kiro-01-chat-and-credits.png` | Kiro's review of the codec spec: R2.1 (k×k submatrix inversion over GF(2⁸)) and R2.5 (trimmed-bytes SHA-256 compared to the tile header) both ticked, the note that `sha16` fingerprints the **pre-padding** bytes, and the "New test added" summary. Bottom bar: **Est. Credits Used: 0.76 · Elapsed time: 1m 16s** |
| `kiro-02-diff.png` | The actual one-file diff Kiro produced in `tests/codec.test.mjs`, including `slice(0, 8)` survival, the four `assert.equal` checks and the UTF-8 `deepEqual` |
| `kiro-03-settings.png` | Kiro Settings: **Specs**, **Agent Hooks**, **Agent Steering & Skills** and **MCP Servers** |

### What the settings screenshot proves — including the bad news

`kiro-03-settings.png` is the most useful of the three because of what it does
**not** show: Specs offers only "+ Create New Spec", Hooks only "+ Create New
Hook", Agent Steering lists only **Global** (three built-in skills), and MCP
Servers is empty. **The repository's `.kiro/` configuration was not loaded in
that session.** Kiro therefore worked by reading the source tree, not through
the specs, steering, hooks or MCP server committed here.

That is disclosed rather than hidden, and it defines the next session's goal:
open the folder so the sidebar lists the five steering docs, the four hooks, the
`deadletter-codec` MCP server and the `Test Reed-Solomon` spec, *then* start
work. See `docs/OPEN_ITEMS.md`.

No screenshot exists for the blocked `execute_pwsh` call (exit -1); it is
recorded in `docs/KIRO_EVIDENCE.md` as a reported-but-uncaptured event.

These are **Kiro** evidence and stay separate from the app screenshots above,
which show the product working, not how it was built.
