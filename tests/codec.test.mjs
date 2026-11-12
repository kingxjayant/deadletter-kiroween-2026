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
