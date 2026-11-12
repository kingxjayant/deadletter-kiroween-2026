# Devpost registration — exact answers (Kiroween 2026)

The registration form is **not** the submission. It is the gate for the
**4,000 free Kiro credits** and it is read by humans, so keep it truthful and
consistent with the project you actually submit.

> ⚠️ **Order matters.** Do a real Kiro session (20–30 min) **before** you submit
> this form. Two required fields ask how much Kiro you have used. If you answer
> "Never" / "None (yet)" and then submit a project whose whole Kiro write-up is
> about specs, hooks and PBT, a judge sees a mismatch between your profile and
> your submission. After one genuine session, the accurate answers become
> "Less than a month" and "Kiro IDE" — and both are then true.

---

## Field-by-field

| Field | Answer | Note |
| --- | --- | --- |
| Do you have teammates? | **Working solo** | Teams up to 3 are allowed; solo is simpler and keeps you eligible for the per-category student prize |
| Who told you about Kiroween 2026? | **Devpost** | True |
| Via | **Devpost.com** | True |
| Kiro user ID or AWS account ID | your `d-…` ID | **Use the copy icon** in the Kiro usage dashboard and paste — never retype it. Yours begins `d-9067c98495.…`. Do not paste it into any public file or chat again; it is an account identifier |
| How much have you used Kiro? | **Less than a month** *(only after your first real session)* | If you genuinely have not opened Kiro yet, answer **Never** — then register-and-fix later is not possible, so prefer: use Kiro first, then register |
| What interests you about Kiro? | see copy-paste text below | Required, free text |
| Which Kiro tools have you used? | **Kiro IDE** *(add Kiro CLI only if you actually ran `kiro-cli`)* | Do not tick tools you have not opened |
| Primary Kiro tool | **Kiro IDE** | Needed once any tool above is selected |
| Eligibility requirements | tick both | Read the second line on screen: it is the age-of-majority declaration. In India that is **18**, and you are 20, so it is true for you |

### Copy-paste: "What interests you about Kiro?"

> Spec-driven development is what I need most. DEAD LETTER's core is a Cauchy
> Reed–Solomon codec: whether "any k of n torn strips still decode" is a
> mathematical claim, not a vibe, so I want it stated as EARS requirements in
> `requirements.md` and then attacked by property-based tests that fuzz random
> k-of-n subsets. Steering keeps the GF(2^8) invariants and the strict
> no-network-at-runtime rule in front of the agent on every turn, hooks run the
> test suite after each save so a codec regression cannot slip through, and
> hooks/MCP matter to me because an offline-first app can only be checked by
> running its own codec rather than guessing. I want a spec I can hand to a
> judge and a test suite that either reproduces or refuses.

*(≈700 characters — trim if the box has a shorter limit.)*

---

## Two traps in this form

1. **Lying about country.** Tips circulating on X say to "try US/UK/Canada".
   Don't. **India is eligible** under the official rules, and a mismatch between
   your country, your ID document and your Devpost profile is exactly what the
   Didit identity check is built to catch.
2. **The identity check needs *government* ID.** The credit flow is: form →
   Didit email (photo of ID + selfie) → code by email → redeem at
   `app.kiro.dev`. A **college ID card is very unlikely to be accepted** — use
   Aadhaar / passport / driving licence / PAN. Your Devpost **profile name must
   match the name on that document exactly**, including spelling.
   Your ID card stays private either way; it is *not* the document to use here.

## After you hit submit

1. Confirm you appear as a participant on the Kiroween 2026 Devpost page.
2. Open **Resources → Credit Request Form** and submit it (Kiro user ID + Devpost
   profile URL + category **Resurrection** + one line about the build).
   Deadline: **1 Dec 2026, 12:00 PM PT = 2 Dec 2026, 1:30 AM IST** — aim for
   **30 Nov**.
3. Watch for the Didit email; complete it immediately. Requests are reviewed in
   ~48 business hours, and the code must be **redeemed by 4 Dec**.
4. Registration ≠ submission. The project still has to be submitted on Devpost
   with repo, live URL, video and write-up.

## Then: the real Kiro session (the actual blocker)

Registration proves you have an account. It does **not** prove Kiro built
anything. `docs/KIRO_USAGE.md` and `docs/KIRO_EVIDENCE.md` still hold the honest
"not Kiro — Arena agent + human" row. Recommended first session:

1. Open the repo in **Kiro IDE**, point it at `.kiro/specs/deadletter-codec/`.
2. Run the spec through requirements → design → tasks; commit the Kiro-authored
   diff as a real PR (not on `main`).
3. Let the `PostFileSave` hook fire on `web/src/codec.mjs`; screenshot the hook
   output.
4. Run **Correctness** (property-based testing) on `decodeTape` and keep the
   counterexample output.
5. Call the MCP tool `encode_message` / `decode_tiles` from chat; screenshot.
6. Record all of it in `docs/KIRO_EVIDENCE.md` — and if something does not fire,
   write "not observed" instead of inventing it.
