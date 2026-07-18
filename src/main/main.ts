import { app, BrowserWindow, ipcMain, screen, Menu, Tray, nativeImage, shell, globalShortcut } from 'electron';
import path from 'node:path';
import { PetSim } from './sim';
import { initWindows, WindowWatcher, enumerateShelves, sendWindowToBottom, isRemoteSession } from './windows';
import { fetchDevlogList, fetchDevlogPost } from './devlog';
import { loadSettings, saveSettings, MAX_PETS, SIZE_STEPS, clampOpacity, type Settings } from './settings';
import {
  initAutoUpdater,
  isUpdateReady,
  updateReadyVersion,
  quitAndInstall,
  setUpdateChannel,
  canSelfUpdate,
} from './updater';
import { t, LOCALES, LOCALE_LABELS, type Locale, type UIKey } from '../shared/i18n';
import type { PetDialogue, Rect } from '../shared/types';
import { CHARACTERS, isCharacterId, type CharacterId } from '../shared/types';
import { PET_SIZE } from '../shared/layout';
import { loadAllDialogues } from './dialogue';
import { applyAutostart as setAutostart, autostartSupported } from './autostart';
import { openCredits, openPatchnotesWindow, openOpacityWindow, reloadChildWindows } from './child-windows';

// ---------------------------------------------------------------------------
// Main process
// Owns the transparent, always-on-top pet window(s) (each with its own PetSim),
// a system tray (speech / window-interaction / autostart / credits / quit) and a
// single Win32 window watcher that feeds shelves to every pet.
// ---------------------------------------------------------------------------

// Animation cap under Remote Desktop (RDP): the transparent window streams every repaint
// over the wire, so a full-rate animation floods the RDP upload channel. Throttle it there
// (0 elsewhere = uncapped). See isRemoteSession() + the renderer's Ticker cap.
const RDP_MAX_FPS = 12;
const DEBUG = process.argv.includes('--debug');
const CLIMBTEST = process.argv.includes('--climbtest');
const MON2TEST = process.argv.includes('--mon2test');
const MEMLOG = process.argv.includes('--memlog'); // periodic per-process memory/CPU sampling
const SEAMTEST = process.argv.includes('--seamtest'); // oscillate the pet across the monitor seam
const GEOMTEST = process.argv.includes('--geomtest'); // log window/content/pet/bubble geometry over time
const CHAR_OVERRIDE = process.argv.find((a) => a.startsWith('--char='))?.slice('--char='.length); // dev: force a character
// When true, updates download + install on quit silently (no pet announcement, no
// tray "지금 업데이트" item). 1.0.7 improves the size feature, so announce it.
const SILENT_UPDATES = false;

// A desktop pet should never greet the user with a crash dialog. Log unexpected
// main-process errors and keep running instead of letting Electron pop its
// default "A JavaScript error occurred" box and tear the app down.
process.on('uncaughtException', (err) => console.error('[main] uncaught exception:', err));
process.on('unhandledRejection', (err) => console.error('[main] unhandled rejection:', err));

interface Pet {
  window: BrowserWindow;
  sim: PetSim | null;
  character: CharacterId; // which roster slot this pet fills (for count reconciliation)
}

let pets: Pet[] = [];
let watcher: WindowWatcher | null = null;
let tray: Tray | null = null;
let hidden = false; // 숨기기 toggle (session-only, not persisted)
let opacitySaveTimer: ReturnType<typeof setTimeout> | null = null;
let settings: Settings;
let dialogues: Record<CharacterId, PetDialogue> = {} as Record<CharacterId, PetDialogue>;
let climbingAvailable = false;
let climbtestDropped = false;

// --- pets ------------------------------------------------------------------

