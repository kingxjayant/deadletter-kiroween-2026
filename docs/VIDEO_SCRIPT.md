# Demo video script — target 2:35 (hard limit 3:00)

Rules: public on YouTube, under 3 minutes, show the project working on the
device it was built for, no third-party trademarks or copyrighted music. Use
silence or an original ambient drone; put every key claim as an on-screen
caption so the video works muted. Judges are not required to watch past 3:00.

Record at 1920×1080, browser zoom 125%, dark room, no cursor wandering.
Capture a real phone for the last shot (rule: "on the device it was built for").

| Time | Visual | On-screen caption / narration |
| --- | --- | --- |
| 0:00–0:12 | Black. A single amber cursor types into the message box. Fade up the app. | **"The network is down. The message still has to travel."** |
| 0:12–0:28 | Show the empty app, the "NO SIGNAL REQUIRED" badge, the two tabs. Hover over the intro. | "DEAD LETTER resurrects telegraph paper tape for places without connectivity — field health workers, offline classrooms, disaster relays." |
| 0:28–0:48 | Type a realistic field message (use the sample). Point at byte counter. Click **Commit to the paper tape**. | "Any Unicode message. Everything happens in this browser tab — no server, no account, no API key." |
| 0:48–1:08 | Scroll to the printed tape. Zoom on one strip: QR, DATA/PARITY label, telegram letters, checksum. | "Each of the 14 strips carries a QR code AND human-readable telegram letters. If a QR is ruined, a person can still type it." |
| 1:08–1:22 | Hold up a real printed sheet if you have one (optional). Otherwise show the browser Print Preview. | "Print it on any cheap printer. Carry it." |
| 1:22–1:45 | Click **Tear strips at random** — six strips go translucent and stamped TORN. The health badge changes to `8/14 ALIVE · 6 LOST`. | "Now destroy six of them. The counter is real: the loss budget comes from the codec, not from the design." |
| 1:45–2:00 | Show one small inset: `G = [I_k ; C]`, `C[i][j] = 1/(x_i ⊕ y_j)`, and one line "Cauchy matrix → any k rows invertible". | "A systematic Cauchy Reed–Solomon code over GF(2⁸) makes any 8 of the 14 strips enough to rebuild everything." |
| 2:00–2:18 | Click **Resurrect from surviving strips**, then **Resurrect**. Show `VERIFIED · SHA-256`, used 8, lost 6, fingerprint. Pause on the recovered Devanagari text. | "CRC-32 rejects unreadable strips, and SHA-256 proves the message is byte-for-byte the original. It refuses rather than guesses." |
| 2:18–2:28 | Fast cut: tear one MORE strip so only 7 remain → `UNRECOVERABLE · 1 MORE NEEDED`. Then restore it. | "Too few strips? It says exactly how many more it needs." |
| 2:28–2:38 | Split-screen: Kiro IDE spec pane / `.kiro` tree / CI green. | "Built spec-driven with Kiro: EARS requirements, six correctness properties, hooks on save, steering, a local MCP server, and property-based tests in CI. `/.kiro` is committed." |
| 2:38–2:45 | Phone in hand: press **▶ One-click demo**, show VERIFIED. Then end card with repo + live URLs. | "Try it yourself. One click, offline. DEAD LETTER — Kiroween 2026, Resurrection." |

## Shot list for the Devpost gallery (6 images)
1. Hero: full app with the tape committed.
2. One strip, close-up (QR + telegram letters).
3. Torn tape with `8/14 ALIVE`.
4. Verified result card with statistics.
5. The `/.kiro` directory tree + CI green badge screenshot.
6. Phone screenshot of the verified result.

## Do not
- Do not use a stock music track, a film still, a brand logo, or a Devpost screenshot.
- Do not say "encrypted", "AI-powered", "anonymous" or "unhackable".
- Do not claim a Kiro hook fired unless you have the log (see `docs/KIRO_EVIDENCE.md`).
- Do not run past 2:55. Trim the maths inset first if you are long.
