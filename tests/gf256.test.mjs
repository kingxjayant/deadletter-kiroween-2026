import test from 'node:test';
import assert from 'node:assert/strict';
import { gfAdd, gfMul, gfInv, gfDiv, cauchyCoefficient, invertMatrix, matrixTimesChunks } from '../web/src/gf256.mjs';

test('GF(256) multiplicative inverse and division are exact', () => {
  for (let a = 1; a < 256; a += 1) {
    assert.equal(gfMul(a, gfInv(a)), 1, `inverse of ${a}`);
    assert.equal(gfDiv(gfMul(a, 57), a), 57, `division by ${a}`);
  }
});

test('GF(256) field laws hold for a sample of triples', () => {
  for (let a = 1; a < 256; a += 17) {
    for (let b = 1; b < 256; b += 19) {
      for (let c = 1; c < 256; c += 23) {
        assert.equal(gfMul(a, b), gfMul(b, a));
        assert.equal(gfMul(a, gfMul(b, c)), gfMul(gfMul(a, b), c));
        assert.equal(gfMul(a, gfAdd(b, c)), gfAdd(gfMul(a, b), gfMul(a, c)));
      }
    }
  }
});

test('Cauchy coefficients are defined for every parity/source pair', () => {
  for (let parity = 1; parity <= 16; parity += 1) {
    for (let k = 2; k <= 24; k += 1) {
      for (let i = 0; i < parity; i += 1) {
        for (let j = 0; j < k; j += 1) {
          const coefficient = cauchyCoefficient(i, j, parity);
          assert.ok(coefficient >= 1 && coefficient <= 255);
          assert.equal(gfMul(coefficient, gfInv(coefficient)), 1);
        }
      }
    }
  }
});

test('matrix inverse satisfies A * A^-1 = I', () => {
  const matrices = [
    [[1, 2], [3, 4]],
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[2, 5, 9], [7, 3, 1], [4, 8, 6]],
    [[1, 1, 1, 1], [1, 2, 4, 8], [1, 3, 9, 27], [1, 4, 16, 64]],
  ];
  for (const matrix of matrices) {
    const inverse = invertMatrix(matrix);
    const product = matrixTimesChunks(matrix, inverse.map((row) => Uint8Array.from(row)));
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix.length; c += 1) {
        assert.equal(product[r][c], r === c ? 1 : 0, `A*A^-1 at (${r},${c})`);
      }
    }
    assert.deepEqual(invertMatrix(inverse).map((row) => [...row]), matrix);
  }
});
