// Rasterize scripts/icon.svg into a multi-size Windows .ico (and a 256 PNG).
// Run: node scripts/make-icon.mjs
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
