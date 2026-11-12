/**
 * DEAD LETTER — GF(2^8) arithmetic for the Cauchy Reed–Solomon tape codec.
 *
 * Field: AES polynomial x^8 + x^4 + x^3 + x + 1 (0x11D), generator 2.
 * Every function here is pure and dependency-free so it can be exercised by
 * property-based tests and by the Kiro CLI headless agent in CI.
 */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();

export const PRIMITIVE_POLYNOMIAL = 0x11d;

export function gfAdd(a, b) {
  return a ^ b;
}

export function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

export function gfInv(a) {
  if (a === 0) throw new RangeError('GF(256): zero has no multiplicative inverse');
  return EXP[255 - LOG[a]];
}

export function gfDiv(a, b) {
  if (b === 0) throw new RangeError('GF(256): division by zero');
  if (a === 0) return 0;
  return EXP[(LOG[a] - LOG[b] + 255) % 255];
}

/**
 * Cauchy coefficient C[i][j] = 1 / (x_i XOR y_j).
 * x_i = i (0..nParity-1), y_j = nParity + j (0..k-1).
 * The x and y sets are disjoint, so no denominator is zero.
 * Any square submatrix of a Cauchy matrix is invertible (MDS property), which
 * is the mathematical reason ANY k surviving tiles can rebuild the message.
 */
export function cauchyCoefficient(row, col, nParity) {
  return gfInv((row ^ (nParity + col)) & 0xff);
}

/** Gauss–Jordan inversion of a square byte matrix over GF(256). */
export function invertMatrix(matrix) {
  const size = matrix.length;
  if (!matrix.every((row) => row.length === size)) {
    throw new RangeError('GF(256): matrix must be square');
  }
  const aug = matrix.map((row, i) => {
    const inverseRow = new Uint8Array(size);
    inverseRow[i] = 1;
    return [...row, ...inverseRow];
  });

  for (let col = 0; col < size; col += 1) {
    let pivot = col;
    while (pivot < size && aug[pivot][col] === 0) pivot += 1;
    if (pivot === size) throw new RangeError('GF(256): singular matrix');

    [aug[col], aug[pivot]] = [aug[pivot], aug[col]];
    const scale = gfInv(aug[col][col]);
    for (let j = 0; j < size * 2; j += 1) aug[col][j] = gfMul(aug[col][j], scale);

    for (let r = 0; r < size; r += 1) {
      if (r === col || aug[r][col] === 0) continue;
      const factor = aug[r][col];
      for (let j = 0; j < size * 2; j += 1) {
        aug[r][j] = gfAdd(aug[r][j], gfMul(factor, aug[col][j]));
      }
    }
  }

  return aug.map((row) => row.slice(size));
}

/** Multiply a k x k matrix by a list of k equal-length chunk vectors. */
export function matrixTimesChunks(matrix, chunks) {
  const size = matrix.length;
  const width = chunks[0].length;
  const out = Array.from({ length: size }, () => new Uint8Array(width));
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const coefficient = matrix[r][c];
      if (coefficient === 0) continue;
      for (let b = 0; b < width; b += 1) {
        out[r][b] = gfAdd(out[r][b], gfMul(coefficient, chunks[c][b]));
      }
    }
  }
  return out;
}
