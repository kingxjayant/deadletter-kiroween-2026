# Kiro credits and the API key — what to do this week

You said you were unsure about the Kiro API key. Here is the exact situation,
based on the official hackathon Resources page and Kiro's CLI documentation.

## 1. The free 4,000 credits (do this first — no subscription needed)

- **Amount:** a one-time allotment of **4,000 Kiro credits** for the Submission
  Period. This is separate from any API key.
- **Request form:** https://forms.gle/ykuadfNyNdWdbJfH9 (also linked on the
  hackathon Resources tab).
- **Deadline:** request by **Tuesday 1 Dec 2026, 12:00 PM PT** =
  **Wednesday 2 Dec 2026, 1:30 AM IST**. In practice, submit by 30 Nov night IST
  so the 48-business-hour review has time.
- **What you need:** a Kiro account (create at https://app.kiro.dev/signin),
  your **Kiro user ID** (docs: https://kiro.dev/docs/billing/related-questions/#how-can-i-retrieve-my-user-id),
  and accurate project details.
- **ID verification:** a selfie + a photo of government ID, run by Didit for
  Devpost. **Your Devpost profile name must match your ID exactly** — the most
  common reason checks fail. Your name is `Jayant Kumar`; make sure Devpost shows
  exactly that.
- **Review:** up to 48 business hours. Redeem the code by **4 Dec 2026**;
  redeemed credits expire **31 Dec 2026 11:59 PM PT**.
- **Redemption:** create/log into the Kiro account *before* opening the
  redemption URL; look for "Kiroupon successfully redeemed!"; check
  https://kiro.dev/account/usage within 1–2 minutes. If you see an error, log
  out, wait a few minutes, log back in and check the usage dashboard first.

## 2. KIRO_API_KEY (for the GitHub Actions headless workflow)

Reality check: **API-key auth for the Kiro CLI is a paid-plan feature.**
`KIRO_API_KEY` (a `ksk_…` key generated at app.kiro.dev → API Keys) is available
to **Pro, Pro+, Pro Max and Power** subscribers. Free-tier accounts must use
browser OAuth (`kiro-cli login`) or device flow locally
([Kiro CLI 2.0 changelog](https://kiro.dev/changelog/cli/2-0/),
[CLI auth guide](https://clawaws.com/blog/kiro-cli-getting-started/)).

So, with only the free hackathon credits:

- ✅ Use **Kiro IDE** (browser sign-in) for specs, Correctness/PBT, hooks,
  steering, MCP and powers. This is where most of the judging evidence comes from.
- ✅ Use **Kiro CLI locally** with `kiro-cli login` if you want a terminal
  session — no API key needed.
- ❌ `.github/workflows/kiro-headless.yml` will stay dormant unless you later
  add a `KIRO_API_KEY` secret from a paid plan. **That is fine.** Do not claim
  in the write-up that Kiro ran in CI unless it actually did.
- If you later get a paid plan: generate the key at app.kiro.dev → API Keys,
  add it as the repo secret `KIRO_API_KEY`, open an issue, comment
  `/kiro <a real spec task>`, and review the PR Kiro opens. Then log the Actions
  run URL in `docs/KIRO_EVIDENCE.md`.

## 3. The minimum real Kiro work that must happen

Regardless of credits, these sessions are what make the submission eligible and
score well — all possible with the free account in the IDE:

1. Open this repo in **Kiro IDE**, execute one task from
   `.kiro/specs/deadletter-codec/tasks.md` (a small real change), commit as a PR.
2. Run the spec's **Correctness** / property-based tests; save the screenshot.
3. Deliberately break `cauchyCoefficient`, save, watch the
   `pbt-on-codec-change` hook fail, fix it, save both outputs.
4. Call the local MCP tools `encode_message` → `decode_tiles` from chat; save the
   transcript.
5. Add one row per session to `docs/KIRO_EVIDENCE.md` and fill every `[[FILL]]`
   in `docs/KIRO_USAGE.md`.

More help: `#kiroween-hackathon` on the Kiro Discord, biweekly office hours
(every other Monday 9:30 AM PT), and https://kiro.dev/docs/guides/.
