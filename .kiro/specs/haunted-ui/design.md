# Design — spectral telegraph interface

## Structure
Single `index.html` shell, two tab panels (`#panel-compose`, `#panel-revive`),
one status line (`#live-status`, `aria-live="polite"`), one tape strip container.
State lives in a single `state` object in `app.mjs`:
`{ tape, torn:Set, cameraStream, scanning, seenTiles:Set }`.

`survivors()` is the single source of truth. Health badge, copy text, print view,
intake text and the demo all derive from it — no duplicated counters.

## Visual system
See `.kiro/steering/design-system.md`. Inline SVG sigil, CSS scanlines/grain,
parchment tiles with perforated edges, amber phosphor, spectral green for
verified, blood red for refusal. All assets are local/inline.

## Interaction model
- Tile cards are buttons; torn state is a CSS class plus a Set membership.
- `renderTape()` rebuilds cards and recomputes the health badge atomically.
- `takeToRevive()` copies surviving tile text into the intake textarea and
  switches tabs — the same path a human uses. The demo is not a fake shortcut.
- `revive()` calls the real `decodeTape()` and only renders on verified success.

## Intake fallbacks (ordered by reliability)
1. Paste tape text — always works, even in a sandboxed iframe.
2. `.deadletter` / `.json` / `.txt` file — always works.
3. QR image upload — jsQR runs on a canvas, no permission.
4. Camera stream — optional, needs HTTPS + permission; degrades with a message.

## Offline
`sw.js` caches `./`, `index.html`, `styles.css`, `app.js`, `vendor/jsQR.js`.
Registration is wrapped in try/catch; failure never blocks the app.

## Risks
- Sandboxed iframe (opaque origin): solved by classic scripts, not ES modules.
- `navigator.clipboard` denied: fallback `document.execCommand('copy')`.
- `getUserMedia` denied: user is told to paste or upload instead.
- jsdom: `Element.prototype.scrollIntoView` is stubbed in tests only.
