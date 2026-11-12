/**
 * DEAD LETTER — Kiroween 2026 submission compliance auditor.
 *
 * The official rules disqualify entries for a handful of boring, avoidable
 * mistakes (missing /.kiro, .kiro in .gitignore, no detectable license, ...).
 * This script turns those rules into a hard gate. It is called by CI, by a
 * Kiro agent hook on save, and by the project's local MCP server.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

export function auditSubmission(root = ROOT) {
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok: Boolean(ok), detail });
  const read = (relative) => (existsSync(join(root, relative)) ? readFileSync(join(root, relative), 'utf8') : null);

  const kiroDir = join(root, '.kiro');
  add('.kiro/ exists at repo root', existsSync(kiroDir), 'Required by the Official Rules.');

  for (const sub of ['specs', 'steering', 'hooks']) {
    const folder = join(kiroDir, sub);
    const count = existsSync(folder) ? readdirSync(folder).length : 0;
    add(`.kiro/${sub}/ is populated`, count > 0, `${count} entries`);
  }

  const gitignore = read('.gitignore') ?? '';
  const ignoring = gitignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .filter((line) => /\.kiro/.test(line) && !line.startsWith('!'));
  add('.kiro is NOT in .gitignore', ignoring.length === 0, ignoring.length ? `offending lines: ${ignoring.join(', ')}` : 'No ignore rule found.');

  const license = read('LICENSE') ?? '';
  add('Open-source LICENSE file present', /MIT License|Permission is hereby granted/i.test(license), 'GitHub must auto-detect it in the About section.');

  const readme = read('README.md') ?? '';
  add('README has run instructions', /npm (ci|install)|Getting started|Quick start/i.test(readme), '');

  for (const file of ['docs/KIRO_USAGE.md', 'docs/PROVENANCE.md', 'docs/SUBMISSION_COPY.md']) {
    add(`${file} present`, Boolean(read(file)), 'Required for the Kiro write-up / disclosure.');
  }

  const usage = read('docs/KIRO_USAGE.md') ?? '';
  add('Kiro write-up covers specs, hooks, steering, MCP',
    /spec/i.test(usage) && /hook/i.test(usage) && /steering/i.test(usage) && /MCP/i.test(usage), '');

  const built = existsSync(join(root, 'public', 'app.js'));
  add('Built app exists (public/app.js)', built, built ? '' : 'Run `npm run build` before deploying.');

  const passed = checks.filter((check) => check.ok).length;
  return { passed, total: checks.length, ok: passed === checks.length, checks };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const report = auditSubmission();
  for (const check of report.checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}${check.detail ? ` — ${check.detail}` : ''}`);
  }
  console.log(`\n${report.passed}/${report.total} checks passed.`);
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}
