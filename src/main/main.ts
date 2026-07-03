import { app, BrowserWindow, ipcMain, screen, Menu, Tray, nativeImage, shell, globalShortcut } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { PetSim } from './sim';
import { initWindows, WindowWatcher, enumerateShelves, sendWindowToBottom } from './windows';
import { loadSettings, saveSettings, MAX_PETS, clampOpacity, type Settings } from './settings';
import { initAutoUpdater, isUpdateReady, updateReadyVersion, quitAndInstall } from './updater';
import type { PetManifest, PetDialogue, DialogueLine, DialogueCategory, Rect } from '../shared/types';

// ---------------------------------------------------------------------------
// Main process
// Owns the transparent, always-on-top pet window(s) (each with its own PetSim),
// a system tray (speech / window-interaction / autostart / credits / quit) and a
// single Win32 window watcher that feeds shelves to every pet.
// ---------------------------------------------------------------------------

const PET_SIZE = 300;
const DEBUG = process.argv.includes('--debug');
const CLIMBTEST = process.argv.includes('--climbtest');

// A desktop pet should never greet the user with a crash dialog. Log unexpected
// main-process errors and keep running instead of letting Electron pop its
// default "A JavaScript error occurred" box and tear the app down.
process.on('uncaughtException', (err) => console.error('[main] uncaught exception:', err));
process.on('unhandledRejection', (err) => console.error('[main] unhandled rejection:', err));

interface Pet {
  window: BrowserWindow;
  sim: PetSim | null;
}

let pets: Pet[] = [];
let watcher: WindowWatcher | null = null;
let tray: Tray | null = null;
let creditsWindow: BrowserWindow | null = null;
let opacityWindow: BrowserWindow | null = null;
let hidden = false; // 숨기기 toggle (session-only, not persisted)
let opacitySaveTimer: ReturnType<typeof setTimeout> | null = null;
let settings: Settings;
let manifest: PetManifest = { clips: {} };
let dialogue: PetDialogue = {};
let climbingAvailable = false;
let climbtestDropped = false;

function readJson<T>(rel: string, fallback: T): T {
  try {
    let text = fs.readFileSync(path.join(__dirname, rel), 'utf-8');
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') return parsed as T;
  } catch {
    /* fall through */
  }
  return fallback;
}

// --- dialogue --------------------------------------------------------------
// The pool ships with the app (assets/data/dialogue.json) and is read fresh on
// every launch, so an app update always delivers the current lines. (It used to
// be seeded once into userData and then kept, which froze updated installs on
// whatever set they first launched with — the bundled lines never reached them.)

const DIALOGUE_KEYS: DialogueCategory[] = ['greeting', 'idle', 'walk', 'sleep', 'drag', 'fall', 'land'];

/** A line is either a plain string or `{ text, thought }`; keep the thought flag
 *  (속마음) if present. Returns null for empty/invalid entries. */
function sanitizeLine(entry: unknown): DialogueLine | null {
  if (typeof entry === 'string') {
    const text = entry.trim();
    return text ? text : null;
  }
  if (entry && typeof entry === 'object') {
    const text = String((entry as { text?: unknown }).text ?? '').trim();
    if (!text) return null;
    return { text, thought: (entry as { thought?: unknown }).thought === true };
  }
  return null;
}

function sanitizeDialogue(raw: unknown): PetDialogue {
  const out: PetDialogue = {};
  if (!raw || typeof raw !== 'object') return out;
  const obj = raw as Record<string, unknown>;
  for (const key of DIALOGUE_KEYS) {
    const arr = obj[key];
    if (Array.isArray(arr)) {
      const lines = arr.map(sanitizeLine).filter((l): l is DialogueLine => l !== null);
      if (lines.length) out[key] = lines;
    }
  }
  return out;
}

function loadDialogue(): PetDialogue {
  return sanitizeDialogue(readJson<PetDialogue>(path.join('assets', 'data', 'dialogue.json'), {}));
}

// --- pets ------------------------------------------------------------------

