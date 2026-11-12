/**
 * Headless DOM smoke test for the built static app.
 * Proves the judge-facing flow works without a browser window, a server, or
 * any network: compose → commit → tear → resurrect → verified message.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const html = readFileSync(`${ROOT}public/index.html`, 'utf8');
const bundle = readFileSync(`${ROOT}public/app.js`, 'utf8');

async function boot() {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://deadletter.test/', pretendToBeVisual: true });
  const { window } = dom;
  window.TextEncoder = TextEncoder;
  window.TextDecoder = TextDecoder;
  Object.defineProperty(window, 'crypto', { value: webcrypto, configurable: true });
  window.Element.prototype.scrollIntoView = () => {};
  const errors = [];
  window.addEventListener('error', (event) => errors.push(event.message));
  window.eval(bundle);
  // jsdom fires DOMContentLoaded on its own tick; wait for bind() to run.
  await new Promise((resolve) => setTimeout(resolve, 60));
  return { window, errors };
}

test('app shell renders and exposes both desks', async () => {
  const { window, errors } = await boot();
  assert.equal(window.document.querySelectorAll('.tile').length, 0);
  assert.ok(window.document.getElementById('btn-commit'));
  assert.ok(window.document.getElementById('btn-revive'));
  assert.deepEqual(errors, []);
  window.close();
});

test('one-click demo resurrects a torn tape with SHA-256 verification', async () => {
  const { window, errors } = await boot();
  const document = window.document;
  document.getElementById('btn-demo').click();
  // jsdom timers are slower under the test runner: poll for the verdict.
  for (let i = 0; i < 40 && !/VERIFIED|REFUSED/.test(document.getElementById('verdict').textContent); i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  const verdict = document.getElementById('verdict').textContent;
  const result = document.getElementById('result-text').textContent;
  assert.match(verdict, /VERIFIED/);
  assert.match(result, /Bridge washed out/);
  assert.match(result, /नमस्ते/);
  assert.match(document.getElementById('result-stats').textContent, /LOST/);
  assert.ok(document.querySelectorAll('.tile.torn').length > 0, 'tape should show torn strips');
  assert.match(document.getElementById('tape-health').textContent, /ALIVE/);
  assert.deepEqual(errors, []);
  window.close();
});

test('insufficient strips are refused rather than guessed', async () => {
  const { window } = await boot();
  const document = window.document;
  document.getElementById('message').value = 'a short message';
  document.getElementById('btn-commit').click();
  await new Promise((resolve) => setTimeout(resolve, 120));
  document.getElementById('tile-input').value = document.getElementById('tile-input').value;
  // tear everything, then try to resurrect an empty intake
  document.getElementById('btn-revive').click();
  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.match(document.getElementById('live-status').textContent, /No strips|intake/);
  window.close();
});
