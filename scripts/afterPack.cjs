// electron-builder afterPack hook: ad-hoc code-sign the macOS .app.
//
// electron-builder itself only skips signing when no Developer-ID cert is present
// (build.mac.identity=null → "skipped code signing"), which leaves the app UNSIGNED.
// An unsigned app is rejected as "damaged" on Apple Silicon. Ad-hoc signing (codesign
// -s -) satisfies the "must be signed" requirement so it launches — the user still has
// to allow it once (right-click → Open / Settings → Open Anyway) since it isn't
// notarized. No-op on Windows/Linux. Real Developer-ID signing comes with an Apple acct.
const { execSync } = require('node:child_process');
const path = require('node:path');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const app = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  console.log(`[afterPack] ad-hoc signing ${app}`);
  // --deep signs nested helpers/frameworks; -s - is the ad-hoc identity.
  execSync(`codesign --force --deep --sign - ${JSON.stringify(app)}`, { stdio: 'inherit' });
};
