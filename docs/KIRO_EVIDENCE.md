# Kiro session evidence log

**Rule: only real sessions go in this file.** Every row must be reproducible from
a PR, a CI run, a command output or a screenshot that is committed in this repo
under `docs/evidence/` (create that folder when you capture the first one).
Judges for Kiroween score *how effectively Kiro was used*; fabricated claims are
both a rules risk and easy to spot.

## How to capture evidence

1. Work on a branch / PR for each spec task. Keep the Kiro-generated diff.
2. Save the exact command and its output:
   `npm test | tee docs/evidence/2026-11-18-pbt.txt`
3. Screenshot the Kiro IDE **Specs** pane, **Correctness** results, **Agent Hooks**
   firing, **Powers** activation and **MCP** tool calls → `docs/evidence/*.png`.
4. For Kiro CLI headless runs, save the Actions run URL and the resulting PR.
5. Add one row below. If a hook never fired, write "not observed" — do not claim
   automation that you did not verify (this is exactly what GhostBridge 2026 did).

## Log

| Date (2026) | Kiro surface | Task / spec | Real artifact | What changed | Verified by |
| --- | --- | --- | --- | --- | --- |
| **23 Nov** | **Kiro IDE** (desktop, Windows lab PC, signed in as `kingxjayant`, **Kiro Free** plan) | Asked Kiro to review `.kiro/specs/deadletter-codec` and the codec source, then add an edge-case test | `tests/codec.test.mjs` — test `Devanagari/Nagpuri text survives losing all 6 parity tiles (8 of 14 remain)`. **Consumed 0.76 credits, 1m 16s, 1 file changed** (meter visible in `docs/evidence/kiro-01-chat-and-credits.png`; taskbar clock reads 2026-11-23 12:16). No PR: the lab PC had no git CLI (repo opened from a GitHub ZIP) and the working copy was deleted at the end of the session | Kiro confirmed the `sha16` fingerprint is taken over the **pre-padding** message bytes (verified independently: `sha16(bytes)` at `codec.mjs:156`, zero-padding to `k × chunkSize` only at line 149, so two messages differing only in trailing-zero padding cannot collide). It then authored the Nagpuri + emoji test asserting exact string recovery, SHA-256 verification, 6 lost tiles, 8 used tiles and UTF-8 byte equality | `docs/evidence/kiro-01-chat-and-credits.png`, `kiro-02-diff.png`, `kiro-03-settings.png`. Test reconstructed from the diff and re-run: `npm test` 27/27 |
| **23 Nov** | **Kiro IDE — configuration NOT loaded** | Opened the repo ZIP expecting the committed `.kiro/` to drive the session | `docs/evidence/kiro-03-settings.png`: Specs, Hooks and MCP Servers are empty and Agent Steering lists only **Global** (architecture-selection, quick-spec, bug-fix) | The specs, 5 steering docs, 4 hooks and the `deadletter-codec` MCP server in this repo were **not active**. Kiro reviewed code by reading files, not by spec-driven development. The next session must confirm the sidebar lists them *before* work starts | The screenshot itself — negative evidence, recorded deliberately |
| **23 Nov** | **Kiro IDE — blocked capability** | Tried a terminal-backed task | `execute_pwsh` returned **Exit Code: -1**: the lab PC's host policy blocks shell execution | Worked around it by having Kiro inspect the codebase and specs read-only instead of running commands. Worth stating plainly in the write-up: this is why that session produced a test rather than a full spec task run, and why no hook fired | This row is itself the evidence — a blocked tool is disclosed, not hidden |
| 23 Nov | *not Kiro* — Arena agent + human | Initial research, concept, scaffold, codec, UI, tests, `.kiro` configuration, docs | this repository at its first commit | Project created inside the Submission Period; disclosed under `docs/PROVENANCE.md` | `npm test` 23/23, `npm run build` |
| `[[FILL]]` | Kiro IDE — spec session | `.kiro/specs/deadletter-codec` tasks 2.x | PR `[[FILL]]` | `[[FILL]]` | `npm run test:pbt` `[[FILL]]` |
| `[[FILL]]` | Kiro IDE — Correctness (PBT) | Properties P1–P6 | `docs/evidence/[[FILL]].png` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Kiro CLI v3 headless in Actions | `[[FILL]]` | Actions run `[[FILL]]` / PR `[[FILL]]` | `[[FILL]]` | CI green |
| `[[FILL]]` | Agent hook | `[[FILL]]` | `docs/evidence/[[FILL]].txt` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | MCP tool | `[[FILL]]` | `docs/evidence/[[FILL]].txt` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Power activation | `[[FILL]]` | `docs/evidence/[[FILL]].png` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Kiro Crew | `crew-app/` | separate repo `[[FILL]]` | `[[FILL]]` | `[[FILL]]` |

## Suggested next Kiro sessions (the first one is now done)

1. **IDE, spec mode — DO THIS NEXT.** The first session produced no PR because
   the machine had no git CLI. Run the next one on a machine **with git
   installed** so Kiro's work lands as a real commit on a `kiro/…` branch, and
   open a PR. That single PR closes the "insufficient use of Kiro" risk far more
   convincingly than any screenshot. Suggested task: `.kiro/specs/deadletter-codec`
   task 2.7, or have Kiro extend the mixed source+parity property into a
   fast-check property in `tests/pbt.test.mjs`.
2. **IDE, Correctness:** run the properties on the codec spec; save the screenshot.
3. **CLI locally (free account):** `kiro-cli login` (browser OAuth), then run a
   scoped task with the workspace `.kiro` config; save the transcript.
   *Headless in CI is optional and needs a paid-plan `KIRO_API_KEY` — see
   `docs/KIRO_CREDITS.md`. If you have no API key, skip this rather than claim it.*
4. **Hook proof:** edit `cauchyCoefficient` deliberately wrong, save, watch the
   PBT hook fail, then fix it. Save both outputs — this is a great 10-second
   story for the demo video.
5. **MCP proof:** in chat, call `encode_message` with k=4, n=7, then pass only 4
   tile strings to `decode_tiles`; save the transcript.
