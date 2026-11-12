# Requirements — DEAD LETTER tear-tolerant tape codec

## Introduction
A browser-based codec turns a Unicode message into n printable paper strips and
rebuilds it from any k surviving strips. It exists so that people without a
network can move data on paper, even when part of the paper is destroyed.

## User stories
**As a field worker with no data connection**, I want to print my message as a
paper tape, so that a colleague can recover it later without any server.

**As a receiver in a different place**, I want to scan or type whichever strips
survived, so that a torn or stained tape still delivers the exact message.

**As a judge**, I want a one-click end-to-end demonstration, so that I can verify
the claim in under a minute without installing anything.

---

## Requirements (EARS)

### R1 — Encoding
- **R1.1** WHEN a non-empty UTF-8 message and parameters (k, n) are supplied,
  THE System SHALL produce exactly n distinct tile strings from one tape id.
- **R1.2** THE System SHALL pad the message to `k × chunkSize` bytes with zero
  bytes and SHALL store the true byte length in every tile header.
- **R1.3** THE System SHALL generate the first k tiles as the source chunks
  (systematic) and the remaining n−k tiles as Cauchy Reed–Solomon parity chunks.
- **R1.4** IF `2 ≤ k ≤ 24`, `k < n ≤ 32`, `length ≤ 8000` bytes, THE System
  SHALL keep each tile payload ≤ 900 bytes, raising k automatically if needed.
- **R1.5** THE System SHALL attach a CRC-32 checksum and an 8-byte SHA-256
  fingerprint to every tile.
- **R1.6** THE System SHALL render each tile as a QR code AND as grouped
  human-readable telegram characters.

### R2 — Loss tolerance (the resurrection guarantee)
- **R2.1** FOR ANY message and ANY valid (k, n), WHEN any subset of at least k
  distinct, valid tiles is supplied in any order, THE System SHALL return the
  exact original message.
- **R2.2** WHEN fewer than k distinct valid tiles are supplied, THE System SHALL
  refuse and SHALL state how many more tiles are needed.
- **R2.3** WHEN a tile fails its CRC-32 checksum, THE System SHALL discard it and
  SHALL report the number of discarded strips.
- **R2.4** WHEN tiles from more than one tape are pasted together, THE System
  SHALL decode the largest consistent group and SHALL ignore the others.
- **R2.5** THE System SHALL recompute SHA-256 after decoding; IF the fingerprint
  does not match, THE System SHALL throw instead of returning a message.

### R3 — Portability and offline behaviour
- **R3.1** THE System SHALL perform all computation locally with no fetch(),
  no credentials and no third-party service.
- **R3.2** THE System SHALL export and import a portable `.deadletter` JSON file.
- **R3.3** THE System SHALL accept tile text pasted by a human, read from a QR
  image, read from a camera stream, or loaded from a file.
- **R3.4** IF camera or clipboard permission is refused, THE System SHALL keep
  the paste/file path fully functional and SHALL explain the fallback.

### R4 — Limits and honesty
- **R4.1** IF the message is empty or exceeds 8000 bytes, THE System SHALL
  reject it with an actionable message instead of silently truncating.
- **R4.2** THE System SHALL describe itself as integrity-verifying, NOT as
  encrypted, anonymous, or AI-powered.

---

## Correctness properties (for Kiro spec "Correctness" / `tests/pbt.test.mjs`)

| ID | Property | Requirement |
| --- | --- | --- |
| **P1** | For every Unicode message drawn from a mixed ASCII/Devanagari/emoji alphabet and every valid (k,n), decoding any randomly chosen k tiles equals the original string. | R2.1 |
| **P2** | For every (k,n), destroying exactly n−k strips still yields the original string and reports `tilesLost = n−k`. | R2.1 |
| **P3** | Every generated tile parses; flipping one character of a tile makes its CRC check fail. | R1.1, R2.3 |
| **P4** | GF(2^8) satisfies inverse, commutativity, associativity and distributivity for all sampled non-zero elements. | R1.3 |
| **P5** | Cauchy coefficients are in 1..255 for every valid parity/source index pair. | R1.3 |
| **P6** | base64 round-trips and CRC32 is stable and detects a single flipped bit. | R1.5 |

> Note: property-based testing is evidence, not proof (Kiro docs,
> "Correctness with Property-based tests"). The MDS theorem supplies the
> mathematical guarantee; PBT guards the implementation.
