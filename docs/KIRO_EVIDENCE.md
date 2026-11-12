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
| 12 Nov | *not Kiro* — Arena agent + human | Initial research, concept, scaffold, codec, UI, tests, `.kiro` configuration, docs | this repository at its first commit | Project created inside the Submission Period; disclosed under `docs/PROVENANCE.md` | `npm test` 23/23, `npm run build` |
| `[[FILL]]` | Kiro IDE — spec session | `.kiro/specs/deadletter-codec` tasks 2.x | PR `[[FILL]]` | `[[FILL]]` | `npm run test:pbt` `[[FILL]]` |
| `[[FILL]]` | Kiro IDE — Correctness (PBT) | Properties P1–P6 | `docs/evidence/[[FILL]].png` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Kiro CLI v3 headless in Actions | `[[FILL]]` | Actions run `[[FILL]]` / PR `[[FILL]]` | `[[FILL]]` | CI green |
| `[[FILL]]` | Agent hook | `[[FILL]]` | `docs/evidence/[[FILL]].txt` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | MCP tool | `[[FILL]]` | `docs/evidence/[[FILL]].txt` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Power activation | `[[FILL]]` | `docs/evidence/[[FILL]].png` | `[[FILL]]` | `[[FILL]]` |
| `[[FILL]]` | Kiro Crew | `crew-app/` | separate repo `[[FILL]]` | `[[FILL]]` | `[[FILL]]` |

## Suggested first real Kiro sessions (do these this week)

1. **IDE, spec mode:** open `.kiro/specs/deadletter-codec/tasks.md`, ask Kiro to
   implement task 2.7 "add a `decodeTape` overload that reports the exact tiles
   used" — a small, real, testable change. Commit as a PR.
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
