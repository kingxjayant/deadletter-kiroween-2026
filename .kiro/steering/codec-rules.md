---
inclusion: fileMatch
fileMatchPattern: "web/src/(codec|gf256)\.mjs$"
---

# Codec invariants — do not break these

1. **MDS property.** `G = [ I_k ; C_(n−k)×k ]` where
   `C[i][j] = 1 / (x_i XOR y_j)` in GF(2^8), `x_i = i`, `y_j = (n−k) + j`.
   Every square submatrix of a Cauchy matrix is invertible, therefore ANY k
   distinct tiles decode. Never replace this with a random/fountain subset code
   without proving the same guarantee.
2. **Field polynomial** is 0x11D with generator 2. `gfMul(0, x) = 0`,
   `gfInv(0)` throws, `gfMul(a, gfInv(a)) = 1`.
3. **Tile text** is exactly 10 pipe-separated fields:
   `DL1|id|k|n|idx|length|sha16|chunkSize|base64|crc32hex`.
   The CRC covers fields 1–9. A tile that fails CRC is discarded, never repaired.
4. **Limits:** `2 ≤ k ≤ 24`, `k+1 ≤ n ≤ 32`, message ≤ 8000 bytes, tile ≤ 900
   bytes so a printed QR stays scannable. `planTape` raises k automatically to
   keep tiles small; never silently truncate the message.
5. **Verification:** after solving, recompute SHA-256 and compare to `sha16`.
   A mismatch throws. The UI must show "REFUSED", never a plausible wrong message.
6. **Cross-realm safety:** no `instanceof Uint8Array` on inputs (see tech.md).
7. Any change to `codec.mjs`/`gf256.mjs` must keep `tests/pbt.test.mjs` green.
   The hook `pbt-on-codec-change.json` runs it on every save.
