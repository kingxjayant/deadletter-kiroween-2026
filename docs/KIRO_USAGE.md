# How Kiro was used — DEAD LETTER OFFICE

> **READ THIS FIRST, JAYANT.** This is the write-up the judges score for
> "Technological Implementation" (20% of the total). Everything below that
> describes the *configuration* in this repo is true today. Anything marked
> `[[FILL: …]]` must come from a **real Kiro session** that you run before
> submitting. Do not guess, and do not attribute work to Kiro that Kiro did not
> do. Log every session in `docs/KIRO_EVIDENCE.md` and link the PRs here.
> GhostBridge, another 2026 entry, explicitly discloses which parts were *not*
> made by Kiro — judges reward that kind of verifiable honesty.

---

## 0. The strategy (one paragraph for the Devpost field)

We treated Kiro as a **spec-driven engineering environment**, not as autocomplete.
DEAD LETTER's central claim — "any k of n printed strips resurrect the message" —
is a mathematical invariant, so we wrote it as EARS requirements with explicit
correctness properties *before* any implementation. Kiro's spec workflow produced
`requirements.md → design.md → tasks.md`; steering files encoded the GF(2⁸)
invariants, the design system and the Devpost rules; hooks made those invariants
executable on every save; a local MCP server let Kiro construct and destroy
tapes from chat; and Kiro's property-based correctness view plus committed PBT
tests supplied evidence. Vibe coding alone would have produced a plausible-looking
demo that silently failed on unlucky tile subsets — the spec/PBT loop is what
made the MDS guarantee trustworthy.

`[[FILL: one sentence naming the Kiro surfaces you actually used, e.g. "Kiro IDE 1.x for specs + Correctness, Kiro CLI v3 headless in GitHub Actions, Kiro Web for a review session, Kiro Crew for the auditor app".]]`

---

## 1. Spec-driven development vs vibe coding

Two feature specs live at the repo root under `.kiro/specs/`:

| Spec | Requirements | Design | Tasks |
| --- | --- | --- | --- |
| `deadletter-codec` | 4 user stories, 18 EARS clauses (R1.1–R4.2), 6 correctness properties (P1–P6) | GF(2⁸) maths, Cauchy/MDS proof sketch, tile format, mermaid sequence, error table, testing strategy, deliberate limitations | 4 dependency waves, 26 numbered tasks |
| `haunted-ui` | 9 EARS clauses, 3 UI properties (UP1–UP3) | state model, interaction model, 4 intake fallbacks, iframe/clipboard/jsdom risks | 12 numbered tasks |

Requirements use EARS phrasing ("WHEN … THE System SHALL …", "FOR ANY …"), which
is what lets Kiro's **Correctness** view extract testable properties. For
example R2.1 became P1: *for any message and any valid (k,n), any subset of k
tiles decodes to the exact original*.

**How this differed from vibe coding** — write your own comparison here, in your
own words, after using both:
`[[FILL: 3–5 sentences. Suggested honest points: (a) with vibe coding you would have implemented a random/fountain XOR code that "usually" recovers, and the failing subsets would only appear in the demo; (b) writing EARS requirements forced the words "any k" into the design, which forced a Cauchy MDS code; (c) tasks.md gave reviewable checkpoints and a paper trail; (d) what was slower/faster.]]`

`[[FILL: link the PR(s) where Kiro executed spec tasks, e.g. https://github.com/.../pull/2.]]`

---

## 2. Kiro surfaces tried and how they differed

Fill in only the rows you actually ran. Delete the others — an honest short
table beats an impressive invented one.

| Surface | What I did | What was different | Evidence |
| --- | --- | --- | --- |
| Kiro IDE | `[[FILL]]` | `[[FILL]]` | `[[FILL: PR / screenshot path]]` |
| Kiro CLI v3 (headless) | `.github/workflows/kiro-headless.yml` runs `kiro-cli` via the Kiro GitHub Action on a `/kiro` comment or workflow dispatch, opens a PR, then `npm test && npm run build && npm run audit:submission` gates it. | `[[FILL: e.g. no interactive approvals, needed a scoped custom agent, slower but reproducible in CI]]` | `[[FILL]]` |
| Kiro Web | `[[FILL]]` | `[[FILL]]` | `[[FILL]]` |
| Kiro Crew | `crew-app/` is a small Crew app that audits a Kiroween submission on a schedule. | `[[FILL: persistent sessions, memory, scheduled jobs vs one-shot IDE chat]]` | `[[FILL: separate public repo URL]]` |

---

## 3. Custom agents

Two read-only custom agents are committed in `.kiro/agents/`:

- **`codec-reviewer.md`** — restricted to `read`/`grep` plus `npm test`, loaded
  with the codec spec, the invariants steering file and the PBT suite. It checks
  changes against the MDS guarantee and the six properties, and is forbidden from
  claiming a test passed without seeing its output.
- **`submission-auditor.md`** — compares `docs/SUBMISSION_COPY.md` against the
  Official Rules steering file, flags 8 blocker conditions, and must include the
  exact output of `node tools/audit-submission.mjs`.

`[[FILL: which Kiro app you used each agent in, and one concrete finding each produced.]]`

---

## 4. Agent hooks — workflows actually automated

`.kiro/hooks/` (v1 JSON format, loaded by both Kiro IDE and CLI v3):

