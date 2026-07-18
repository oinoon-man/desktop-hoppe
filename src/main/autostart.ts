// "Launch at login" for all three platforms. Windows and macOS have a real API; Linux is
// handled by writing an XDG autostart entry (see autostart-entry.ts for the pure parts).
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { DESKTOP_FILE, autostartDir, launchTarget, desktopEntry } from './autostart-entry';

export function autostartSupported(): boolean {
  return process.platform === 'win32' || process.platform === 'darwin' || process.platform === 'linux';
}

function applyLinux(enabled: boolean): void {
  const file = path.join(autostartDir(), DESKTOP_FILE);
  try {
    if (!enabled) {
      fs.rmSync(file, { force: true });
      return;
    }
    fs.mkdirSync(autostartDir(), { recursive: true });
    fs.writeFileSync(file, desktopEntry(launchTarget()), 'utf-8');
  } catch (e) {
    console.error('[autostart] linux autostart failed:', (e as Error).message);
  }
}

/** Turn "launch at login" on or off for the current platform. */
export function applyAutostart(enabled: boolean): void {
  if (process.platform === 'linux') {
    applyLinux(enabled);
    return;
  }
  // Explicit path re-asserts one current entry (fixes stale paths from older installs
  // and avoids duplicate autostart launches).
  app.setLoginItemSettings({ openAtLogin: enabled, path: process.execPath });
}
