// ---------------------------------------------------------------------------
// Pure helpers for "launch at login" on Linux, kept free of Electron so they can be tested
// (see autostart-entry.test.ts). Linux has no login-item API: the desktop-agnostic
// mechanism is the XDG autostart spec — a .desktop file in ~/.config/autostart/ that any
// spec-compliant session (GNOME, KDE, XFCE, Cinnamon, MATE...) launches at login.
// ---------------------------------------------------------------------------
import path from 'node:path';
import os from 'node:os';

export const DESKTOP_FILE = 'desktop-butter.desktop';

/** Directory the session reads autostart entries from. */
export function autostartDir(env: NodeJS.ProcessEnv = process.env): string {
  const base = env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(base, 'autostart');
}

/**
 * The executable to relaunch. Inside an AppImage, process.execPath points at the unpacked
 * binary in a temporary mount that disappears on quit, so autostarting it would fail on the
 * next boot; the path that survives is the AppImage itself, exposed as $APPIMAGE.
 */
export function launchTarget(env: NodeJS.ProcessEnv = process.env, execPath = process.execPath): string {
  return env.APPIMAGE || execPath;
}

/** The .desktop entry contents. */
export function desktopEntry(exec: string, name = 'Desktop Butter'): string {
  // An Exec path containing spaces must be quoted, or the session silently fails to launch.
  const needsQuotes = /\s/.test(exec);
  const escaped = exec.replace(/(["\\])/g, '\\$1');
  const quoted = needsQuotes ? '"' + escaped + '"' : exec;
  return [
    '[Desktop Entry]',
    'Type=Application',
    `Name=${name}`,
    `Exec=${quoted}`,
    'Terminal=false',
    // Spec defaults, but some sessions hide entries without them - be explicit.
    'X-GNOME-Autostart-enabled=true',
    'NoDisplay=false',
    '',
  ].join('\n');
}
