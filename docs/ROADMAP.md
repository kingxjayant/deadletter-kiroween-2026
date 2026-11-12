# 22-day roadmap — 12 Nov → 4 Dec 2026

Deadline: **Fri 4 Dec 2026, 2:00 PM PT = Sat 5 Dec 2026, 3:30 AM IST**.
Target: submit by **Thu 3 Dec evening IST**, with 24+ hours of buffer.

## Week 1 — make it real and verifiable (12–18 Nov)
- [x] Deep rules research, winner analysis, category decision (`KIROWEEN_2026_STRATEGY.md`)
- [x] Working codec + 23 tests + UI + build + `/.kiro` scaffold
- [ ] Register on Devpost for Kiroween 2026 (if not already).
- [ ] Create the public GitHub repo, push, enable Pages (workflow build type).
- [ ] Request the 4,000 free Kiro credits (before 1 Dec 12:00 PM PT; ID check;
      Devpost profile name must match your ID exactly).
- [ ] Open the repo in **Kiro IDE** and run a real spec task from `.kiro/specs/`
      → PR → log in `docs/KIRO_EVIDENCE.md`.
- [ ] Run Kiro **Correctness / PBT** on the codec spec → screenshot → evidence.
- [ ] Verify a Kiro hook actually fires (deliberately break a coefficient, save,
      capture the failing PBT output, fix it). Great video material.
- [ ] Call `encode_message` / `decode_tiles` from the MCP server in Kiro chat;
      save the transcript.

## Week 2 — product polish and proof (19–25 Nov)
- [ ] Real device testing: phone (390px), camera sweep, print preview, offline
      reload after the service worker installs.
- [ ] Fix anything from `docs/RISK_REGISTER.md` section C that you can still see.
- [ ] Capture 6 gallery screenshots + a short GIF of the tear → verified moment.
- [ ] Add real Kiro session rows to `docs/KIRO_EVIDENCE.md`; fill every `[[FILL]]`
      in `docs/KIRO_USAGE.md` and `docs/SUBMISSION_COPY.md`.
- [ ] **Record the demo video** following `docs/VIDEO_SCRIPT.md` (2:35–2:45).
      Upload public to YouTube; put the URL in `docs/SUBMISSION_COPY.md`.
- [ ] **Publish the blog post** (`docs/BLOG_DRAFT.md`) on dev.to / Hashnode /
      Medium during the Submission Period; save URL. Mention Kiroween 2026.
- [ ] **Publish the social post** (`docs/SOCIAL_BLITZ.md`) with the hashtag as
      the literal first characters; save URL. Add an original short screen recording.
- [ ] Optional: set `KIRO_API_KEY` secret and run the Kiro CLI headless workflow
      from a `/kiro` comment; review the PR Kiro opens.
- [ ] Optional: publish `crew-app/` as a separate public repo and enter
      Best Kiro Crew App.

## Week 3 — lock and submit (26 Nov – 3 Dec)
- [x] Student prize details confirmed: LinkedIn
      https://in.linkedin.com/in/jayant-kumar-a180a6362,
      `jayant.explains.ai@gmail.com` + private college ID card as enrolment
      proof (admission receipt still to be attached), **1st year Sem 2,
      B.Sc. AI & ML (2025–2028)**,
      Marwari College Ranchi. Keep the ID card OUT of the public repo.
- [x] Confirmed **not** registered for Kiroween 2025 → ❌ leave the
      Best Ghost of Kiroween Past bonus unchecked (organisers verify records).
- [ ] Fill the Devpost draft form completely using `docs/SUBMISSION_COPY.md`.
      Save drafts often; no edits after the deadline.
- [ ] Re-read the Official Rules once more for any update on the Updates tab.
- [ ] Final gate on a clean clone:
      `npm ci && npm test && npm run test:pbt && npm run build && npm run audit:submission`
- [ ] Ensure the live URL, GitHub URL, YouTube URL, blog URL and social URL are
      all public and reachable in a logged-out/incognito window.
- [ ] **Submit by 3 Dec evening IST.**

## Judging period (16 Dec 2026 – 29 Jan 2027)
- Keep the app and repo available and free of charge until judging ends.
- Winners announced on/around 3 Feb 2027. If selected: return the affidavit
  within 10 business days; non-US residents should expect a W-8BEN and possible
  withholding. Prize delivery within 60 days of receiving the forms.
