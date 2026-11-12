/**
 * Property-based tests (PBT) for DEAD LETTER.
 *
 * These are the correctness properties derived from the EARS requirements in
 * .kiro/specs/deadletter-codec/requirements.md. Kiro's spec "Correctness" view
 * generates the same kind of checks from acceptance criteria; this file is the
 * committed, CI-runnable evidence that the properties actually hold.
 *
 * Run: npm run test:pbt
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { gfAdd, gfMul, gfInv, cauchyCoefficient } from '../web/src/gf256.mjs';
import { makeTape, decodeTape, parseTile, bytesToBase64, base64ToBytes, crc32 } from '../web/src/codec.mjs';

const ALPHABET = 'abcXYZ 0123456789\n.,!?—@#/:-_()' + 'अआइईउऊकखगघङचछजझञटठडढणतथदधन' + '☠️🕯️👻';
const characters = [...new Set([...ALPHABET])];
const messageArb = fc
  .array(fc.constantFrom(...characters), { minLength: 1, maxLength: 180 })
  .map((chars) => chars.join(''));
const planArb = fc.record({
  k: fc.integer({ min: 2, max: 12 }),
  extra: fc.integer({ min: 2, max: 8 }),
  seed: fc.integer({ min: 0, max: 0xffffffff }),
});

test('P1 — for ANY message and ANY (k,n), ANY k tiles resurrect it exactly', async () => {
  await fc.assert(
    fc.asyncProperty(messageArb, planArb, async (message, { k, extra, seed }) => {
      const n = Math.min(32, k + extra);
      const tape = await makeTape(message, { k, n, id: seed.toString(16).padStart(8, '0') });
      const indices = [...Array(tape.n).keys()];
      // deterministic pseudo-random subset of exactly k tiles
      let state = seed || 1;
      const next = () => ((state = (state * 1664525 + 1013904223) >>> 0) >>> 8) / 0x1000000;
      const chosen = indices.slice().sort(() => next() - 0.5).slice(0, tape.k);
      const result = await decodeTape(chosen.map((i) => tape.tiles[i].text));
      assert.equal(result.text, message);
      assert.equal(result.verified, true);
      assert.equal(result.tilesUsed.length, tape.k);
    }),
    { numRuns: 120, verbose: false },
  );
});

test('P2 — for ANY (k,n), destroying n-k strips is harmless', async () => {
  await fc.assert(
    fc.asyncProperty(messageArb, planArb, async (message, { k, extra, seed }) => {
      const n = Math.min(32, k + extra);
      const tape = await makeTape(message, { k, n, id: (seed ^ 0x5a5a).toString(16).padStart(8, '0') });
      const survivors = tape.tiles.slice(0, tape.k).map((tile) => tile.text);
      const result = await decodeTape(survivors);
      assert.equal(result.text, message);
      assert.equal(result.tilesLost, tape.n - tape.k);
    }),
    { numRuns: 100 },
  );
});

test('P3 — every generated tile parses, and its checksum covers the whole tile', async () => {
  await fc.assert(
    fc.asyncProperty(messageArb, planArb, async (message, { k, extra, seed }) => {
      const n = Math.min(32, k + extra);
      const tape = await makeTape(message, { k, n, id: (seed ^ 0xa5a5).toString(16).padStart(8, '0') });
      assert.equal(tape.tiles.length, n);
      for (const tile of tape.tiles) {
        const parsed = parseTile(tile.text);
        assert.equal(parsed.chunk.length, tape.chunkSize);
        assert.equal(parsed.idx, tile.idx);
        const broken = `${tile.text.slice(0, -1)}${tile.text.endsWith('a') ? 'b' : 'a'}`;
        assert.throws(() => parseTile(broken), /checksum/);
      }
    }),
    { numRuns: 80 },
  );
});

test('P4 — GF(256) is a field: inverse, commutativity, associativity, distributivity', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 255 }),
      fc.integer({ min: 1, max: 255 }),
      fc.integer({ min: 1, max: 255 }),
      (a, b, c) => {
        assert.equal(gfMul(a, gfInv(a)), 1);
        assert.equal(gfMul(a, b), gfMul(b, a));
        assert.equal(gfMul(a, gfMul(b, c)), gfMul(gfMul(a, b), c));
        assert.equal(gfMul(a, gfAdd(b, c)), gfAdd(gfMul(a, b), gfMul(a, c)));
      },
    ),
    { numRuns: 500 },
  );
});

test('P5 — Cauchy matrix has no zero coefficients in range', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 16 }),
      fc.integer({ min: 0, max: 15 }),
      fc.integer({ min: 2, max: 24 }),
      fc.integer({ min: 0, max: 23 }),
      (parity, i, k, j) => {
        fc.pre(i < parity && j < k);
        const coefficient = cauchyCoefficient(i, j, parity);
        assert.ok(coefficient >= 1 && coefficient <= 255);
      },
    ),
    { numRuns: 300 },
  );
});

test('P6 — base64 and CRC32 are total, stable functions on byte arrays', () => {
  fc.assert(
    fc.property(fc.uint8Array({ minLength: 0, maxLength: 400 }), (bytes) => {
      assert.deepEqual([...base64ToBytes(bytesToBase64(bytes))], [...bytes]);
      assert.equal(crc32(bytes), crc32(Uint8Array.from(bytes)));
      if (bytes.length > 0) {
        const flipped = Uint8Array.from(bytes);
        flipped[0] ^= 1;
        assert.notEqual(crc32(flipped), crc32(bytes));
      }
    }),
    { numRuns: 250 },
  );
});
