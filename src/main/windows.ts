import type { Rect } from '../shared/types';
import koffi from 'koffi';

// ---------------------------------------------------------------------------
// Win32 window enumeration via koffi FFI — no native compilation required.
// Returns rects of visible, non-minimized, non-cloaked top-level app windows,
// whose top edges the sim treats as shelves the pet can stand / walk on.
// If FFI init fails (unsupported runtime), everything degrades to "no shelves"
// and the pet simply uses the screen floor.
// ---------------------------------------------------------------------------

const DWMWA_CLOAKED = 14;
const MIN_W = 120;
const MIN_H = 60;
// Own pet windows are titled "Hoppe"; the desktop shell is "Program Manager".
const SKIP_TITLES = new Set(['Hoppe', 'Program Manager']);

let ready = false;
let k: any = null;
let EnumWindows: any;
let GetWindowRect: any;
let IsWindowVisible: any;
let IsIconic: any;
let GetWindowTextLengthW: any;
let GetWindowTextW: any;
let DwmGetWindowAttribute: any;
let enumCb: any = null;
let collected: any[] = [];

export function initWindows(): boolean {
  if (ready) return true;
  try {
    k = koffi;
    const user32 = k.load('user32.dll');
    const dwmapi = k.load('dwmapi.dll');
    k.struct('RECT', { left: 'long', top: 'long', right: 'long', bottom: 'long' });
    EnumWindows = user32.func('bool EnumWindows(void *proc, intptr_t lparam)');
    GetWindowRect = user32.func('bool GetWindowRect(void *hwnd, _Out_ RECT *rect)');
    IsWindowVisible = user32.func('bool IsWindowVisible(void *hwnd)');
    IsIconic = user32.func('bool IsIconic(void *hwnd)');
    GetWindowTextLengthW = user32.func('int GetWindowTextLengthW(void *hwnd)');
    GetWindowTextW = user32.func('int GetWindowTextW(void *hwnd, _Out_ void *buf, int max)');
    DwmGetWindowAttribute = dwmapi.func(
      'int DwmGetWindowAttribute(void *hwnd, uint attr, _Out_ void *val, uint size)',
    );
    const CB = k.proto('bool CB(void *hwnd, intptr_t lparam)');
    enumCb = k.register((h: any) => {
      collected.push(h);
      return true;
    }, k.pointer(CB));
    ready = true;
  } catch (e) {
    console.log('[windows] FFI init failed; window-climbing disabled:', (e as Error).message);
    ready = false;
  }
  return ready;
}

export function isReady(): boolean {
  return ready;
}

function titleOf(h: any): string {
  const n = GetWindowTextLengthW(h);
  if (n <= 0) return '';
  const buf = Buffer.alloc((n + 1) * 2);
  GetWindowTextW(h, buf, n + 1);
  return buf.toString('utf16le').replace(/\0.*$/, '');
}
function isCloaked(h: any): boolean {
  const out = Buffer.alloc(4);
  const hr = DwmGetWindowAttribute(h, DWMWA_CLOAKED, out, 4);
  return hr === 0 && out.readInt32LE(0) !== 0;
}

export function enumerateShelves(): Rect[] {
  if (!ready) return [];
  collected = [];
  EnumWindows(enumCb, 0);
  const rects: Rect[] = [];
  for (const h of collected) {
    if (!IsWindowVisible(h) || IsIconic(h)) continue;
    const t = titleOf(h);
    if (!t || SKIP_TITLES.has(t)) continue;
    if (isCloaked(h)) continue;
    const r: any = {};
    if (!GetWindowRect(h, r)) continue;
    const w = r.right - r.left;
    const hh = r.bottom - r.top;
    if (w < MIN_W || hh < MIN_H) continue;
    rects.push({ x: r.left, y: r.top, w, h: hh });
  }
  return rects;
}

/** Polls the window layout and pushes shelves to a consumer (e.g. the sim). */
export class WindowWatcher {
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly onUpdate: (rects: Rect[]) => void;

  constructor(onUpdate: (rects: Rect[]) => void) {
    this.onUpdate = onUpdate;
  }

  start(intervalMs = 125): void {
    const poll = () => this.onUpdate(enumerateShelves());
    poll();
    this.timer = setInterval(poll, intervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
