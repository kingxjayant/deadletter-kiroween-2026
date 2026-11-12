/**
 * DEAD LETTER — tear-tolerant paper telegram codec.
 *
 * A message is split into k source chunks. n (>= k) tiles are produced: the
 * first k tiles are the source chunks (systematic), the remaining n-k tiles are
 * Cauchy Reed–Solomon parity chunks. Because a systematic Cauchy code is MDS,
 * ANY k of the n tiles are sufficient to reconstruct the message. That lets a
 * printed paper tape survive torn, stained, lost or unreadable strips.
 *
 * No network, no account, no server, no API key. Runs in a browser or Node.
 */

import {
  cauchyCoefficient,
  gfAdd,
  gfMul,
  invertMatrix,
  matrixTimesChunks,
} from './gf256.mjs';

export const LIMITS = Object.freeze({
  MIN_K: 2,
  MAX_K: 24,
  MAX_N: 32,
  MAX_MESSAGE_BYTES: 8000,
  MAX_TILE_BYTES: 900,
});

const MAGIC = 'DL1';
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_LOOKUP = (() => {
  const table = new Int16Array(256).fill(-1);
  for (let i = 0; i < B64.length; i += 1) table[B64.charCodeAt(i)] = i;
  table['='.charCodeAt(0)] = 0;
  return table;
})();

export function bytesToBase64(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (a << 16) | (b << 8) | c;
    out += B64[(triple >> 18) & 63] + B64[(triple >> 12) & 63];
    out += i + 1 < bytes.length ? B64[(triple >> 6) & 63] : '=';
    out += i + 2 < bytes.length ? B64[triple & 63] : '=';
  }
  return out;
}

export function base64ToBytes(text) {
  const clean = text.replace(/[^A-Za-z0-9+/=]/g, '');
  if (clean.length % 4 !== 0) throw new Error('Invalid base64 length');
  const bytes = [];
  for (let i = 0; i < clean.length; i += 4) {
    const a = B64_LOOKUP[clean.charCodeAt(i)];
    const b = B64_LOOKUP[clean.charCodeAt(i + 1)];
    const c = B64_LOOKUP[clean.charCodeAt(i + 2)];
    const d = B64_LOOKUP[clean.charCodeAt(i + 3)];
    if (a < 0 || b < 0 || c < 0 || d < 0) throw new Error('Invalid base64 character');
    const triple = (a << 18) | (b << 12) | (c << 6) | d;
    bytes.push((triple >> 16) & 255);
    if (clean[i + 2] !== '=') bytes.push((triple >> 8) & 255);
    if (clean[i + 3] !== '=') bytes.push(triple & 255);
  }
  return Uint8Array.from(bytes);
}

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function hex8(value) {
  return (value >>> 0).toString(16).padStart(8, '0');
}

