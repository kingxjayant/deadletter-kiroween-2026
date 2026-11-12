---
name: kiroween-audit
description: Run the DEAD LETTER Kiroween 2026 compliance gate and summarise pass/fail results for the Crew dashboard.
---

# Kiroween submission audit

Run from the DEAD LETTER repository root:

```
node tools/audit-submission.mjs --json
```

Report: total checks, passed checks, and every failing check with its one-line
fix. Never mark a check as passed unless the command reported `ok: true`.
Remind the owner of the two most common disqualifications: `/.kiro` missing or
gitignored, and no detectable open-source license.
