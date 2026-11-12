<!--
PUBLISH THIS ON A THIRD-PARTY PLATFORM (dev.to, Hashnode, Medium, your own blog)
DURING THE SUBMISSION PERIOD (30 Oct – 4 Dec 2026). It must mention that it is
written as part of the Kiroween 2026 hackathon. Add the public URL to the
Devpost submission form. Do not publish before 30 Oct or after 4 Dec 2026.
Replace every [[FILL]] with real evidence before publishing.
-->

# Any 8 of 14: building a tear-proof telegram with spec-driven development

*Written as part of the Kiroween 2026 hackathon (AWS Kiro × Devpost). My project,
**THE DEAD LETTER OFFICE**, is entered in the Resurrection category. Repo:
`[[GITHUB_URL]]` · Live demo: `[[LIVE_URL]]`*

---

## The problem I started from

I live in Jharkhand. A flood, a power cut, or a network shutdown does not just
make the internet slow — it removes it. Yet people still need to move
information: a health worker's visit log, a teacher's attendance sheet, a list
of families who need supplies. What they *do* have is paper, a cheap printer, and
a phone camera.

So I asked a slightly ridiculous question: could a dead 19th-century medium —
telegraph **paper tape** — carry a modern message more reliably than a broken 2G
connection?

## What DEAD LETTER does

You type a message. The app prints a tape of QR-coded strips. You carry it. If
six of the fourteen strips are torn, stained, or left behind, the receiving
phone still reconstructs the message exactly, offline, with no server and no
account. Every strip also carries the data as grouped telegram letters, so a
human can retype a strip whose QR is destroyed.

The trick is a **systematic Cauchy Reed–Solomon code over GF(2⁸)**:

```
G = [ I_k ; C_(n−k)×k ]
C[i][j] = 1 / (x_i ⊕ y_j),   x_i = i,  y_j = (n−k) + j
```

The first `k` strips are the data. The remaining `n − k` are parity. Because a
Cauchy matrix is super-regular — every square submatrix is invertible — **any**
`k` rows of `G` form an invertible system. That is an MDS code: "usually
decodes" becomes "always decodes". On receive, we invert a `k × k` matrix over
the field, multiply by the surviving strips, trim to the recorded length, and
check a SHA-256 fingerprint. A strip that fails CRC-32 is discarded, not
repaired. If fewer than `k` strips survive, the app refuses and says exactly
how many more it needs.

## Why I wrote the spec before the code

My first instinct was to vibe-code a fountain code: XOR a few random chunks per
strip and hope enough independent equations arrive. That works *most* of the
time. "Most" is exactly the wrong answer for a tool someone might rely on during
a flood.

Writing EARS requirements forced the words **"FOR ANY message and ANY (k,n),
WHEN any subset of at least k distinct valid tiles is supplied …"** into the
design before a line of implementation existed. Kiro's spec workflow turned that
into `requirements.md → design.md → tasks.md`, and its correctness notion turned
it into property-based tests. I committed the same properties as runnable code
with fast-check: 120 generated messages crossed with random k-of-n subsets, plus
field laws, tile integrity and CRC checks.

That changed the implementation. The MDS property forced a Cauchy matrix instead
of random XOR, forced disjoint `x`/`y` index sets, and forced a real SHA-256
verification step. Six properties, ~1,300 generated cases per CI run, and one
short theorem now carry more weight than any amount of manual testing.

`[[FILL: add one paragraph here describing YOUR real Kiro sessions — the IDE
spec session, the Correctness/PBT run, a hook that actually fired, the MCP tool
that exposed a bug, and how the CLI headless run in GitHub Actions differed.
Link the PRs. Do not invent any of it.]]`

## What is inside `/.kiro`

Kiroween requires a `/.kiro` directory at the repo root, and forbids gitignoring
it. I made it the most useful folder in the project instead of a checkbox:

- **Two specs** (`deadletter-codec`, `haunted-ui`) with EARS requirements,
  architecture, mermaid sequence diagrams and trackable tasks.
- **Five steering files** using three inclusion modes: product intent, tech
  conventions and the Official Rules always on; codec invariants injected only
  when `codec.mjs`/`gf256.mjs` are touched; the design system injected only for
  UI files.
- **Four hook files**: full tests on save, property tests on codec change, a
  compliance guard on file writes and `.gitignore` edits, and a docs-sync /
  evidence-reminder hook on spec changes.
- **A local MCP server** with five project-specific tools (`encode_message`,
  `decode_tiles`, `gf_explain`, `audit_submission`,
  `list_correctness_properties`). It lets an agent build a tape, destroy strips,
  and check the MDS property from inside a chat session.
- **Two read-only custom agents**: a codec reviewer and a submission auditor.
- **A local Kiro power** bundling the GF(2⁸) proof sketch and the hackathon
  compliance checklist, activated on demand by keyword.

The Rules themselves became executable: `node tools/audit-submission.mjs`
checks that `/.kiro` is committed, the license is detectable, the write-up and
provenance docs exist, and the site builds. CI runs it on every push.

## Three bugs worth writing down

1. **Cross-realm byte arrays.** `instanceof Uint8Array` is false for a byte array
   produced in a different realm (jsdom, a worker, a headless CLI run). Duck-typing
   with `ArrayBuffer.isView` fixed it — and the DOM smoke test now runs against
   the *built* bundle, which is where it showed up.
2. **Sandboxed iframes.** ES module imports fail under an opaque origin, so the
   app ships as a single classic IIFE script. No CDN, no external fonts.
3. **Permission assumptions.** Camera and clipboard are optional luxuries.
   Paste, `.deadletter` file upload and QR-image upload work everywhere, so a
   judge can always complete the flow.

## What this is not

It is **integrity verification, not encryption**. Strips are readable by anyone
who has them; the CRC and SHA-256 only prove the message was not altered or
guessed. It is not AI-powered — no model is called at runtime. It holds 8 KB per
tape; bigger payloads need a session layer. And property-based testing is
evidence, not proof: Kiro's own docs say so. The proof is the super-regularity
of Cauchy matrices.

## Try it

Open `[[LIVE_URL]]` and press **▶ One-click demo**. Write a message, commit it
to paper, tear six strips, and resurrect it. Or clone the repo and run
`npm ci && npm test && npm run build && npm run serve`.

If you are building for Kiroween 2026: write the invariant first, make the rules
executable, and commit `/.kiro`. The spec is not paperwork — it is the thing
that stops a plausible demo from being a wrong one.

---

*Kiroween 2026 · Resurrection · MIT licensed · built with Kiro by Jayant Kumar,
Marwari College, Ranchi.*
