import { app } from 'electron';
import { autoUpdater } from 'electron-updater';

// ---------------------------------------------------------------------------
// Auto-update (electron-updater) — checks GitHub Releases (see build.publish in
// package.json), downloads new versions in the background, and installs on quit.
// The pet ALSO announces the update and a "지금 업데이트" tray item lets the user
// apply it immediately. Only the NSIS installer build can self-update; the
// portable exe has no install step, so this is a no-op there and when unpackaged.
// ---------------------------------------------------------------------------

const INITIAL_DELAY_MS = 8000;
const RECHECK_MS = 6 * 60 * 60 * 1000; // re-check every 6h for long-running sessions

export interface UpdaterHooks {
  /** Fired once the new version is downloaded and ready to install. */
  onUpdateReady: (version: string) => void;
}

let ready = false;
let readyVersion = '';

export function isUpdateReady(): boolean {
  return ready;
}

export function updateReadyVersion(): string {
  return readyVersion;
}

export function initAutoUpdater(hooks: UpdaterHooks): void {
  // No app-update.yml when running unpackaged (npm start) or as the portable
  // build — checking would just throw, so skip cleanly.
  if (!app.isPackaged) {
    console.log('[updater] skipped (not packaged)');
    return;
  }

  // Download automatically, but DO NOT auto-restart: we let the user apply it
  // via the tray, and install silently on the next normal quit.
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => console.log('[updater] checking for update…'));
  autoUpdater.on('update-available', (info) => console.log(`[updater] update available: ${info.version}`));
  autoUpdater.on('update-not-available', () => console.log('[updater] up to date'));
  autoUpdater.on('error', (err) => console.error('[updater] error:', err?.message ?? err));
  autoUpdater.on('download-progress', (p) => console.log(`[updater] downloading ${Math.round(p.percent)}%`));
  autoUpdater.on('update-downloaded', (info) => {
    ready = true;
    readyVersion = info.version;
    console.log(`[updater] downloaded ${info.version} — ready to install`);
    hooks.onUpdateReady(info.version);
  });

  const check = () =>
    autoUpdater.checkForUpdates().catch((e) => console.error('[updater] check failed:', e?.message ?? e));
  setTimeout(check, INITIAL_DELAY_MS);
  setInterval(check, RECHECK_MS);
}

/** Quit and install the downloaded update now (used by the tray item). */
export function quitAndInstall(): void {
  if (!ready) return;
  // isSilent = false (show installer progress), isForceRunAfter = true (relaunch).
  autoUpdater.quitAndInstall(false, true);
}
