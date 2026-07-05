import { app, BrowserWindow, ipcMain, screen, Menu, Tray, nativeImage, shell, globalShortcut } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { PetSim } from './sim';
import { initWindows, WindowWatcher, enumerateShelves, sendWindowToBottom } from './windows';
import { loadSettings, saveSettings, MAX_PETS, clampOpacity, type Settings } from './settings';
import { initAutoUpdater, isUpdateReady, updateReadyVersion, quitAndInstall } from './updater';
import { t, LOCALES, LOCALE_LABELS, type Locale } from '../shared/i18n';
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
const MON2TEST = process.argv.includes('--mon2test');
const MEMLOG = process.argv.includes('--memlog'); // periodic per-process memory/CPU sampling
// Silent updates: the new build is still downloaded and installed on the next
// quit (electron-updater autoInstallOnAppQuit), but the pet never announces it
// and the tray shows no "지금 업데이트" item — testers just get it automatically.
const SILENT_UPDATES = true;

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

function dialogueFile(locale: Locale): string {
  return locale === 'ko' ? 'dialogue.json' : `dialogue.${locale}.json`;
}

function loadDialogue(locale: Locale): PetDialogue {
  const d = sanitizeDialogue(readJson<PetDialogue>(path.join('assets', 'data', dialogueFile(locale)), {}));
  // Fall back to the Korean pool if a locale file is missing or empty.
  if (Object.keys(d).length > 0 || locale === 'ko') return d;
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
      backgroundThrottling: false, // never freeze the pet's animation when unfocused/occluded
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
    window.webContents.send('set-locale', settings.locale);
    if (!SILENT_UPDATES && isUpdateReady()) window.webContents.send('update-announce', announceLine());
    applyBehindTo(window); // re-assert z-order once the window is fully realized
    // did-finish-load also fires on a reload (e.g. the memory watchdog): retire the
    // previous sim so its interval doesn't keep running orphaned alongside the new one.
    pet.sim?.stop();
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
  // Explicit path re-asserts one current Run entry (fixes stale paths from older
  // installs and avoids duplicate autostart launches).
  app.setLoginItemSettings({ openAtLogin: settings.autostart, path: process.execPath });
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
// Bring the pet back into view — used when a 2nd launch is attempted (or the user
// thinks it closed): unhide and raise it to the top. Only a pet that is genuinely
// off *every* screen is re-spawned; one that's simply on another monitor stays put
// (so a relaunch never yanks it back to the primary display).
function revealPets(): void {
  setHidden(false);
  const displays = screen.getAllDisplays();
  pets.forEach((p, i) => {
    if (p.window.isDestroyed()) return;
    const b = p.window.getBounds();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const onScreen = displays.some(
      (d) =>
        cx >= d.bounds.x &&
        cx < d.bounds.x + d.bounds.width &&
        cy >= d.bounds.y &&
        cy < d.bounds.y + d.bounds.height,
    );
    if (!onScreen) p.sim?.resetPosition(i);
    p.window.showInactive();
    p.window.moveTop();
  });
}

// --- auto-update announce --------------------------------------------------
// When an update is ready the pet speaks up (a one-off notice) and the tray
// grows a "지금 업데이트" item. The line the pet says (in the current language):
function announceLine(): string {
  return t(settings.locale, 'updateAnnounce');
}

function announceUpdate(): void {
  if (SILENT_UPDATES) return;
  for (const p of pets) {
    if (!p.window.isDestroyed()) p.window.webContents.send('update-announce', announceLine());
  }
}

// --- tray ------------------------------------------------------------------

function buildTrayMenu(): Menu {
  const l = settings.locale;
  const updateItems: Electron.MenuItemConstructorOptions[] = !SILENT_UPDATES && isUpdateReady()
    ? [
        { label: t(l, 'updateNow').replace('{v}', updateReadyVersion()), click: () => quitAndInstall() },
        { type: 'separator' },
      ]
    : [];
  // "버터가 복사가 된다고": pick how many pets run (1..MAX_PETS).
  const copiesSubmenu: Electron.MenuItemConstructorOptions[] = Array.from(
    { length: MAX_PETS },
    (_, i) => i + 1,
  ).map((n) => ({
    label: String(n),
    type: 'radio',
    checked: settings.pets === n,
    click: () => {
      settings.pets = n;
      saveSettings(settings);
      setPetCount(n);
      rebuildTray();
    },
  }));
  // Language picker (한국어 / 日本語 / English).
  const languageSubmenu: Electron.MenuItemConstructorOptions[] = LOCALES.map((loc) => ({
    label: LOCALE_LABELS[loc],
    type: 'radio',
    checked: settings.locale === loc,
    click: () => setLocale(loc),
  }));
  return Menu.buildFromTemplate([
    { label: 'Desktop Butter', enabled: false },
    { type: 'separator' },
    ...updateItems,
    {
      label: t(l, 'speechToggle'),
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
      label: t(l, 'interactToggle'),
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
      label: t(l, 'behind'),
      type: 'checkbox',
      checked: settings.behind,
      click: () => {
        settings.behind = !settings.behind;
        saveSettings(settings);
        applyBehind();
        rebuildTray();
      },
    },
    { label: t(l, 'copies'), submenu: copiesSubmenu },
    { label: t(l, 'recall'), click: () => resetPositions() },
    { label: t(l, 'opacity'), click: () => openOpacityWindow() },
    { type: 'separator' },
    {
      label: t(l, 'autostart'),
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
    { label: `ver. ${app.getVersion()}`, enabled: false },
    { label: t(l, 'language'), submenu: languageSubmenu },
    { label: t(l, 'credits'), click: () => openCredits() },
    { type: 'separator' },
    {
      label: t(l, 'hide'),
      type: 'checkbox',
      checked: hidden,
      click: () => {
        setHidden(!hidden);
        rebuildTray();
      },
    },
    { label: t(l, 'quit'), click: () => app.quit() },
  ]);
}

// Switch UI + dialogue language: persist it, swap the pets' dialogue pool, and
// refresh the tray and any open child windows so everything re-renders localized.
function setLocale(loc: Locale): void {
  if (loc === settings.locale) return;
  settings.locale = loc;
  saveSettings(settings);
  dialogue = loadDialogue(loc);
  for (const p of pets) {
    if (p.window.isDestroyed()) continue;
    p.window.webContents.send('set-locale', loc);
    p.window.webContents.send('dialogue', dialogue);
  }
  if (creditsWindow && !creditsWindow.isDestroyed()) loadCredits(creditsWindow);
  if (opacityWindow && !opacityWindow.isDestroyed()) loadOpacity(opacityWindow);
  rebuildTray();
}

function rebuildTray(): void {
  tray?.setContextMenu(buildTrayMenu());
}

function createTray(): void {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  tray = new Tray(icon);
  tray.setToolTip('Desktop Butter');
  rebuildTray();
  tray.on('click', () => tray?.popUpContextMenu());
}

// --- credits popup ---------------------------------------------------------

function loadCredits(win: BrowserWindow): void {
  void win.loadFile(path.join(__dirname, 'credits.html'), { query: { loc: settings.locale } });
}

function openCredits(): void {
  if (creditsWindow && !creditsWindow.isDestroyed()) {
    creditsWindow.show();
    creditsWindow.focus();
    return;
  }
  creditsWindow = new BrowserWindow({
    width: 380,
    height: 286, // web-content height (useContentSize) — fits the credits layout
    useContentSize: true,
    title: t(settings.locale, 'credits'),
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
  loadCredits(creditsWindow);
  creditsWindow.on('closed', () => {
    creditsWindow = null;
  });
}

// --- opacity slider window -------------------------------------------------

function loadOpacity(win: BrowserWindow): void {
  void win.loadFile(path.join(__dirname, 'opacity.html'), { query: { loc: settings.locale } });
}

function openOpacityWindow(): void {
  if (opacityWindow && !opacityWindow.isDestroyed()) {
    opacityWindow.show();
    opacityWindow.focus();
    return;
  }
  opacityWindow = new BrowserWindow({
    width: 320,
    height: 148,
    title: t(settings.locale, 'opacity'),
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
  loadOpacity(opacityWindow);
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

// Single-instance lock: only ONE app runs at a time. A second launch (double-
// click, autostart, updater relaunch…) exits immediately; the already-running
// instance reveals its pet so the user can see it IS still running.
// The pet must keep animating even when it isn't the focused/foreground window
// (it never takes focus, and other windows constantly cover it). By default
// Chromium throttles/pauses a backgrounded or occluded renderer's rAF + timers,
// which freezes the CreateJS canvas on whatever frame it was on while the main
// process keeps moving the pet and pushing state — the "stuck in the airborne
// pose while sliding" bug. Disable every form of renderer backgrounding. Must be
// set before app 'ready'. (Also set per-window via webPreferences.backgroundThrottling.)
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
app.on('second-instance', () => revealPets());

app.whenReady().then(() => {
  if (!gotLock) return;
  settings = loadSettings();
  manifest = readJson<PetManifest>(path.join('assets', 'prototype', 'manifest.json'), { clips: {} });
  dialogue = loadDialogue(settings.locale);
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

  if (MON2TEST) {
    setTimeout(() => {
      const sim = pets[0]?.sim;
      if (!sim) return;
      sim.debugPlaceAt(-960); // center of a left-side monitor at x -1920..0
      let n = 0;
      const iv = setInterval(() => {
        const b = pets[0].window.getBounds();
        console.log(`[mon2test] pet x=${Math.round(sim.getX())} windowBounds.x=${b.x}`);
        if (++n >= 6) clearInterval(iv);
      }, 700);
    }, 2500);
  }

  if (MEMLOG) {
    const started = Date.now();
    let base = 0;
    const mb = (kb: number): string => (kb / 1024).toFixed(1);
    const sample = (): void => {
      const metrics = app.getAppMetrics();
      let total = 0;
      let cpu = 0;
      const byType: Record<string, number> = {};
      for (const p of metrics) {
        total += p.memory.workingSetSize;
        cpu += p.cpu?.percentCPUUsage ?? 0;
        byType[p.type] = (byType[p.type] ?? 0) + p.memory.workingSetSize;
      }
      if (!base) base = total;
      const t = Math.round((Date.now() - started) / 1000);
      const parts = Object.entries(byType)
        .map(([k, v]) => `${k}=${mb(v)}MB`)
        .join(' ');
      console.log(
        `[mem] t=${t}s total=${mb(total)}MB (Δ${mb(total - base)}) cpu=${cpu.toFixed(0)}% procs=${metrics.length} | ${parts}`,
      );
    };
    sample();
    setInterval(sample, 15000);
  }

  // Memory watchdog: a pet renderer that has ballooned far past its normal working
  // set (~140MB) indicates a runaway leak we couldn't reproduce in-house. Reclaim it
  // by reloading just that renderer — a cause-agnostic hard cap on RAM growth. Only a
  // genuine runaway trips this; the renderer re-inits in place (sim keeps position).
  const RENDERER_RSS_LIMIT_KB = 700 * 1024;
  setInterval(() => {
    const byPid = new Map(app.getAppMetrics().map((m) => [m.pid, m.memory.workingSetSize]));
    for (const p of pets) {
      if (p.window.isDestroyed()) continue;
      let pid = 0;
      try {
        pid = p.window.webContents.getOSProcessId();
      } catch {
        continue;
      }
      const rss = byPid.get(pid) ?? 0;
      if (rss > RENDERER_RSS_LIMIT_KB) {
        console.warn(`[mem] pet renderer pid=${pid} at ${Math.round(rss / 1024)}MB — reloading to reclaim`);
        try {
          p.window.webContents.reload();
        } catch {
          /* window went away */
        }
      }
    }
  }, 60000);

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
