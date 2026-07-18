// Rasterize scripts/icon.svg into a multi-size Windows .ico (and a 256 PNG).
//
// One-off tool: the icons it produces are committed under build/, so this only needs running
// when the icon art changes. Its two rasterizer packages are therefore NOT in devDependencies
// (they are native and heavy, and every CI `npm ci` would pay for them). Install them on
// demand first:
//
//   npm i --no-save @resvg/resvg-js png-to-ico && node scripts/make-icon.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const root = path.dirname(fileURLToPath(import.meta.url));
const svg = fs.readFileSync(path.join(root, 'icon.svg'));
const outDir = path.join(root, '..', 'build');
fs.mkdirSync(outDir, { recursive: true });

// Windows .ico sizes; 256 is what electron-builder wants at minimum.
const sizes = [256, 128, 64, 48, 32, 16];

const pngs = sizes.map((size) => {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  return r.render().asPng();
});

// Keep a standalone 256 PNG too (handy for docs / Linux / tray reuse).
fs.writeFileSync(path.join(outDir, 'icon.png'), pngs[0]);

const ico = await pngToIco(pngs);
fs.writeFileSync(path.join(outDir, 'icon.ico'), ico);

console.log('wrote build/icon.ico (' + sizes.join(',') + ') and build/icon.png');
