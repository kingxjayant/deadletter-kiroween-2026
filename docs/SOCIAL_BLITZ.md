<!--
PUBLISH DURING THE SUBMISSION PERIOD (30 Oct – 4 Dec 2026) on X, LinkedIn,
Instagram or TikTok. The hashtag MUST be the very first characters of the post —
that is a strict eligibility rule. Add the public post URL to the Devpost form.
The Kiro team judges "original thoughts vs AI writing", interesting insights,
and post assets. Rewrite this draft in YOUR voice before posting; generic AI
prose scores badly. Keep real specifics from your own Kiro sessions.
-->

# Social Blitz post — starts with the required hashtag

```
#KiroweenHackathon26 The thing that changed how I build wasn't Kiro's autocomplete — it was being forced to write "FOR ANY" into a requirement before writing code.

I'm building DEAD LETTER for the Resurrection category: a telegraph paper tape that carries a message where the internet can't go. Any 8 of 14 printed strips rebuild the whole message, offline, with SHA-256 verification. No server, no key, no account.

My first instinct was to vibe-code a random XOR fountain code. It "usually" recovered the message. Then I wrote the EARS requirement "WHEN any subset of at least k tiles is supplied, THE System SHALL return the exact original" — and "usually" stopped being acceptable. That single line forced a systematic Cauchy Reed–Solomon code over GF(2⁸), because a Cauchy matrix is super-regular: every square submatrix is invertible. Now 6 of the 14 strips can be torn and the maths still guarantees recovery.

Kiro's spec workflow turned that requirement into correctness properties. I wired a hook to run the property tests on every save of codec.mjs, put the invariants in a fileMatch steering doc so they only load when those files are touched, and added a tiny local MCP server so I can call encode_message → destroy strips → decode_tiles from inside chat. When a property fails, I fix the implementation, not the property.

Biggest lesson: with vibe coding I was reviewing code. With specs I'm reviewing intent — and intent is where the dangerous assumptions hide.

[[FILL: one specific real detail — e.g. "The PBT hook caught a wrong parity index at 11:40 pm; here's the diff."]]

Live demo: https://kingxjayant.github.io/deadletter-kiroween-2026/ · Repo (MIT, /.kiro committed): https://github.com/kingxjayant/deadletter-kiroween-2026
```

## Posting notes
- **First characters must be `#KiroweenHackathon26`** — no emoji, no greeting before it.
- Publish between 30 Oct and 4 Dec 2026. Save the exact public URL.
- Best asset: a 10-second screen recording of the tape being torn and the
  `VERIFIED · SHA-256` stamp appearing. Original footage only.
- Second-best asset: a photo of a real printed tape with strips torn off.
- Don't use AI-polished generic phrasing. The Kiro team explicitly scores
  "original thoughts vs AI writing". Keep your own Jharkhand context and the
  real bug you hit.
- Optionally post a short thread with the maths, but the FIRST post must contain
  the hashtag at the start and the URL you submit must be that post.
