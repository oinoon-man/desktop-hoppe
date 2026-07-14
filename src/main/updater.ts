import { app, shell } from 'electron';
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
const RELEASES_URL = 'https://github.com/oinoon-man/desktop-hoppe/releases/latest';

/** Whether this platform can install an update in place. macOS cannot: the build is only
 *  ad-hoc signed (no Apple Developer ID) and Squirrel.Mac refuses an update it can't verify,
 *  so there we announce the new version and open the download page instead. */
export function canSelfUpdate(): boolean {
  return process.platform !== 'darwin';
}

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

// A prerelease build (…-beta.N) always tracks the beta channel, so a beta tester keeps
// getting newer betas without toggling the setting; stable builds honor the opt-in only.
function wantsBeta(optIn: boolean): boolean {
  return optIn || app.getVersion().includes('-');
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
  applyChannel(wantsBeta(beta));
  autoUpdater.checkForUpdates().catch(() => {}); // failures surface via the 'error' handler
}

export function initAutoUpdater(hooks: UpdaterHooks, beta = false): void {
  // No app-update.yml when running unpackaged (npm start) or as the portable
  // build — checking would just throw, so skip cleanly.
  if (!app.isPackaged) {
    console.log('[updater] skipped (not packaged)');
    return;
  }

  applyChannel(wantsBeta(beta)); // stable → latest.yml; tester opt-in OR any prerelease build → beta.yml

  // Download automatically, but DO NOT auto-restart: we let the user apply it
  // via the tray, and install silently on the next normal quit.
  // EXCEPT on macOS: the app is only ad-hoc signed (no Apple Developer ID), and Squirrel.Mac
  // refuses to install an update whose signature it can't validate — the download would just
  // burn bandwidth and then fail. So don't self-update there; announce the new version and
  // send the user to the download page instead (see canSelfUpdate + the tray item).
  autoUpdater.autoDownload = canSelfUpdate();
  autoUpdater.autoInstallOnAppQuit = canSelfUpdate();

  autoUpdater.on('checking-for-update', () => console.log('[updater] checking for update…'));
  autoUpdater.on('update-available', (info) => {
    console.log(`[updater] update available: ${info.version}`);
    // macOS never reaches 'update-downloaded' (no self-update), so treat "available" as the
    // signal: the pet announces it and the tray offers the download page.
    if (!canSelfUpdate()) {
      ready = true;
      readyVersion = info.version;
      hooks.onUpdateReady(info.version);
    }
  });
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

/** Apply the update now (used by the tray item). On macOS there is no in-place install —
 *  open the download page so the user can grab the new build themselves. */
export function quitAndInstall(): void {
  if (!ready) return;
  if (!canSelfUpdate()) {
    void shell.openExternal(RELEASES_URL);
    return;
  }
  killOtherInstances(); // free any file lock so the install can't silently fail
  // isSilent = false (show installer progress), isForceRunAfter = true (relaunch).
  autoUpdater.quitAndInstall(false, true);
}
