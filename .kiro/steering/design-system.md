---
inclusion: fileMatch
fileMatchPattern: "web/(index\.html|styles\.css|src/app\.mjs)$"
---

# Spectral telegraph design system

Palette: ink `#0d0b09`, ink-2 `#15110d`, parchment `#efe4cd`, amber `#ffb454`,
spectral green `#83e5bd`, blood red `#e2564a`, mist `#a9a094`.
Type: system serif for prose, ui-monospace for anything numerical or machine-like.
No external fonts, no external images, inline SVG only.

## Functional spookiness
Every effect must report state; if an effect is purely decorative, remove it.
- Torn strips: translucent, clipped, stamped TORN → the strip is excluded from decode.
- `INTACT` / `n/k ALIVE` / `UNRECOVERABLE` health badge → loss budget from the codec.
- `VERIFIED · SHA-256` / `REFUSED` stamp → authoritative verification result.
- Scanlines, amber flicker and grain set the mood but never reduce text contrast.

## Accessibility
- `aria-live` status line for every state change; all controls keyboard reachable.
- Tile cards are `role="button"`, `tabIndex=0`, toggled with Enter/Space.
- `@media (prefers-reduced-motion: reduce)` disables all animation.
- `@media print` hides the app chrome and prints only the surviving paper strips.
- Layout must remain usable at 390px; the tape strip scrolls horizontally.

## Copy rules
Say "resurrect", "commit to paper", "strip", "intake desk". Never claim AI,
cloud, encryption or anonymity: DEAD LETTER provides integrity verification,
not confidentiality. Say so explicitly if asked.
