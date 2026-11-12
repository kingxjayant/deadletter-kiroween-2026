/** Refresh the vendored offline libraries and their license texts.
 *  Run after `npm install` if a vendored dependency version changes. */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const dest = `${ROOT}web/vendor/`;
mkdirSync(dest, { recursive: true });

const files = [
  ['node_modules/jsqr/dist/jsQR.js', 'jsQR.js'],
  ['node_modules/jsqr/LICENSE', 'jsQR-LICENSE.txt'],
];
for (const [from, to] of files) {
  const source = `${ROOT}${from}`;
  if (!existsSync(source)) { console.warn(`Missing ${source} — run npm ci first`); continue; }
  copyFileSync(source, `${dest}${to}`);
  console.log(`vendored ${from} -> web/vendor/${to}`);
}
console.log('qrcode-generator is bundled at build time from node_modules (MIT header kept inline).');
