/**
 * DEAD LETTER OFFICE — browser controller.
 *
 * Everything runs locally. No fetch(), no telemetry, no external assets.
 * The only browser capabilities used are Web Crypto, canvas, clipboard,
 * camera (optional) and print. Every one has a graceful fallback.
 */

import { makeTape, decodeTape, packTapeFile, unpackTapeFile, LIMITS } from './codec.mjs';
import { tileSvg, humanGroups, tapeAsText, downloadBlob } from './tape.mjs';

const $ = (id) => document.getElementById(id);
const state = { tape: null, torn: new Set(), cameraStream: null, scanning: false, seenTiles: new Set() };

const SAMPLE = 'Station 04 → McCluskieganj. Bridge washed out, network down since 06:20. '
  + 'All families accounted for. Send oral rehydration salts and two volunteers by morning. '
  + '— J.K. · नमस्ते · ✦';

function status(message, kind = '') {
  const node = $('live-status');
  node.textContent = message;
  node.className = `live-status ${kind}`;
}

function showTab(which) {
  const compose = which === 'compose';
  $('panel-compose').hidden = !compose;
  $('panel-revive').hidden = compose;
  $('tab-compose').classList.toggle('active', compose);
  $('tab-revive').classList.toggle('active', !compose);
  $('tab-compose').setAttribute('aria-selected', String(compose));
  $('tab-revive').setAttribute('aria-selected', String(!compose));
}

function bytes(text) {
  return new TextEncoder().encode(text).length;
}

function survivors() {
  if (!state.tape) return [];
  return state.tape.tiles.filter((tile) => !state.torn.has(tile.idx));
}

function updateSliders() {
  const kSlider = $('k-slider');
  const nSlider = $('n-slider');
  let k = Number(kSlider.value);
  let n = Number(nSlider.value);
  if (n < k + 2) { n = Math.min(LIMITS.MAX_N, k + 2); nSlider.value = String(n); }
  $('k-value').textContent = String(k);
  $('n-value').textContent = String(n);
  $('intro-kn').textContent = `${k} of ${n} strips`;
}