function createPet(index: number, character: CharacterId): Pet {
  // --char= (dev) forces which art renders; the roster slot (`character`) is still what
  // this pet counts as, so count reconciliation stays correct.
  const renderChar: CharacterId = CHAR_OVERRIDE && isCharacterId(CHAR_OVERRIDE) ? CHAR_OVERRIDE : character;
  const wa = screen.getPrimaryDisplay().workArea;
  // The window stays PET_SIZE regardless of the size setting: it must hold the speech
  // bubble (which never shrinks below readable), and the pet art is scaled+placed inside
  // it (renderer). A small window would clip the bubble into a 1-char vertical sliver.
  const sz = PET_SIZE;
  const window = new BrowserWindow({
    width: sz,
    height: sz,
    x: Math.max(wa.x, wa.x + wa.width - sz - 40 - index * 90),
    y: wa.y + wa.height - sz - 40,
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
      // backgroundThrottling left at its default (true): see the single-instance-lock
      // note above — forcing it off caused the multi-monitor compositor RAM runaway.
    },
  });

  window.setAlwaysOnTop(true, 'screen-saver');
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setIgnoreMouseEvents(true);
  // Opacity is applied in the renderer as CSS (see the 'opacity' IPC on did-finish-load),
  // not window.setOpacity — the latter is a no-op on Linux/X11 for a transparent window.
  applyBehindTo(window); // honor "윈도우 맨 뒤로" for freshly spawned pets
  if (hidden) window.hide();
  window.webContents.on('console-message', (e) => console.log('[renderer]', e.message));

  // A transparent, frameless window creeps larger every paint on fractional-DPI displays
  // (125/150/175 %) — an Electron/Chromium bug. Guard BOTH sizes: the outer window AND the
  // CONTENT (viewport). The content can drift on its own while the outer window sits at
  // 300px, and anything the renderer positions against the viewport then slides with it —
  // that's what walked the pet out of view while the bubble stayed put. (The renderer is
  // also structurally immune now via the fixed #stage box; this is belt-and-suspenders,
  // and it can only help when a 'resize' actually fires.)
  let enforcingSize = false;
  window.on('resize', () => {
    if (enforcingSize || window.isDestroyed()) return;
    const want = PET_SIZE; // the pet window is always PET_SIZE (the art scales inside)
    const [w, h] = window.getSize();
    const [cw, ch] = window.getContentSize();
    const outerDrift = Math.abs(w - want) > 1 || Math.abs(h - want) > 1;
    const contentDrift = Math.abs(cw - want) > 1 || Math.abs(ch - want) > 1;
    if (outerDrift || contentDrift) {
      enforcingSize = true;
      if (contentDrift) window.setContentSize(want, want);
      window.setSize(want, want);
      setTimeout(() => (enforcingSize = false), 0);
    }
  });

  const pet: Pet = { window, sim: null, character };

  window.webContents.on('did-finish-load', () => {
    if (window.isDestroyed()) return;
    const pool = dialogues[pet.character] ?? {};
    window.webContents.send('dialogue', pool);
    console.log('[dialogue]', pet.character, Object.values(pool).reduce((n, a) => n + a.length, 0), 'lines');
    window.webContents.send('set-speech', settings.speech);
    window.webContents.send('set-locale', settings.locale);
    window.webContents.send('pet-size', scaledSize());
    window.webContents.send('opacity', effectiveOpacity());
    window.webContents.send('max-fps', isRemoteSession() ? RDP_MAX_FPS : 0); // throttle under RDP
    if (!SILENT_UPDATES && isUpdateReady()) window.webContents.send('update-announce', announceLine(pet.character));
    applyBehindTo(window); // re-assert z-order once the window is fully realized
    // did-finish-load also fires on a reload (e.g. the memory watchdog): retire the
    // previous sim so its interval doesn't keep running orphaned alongside the new one.
    pet.sim?.stop();
    const sim = new PetSim(window, PET_SIZE); // window is always PET_SIZE; the art scales inside it
    sim.start();
    sim.setPlatforms(settings.climbing ? enumerateShelves() : []);
    sim.setStay(settings.stay);
    sim.setArtSize(scaledSize()); // grab region tracks the scaled art, not the 300px window
    pet.sim = sim;
  });

  if (DEBUG) window.webContents.openDevTools({ mode: 'detach' });
  window.on('closed', () => {
    pet.sim?.stop();
    pet.sim = null;
  });

  // `debug` exposes the renderer's animator as window.__cj (head anchors, clip bounds) —
  // on for --debug/--geomtest so the geometry harness can inspect it.
  const petQuery: Record<string, string> = { char: renderChar };
  if (DEBUG || GEOMTEST) petQuery.debug = '1';
  void window.loadFile(path.join(__dirname, 'index.html'), { query: petQuery });
  return pet;
}

