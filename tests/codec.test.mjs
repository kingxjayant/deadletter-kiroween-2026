import test from 'node:test';
import assert from 'node:assert/strict';
import {
  makeTape, decodeTape, parseTile, planTape, packTapeFile, unpackTapeFile,
  bytesToBase64, base64ToBytes, crc32, LIMITS,
} from '../web/src/codec.mjs';

const MESSAGE = 'नमस्ते जयंत! The network is dead. Long live the tape. 🕯️ 12345';

test('base64 is a round-trip for arbitrary byte arrays', () => {
  for (let length = 1; length < 300; length += 1) {
    const bytes = Uint8Array.from({ length }, (_, i) => (i * 37 + 11) & 255);
    assert.deepEqual([...base64ToBytes(bytesToBase64(bytes))], [...bytes]);
  }
});

test('CRC32 matches a known vector', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  assert.notEqual(crc32(new TextEncoder().encode('123456788')), 0xcbf43926);
});

test('planTape keeps every tile small enough to print', () => {
  const bytes = new TextEncoder().encode('x'.repeat(6000));
  const plan = planTape(bytes, 2, 4);
  assert.ok(plan.k > 2, 'k should grow to keep tiles printable');
  assert.ok(plan.chunkSize <= LIMITS.MAX_TILE_BYTES);
  assert.ok(plan.n > plan.k);
});

test('a tape survives losing every tile except k of them', async () => {
  const tape = await makeTape(MESSAGE, { k: 8, n: 14, id: 'feedface' });
  assert.equal(tape.tiles.length, 14);
  for (const tile of tape.tiles) assert.doesNotThrow(() => parseTile(tile.text));

  for (let keep = 8; keep <= 14; keep += 1) {
    const texts = tape.tiles.slice(0, keep).map((tile) => tile.text);
    const result = await decodeTape(texts);
    assert.equal(result.text, MESSAGE);
    assert.equal(result.verified, true);
    assert.equal(result.tilesLost, 14 - keep);
  }
});

test('any k tiles in any order resurrect the message', async () => {
  const tape = await makeTape(MESSAGE, { k: 8, n: 14, id: 'c0ffee01' });
  const indices = [...Array(14).keys()];
  for (let run = 0; run < 40; run += 1) {
    const shuffled = indices.slice().sort(() => Math.random() - 0.5).slice(0, 8);
    const result = await decodeTape(shuffled.map((i) => tape.tiles[i].text));
    assert.equal(result.text, MESSAGE, `subset ${shuffled.join(',')}`);
  }
});

test('too few tiles fails with an actionable message', async () => {
  const tape = await makeTape(MESSAGE, { k: 8, n: 14, id: 'deadbeef' });
  const texts = tape.tiles.slice(0, 7).map((tile) => tile.text);
  await assert.rejects(() => decodeTape(texts), /1 more tile/);
});

test('a corrupted tile is rejected by its checksum, not silently decoded', async () => {
  const tape = await makeTape(MESSAGE, { k: 6, n: 12, id: 'badc0de1' });
  const broken = tape.tiles[0].text.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a'));
  assert.throws(() => parseTile(broken), /checksum/);
  const texts = [broken, ...tape.tiles.slice(1, 8).map((tile) => tile.text)];
  const result = await decodeTape(texts);
  assert.equal(result.text, MESSAGE);
  assert.ok(result.discardedLines.some((line) => /checksum/.test(line)));
});

test('SHA-256 fingerprint detects a semantically altered tape', async () => {
  const tape = await makeTape(MESSAGE, { k: 8, n: 14, id: '5eed1234' });
  const texts = tape.tiles.slice(0, 8).map((tile) => tile.text);
  const tampered = texts.map((text) => text.replace(tape.fingerprint, '0'.repeat(16)));
  await assert.rejects(() => decodeTape(tampered));
});