async function sha16(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function randomId() {
  const bytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Choose k / n so that every tile fits inside a printable QR code. */
export function planTape(messageBytes, requestedK = 8, requestedN = 14) {
  // Duck-typed on purpose: Uint8Array instances can cross realms (Node worker,
  // jsdom test harness, Kiro CLI headless runner), where instanceof fails.
  if (!ArrayBuffer.isView(messageBytes) || messageBytes.BYTES_PER_ELEMENT !== 1) {
    throw new TypeError('messageBytes must be a byte array');
  }
  if (messageBytes.length === 0) throw new RangeError('Message must not be empty');
  if (messageBytes.length > LIMITS.MAX_MESSAGE_BYTES) {
    throw new RangeError(`Message exceeds ${LIMITS.MAX_MESSAGE_BYTES} bytes; split it into two tapes`);
  }

  let k = clamp(requestedK, LIMITS.MIN_K, LIMITS.MAX_K);
  let chunkSize = Math.max(1, Math.ceil(messageBytes.length / k));
  while (chunkSize > LIMITS.MAX_TILE_BYTES && k < LIMITS.MAX_K) {
    k += 1;
    chunkSize = Math.ceil(messageBytes.length / k);
  }
  if (chunkSize > LIMITS.MAX_TILE_BYTES) {
    throw new RangeError('Tiles would be too large to print; shorten the message');
  }

  const minimumN = Math.min(LIMITS.MAX_N, k + 2);
  const n = clamp(Math.max(requestedN, minimumN), k + 1, LIMITS.MAX_N);
  return { k, n, chunkSize };
}

function buildParity(sourceChunks, nParity, k, chunkSize) {
  const parity = Array.from({ length: nParity }, () => new Uint8Array(chunkSize));
  for (let i = 0; i < nParity; i += 1) {
    for (let j = 0; j < k; j += 1) {
      const coefficient = cauchyCoefficient(i, j, nParity);
      for (let b = 0; b < chunkSize; b += 1) {
        parity[i][b] = gfAdd(parity[i][b], gfMul(coefficient, sourceChunks[j][b]));
      }
    }
  }
  return parity;
}

/** Build a printable tape from a Unicode string. */
export async function makeTape(message, { k = 8, n = 14, id = randomId() } = {}) {
  const bytes = new TextEncoder().encode(message);
  const plan = planTape(bytes, k, n);
  const { chunkSize } = plan;
  const padded = new Uint8Array(plan.k * chunkSize);
  padded.set(bytes);

  const sourceChunks = Array.from({ length: plan.k }, (_, j) =>
    padded.slice(j * chunkSize, (j + 1) * chunkSize),
  );
  const parityChunks = buildParity(sourceChunks, plan.n - plan.k, plan.k, chunkSize);
  const fingerprint = await sha16(bytes);

  const tiles = [];
  for (let idx = 0; idx < plan.n; idx += 1) {
    const chunk = idx < plan.k ? sourceChunks[idx] : parityChunks[idx - plan.k];
    const payload = bytesToBase64(chunk);
    const head = [MAGIC, id, plan.k, plan.n, idx, bytes.length, fingerprint, chunkSize].join('|');
    const body = `${head}|${payload}`;
    const checksum = hex8(crc32(new TextEncoder().encode(body)));
    tiles.push({
      idx,
      text: `${body}|${checksum}`,
      human: `${id.slice(0, 4).toUpperCase()} ${String(idx + 1).padStart(2, '0')}/${plan.n} ${payload.match(/.{1,6}/g).join(' ')}`,
      chunk,
      systematic: idx < plan.k,
    });
  }

  return {
    id,
    k: plan.k,
    n: plan.n,
    chunkSize,
    length: bytes.length,
    fingerprint,
    tiles,
    createdAt: new Date().toISOString(),
  };
}

/** Parse and checksum-verify one tile of tape text. */
export function parseTile(text) {
  const parts = String(text).trim().split('|');
  if (parts.length !== 10 || parts[0] !== MAGIC) {
    throw new Error('Not a DEAD LETTER tile (expected DL1|... format)');
  }
  const [magic, id, kRaw, nRaw, idxRaw, lenRaw, fingerprint, sizeRaw, payload, checksum] = parts;
  const body = parts.slice(0, 9).join('|');
  if (hex8(crc32(new TextEncoder().encode(body))) !== checksum.toLowerCase()) {
    throw new Error(`Tile ${idxRaw} failed its checksum (unreadable / tampered)`);
  }
  const k = Number(kRaw);
  const n = Number(nRaw);
  const idx = Number(idxRaw);
  const length = Number(lenRaw);
  const chunkSize = Number(sizeRaw);
  const chunk = base64ToBytes(payload);
  if (!Number.isInteger(k) || !Number.isInteger(n) || !Number.isInteger(idx) || !Number.isInteger(length) || !Number.isInteger(chunkSize)) {
    throw new Error('Tile header contains invalid numbers');
  }
  if (k < LIMITS.MIN_K || k > LIMITS.MAX_K || n > LIMITS.MAX_N || n <= k || idx < 0 || idx >= n) {
    throw new Error('Tile header is out of range');
  }
  if (chunk.length !== chunkSize) throw new Error('Tile payload has the wrong size');
  return { magic, id, k, n, idx, length, fingerprint, chunkSize, chunk, checksum, text: `${body}|${checksum}` };
}

/** Rebuild a message from ANY k or more surviving tiles, in any order. */
export async function decodeTape(tileTexts, { ignoreErrors = true } = {}) {
  const parsed = [];
  const errors = [];
  for (const text of tileTexts) {
    for (const line of String(text).split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        parsed.push(parseTile(trimmed));
      } catch (error) {
        errors.push(error.message);
        if (!ignoreErrors) throw error;
      }
    }
  }
  if (parsed.length === 0) throw new Error('No readable tiles found');

  // A single tape only. If several tapes were pasted together, pick the largest group.
  const groups = new Map();
  for (const tile of parsed) {
    const key = [tile.id, tile.k, tile.n, tile.length, tile.fingerprint].join(':');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(tile);
  }
  const group = [...groups.values()].sort((a, b) => b.length - a.length)[0];
  const { k, n, length, fingerprint, chunkSize } = group[0];

  const unique = new Map();
  for (const tile of group) unique.set(tile.idx, tile);
  const available = [...unique.values()].sort((a, b) => a.idx - b.idx);
  if (available.length < k) {
    throw new Error(`Only ${available.length} of ${n} tiles survived; ${k - available.length} more tile(s) are needed to resurrect this message`);
  }

  const nParity = n - k;
  const buildRows = (tiles) =>
    tiles.map((tile) => {
      if (tile.idx < k) {
        return Array.from({ length: k }, (_, j) => (j === tile.idx ? 1 : 0));
      }
      return Array.from({ length: k }, (_, j) => cauchyCoefficient(tile.idx - k, j, nParity));
    });

  let sourceChunks = null;
  let used = null;
  let lastError = null;
  // Cauchy codes are MDS, so the first k rows are always invertible. The retry
  // loop is a defensive fallback for corrupted-but-checksummed edge cases.
  for (let offset = 0; offset + k <= available.length && !sourceChunks; offset += 1) {
    const candidate = available.slice(offset, offset + k);
    try {
      const inverse = invertMatrix(buildRows(candidate));
      sourceChunks = matrixTimesChunks(inverse, candidate.map((tile) => tile.chunk));
      used = candidate;
    } catch (error) {
      lastError = error;
    }
  }
  if (!sourceChunks) throw new Error(`Could not solve the tape: ${lastError?.message ?? 'singular system'}`);

  const rebuilt = new Uint8Array(k * chunkSize);
  sourceChunks.forEach((chunk, j) => rebuilt.set(chunk, j * chunkSize));
  const bytes = rebuilt.slice(0, length);
  const actual = await sha16(bytes);
  if (actual !== fingerprint) {
    throw new Error('SHA-256 verification failed — the resurrected message does not match the original');
  }

  return {
    text: new TextDecoder().decode(bytes),
    bytes,
    verified: true,
    fingerprint,
    tilesUsed: used.map((tile) => tile.idx),
    tilesReceived: available.length,
    tilesLost: n - available.length,
    k,
    n,
    discardedLines: errors,
  };
}

/** Serialize / deserialize the portable .deadletter file. */
export function packTapeFile(tape) {
  return JSON.stringify({
    format: 'deadletter/v1',
    id: tape.id,
    k: tape.k,
    n: tape.n,
    length: tape.length,
    fingerprint: tape.fingerprint,
    createdAt: tape.createdAt,
    tiles: tape.tiles.map((tile) => tile.text),
  }, null, 2);
}

export function unpackTapeFile(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json;
  if (data?.format !== 'deadletter/v1' || !Array.isArray(data.tiles)) {
    throw new Error('Not a .deadletter file');
  }
  return data.tiles;
}
