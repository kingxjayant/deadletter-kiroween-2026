# Devpost submission copy — fill the `[[...]]` fields before 4 Dec 2026

Everything not in brackets is ready to paste. **Submit at least 24 hours early.**
Deadline: 4 Dec 2026, 2:00 PM PT = **5 Dec 2026, 3:30 AM IST**.

---

## Form fields

**Title:** `THE DEAD LETTER OFFICE — a tear-tolerant paper telegram`

**Tagline (one line):** `Send a message where the internet cannot go. Print it. Tear it. Resurrect it.`

**Category:** `Resurrection`

**Bonus prizes to select:**
- ✅ Best Student Project: Resurrection ($1,500 + 1-year Kiro Pro Max)
- ✅ Bonus Blog Prize (2,000 Kiro credits, 100 winners)
- ✅ Social Blitz Prize (3-month Kiro Pro+, 5 winners)
- ✅ Best Demo (automatic, no extra step)
- ❌ **NOT ELIGIBLE: Best Ghost of Kiroween Past** — you confirmed on 12 Nov 2026 that you did **not** register for Kiroween 2025. Leave this unchecked; the organisers verify against 2025 records.
- ☐ Best Kiro Crew App — only after `crew-app/` is published as its own public repo.
- ☐ Best Startup Project — only if you are genuinely a founder with a startup website.

