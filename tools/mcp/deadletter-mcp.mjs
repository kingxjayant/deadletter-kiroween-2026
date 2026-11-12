/**
 * Local MCP server for DEAD LETTER — zero external dependencies.
 *
 * Speaks newline-delimited JSON-RPC 2.0 over stdio (MCP stdio transport).
 * Registered in .kiro/settings/mcp.json and inside the local Kiro power.
 * It gives Kiro real, project-specific tools instead of generic ones:
 *   encode_message, decode_tiles, gf_explain, audit_submission,
 *   list_correctness_properties.
 *
 * Why it matters (for the Kiro write-up): the agent can construct a tape,
 * destroy strips, and verify the MDS property directly from chat while
 * implementing a spec, and it can run the Official Rules gate at any time.
 */

import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { makeTape, decodeTape } from '../../web/src/codec.mjs';
import { cauchyCoefficient, gfInv, gfMul } from '../../web/src/gf256.mjs';
import { auditSubmission } from '../audit-submission.mjs';

const PROPERTIES_PATH = new URL('../../.kiro/specs/deadletter-codec/requirements.md', import.meta.url);

const TOOLS = [
  {
    name: 'encode_message',
    description: 'Turn a Unicode message into a tear-tolerant DEAD LETTER paper tape. Returns k, n, fingerprint and every tile string.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to commit to paper' },
        k: { type: 'integer', minimum: 2, maximum: 24, description: 'Minimum surviving strips needed (default 8)' },
        n: { type: 'integer', minimum: 3, maximum: 32, description: 'Total printed strips (default 14)' },
      },
      required: ['message'],
    },
  },
  {
    name: 'decode_tiles',
    description: 'Resurrect a message from any k or more surviving tile strings. Verifies CRC-32 and SHA-256.',
    inputSchema: {
      type: 'object',
      properties: { tiles: { type: 'array', items: { type: 'string' }, description: 'DL1|... tile strings' } },
      required: ['tiles'],
    },
  },
  {
    name: 'gf_explain',
    description: 'Show the GF(2^8) Cauchy coefficient for a parity row / source column and explain why it is never zero.',
    inputSchema: {
      type: 'object',
      properties: {
        row: { type: 'integer', minimum: 0 },
        col: { type: 'integer', minimum: 0 },
        parity: { type: 'integer', minimum: 1, maximum: 24 },
      },
      required: ['row', 'col', 'parity'],
    },
  },
  {
    name: 'audit_submission',
    description: 'Run the Kiroween 2026 Official Rules compliance gate (.kiro committed, license, docs, build).',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_correctness_properties',
    description: 'Return the correctness-property table from the codec spec so Kiro can map properties to tests.',
    inputSchema: { type: 'object', properties: {} },
  },
];

const text = (value) => [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];

function reply(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`);
}

function fail(id, code, message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } })}\n`);
}

async function callTool(name, args = {}) {
  switch (name) {
    case 'encode_message': {
      const tape = await makeTape(args.message, { k: args.k ?? 8, n: args.n ?? 14 });
      return text({
        id: tape.id, k: tape.k, n: tape.n, chunkSize: tape.chunkSize,
        length: tape.length, fingerprint: tape.fingerprint,
        tiles: tape.tiles.map((tile) => tile.text),
        hint: `Any ${tape.k} of these ${tape.n} strips will decode the message. Try decode_tiles with a subset.`,
      });
    }
    case 'decode_tiles': {
      const result = await decodeTape(args.tiles ?? []);
      return text({
        text: result.text, verified: result.verified, fingerprint: result.fingerprint,
        tilesUsed: result.tilesUsed, tilesReceived: result.tilesReceived,
        tilesLost: result.tilesLost, discardedLines: result.discardedLines,
      });
    }
    case 'gf_explain': {
      const { row, col, parity } = args;
      const x = row;
      const y = parity + col;
      const coefficient = cauchyCoefficient(row, col, parity);
      return text({
        x, y, xor: x ^ y, coefficient, inverseCheck: gfMul(coefficient, gfInv(coefficient)),
        explanation: 'x ∈ [0,parity) and y ∈ [parity,parity+k) are disjoint sets, so x XOR y ≠ 0 and the inverse exists. All square submatrices of a Cauchy matrix are invertible, which is why any k strips decode.',
      });
    }
    case 'audit_submission':
      return text(auditSubmission());
    case 'list_correctness_properties': {
      const spec = readFileSync(PROPERTIES_PATH, 'utf8');
      return text(spec.slice(spec.indexOf('## Correctness properties')));
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', async (line) => {
  if (!line.trim()) return;
  let request;
  try { request = JSON.parse(line); } catch { return; }
  const { id, method, params } = request;
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return;
  try {
    if (method === 'initialize') {
      reply(id, {
        protocolVersion: params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'deadletter-codec', version: '1.0.0' },
      });
    } else if (method === 'ping') {
      reply(id, {});
    } else if (method === 'tools/list') {
      reply(id, { tools: TOOLS });
    } else if (method === 'tools/call') {
      const content = await callTool(params?.name, params?.arguments);
      reply(id, { content, isError: false });
    } else if (id !== undefined) {
      fail(id, -32601, `Method not found: ${method}`);
    }
  } catch (error) {
    if (id !== undefined) fail(id, -32000, error.message);
  }
});