// Reconcile the live pets to settings.roster: per character, add or close the difference
// (so changing one character's count leaves the others in place). Skips destroyed windows.
function applyRoster(): void {
  // Drop any windows that closed themselves before reconciling counts.
  for (let i = pets.length - 1; i >= 0; i--) if (pets[i].window.isDestroyed()) pets.splice(i, 1);
  for (const id of Object.keys(CHARACTERS) as CharacterId[]) {
    const want = settings.roster[id] ?? 0;
    const mine = pets.filter((p) => p.character === id);
    for (let have = mine.length; have < want; have++) pets.push(createPet(pets.length, id));
    for (let have = mine.length; have > want; have--) {
      const p = mine.pop();
      if (p) {
        pets.splice(pets.indexOf(p), 1);
        if (!p.window.isDestroyed()) p.window.close();
      }
    }
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
  setAutostart(settings.autostart);
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
  for (const p of pets) if (!p.window.isDestroyed()) p.window.webContents.send('opacity', o);
}
// Pet pixel size for the current scale setting (10/30/50/70/100 % of PET_SIZE).
function scaledSize(): number {
  return Math.max(1, Math.round((PET_SIZE * settings.size) / 100));
}
function applySize(): void {
  const s = scaledSize();
  // The window stays PET_SIZE; only the art inside scales. Push the intended art size to
  // the renderer (draws the art) AND to the sim (so the grab hit-test matches the scaled
  // art). No window resize — the feet stay pinned to the window bottom.
  for (const p of pets) {
    if (!p.window.isDestroyed()) p.window.webContents.send('pet-size', s);
    p.sim?.setArtSize(s);
  }
}
function applyStay(): void {
  for (const p of pets) p.sim?.setStay(settings.stay);
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
  // Keep the "숨기기" checkbox in sync with the real state. Without this, revealPets()
  // (a relaunch that unhides the pet) left the tray checkbox stale-checked even though the
  // pet was visible again — exactly the "재실행 시 체크되어 있음" report.
  rebuildTray();
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
function announceLine(character: CharacterId): string {
  return t(settings.locale, character === 'komi' ? 'updateAnnounceKomi' : 'updateAnnounce');
}

function announceUpdate(): void {
  if (SILENT_UPDATES) return;
  for (const p of pets) {
    if (!p.window.isDestroyed()) p.window.webContents.send('update-announce', announceLine(p.character));
  }
}

// --- tray ------------------------------------------------------------------

function buildTrayMenu(): Menu {
  const l = settings.locale;
  const updateItems: Electron.MenuItemConstructorOptions[] = !SILENT_UPDATES && isUpdateReady()
    ? [
        {
          // macOS can't self-install, so there the item opens the download page instead.
          label: t(l, canSelfUpdate() ? 'updateNow' : 'updateDownload').replace('{v}', updateReadyVersion()),
          click: () => quitAndInstall(),
        },
        { type: 'separator' },
      ]
    : [];
  // "친구들 데려오기": per-character counts (0..MAX_PETS each) so Butter + Komi can share
  // the screen. Each character gets its own count submenu.
  const countSubmenu = (id: CharacterId): Electron.MenuItemConstructorOptions[] =>
    Array.from({ length: MAX_PETS + 1 }, (_, n) => ({
      label: String(n),
      type: 'radio' as const,
      checked: (settings.roster[id] ?? 0) === n,
      click: () => {
        settings.roster = { ...settings.roster, [id]: n };
        saveSettings(settings);
        applyRoster();
        rebuildTray();
      },
    }));
  const copiesSubmenu: Electron.MenuItemConstructorOptions[] = (Object.keys(CHARACTERS) as CharacterId[]).map(
    (id) => ({ label: t(l, `char_${id}` as UIKey), submenu: countSubmenu(id) }),
  );
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
    {
      label: t(l, 'stay'),
      type: 'checkbox',
      checked: settings.stay,
      click: () => {
        settings.stay = !settings.stay;
        saveSettings(settings);
        applyStay();
        rebuildTray();
      },
    },
    { label: t(l, 'opacity'), click: () => openOpacityWindow(settings.locale) },
    {
      label: t(l, 'size'),
      submenu: SIZE_STEPS.map((s) => ({
        label: `${s}%`,
        type: 'radio',
        checked: settings.size === s,
        click: () => {
          settings.size = s;
          saveSettings(settings);
          applySize();
          rebuildTray();
        },
      })),
    },
    { type: 'separator' },
    {
      label: t(l, 'autostart'),
      type: 'checkbox',
      checked: settings.autostart && autostartSupported(),
      click: () => {
        settings.autostart = !settings.autostart;
        saveSettings(settings);
        applyAutostart();
        rebuildTray();
      },
    },
    {
      label: t(l, 'betaUpdates'),
      type: 'checkbox',
      checked: settings.beta,
      click: () => {
        settings.beta = !settings.beta;
        saveSettings(settings);
        setUpdateChannel(settings.beta); // switch channel + re-check now
        rebuildTray();
      },
    },
    { type: 'separator' },
    { label: `ver. ${app.getVersion()}`, enabled: false },
    { label: t(l, 'language'), submenu: languageSubmenu },
    { label: t(l, 'patchnotes'), click: () => openPatchnotesWindow(settings.locale) },
    { label: t(l, 'credits'), click: () => openCredits(settings.locale) },
    { type: 'separator' },
    {
      label: t(l, 'hide'),
      type: 'checkbox',
      checked: hidden,
      click: () => setHidden(!hidden), // setHidden rebuilds the tray itself
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
  dialogues = loadAllDialogues(loc);
  for (const p of pets) {
    if (p.window.isDestroyed()) continue;
    p.window.webContents.send('set-locale', loc);
    p.window.webContents.send('dialogue', dialogues[p.character] ?? {});
  }
  reloadChildWindows(loc);
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

// --- IPC -------------------------------------------------------------------

ipcMain.on('grab', (e) => petBySender(e.sender.id)?.sim?.onGrab());
ipcMain.on('release', (e) => petBySender(e.sender.id)?.sim?.onRelease());
ipcMain.on('show-context-menu', () => tray?.popUpContextMenu());

// Patch-notes window ↔ main: fetch the itch.io devlog, open links in the browser.
ipcMain.handle('devlog-list', () => fetchDevlogList());
ipcMain.handle('devlog-post', (_e, url: string) => fetchDevlogPost(url));
ipcMain.on('open-external', (_e, url: string) => {
  if (typeof url === 'string' && /^https?:\/\//i.test(url)) void shell.openExternal(url);
});

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
//
// NOTE: we intentionally do NOT disable Chromium's renderer backgrounding here.
// 1.0.3 disabled it (+ webPreferences.backgroundThrottling:false) to stop the
// unfocused/occluded "frozen pose" glitch, but that forced the transparent, always-
// on-top window to composite continuously; on some GPU/driver/OS combos, rapidly
// moving it across a monitor seam or through occlusion churned compositor surfaces
// without bound → RAM ballooned to 10s of GB → renderer OOM-crash → respawn → repeat.
// The frozen-pose glitch is instead mitigated cheaply by rendering on every state
// change (stage.update in createjs-anim) plus a ~1s sim heartbeat, so throttling can
// resume and the runaway can't happen.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
app.on('second-instance', () => revealPets());

app.whenReady().then(() => {
  if (!gotLock) return;
  settings = loadSettings();
  dialogues = loadAllDialogues(settings.locale);
  applyAutostart();

  climbingAvailable = initWindows();
  const rdp = isRemoteSession();
  console.log(`[rdp] remote session: ${rdp} (fps cap ${rdp ? RDP_MAX_FPS : 'off'})`);
  if (climbingAvailable) {
    console.log(`[windows] climbing available — ${enumerateShelves().length} shelves detected`);
    watcher = new WindowWatcher(distributePlatforms);
    watcher.start();
  } else {
    console.log('[windows] climbing disabled (FFI unavailable)');
  }

  createTray();
  applyRoster(); // spawn the configured number of each character

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

  if (SEAMTEST) {
    setTimeout(() => pets[0]?.sim?.startSeamTest(), 2500);
  }

  if (GEOMTEST) {
    const w = pets[0]?.window;
    if (w) {
      let n = 0;
      const iv = setInterval(async () => {
        if (w.isDestroyed()) return clearInterval(iv);
        const [sw, sh] = w.getSize();
        const [cw, ch] = w.getContentSize();
        const geo = await w.webContents
          .executeJavaScript(
            `(() => { const pet=document.getElementById('pet'), st=document.getElementById('stage'),
             p=pet.getBoundingClientRect(), b=document.getElementById('bubble').getBoundingClientRect(),
             s=st.getBoundingClientRect(), cs=getComputedStyle(document.documentElement);
             return {iw:innerWidth,ih:innerHeight,dpr:devicePixelRatio,
               stage:Math.round(s.width)+'x'+Math.round(s.height),
               petCx:Math.round(p.left-s.left+p.width/2), petW:Math.round(p.width),
               // measured bubble anchor (empty = falling back to the old fixed estimate)
               anchorX:cs.getPropertyValue('--bubble-x').trim()||'(fallback)',
               anchorY:cs.getPropertyValue('--bubble-y').trim()||'(fallback)',
               bubTailX:Math.round(b.left-s.left+b.width/2),
               bubBottom:Math.round(s.bottom-b.bottom),
               mode:(window.__cj&&window.__cj.current)||'?',
               anchors:window.__cj?JSON.stringify([...window.__cj.headByMode].map(
                 ([m,v])=>m+':'+Math.round(v.ax)+','+Math.round(v.ay)+'#'+v.samples)):'-'}; })()`,
          )
          .catch(() => null);
        console.log(`[geom] size=${sw}x${sh} content=${cw}x${ch} ${JSON.stringify(geo)}`);
        if (++n >= 10) clearInterval(iv);
      }, 800);
    }
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
  initAutoUpdater(
    {
      onUpdateReady: () => {
        announceUpdate();
        rebuildTray();
      },
    },
    settings.beta, // stable users stay on `latest`; only opt-in testers get `beta`
  );

  globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit());
  app.on('activate', () => {
    if (pets.length === 0) applyRoster();
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
