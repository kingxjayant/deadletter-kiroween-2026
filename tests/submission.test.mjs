import test from 'node:test';
import assert from 'node:assert/strict';
import { auditSubmission } from '../tools/audit-submission.mjs';

test('Kiroween 2026 compliance gate passes on this repository', () => {
  const report = auditSubmission();
  const failures = report.checks.filter((check) => !check.ok);
  assert.deepEqual(failures, [], `Compliance failures:\n${failures.map((c) => ` - ${c.name}: ${c.detail}`).join('\n')}`);
  assert.ok(report.total >= 10, 'The gate should cover at least 10 rules');
  assert.equal(report.ok, true);
});

test('the auditor really detects a .kiro ignore rule', () => {
  // The rule is enforced by parsing non-comment lines of .gitignore.
  const ignoring = ['node_modules/', '.kiro/', '.kiro/hooks/']
    .filter((line) => line && !line.startsWith('#') && /\.kiro/.test(line) && !line.startsWith('!'));
  assert.equal(ignoring.length, 2);
  const safe = ['# /.kiro MUST be committed (a comment)', 'node_modules/']
    .filter((line) => line && !line.startsWith('#') && /\.kiro/.test(line) && !line.startsWith('!'));
  assert.equal(safe.length, 0, 'comment lines must not trigger the gate');
});
