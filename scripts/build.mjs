// Minimal esbuild pipeline for the Electron app.
// - main / preload  -> CommonJS bundles for the Node (main) process
// - renderer         -> IIFE bundle for the browser (renderer) process
// Run: `node scripts/build.mjs` (one-shot) or `--watch` (rebuild on change).
import { build, context } from 'esbuild';
import { cp, mkdir, access } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const outdir = 'dist';

const common = {
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
};

/** @type {import('esbuild').BuildOptions[]} */
const targets = [
  {
    ...common,
    entryPoints: ['src/main/main.ts'],
    outfile: `${outdir}/main.js`,
    platform: 'node',
    format: 'cjs',
    // electron-updater is kept external (loaded from node_modules at runtime):
    // it uses dynamic requires / reads its own files, which don't survive bundling.
    external: ['electron', 'koffi', 'electron-updater'],
  },
  {
    ...common,
    entryPoints: ['src/main/preload.ts'],
    outfile: `${outdir}/preload.js`,
    platform: 'node',
    format: 'cjs',
    external: ['electron'],
  },
  {
    ...common,
    entryPoints: ['src/renderer/renderer.ts'],
    outfile: `${outdir}/renderer.js`,
    platform: 'browser',
    format: 'iife',
  },
  {
    ...common,
    entryPoints: ['src/renderer/opacity.ts'],
    outfile: `${outdir}/opacity.js`,
    platform: 'browser',
    format: 'iife',
  },
  {
    ...common,
    entryPoints: ['src/renderer/credits.ts'],
    outfile: `${outdir}/credits.js`,
    platform: 'browser',
    format: 'iife',
  },
  {
    ...common,
    entryPoints: ['src/renderer/patchnotes.ts'],
    outfile: `${outdir}/patchnotes.js`,
    platform: 'browser',
    format: 'iife',
  },
];

async function copyStatic() {
  await mkdir(outdir, { recursive: true });
  await cp('src/renderer/index.html', `${outdir}/index.html`);
  await cp('src/renderer/credits.html', `${outdir}/credits.html`);
  await cp('src/renderer/opacity.html', `${outdir}/opacity.html`);
  await cp('src/renderer/patchnotes.html', `${outdir}/patchnotes.html`);
  // Copy prototype/art assets if present so they're served same-origin from dist/.
  try {
    await access('assets');
    await cp('assets', `${outdir}/assets`, { recursive: true });
  } catch {
    /* no assets/ yet — placeholder art is used */
  }
}

if (watch) {
  await copyStatic();
  for (const t of targets) {
    const ctx = await context(t);
    await ctx.watch();
  }
  console.log('[build] watching for changes...');
} else {
  for (const t of targets) {
    await build(t);
  }
  await copyStatic();
  console.log('[build] done.');
}
