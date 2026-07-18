// The Linux autostart entry is written by hand (no Electron API for it), and it only ever
// runs on a machine we don't develop on — so the file's contents are pinned here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desktopEntry } from './autostart-entry.ts';

test('desktop entry has the keys a session needs to launch it', () => {
  const entry = desktopEntry('/opt/DesktopButter.AppImage');
  assert.match(entry, /^\[Desktop Entry\]/, 'must start with the group header');
  assert.match(entry, /\nType=Application\n/);
  assert.match(entry, /\nExec=\/opt\/DesktopButter\.AppImage\n/);
  assert.match(entry, /\nTerminal=false\n/);
  assert.match(entry, /\nName=Desktop Butter\n/);
  assert.ok(entry.endsWith('\n'), 'trailing newline keeps parsers happy');
});

test('a path containing spaces is quoted (unquoted Exec would silently not launch)', () => {
  const entry = desktopEntry('/home/user/My Apps/Desktop Butter.AppImage');
  assert.match(entry, /\nExec="\/home\/user\/My Apps\/Desktop Butter\.AppImage"\n/);
});

test('backslashes and quotes in the path are escaped', () => {
  const entry = desktopEntry('/tmp/we ird/"quo\\te".AppImage');
  const exec = entry.split('\n').find((l) => l.startsWith('Exec='))!;
  assert.equal(exec, 'Exec="/tmp/we ird/\\"quo\\\\te\\".AppImage"');
});
