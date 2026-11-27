# Kiro lab session runbook

**Job of this session:** turn "Kiro reviewed a file" into "Kiro did spec-driven
work, and the repo proves it." The single biggest remaining judging risk is that
you have no Kiro-authored commit and no evidence the `.kiro/` config works.

Print this or open it on your phone at the lab. Time needed: **45–60 min**.

---

## 0. Pre-flight — check BEFORE you sit down (5 min)

| Check | Why |
| --- | --- |
| The lab PC has **`git`** installed (`git --version`) | Without it you cannot create a PR, and last session proved the cost: zero Kiro commits, and the work died with the machine |
| You can sign in to **Kiro** (GitHub or Google) | Free plan is fine |
| **Phone charged / screenshot shortcut known** | Every claim needs a picture; a screenshot takes 1 s, re-running a lost session takes an hour |
| You can reach `https://kiroween.devpost.com` | For the credit form, if not already done |

If `git` is missing: do not download the ZIP again. Ask the lab staff, or use
**Kiro Web** and copy the exact file contents out, or bring a USB stick. A ZIP
session with no git is what cost you last time.

## 1. Clone, don't download (5 min)

```bash
git clone https://github.com/kingxjayant/deadletter-kiroween-2026.git
cd deadletter-kiroween-2026
git switch -c kiro/spec-task-2-7
```

Then in Kiro: **File → Open Folder → the `deadletter-kiroween-2026` folder
itself** — the folder that *directly contains* `.kiro/`. Opening a parent folder
(with the repo nested inside) is the most common reason the config silently does
not load.

Trust the folder when prompted.

## 2. The gate — prove the config loaded (5 min) ⭐

Open the Kiro sidebar (Settings icon). **All four must be true:**

- [ ] **Specs** → `Test Reed-Solomon` / `deadletter-codec` listed (not just "+ Create New Spec")
- [ ] **Agent Hooks** → 4 hooks listed
- [ ] **Agent Steering & Skills** → the 5 steering docs, not only **Global**
- [ ] **MCP Servers** → `deadletter-codec` present and connected

**Screenshot this pane.** It is the proof that everything in `docs/KIRO_USAGE.md`
is real, and it is the screenshot last session was missing.

If something is absent, stop and fix it before working — a session that produces
code with the config unloaded is what you already have. Quick checks:

- Is there a `.kiro` folder in the folder you opened? (`ls -a`)
- Did the trust prompt appear and get accepted? Restart Kiro after trusting.
- Is `deadletter-codec` failing to start? Run it by hand:
  `node tools/mcp/deadletter-mcp.mjs` — it should wait for JSON on stdin, not exit.

## 3. One real spec task, on a branch (25 min)

Ask Kiro, in chat:

> Read `.kiro/specs/deadletter-codec/tasks.md` and implement the next unfinished
> task. Follow `.kiro/steering/codec-rules.md` exactly. Do not change the tile
> format. Show me the diff first.

Watch for: does it cite the steering rules? does a **hook** fire after the save
(that is the thing nothing has yet proved)? If a hook fires, screenshot the output.

Let it write **a test too** — that is the pattern that worked last time.

## 4. Correctness (PBT) — 10 min

Open the codec spec → **Correctness** → run the properties. Kiro fuzzes and
shrinks; it costs real credits, so run it once, on `decodeTape`, not on the UI.

Screenshot the result, pass **or fail**. A shrunk counterexample is *better*
evidence than a green tick — it shows the tool doing something you cannot fake.

## 5. MCP from chat — 5 min

In chat, ask Kiro to call `encode_message` with k=4, n=7, then pass only 4 of the
returned tiles to `decode_tiles`. Screenshot the transcript. This takes a tool
that already passes CI and proves Kiro actually used it.

## 6. Commit and open the PR (5 min)

```bash
npm test            # must be green before you push
git add -A
git commit -m "Kiro: <what it actually did> (spec task 2.x)"
git push -u origin kiro/spec-task-2-7
```

Then open the PR on GitHub and paste the URL into `docs/KIRO_EVIDENCE.md`.
**This PR is the thing judges can verify.** It is worth more than every
screenshot on this list.

## 7. Before you leave

- [ ] `git push` succeeded (`git log origin/kiro/spec-task-2-7 --oneline`)
- [ ] PR URL copied somewhere you can reach from home (email it to yourself)
- [ ] Screenshots: populated settings pane, hook firing, Correctness, MCP
- [ ] Sign out of Kiro **and** GitHub; verify https://github.com/settings/sessions
- [ ] Nothing on the lab PC that you need — assume it is wiped

## What to say afterwards, honestly

If the config does **not** load, or the hooks do not fire, that is fine — say so
in `docs/KIRO_EVIDENCE.md` and describe what you ran manually instead. GhostBridge
(another 2026 entry) scored well while disclosing exactly that. What sinks an
entry is a write-up that claims automation nobody can find.