function tileCard(tile) {
  const card = document.createElement('div');
  card.className = 'tile';
  card.tabIndex = 0;
  card.dataset.idx = String(tile.idx);
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Strip ${tile.idx + 1} of ${state.tape.n}. Click to tear or restore.`);
  const human = humanGroups(tile.text);
  card.innerHTML = `
    <div class="tile-top"><span>${human.label}</span><span class="kind">${tile.systematic ? 'DATA' : 'PARITY'}</span></div>
    <div class="tile-qr">${tileSvg(tile.text)}</div>
    <div class="tile-human">${human.groups.slice(0, 12).join(' ')}${human.groups.length > 12 ? ' …' : ''}</div>
    <div class="tile-foot">${state.tape.id.slice(0, 4).toUpperCase()} · tap to tear</div>`;
  const toggle = () => {
    if (state.torn.has(tile.idx)) state.torn.delete(tile.idx);
    else state.torn.add(tile.idx);
    renderTape();
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
  return card;
}

function renderTape() {
  const strip = $('tape-strip');
  strip.innerHTML = '';
  for (const tile of state.tape.tiles) {
    const card = tileCard(tile);
    if (state.torn.has(tile.idx)) card.classList.add('torn');
    strip.appendChild(card);
  }
  const alive = survivors().length;
  const lost = state.tape.n - alive;
  const budget = state.tape.n - state.tape.k;
  $('loss-budget').textContent = String(budget);
  const health = $('tape-health');
  health.className = 'health';
  if (alive < state.tape.k) {
    health.textContent = `UNRECOVERABLE · ${state.tape.k - alive} MORE NEEDED`;
    health.classList.add('lost');
  } else if (lost > 0) {
    health.textContent = `${alive}/${state.tape.n} ALIVE · ${lost} LOST`;
    health.classList.add('danger');
  } else {
    health.textContent = 'INTACT';
  }
  $('tape-meta').textContent =
    `Tape ${state.tape.id.toUpperCase()} · ${state.tape.k} source strips · ${state.tape.n} printed · `
    + `${state.tape.length} bytes · SHA-256 ${state.tape.fingerprint} · ${state.tape.chunkSize} bytes/strip`;
  status(alive < state.tape.k
    ? `Too many strips are gone. Restore at least ${state.tape.k - alive} to resurrect this message.`
    : `${alive} strips alive. ${Math.max(0, alive - state.tape.k)} more can be lost before the message is gone.`,
  alive < state.tape.k ? 'warn' : '');
}

async function commit() {
  const message = $('message').value;
  if (!message.trim()) { status('The desk is empty — write a message first.', 'warn'); return; }
  if (bytes(message) > LIMITS.MAX_MESSAGE_BYTES) {
    status(`Message exceeds ${LIMITS.MAX_MESSAGE_BYTES} bytes. Split it into two tapes.`, 'warn');
    return;
  }
  try {
    status('Cutting the paper tape…');
    const tape = await makeTape(message, { k: Number($('k-slider').value), n: Number($('n-slider').value) });
    state.tape = tape;
    state.torn = new Set();
    $('tape-output').hidden = false;
    renderTape();
    status(`Tape ${tape.id.toUpperCase()} committed. Any ${tape.k} of ${tape.n} strips can resurrect it.`, 'ok');
    $('tape-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    status(`Commit failed: ${error.message}`, 'warn');
  }
}

function tearRandom() {
  if (!state.tape) return;
  const alive = survivors().map((tile) => tile.idx);
  const canLose = Math.max(0, alive.length - state.tape.k);
  const shuffled = alive.slice().sort(() => Math.random() - 0.5);
  for (const idx of shuffled.slice(0, canLose)) state.torn.add(idx);
  renderTape();
}

function restore() {
  state.torn = new Set();
  renderTape();
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else throw new Error('clipboard unavailable');
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand('copy'); } catch { /* user can select manually */ }
    temp.remove();
  }
}

function takeToRevive() {
  const alive = survivors();
  if (alive.length < state.tape.k) {
    status('Not enough surviving strips to resurrect. Restore a few first.', 'warn');
    return;
  }
  $('tile-input').value = tapeAsText(state.tape, alive.map((tile) => tile.idx));
  showTab('revive');
  status(`${alive.length} surviving strips carried to the intake desk. Press Resurrect.`, 'ok');
  $('panel-revive').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function revive() {
  const raw = $('tile-input').value;
  if (!raw.trim()) { status('No strips at the intake desk.', 'warn'); return; }
  const box = $('result-card') || document.querySelector('.result-card');
  box.classList.remove('error');
  status('Solving the surviving strips over GF(256) and checking the fingerprint…');
  try {
    const result = await decodeTape([raw]);
    $('result-empty').hidden = true;
    $('result-body').hidden = false;
    $('result-text').textContent = result.text;
    $('verdict').textContent = 'VERIFIED · SHA-256';
    $('result-stats').innerHTML = [
      `<span>STRIPS RECEIVED <b>${result.tilesReceived}/${result.n}</b></span>`,
      `<span>USED <b>${result.tilesUsed.length}</b></span>`,
      `<span>LOST <b>${result.tilesLost}</b></span>`,
      `<span>MINIMUM k <b>${result.k}</b></span>`,
      `<span>DISCARDED <b>${result.discardedLines.length}</b></span>`,
      `<span>FINGERPRINT <b>${result.fingerprint}</b></span>`,
    ].join('');
    $('result-note').textContent = result.tilesLost > 0
      ? `${result.tilesLost} strip(s) never made it. The Cauchy Reed–Solomon code rebuilt every missing byte from the ${result.tilesUsed.length} strips that did.`
      : 'All strips arrived. The checksum and SHA-256 fingerprint still prove the message is byte-for-byte intact.';
    status(`Resurrected and verified from ${result.tilesUsed.length} strips — ${result.tilesLost} lost.`, 'ok');
  } catch (error) {
    $('result-empty').hidden = true;
    $('result-body').hidden = false;
    $('result-text').textContent = error.message;
    $('verdict').textContent = 'REFUSED';
    $('result-stats').innerHTML = '';
    $('result-note').textContent = 'DEAD LETTER refuses to guess. Bring more readable strips, or check that they all come from the same tape.';
    box.classList.add('error');
    status(`Resurrection refused: ${error.message}`, 'warn');
  }
}

async function handleFiles(fileList) {
  let added = 0;
  for (const file of fileList) {
    try {
      if (/\.(deadletter|json|txt)$/i.test(file.name)) {
        const text = await file.text();
        const tiles = /\.(deadletter|json)$/i.test(file.name) ? unpackTapeFile(text) : text.split(/\r?\n/).filter(Boolean);
        const fresh = tiles.filter((tile) => !state.seenTiles.has(tile.trim()));
        fresh.forEach((tile) => state.seenTiles.add(tile.trim()));
        $('tile-input').value = [...$('tile-input').value.split(/\r?\n/).filter(Boolean), ...fresh].join('\n');
        added += fresh.length;
      } else if (file.type.startsWith('image/')) {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = window.jsQR ? window.jsQR(pixels.data, canvas.width, canvas.height) : null;
        if (qr?.data?.startsWith('DL1|')) {
          if (!state.seenTiles.has(qr.data)) {
            state.seenTiles.add(qr.data);
            $('tile-input').value = [...$('tile-input').value.split(/\r?\n/).filter(Boolean), qr.data].join('\n');
            added += 1;
          }
        }
      }
    } catch (error) {
      status(`Could not read ${file.name}: ${error.message}`, 'warn');
    }
  }
  status(added ? `${added} strip(s) added to the intake desk.` : 'No new strips found in those files.', added ? 'ok' : 'warn');
}

function stopCamera() {
  state.scanning = false;
  if (state.cameraStream) state.cameraStream.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
  $('camera-box').hidden = true;
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia || !window.jsQR) {
    status('Camera scanning is unavailable here. Use "Open .deadletter / QR image" or paste tape text instead — both work fully offline.', 'warn');
    return;
  }
  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = $('camera-video');
    video.srcObject = state.cameraStream;
    await video.play();
    $('camera-box').hidden = false;
    state.scanning = true;
    $('camera-status').textContent = 'Point the camera at a tape strip…';
    status('Camera open. Sweep slowly across the printed strips.', 'ok');
    const canvas = $('camera-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const tick = () => {
      if (!state.scanning) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = window.jsQR(pixels.data, canvas.width, canvas.height);
        if (qr?.data?.startsWith('DL1|') && !state.seenTiles.has(qr.data)) {
          state.seenTiles.add(qr.data);
          $('tile-input').value = [...$('tile-input').value.split(/\r?\n/).filter(Boolean), qr.data].join('\n');
          $('camera-status').textContent = `${state.seenTiles.size} strip(s) captured. Keep sweeping, or press Resurrect.`;
          status(`Strip captured (${state.seenTiles.size} so far).`, 'ok');
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } catch (error) {
    status(`Camera refused: ${error.message}. Paste tape text instead — no permission is required for that path.`, 'warn');
  }
}

async function oneClickDemo() {
  status('Running the full transmission: compose → print → tear → resurrect…', 'ok');
  $('message').value = SAMPLE;
  $('char-count').textContent = `${bytes(SAMPLE)} bytes`;
  showTab('compose');
  await commit();
  if (!state.tape) return;
  tearRandom();
  await new Promise((resolve) => setTimeout(resolve, 650));
  takeToRevive();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await revive();
  status('End-to-end demo complete: the message survived a torn tape, offline.', 'ok');
}

function bind() {
  $('tab-compose').addEventListener('click', () => showTab('compose'));
  $('tab-revive').addEventListener('click', () => showTab('revive'));
  $('message').addEventListener('input', () => { $('char-count').textContent = `${bytes($('message').value)} bytes`; });
  $('btn-sample').addEventListener('click', () => {
    $('message').value = SAMPLE;
    $('char-count').textContent = `${bytes(SAMPLE)} bytes`;
  });
  $('k-slider').addEventListener('input', updateSliders);
  $('n-slider').addEventListener('input', updateSliders);
  $('btn-commit').addEventListener('click', commit);
  $('btn-tear').addEventListener('click', tearRandom);
  $('btn-restore').addEventListener('click', restore);
  $('btn-print').addEventListener('click', () => window.print());
  $('btn-copy').addEventListener('click', async () => {
    const text = tapeAsText(state.tape, survivors().map((tile) => tile.idx));
    await copyText(text);
    status(`${survivors().length} surviving strips copied to the clipboard.`, 'ok');
  });
  $('btn-download').addEventListener('click', () => {
    downloadBlob(`deadletter-${state.tape.id}.deadletter`, packTapeFile(state.tape), 'application/json');
    status('Portable .deadletter file downloaded.', 'ok');
  });
  $('btn-to-revive').addEventListener('click', takeToRevive);
  $('btn-revive').addEventListener('click', revive);
  $('btn-clear').addEventListener('click', () => {
    $('tile-input').value = '';
    state.seenTiles.clear();
    status('Intake desk cleared.');
  });
  $('file-input').addEventListener('change', (event) => handleFiles(event.target.files));
  $('btn-camera').addEventListener('click', startCamera);
  $('btn-camera-stop').addEventListener('click', stopCamera);
  $('btn-demo').addEventListener('click', oneClickDemo);
  updateSliders();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline cache is optional */ });
  }
  window.addEventListener('beforeunload', stopCamera);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
else bind();