function createPet(index: number): Pet {
  const wa = screen.getPrimaryDisplay().workArea;
  const window = new BrowserWindow({
    width: PET_SIZE,
    height: PET_SIZE,
    x: Math.max(wa.x, wa.x + wa.width - PET_SIZE - 40 - index * 90),
    y: wa.y + wa.height - PET_SIZE - 40,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.setAlwaysOnTop(true, 'screen-saver');
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setIgnoreMouseEvents(true);
  window.setOpacity(effectiveOpacity());
  applyBehindTo(window); // honor "윈도우 맨 뒤로" for freshly spawned pets
  if (hidden) window.hide();
  window.webContents.on('console-message', (e) => console.log('[renderer]', e.message));

  const pet: Pet = { window, sim: null };

  window.webContents.on('did-finish-load', () => {
    if (window.isDestroyed()) return;
    window.webContents.send('manifest', manifest);
    window.webContents.send('dialogue', dialogue);
    window.webContents.send('set-speech', settings.speech);
    if (isUpdateReady()) window.webContents.send('update-announce', UPDATE_ANNOUNCE_LINE);
    applyBehindTo(window); // re-assert z-order once the window is fully realized
    const sim = new PetSim(window, PET_SIZE);
    sim.start();
    sim.setPlatforms(settings.climbing ? enumerateShelves() : []);
    pet.sim = sim;
  });

  if (DEBUG) window.webContents.openDevTools({ mode: 'detach' });
  window.on('closed', () => {
    pet.sim?.stop();
    pet.sim = null;
  });

  void window.loadFile(path.join(__dirname, 'index.html'));
  return pet;
}

function setPetCount(n: number): void {
  n = Math.max(1, Math.min(MAX_PETS, n));
  while (pets.length < n) pets.push(createPet(pets.length));
  while (pets.length > n) {
    const p = pets.pop();
    if (p && !p.window.isDestroyed()) p.window.close();
  }
}

function petBySender(senderId: number): Pet | undefined {
  return pets.find((p) => !p.window.isDestroyed() && p.window.webContents.id === senderId);
}

// --- settings application --------------------------------------------------

function distributePlatforms(rects: Rect[]): void {
  const eff = settings.climbing ? rects : [];
  for (const p of pets) p.sim?.setPlatforms(eff);
  if (CLIMBTEST && !climbtestDropped && eff.length > 0 && pets[0]?.sim) {
    climbtestDropped = true;
    pets[0].sim.setDebug(true);
    console.log(`[climbtest] dropping onto shelf ${JSON.stringify(eff[0])}`);
    pets[0].sim.debugDropOnto(eff[0]);
  }
}

function applySpeech(): void {
  for (const p of pets) if (!p.window.isDestroyed()) p.window.webContents.send('set-speech', settings.speech);
}
function applyAutostart(): void {
  app.setLoginItemSettings({ openAtLogin: settings.autostart });
}
// "윈도우 맨 뒤로": when on, drop the always-on-top flag and push the window to
// the bottom of the z-order so the pet sits behind other windows.
function applyBehindTo(win: BrowserWindow): void {
  if (win.isDestroyed()) return;
  if (settings.behind) {
    win.setAlwaysOnTop(false);
    sendWindowToBottom(win.getNativeWindowHandle());
  } else {
    win.setAlwaysOnTop(true, 'screen-saver');
  }
}
function applyBehind(): void {
  for (const p of pets) applyBehindTo(p.window);
}
// The slider shows 1–100, but the applied opacity is floored at 10% so the pet
// never becomes fully invisible (that is what 숨기기 is for).
function effectiveOpacity(): number {
  return Math.max(10, settings.opacity) / 100;
}
function applyOpacity(): void {
  const o = effectiveOpacity();
  for (const p of pets) if (!p.window.isDestroyed()) p.window.setOpacity(o);
}
function resetPositions(): void {
  pets.forEach((p, i) => p.sim?.resetPosition(i));
}
function setHidden(h: boolean): void {
  hidden = h;
  for (const p of pets) {
    if (p.window.isDestroyed()) continue;
    if (h) p.window.hide();
    else p.window.show();
  }
}

// --- auto-update announce --------------------------------------------------
// When an update is ready the pet speaks up (a one-off notice) and the tray
// grows a "지금 업데이트" item. The line the pet says:
const UPDATE_ANNOUNCE_LINE = '업데이트가 있대요!';

function announceUpdate(): void {
  for (const p of pets) {
    if (!p.window.isDestroyed()) p.window.webContents.send('update-announce', UPDATE_ANNOUNCE_LINE);
  }
}

// --- tray ------------------------------------------------------------------

function buildTrayMenu(): Menu {
  const updateItems: Electron.MenuItemConstructorOptions[] = isUpdateReady()
    ? [
        { label: `✨ 지금 업데이트 (v${updateReadyVersion()})`, click: () => quitAndInstall() },
        { type: 'separator' },
      ]
    : [];
  return Menu.buildFromTemplate([
    { label: 'Hoppe - The Desktop Butter', enabled: false },
    { type: 'separator' },
    ...updateItems,
    {
      label: '말풍선 켜기/끄기',
      type: 'checkbox',
      checked: settings.speech,
      click: () => {
        settings.speech = !settings.speech;
        saveSettings(settings);
        applySpeech();
        rebuildTray();
      },
    },
    {
      label: '윈도우와 상호작용 켜기/끄기',
      type: 'checkbox',
      checked: settings.climbing,
      enabled: climbingAvailable,
      click: () => {
        settings.climbing = !settings.climbing;
        saveSettings(settings);
        distributePlatforms(enumerateShelves());
        rebuildTray();
      },
    },
    {
      label: '윈도우 맨 뒤로',
      type: 'checkbox',
      checked: settings.behind,
      click: () => {
        settings.behind = !settings.behind;
        saveSettings(settings);
        applyBehind();
        rebuildTray();
      },
    },
    { label: '실종된 애 불러오기', click: () => resetPositions() },
    { label: '투명도 조절', click: () => openOpacityWindow() },
    { type: 'separator' },
    {
      label: '로그인 시 자동 실행',
      type: 'checkbox',
      checked: settings.autostart,
      click: () => {
        settings.autostart = !settings.autostart;
        saveSettings(settings);
        applyAutostart();
        rebuildTray();
      },
    },
    { type: 'separator' },
    { label: '만든 사람들', click: () => openCredits() },
    { type: 'separator' },
    {
      label: '숨기기',
      type: 'checkbox',
      checked: hidden,
      click: () => {
        setHidden(!hidden);
        rebuildTray();
      },
    },
    { label: '종료 (Ctrl+Shift+Q)', click: () => app.quit() },
  ]);
}

function rebuildTray(): void {
  tray?.setContextMenu(buildTrayMenu());
}

function createTray(): void {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  tray = new Tray(icon);
  tray.setToolTip('Hoppe');
  rebuildTray();
  tray.on('click', () => tray?.popUpContextMenu());
}

// --- credits popup ---------------------------------------------------------

function openCredits(): void {
  if (creditsWindow && !creditsWindow.isDestroyed()) {
    creditsWindow.show();
    creditsWindow.focus();
    return;
  }
  creditsWindow = new BrowserWindow({
    width: 380,
    height: 402,
    title: '만든 사람들',
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  // credited links always open in the user's browser, never in this window
  const openExternal = (url: string) => {
    if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
  };
  creditsWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  creditsWindow.webContents.on('will-navigate', (e, url) => {
    e.preventDefault();
    openExternal(url);
  });
  void creditsWindow.loadFile(path.join(__dirname, 'credits.html'));
  creditsWindow.on('closed', () => {
    creditsWindow = null;
  });
}

// --- opacity slider window -------------------------------------------------

function openOpacityWindow(): void {
  if (opacityWindow && !opacityWindow.isDestroyed()) {
    opacityWindow.show();
    opacityWindow.focus();
    return;
  }
  opacityWindow = new BrowserWindow({
    width: 320,
    height: 148,
    title: '투명도 조절',
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  void opacityWindow.loadFile(path.join(__dirname, 'opacity.html'));
  opacityWindow.on('closed', () => {
    opacityWindow = null;
  });
}

// --- IPC -------------------------------------------------------------------

ipcMain.on('grab', (e) => petBySender(e.sender.id)?.sim?.onGrab());
ipcMain.on('release', (e) => petBySender(e.sender.id)?.sim?.onRelease());
ipcMain.on('show-context-menu', () => tray?.popUpContextMenu());

ipcMain.handle('get-opacity', () => settings.opacity);
ipcMain.on('set-opacity', (_e, v: number) => {
  settings.opacity = clampOpacity(v);
  applyOpacity();
  if (opacitySaveTimer) clearTimeout(opacitySaveTimer);
  opacitySaveTimer = setTimeout(() => saveSettings(settings), 400);
});

// --- lifecycle -------------------------------------------------------------

app.whenReady().then(() => {
  settings = loadSettings();
  manifest = readJson<PetManifest>(path.join('assets', 'prototype', 'manifest.json'), { clips: {} });
  dialogue = loadDialogue();
  applyAutostart();

  climbingAvailable = initWindows();
  if (climbingAvailable) {
    console.log(`[windows] climbing available — ${enumerateShelves().length} shelves detected`);
    watcher = new WindowWatcher(distributePlatforms);
    watcher.start();
  } else {
    console.log('[windows] climbing disabled (FFI unavailable)');
  }

  createTray();
  for (let i = 0; i < settings.pets; i++) pets.push(createPet(i));

  // Auto-update: when a new version is downloaded, the pet announces it and the
  // tray gains a "지금 업데이트" item; it also installs silently on next quit.
  initAutoUpdater({
    onUpdateReady: () => {
      announceUpdate();
      rebuildTray();
    },
  });

  globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit());
  app.on('activate', () => {
    if (pets.length === 0) setPetCount(settings.pets);
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  watcher?.stop();
  tray?.destroy();
});

// Tray keeps the app alive; quitting is explicit (tray or the global shortcut).
app.on('window-all-closed', () => {
  /* intentionally no-op */
});