| Hook | Trigger | Action | Why it improved the build |
| --- | --- | --- | --- |
| `tests-on-save.json` | `PostFileSave` on `web/src/**`, `tests/**`, `tools/**` | `npm test` | Any codec regression surfaces within a save, not at the end of the day. |
| `pbt-on-codec-change.json` | `PostFileSave` on `codec.mjs` / `gf256.mjs` | `npm run test:pbt` | The product *is* the MDS invariant; hundreds of generated subsets re-check it on every edit. |
| `compliance-guard.json` | `PreToolUse` on writes (agent prompt), `SessionStart` (audit command), `PostFileSave` on `.gitignore` | reminders + `node tools/audit-submission.mjs` | Prevents the two most common disqualifications: `.kiro` gitignored and stale provenance. |
| `docs-sync.json` | `PostFileSave` on specs (agent prompt); `Stop` (agent prompt) | keep README/spec map and the usage write-up consistent; nudge to log evidence | Judges never read a stale claim; evidence is captured while the session is fresh. |

`[[FILL: paste one real hook log excerpt showing an actual firing — e.g. the PBT hook catching a broken coefficient — and what you fixed. If no hook fired during your build, say so honestly and describe the manual run instead, like GhostBridge did.]]`

---

## 5. Steering docs and the strategy that mattered most

`.kiro/steering/` (front matter must be the *first* line — a blank line above it
silently breaks inclusion modes):

- `product.md`, `tech.md`, `kiroween-compliance.md` — `inclusion: always`:
  the audience, the zero-network constraint, the exact deadlines and prize rules.
- `codec-rules.md` — `inclusion: fileMatch` on `codec.mjs`/`gf256.mjs`: the
  seven mathematical and format invariants, injected only when those files are touched.
- `design-system.md` — `inclusion: fileMatch` on the HTML/CSS/controller: palette,
  accessibility and the "spooky must encode real state" rule.

**The highest-value strategy:** putting the *disqualification rules themselves*
into always-on steering and into an executable audit script. Kiro then had the
Official Rules in context on every turn, and could not "helpfully" add `.kiro`
to `.gitignore` or claim encryption. `[[FILL: agree or replace with the strategy
that actually made the biggest difference in your sessions.]]`

---

## 6. MCP — extending Kiro with project-specific tools

`.kiro/settings/mcp.json` registers a **local stdio MCP server**
(`tools/mcp/deadletter-mcp.mjs`, zero external dependencies, newline-delimited
JSON-RPC). It exposes five tools:

| Tool | What it lets Kiro do |
| --- | --- |
| `encode_message` | Build a real tape from chat; get k, n, fingerprint and all tile strings |
| `decode_tiles` | Destroy strips and verify the MDS property interactively |
| `gf_explain` | Inspect a Cauchy coefficient and its inverse while debugging the field maths |
| `audit_submission` | Run the Official Rules gate at any point in a session |
| `list_correctness_properties` | Read the property table from the spec without loading the whole file |

`.github/workflows/ci.yml` smoke-tests the server with three JSON-RPC calls on
every push, so this is a working integration, not a config file for show.

`[[FILL: one concrete bug or design decision the MCP tools helped you with — e.g. "encode_message with k=4,n=7 exposed that the parity row for idx=k used the wrong x value; gf_explain showed x=y".]]`

---

## 7. Property-based testing (Kiro Correctness)

`tests/pbt.test.mjs` implements P1–P6 with `fast-check`: 120 generated
messages × random k-of-n subsets, 100 erasure cases, 80 tile-integrity cases,
500 field-law cases, 300 Cauchy cases, 250 base64/CRC cases. CI runs them twice
(explicitly in `npm run test:pbt` and as part of `npm test`).

Kiro's spec **Correctness** view derives properties from EARS requirements and
fuzz-tests them with shrinking. It is IDE-only and costs more than one credit per
run, so use it on the codec spec's critical path, not on every change.

`[[FILL: paste the real Kiro Correctness output / screenshot path here, plus the
`npm run test:pbt` summary. Note explicitly: Kiro's docs say PBT is "evidence,
not verification or proof" — the MDS theorem supplies the proof, PBT guards the
implementation. If you did not run the IDE feature, say "not run" and rely on
the committed fast-check suite.]]`

---

## 8. Kiro powers

`powers/deadletter-codec/` is a **local knowledge power** (legacy `POWER.md`
format, 5-field front matter, keywords for on-demand activation) with two
steering files: `gf256.md` (the MDS proof sketch and a worked 8-of-14 example)
and `submission-checklist.md` (every disqualification trap). Installing it from a
local folder keeps the codec expertise out of context during unrelated UI work —
the key advantage over always-on steering or five MCP servers loaded at once.

`[[FILL: confirm you installed it from the Powers panel, and name a task where it activated. If you used a marketplace power instead (e.g. Kane CLI verification for browser checks), name it here and delete this paragraph's claims.]]`

---

## 9. What Kiro did NOT do

Be explicit — this is a credibility multiplier:

- `[[FILL: e.g. "The initial scaffold, CI workflows and first documentation draft were produced in an Arena agent session on 12 Nov 2026, then all codec/UI implementation tasks were re-run inside Kiro from the spec; see PR #…". Adapt to what actually happened.]]`
- The maths (Cauchy MDS property) comes from coding theory, not from Kiro.
- The licence texts of vendored libraries are third-party; see `NOTICE`.
- No AI model is called at runtime. The demo contains no inference, no API key.

---

## 10. Verification commands the judges can run

```bash
npm ci
npm test                  # 23 tests: unit, PBT, headless DOM smoke
npm run test:pbt          # the six correctness properties
npm run build             # reproducible static bundle
npm run audit:submission  # 10+ Official Rules checks
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | node tools/mcp/deadletter-mcp.mjs
```
