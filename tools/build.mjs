/** Zero-config static build for GitHub Pages. No runtime network dependency. */
import { build } from 'esbuild';
import { cpSync, mkdirSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, 'public');
mkdirSync(join(OUT, 'vendor'), { recursive: true });
mkdirSync(join(OUT, 'assets'), { recursive: true });

await build({
  entryPoints: [join(ROOT, 'web', 'src', 'app.mjs')],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: join(OUT, 'app.js'),
  legalComments: 'inline',
  minify: false,
  sourcemap: false,
  logLevel: 'warning',
});

for (const file of ['index.html', 'styles.css', 'sw.js']) {
  cpSync(join(ROOT, 'web', file), join(OUT, file));
}
for (const file of readdirSync(join(ROOT, 'web', 'vendor'))) {
  cpSync(join(ROOT, 'web', 'vendor', file), join(OUT, 'vendor', file));
}
const assets = join(ROOT, 'web', 'assets');
if (existsSync(assets)) {
  for (const file of readdirSync(assets)) cpSync(join(assets, file), join(OUT, 'assets', file));
}
writeFileSync(join(OUT, '.nojekyll'), '');
console.log(`Built static site into ${OUT}`);
