// ---------------------------------------------------------------------------
// The app's small auxiliary windows: credits, patch notes and the opacity slider.
//
// All three follow the same shape — a singleton window that re-focuses if already open,
// loads its page with the current locale, and opens any link in the real browser rather
// than inside the app. They take the locale as an argument instead of reaching into
// settings, so this module owns nothing but the windows themselves.
// ---------------------------------------------------------------------------
import { BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { t, type Locale } from '../shared/i18n';

let creditsWindow: BrowserWindow | null = null;
let opacityWindow: BrowserWindow | null = null;
let patchnotesWindow: BrowserWindow | null = null;

/** Re-render any open auxiliary window in `locale` (called when the language changes). */
export function reloadChildWindows(locale: Locale): void {
  if (creditsWindow && !creditsWindow.isDestroyed()) loadCredits(creditsWindow, locale);
  if (opacityWindow && !opacityWindow.isDestroyed()) loadOpacity(opacityWindow, locale);
  if (patchnotesWindow && !patchnotesWindow.isDestroyed()) {
    void patchnotesWindow.loadFile(path.join(__dirname, 'patchnotes.html'), { query: { loc: locale } });
  }
}

// --- credits popup ---------------------------------------------------------

export function loadCredits(win: BrowserWindow, locale: Locale): void {
  void win.loadFile(path.join(__dirname, 'credits.html'), { query: { loc: locale } });
}

export function openCredits(locale: Locale): void {
  if (creditsWindow && !creditsWindow.isDestroyed()) {
    creditsWindow.show();
    creditsWindow.focus();
    return;
  }
  creditsWindow = new BrowserWindow({
    width: 380,
    height: 286, // web-content height (useContentSize) — fits the credits layout
    useContentSize: true,
    title: t(locale, 'credits'),
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
  loadCredits(creditsWindow, locale);
  creditsWindow.on('closed', () => {
    creditsWindow = null;
  });
}

// In-app patch notes: a window that lists the itch.io devlog and shows each post's
// full body (main does the fetching; see devlog.ts). Links open in the browser.
export function openPatchnotesWindow(locale: Locale): void {
  if (patchnotesWindow && !patchnotesWindow.isDestroyed()) {
    patchnotesWindow.show();
    patchnotesWindow.focus();
    return;
  }
  patchnotesWindow = new BrowserWindow({
    width: 660,
    height: 540,
    useContentSize: true,
    title: t(locale, 'patchnotes'),
    center: true,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const openExternal = (url: string) => {
    if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
  };
  patchnotesWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  patchnotesWindow.webContents.on('will-navigate', (e, url) => {
    e.preventDefault();
    openExternal(url);
  });
  void patchnotesWindow.loadFile(path.join(__dirname, 'patchnotes.html'), {
    query: { loc: locale },
  });
  patchnotesWindow.on('closed', () => {
    patchnotesWindow = null;
  });
}

// --- opacity slider window -------------------------------------------------

export function loadOpacity(win: BrowserWindow, locale: Locale): void {
  void win.loadFile(path.join(__dirname, 'opacity.html'), { query: { loc: locale } });
}

export function openOpacityWindow(locale: Locale): void {
  if (opacityWindow && !opacityWindow.isDestroyed()) {
    opacityWindow.show();
    opacityWindow.focus();
    return;
  }
  opacityWindow = new BrowserWindow({
    width: 320,
    height: 148,
    title: t(locale, 'opacity'),
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
  loadOpacity(opacityWindow, locale);
  opacityWindow.on('closed', () => {
    opacityWindow = null;
  });
}