**URLs**
- GitHub repo: `https://github.com/kingxjayant/deadletter-kiroween-2026`
- Working app: `https://kingxjayant.github.io/deadletter-kiroween-2026/`
- Demo video (public YouTube, < 3 min): `[[YOUTUBE_URL]]`
- Blog post (third-party platform): `[[BLOG_URL]]`
- Social post (starts with #KiroweenHackathon26): `[[SOCIAL_URL]]`

**Student details (required for Best Student Project)**
- Name: Jayant Kumar
- Age: 20
- Institution: Marwari College, Ranchi, Jharkhand, India
- Year & degree: B.Sc. Artificial Intelligence & Machine Learning — **1st year, Semester 2** (session 2025–2028)
- Personal email (already known): `jayant.explains.ai@gmail.com`
- Student email: `jayant.explains.ai@gmail.com` — the college issues no institutional email. Enrolment proof: the **college ID card** (`IDCARD.jpg`, held privately) is ready; you also said an admission receipt is ready but have not attached it yet. Supply either only if the organisers request proof. **Do not upload it to the public repo.**
- LinkedIn: `https://in.linkedin.com/in/jayant-kumar-a180a6362`
- Team: solo (if you add teammates, ALL must be students and each needs the same details)
- Proof of enrolment: college ID card, Marwari College Ranchi (Ranchi University), session 2025–2028, class B.Sc. AI & ML, roll no. 14 — **private document, never committed to the public repo**. Contains personal data (phone, father's name, blood group).

**Judge testing instructions**
No account, credentials, API key or installation is needed. Open the live URL,
press **▶ One-click demo** (top right) and watch the full flow. For manual
testing: write a message → *Commit to the paper tape* → click strips to tear them
→ *Resurrect from surviving strips* → *Resurrect*. Also works from
`public/index.html` opened as a local file, or with `npm ci && npm run build &&
npm run serve`. Available offline after first load via service worker.

---

## Long description (paste into "Describe your project")

### Inspiration
`[[FILL: 2–3 honest sentences. Suggested: "I live in Jharkhand, where a flood or a network shutdown still turns a 40 km trip into the only reliable data channel. People already carry paper — forms, prescriptions, attendance sheets. I wanted to know whether a dead 19th-century medium could carry a modern message better than a broken 2G connection, and whether I could prove it would survive being torn."]]`

### What it does
DEAD LETTER turns any Unicode message into a printable paper tape of QR-coded
strips. Each strip also carries the same data as grouped telegram characters, so
a human can retype it if a QR is destroyed. The tape is built with a systematic
Cauchy Reed–Solomon code over GF(2⁸): **any k of the n strips** reconstruct the
entire message. Strips can be torn, stained, lost or delivered out of order.

The app runs entirely in the browser — no server, no account, no API key, no
telemetry, no network after the first load. Intake works four ways: paste the
telegram text, open a `.deadletter` file, upload a QR image, or scan strips with
a camera. Every strip is CRC-32 checked; every decoded message is SHA-256
verified. If fewer than k strips survive, the app **refuses** instead of
guessing and says exactly how many more it needs.

It is designed for community health workers, rural teachers and disaster-relief
volunteers who move between connected and disconnected places. It is also useful
for anyone under an internet shutdown. Integrity, not confidentiality: tiles are
not encrypted, and we say so plainly.

### How we built it
Vanilla ES modules, bundled to one classic script with esbuild and deployed as
static files on GitHub Pages. `gf256.mjs` implements the field and matrix
inversion; `codec.mjs` implements the tile format, CRC-32, MDS decoding and the
portable file format; `tape.mjs` renders QR SVGs; `app.mjs` drives the spectral
telegraph UI. Tests use Node's built-in test runner, fast-check for property-based
testing and jsdom for a full end-to-end DOM smoke test. The whole development
process is spec-driven inside Kiro — see **How Kiro was used** below and
`docs/KIRO_USAGE.md` in the repo.

### Challenges we ran into
- **"Usually decodes" was not acceptable.** A naive random-XOR fountain code
  fails on unlucky subsets. Switching to a systematic Cauchy matrix made the
  guarantee mathematical (MDS) and gave us six crisp correctness properties.
- **Cross-realm byte arrays.** `instanceof Uint8Array` broke under jsdom and in
  headless CI; duck typing fixed it. This is why the DOM smoke test runs against
  the built bundle, not the source.
- **Sandboxed iframes and permissions.** ES module imports fail under an opaque
  origin, so the app ships as a classic IIFE script. Camera and clipboard are
  optional; paste/file/QR-image paths always work.
- **Printed QR density.** Tile payloads are capped at 900 bytes and `k` grows
  automatically, so a cheap printer still produces scannable strips.
- **Proof vs evidence.** Property-based testing is evidence, not proof; the MDS
  theorem is the proof, and we say both out loud.

### Accomplishments we're proud of
- A one-click, < 60 second end-to-end demo a judge can run with no setup.
- 23 automated tests including six correctness properties and a headless DOM demo.
- The `/.kiro` folder as a real engineering artefact: two specs, five steering
  files, four hook files, a working local MCP server, custom agents and a power.
- An executable compliance gate so no hackathon rule is left to memory.
- A haunting interface where every spooky effect reports real state.

### What we learned
`[[FILL: 2–3 sentences of your own — specifically what spec-driven development changed about how you build, compared with vibe coding.]]`

### What's next
Multi-tape sessions for larger payloads, optional authenticated encryption for
sensitive records, a printable A4 layout optimised for thermal printers, and a
field trial with a local college/NGO.

---

## "How Kiro was used" field (short version — full version in repo)

Paste `docs/KIRO_USAGE.md` section 0 plus a condensed version of the table in
section "Kiro usage" from `README.md`, then add `[[FILL]]` evidence links. Target
250–400 words. Judges explicitly ask about custom agents, hooks, specs vs vibe
coding, steering, MCP, PBT, powers, and IDE/CLI/Web/Crew differences — cover all
eight, but only claim what you actually did.

---

## Final pre-submit checklist

- [ ] Repo public on GitHub; MIT license visible in About section.
- [ ] `/.kiro` present at root and NOT in `.gitignore`.
- [ ] `npm ci && npm test && npm run build && npm run audit:submission` all green.
- [ ] Live Pages URL loads on desktop AND on a phone; one-click demo works.
- [ ] YouTube video public, < 3 min, no copyrighted music/logos, English.
- [ ] Description, How-Kiro-was-used, category and bonus fields filled.
- [ ] Student details complete; proof of enrolment ready if requested.
- [ ] Blog and social posts published **during** the Submission Period, URLs added.
- [ ] `docs/KIRO_EVIDENCE.md` contains only real sessions.
- [ ] Submitted before 3 Dec 2026 evening IST (a full day of buffer).