test('.deadletter file is a portable tape', async () => {
  const tape = await makeTape(MESSAGE, { k: 5, n: 9, id: 'f11e0001' });
  const file = packTapeFile(tape);
  const parsed = unpackTapeFile(file);
  assert.equal(parsed.length, 9);
  assert.equal((await decodeTape(parsed.slice(0, 5))).text, MESSAGE);
  assert.throws(() => unpackTapeFile('{"format":"other"}'), /Not a .deadletter/);
});

test('empty and oversized messages are rejected clearly', async () => {
  await assert.rejects(() => makeTape(''), /must not be empty/);
  await assert.rejects(() => makeTape('x'.repeat(LIMITS.MAX_MESSAGE_BYTES + 1)), /exceeds/);
});

// ---------------------------------------------------------------------------
// Authored by Kiro during a real Kiro IDE session on a college lab PC
// (2026-11-23 12:16, Kiro Free plan, 0.76 credits, 1m 16s, 1 file changed).
// That machine had no git CLI and its working copy was wiped, so this is a
// reconstruction from the session's diff screenshot
// (docs/evidence/kiro-02-diff.png), which is the actual provenance.
// ---------------------------------------------------------------------------
test('Devanagari/Nagpuri text survives losing all 6 parity tiles (8 of 14 remain)', async () => {
  // Nagpuri (Chhattisgarhi) written in Devanagari script. The message uses
  // multi-byte UTF-8 sequences (each Devanagari akshara is 3 bytes) plus
  // conjunct consonants, matras, and ASCII punctuation. The tape uses
  // k=8, n=14, so exactly 6 parity tiles exist — losing all 6 leaves the bare k=8.
  const message =
    'नेटवर्क मरे गे। संदेसा काकर ले जाबे? — जयंत कुमार, नागपुर 🕯️';

  const tape = await makeTape(message, { k: 8, n: 14, id: 'nagpur0' });
  assert.equal(tape.tiles.length, 14, 'tape must have exactly 14 tiles');

  // Keep only the 8 systematic tiles (indices 0-7); discard all 6 parity tiles.
  const survivingTexts = tape.tiles.slice(0, 8).map((tile) => tile.text);
  const result = await decodeTape(survivingTexts);

  assert.equal(result.text, message, 'decoded text must match original');
  assert.equal(result.verified, true, 'SHA-256 fingerprint must pass');
  assert.equal(result.tilesLost, 6, 'exactly 6 parity tiles were lost');
  assert.equal(result.tilesUsed.length, 8, 'exactly k=8 tiles used');

  // Confirm the round-trip is byte-exact for multi-byte Devanagari text.
  assert.deepEqual(
    [...new TextEncoder().encode(result.text)],
    [...new TextEncoder().encode(message)],
    'UTF-8 encoding of decoded text must be identical to the original',
  );
});

// Added by Jayant (not by Kiro) after the session. Keeping only the 8
// *systematic* tiles is the easy path: decodeTape can rebuild those chunks
// without inverting anything, so the Cauchy system is never exercised. This
// case drops 4 source tiles as well and forces 4 parity tiles into the solve.
test('the same Nagpuri tape also survives a mixed 4-source + 4-parity selection', async () => {
  const message =
    'नेटवर्क मरे गे। संदेसा काकर ले जाबे? — जयंत कुमार, नागपुर 🕯️';
  const tape = await makeTape(message, { k: 8, n: 14, id: 'nagpur0' });

  const mixed = [
    ...tape.tiles.filter((tile) => tile.idx < 4),
    ...tape.tiles.filter((tile) => tile.idx >= 10),
  ].map((tile) => tile.text);
  assert.equal(mixed.length, 8);

  const result = await decodeTape(mixed);
  assert.equal(result.text, message, 'mixed source+parity recovery');
  assert.equal(result.verified, true);
  assert.equal(result.tilesLost, 6);
  assert.deepEqual([...result.bytes], [...new TextEncoder().encode(message)]);
  assert.ok(result.tilesUsed.some((idx) => idx >= 8), 'a parity tile was required to solve');
});
