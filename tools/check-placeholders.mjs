/** List every unresolved [[...]] placeholder in docs/ with file and line. */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = fileURLToPath(new URL('../docs/', import.meta.url));
const files = readdirSync(DOCS).filter((name) => name.endsWith('.md'));
let total = 0;
for (const file of files) {
  const lines = readFileSync(join(DOCS, file), 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(/\[\[([^\]]+)\]\]/g)];
    for (const match of matches) {
      total += 1;
      const label = match[1].replace(/\s+/g, ' ').slice(0, 90);
      console.log(`docs/${file}:${index + 1}  [[${label}${match[1].length > 90 ? '…' : ''}]]`);
    }
  });
}
console.log(`\n${total} open placeholder(s). See docs/OPEN_ITEMS.md for who fills each one.`);
