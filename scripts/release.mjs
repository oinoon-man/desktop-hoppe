// scripts/release.mjs — build + publish a GitHub release with the gh CLI.
//
// A stable replacement for `electron-builder --publish always`, which raced
// (nsis + portable both tried to create the release) and hit GitHub 422s when
// publishing a release before its tag existed. This script builds locally, then
// lets `gh release create` create the tag + published release + upload assets in
// one atomic call.
//
// Prereqs (one time): `gh auth login` with repo scope.
// Normal flow:
//   1. bump "version" in package.json  (e.g. 0.0.2 -> 0.0.3)
//   2. git commit + git push            (the tag is cut from origin/main)
//   3. npm run release
//
// Usage:
//   npm run release                 build + publish
//   npm run release -- --dry-run    build + validate, but print the gh command
//                                   instead of publishing
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));

const version = pkg.version;
const tag = `v${version}`;
const productName = pkg.build?.productName ?? pkg.name;
const publish = pkg.build?.publish?.[0];
if (!publish || publish.provider !== 'github') {
  fail('package.json build.publish[0] must be a github provider (owner/repo).');
}
const slug = `${publish.owner}/${publish.repo}`;

function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}
function capture(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}
// In a real run a failed check aborts; in --dry-run it only warns so the whole
// pipeline (build + command preview) can still be exercised.
function fail(msg) {
  if (dryRun) {
    console.warn(`⚠ (dry-run) ${msg}`);
    return;
  }
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// --- 1. sanity checks ------------------------------------------------------
console.log(`\n▶ Releasing ${productName} ${tag} → ${slug}\n`);

if (!capture('gh --version')) fail('GitHub CLI (gh) not found on PATH. Install it and run `gh auth login`.');
if (capture('git status --porcelain')) fail('Working tree has uncommitted changes — commit & push your version bump first.');

execSync('git fetch --tags origin main', { stdio: 'ignore' });
if (capture(`git tag --list ${tag}`) || capture(`git ls-remote --tags origin ${tag}`)) {
  fail(`Tag ${tag} already exists. Bump "version" in package.json.`);
}
if (capture('git rev-list origin/main..HEAD')) {
  fail('You have commits that are not pushed to origin/main — push them so the tag matches the published code.');
}
if (capture(`gh release view ${tag} -R ${slug} --json tagName`)) {
  fail(`Release ${tag} already exists on GitHub. Bump the version.`);
}

// --- 2. build --------------------------------------------------------------
sh('node scripts/build.mjs');
sh('npx electron-builder --win');

// --- 3. collect artifacts (names come from build.nsis/portable artifactName) -
const rel = join(root, 'release');
const setup = join(rel, `${productName}-Setup-${version}.exe`);
const assets = [
  setup, // NSIS installer (the auto-update target)
  `${setup}.blockmap`, // delta-update block map
  join(rel, `${productName}-${version}.exe`), // portable (bonus download)
  join(rel, 'latest.yml'), // electron-updater manifest — MUST be on the release
];
for (const a of assets) {
  if (!existsSync(a)) fail(`Missing build artifact: ${a}`);
}

// --- 4. publish ------------------------------------------------------------
const notes = `${productName} ${version} 릴리스. 설치본(${productName}-Setup-${version}.exe) 권장 · 포터블(${productName}-${version}.exe)도 제공. 설치본은 실행 중 자동 업데이트됩니다.`;
const assetArgs = assets.map((a) => `"${a}"`).join(' ');
const ghCmd = `gh release create ${tag} ${assetArgs} -R ${slug} --target main --title "${productName} ${version}" --notes "${notes}" --latest`;

if (dryRun) {
  console.log(`\n[dry-run] build OK, ${assets.length} assets present. Would publish with:\n${ghCmd}\n`);
} else {
  sh(ghCmd);
  console.log(`\n✓ Released ${tag}: https://github.com/${slug}/releases/tag/${tag}`);
  console.log('  Installed apps will pick it up on next launch (pet announces it + tray "✨ 지금 업데이트").');
}
