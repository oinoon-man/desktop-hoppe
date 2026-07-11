import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import { execSync } from 'node:child_process';
import path from 'node:path';

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

// Update channel: stable users stay on `latest` (only sees non-prerelease `latest.yml`);
// opt-in testers switch to `beta` (sees prerelease `beta.yml`). Keeping these separate is
// what isolates live users from -beta.N builds — a `latest` user never sees a prerelease.
function applyChannel(beta: boolean): void {
  autoUpdater.channel = beta ? 'beta' : 'latest';
  autoUpdater.allowPrerelease = beta;
}

// A missing manifest (HTTP 404) is EXPECTED where no update feed is published for this
// build yet: macOS/Linux before a stable v2 release (the latest stable, v1.0.7, ships only
// Windows manifests), or the beta channel before its first beta.yml. That isn't an error to
// alarm testers with — log it calmly. Anything else stays a real error. Never rethrows.
function logUpdaterError(e: unknown): void {
  const msg = (e as { message?: string } | null)?.message ?? String(e);
  if (/\b404\b|not ?found|ERR_UPDATER_LATEST_VERSION_NOT_FOUND|Cannot find|Unable to find/i.test(msg)) {
    console.log('[updater] no update feed for this build yet — skipping:', msg.split('\n')[0]);
  } else {
    console.error('[updater] error:', msg);
  }
}

/** Switch channel at runtime (from the "베타 업데이트 받기" toggle) and re-check. */
export function setUpdateChannel(beta: boolean): void {
  if (!app.isPackaged) return;
  applyChannel(beta);
  autoUpdater.checkForUpdates().catch(() => {}); // failures surface via the 'error' handler
}

export function initAutoUpdater(hooks: UpdaterHooks, beta = false): void {
  // No app-update.yml when running unpackaged (npm start) or as the portable
  // build — checking would just throw, so skip cleanly.
  if (!app.isPackaged) {
    console.log('[updater] skipped (not packaged)');
    return;
  }

  applyChannel(beta); // stable → latest.yml, tester → beta.yml (opt-in)

  // Download automatically, but DO NOT auto-restart: we let the user apply it
  // via the tray, and install silently on the next normal quit.
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => console.log('[updater] checking for update…'));
  autoUpdater.on('update-available', (info) => console.log(`[updater] update available: ${info.version}`));
  autoUpdater.on('update-not-available', () => console.log('[updater] up to date'));
  autoUpdater.on('error', logUpdaterError);
  autoUpdater.on('download-progress', (p) => console.log(`[updater] downloading ${Math.round(p.percent)}%`));
  autoUpdater.on('update-downloaded', (info) => {
    ready = true;
    readyVersion = info.version;
    console.log(`[updater] downloaded ${info.version} — ready to install`);
    hooks.onUpdateReady(info.version);
  });

  const check = () => autoUpdater.checkForUpdates().catch(() => {}); // logged via 'error' handler
  setTimeout(check, INITIAL_DELAY_MS);
  setInterval(check, RECHECK_MS);

  // When the app quits WITH an update pending, electron-updater's autoInstallOnAppQuit
  // runs the NSIS installer. Clear any *other* running copies first so they don't keep
  // the executable file-locked — a locked file silently aborts the install, which looks
  // exactly like "the app just quit and nothing updated".
  app.on('before-quit', () => {
    if (ready) killOtherInstances();
  });
}

/**
 * Kill any *other* running instance of the installed app (a stale duplicate from
 * before the single-instance lock) so the updater can overwrite its files. Only
 * touches other *main* processes of this same exe — never this process, its child
 * processes (they carry `--type=`), or anything while running unpackaged in dev.
 */
export function killOtherInstances(): void {
  if (!app.isPackaged || process.platform !== 'win32') return;
  const exe = path.basename(process.execPath).replace(/'/g, "''");
  const self = process.pid;
  try {
    const script =
      `Get-CimInstance Win32_Process | Where-Object { ` +
      `$_.Name -eq '${exe}' -and $_.ProcessId -ne ${self} -and ($_.CommandLine -notlike '*--type=*') } | ` +
      `ForEach-Object { $_.ProcessId }`;
    const out = execSync(`powershell -NoProfile -NonInteractive -Command "${script}"`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    }).trim();
    const pids = out.split(/\s+/).filter((s) => /^\d+$/.test(s) && Number(s) !== self);
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore', timeout: 5000 });
      } catch {
        /* already exited */
      }
    }
    if (pids.length) console.log(`[updater] cleared ${pids.length} stale instance(s) before install`);
  } catch (e) {
    console.error('[updater] killOtherInstances failed:', (e as Error)?.message ?? e);
  }
}

/** Quit and install the downloaded update now (used by the tray item). */
export function quitAndInstall(): void {
  if (!ready) return;
  killOtherInstances(); // free any file lock so the install can't silently fail
  // isSilent = false (show installer progress), isForceRunAfter = true (relaunch).
  autoUpdater.quitAndInstall(false, true);
}
