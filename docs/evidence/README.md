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

Verification performed (no console/page errors on either viewport):
- `h1` = "THE DEAD LETTER OFFICE"
- one-click demo → `VERIFIED · SHA-256`
- tape health → `8/14 ALIVE · 6 LOST`
- 6 tiles carry the TORN state
- recovered message includes Devanagari text and matches the original byte-for-byte
- after a fix, `#result-empty` computes to `display: none` on success (the
  "Nothing has crossed over yet" placeholder no longer lingers above the result)

> These are **app** screenshots, not Kiro session evidence. Kiro session
> evidence goes in the table in `docs/KIRO_EVIDENCE.md` with PR links and
> command output. Keep the two kinds of proof separate.
