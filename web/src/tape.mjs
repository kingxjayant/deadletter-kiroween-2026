/**
 * DEAD LETTER — turns a codec tile into a printable paper-tape strip.
 *
 * The tape is deliberately dual-channel:
 *   - a QR code (fast, machine readable)
 *   - the same tile text in telegram-style letter groups (slow, human readable)
 * If a printed QR is torn or stained beyond recognition, a human can still
 * type the letters. If the letters are lost, the QR still works.
 */

import qrcode from 'qrcode-generator';

export function tileSvg(text, { cell = 3, margin = 2 } = {}) {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte'); // tile text is ASCII by construction
  qr.make();
  const count = qr.getModuleCount();
  const size = (count + margin * 2) * cell;
  let rects = '';
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!qr.isDark(row, col)) continue;
      const x = (col + margin) * cell;
      const y = (row + margin) * cell;
      rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="QR code for tile"><rect width="${size}" height="${size}" fill="#efe4cd"/><g fill="#15120e">${rects}</g></svg>`;
}

export function humanGroups(text) {
  const parts = text.split('|');
  const payload = parts[8] ?? '';
  const idx = Number(parts[4] ?? 0) + 1;
  const total = Number(parts[3] ?? 0);
  const groups = payload.match(/.{1,6}/g) ?? [];
  return {
    label: `STRIP ${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    groups,
  };
}

export function tapeAsText(tape, indices = null) {
  const chosen = indices ? tape.tiles.filter((tile) => indices.includes(tile.idx)) : tape.tiles;
  return chosen.map((tile) => tile.text).join('\n');
}

export function downloadBlob(filename, contents, type = 'text/plain') {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
