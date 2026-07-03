import { BrowserWindow, screen } from 'electron';
import type { Mode, PetState, Rect } from '../shared/types';

// ---------------------------------------------------------------------------
// PetSim — the pet's simulation, run in the MAIN process in screen coordinates.
// Owns position/velocity, gravity/throw physics, and the movement state machine
// (idle / walk / drag / fall / land / sleep). It drives the window position and
// notifies the renderer whenever the mode or facing changes.
//
// Position (x, y) == the window top-left; the pet's feet are at the window bottom.
// "Shelves" (M3) are the top edges of other windows, supplied via setPlatforms();
// the pet can land, stand, walk on, and ride them. The screen work-area bottom is
// the ultimate floor. Support is resolved per-tick from the pet's feet + center.
// ---------------------------------------------------------------------------

const TICK_MS = 16;
const GRAVITY = 2600; // px/s^2
const WALK_SPEED = 74; // px/s
const WALL_BOUNCE = 0.4;
const MAX_SPEED = 3200; // clamp throw velocity (px/s)
const SUPPORT_SNAP = 16; // px tolerance for staying on / riding a shelf
const LAND_MS = 500; // play the land motion and hold it 0.5s after a thrown pet touches down
const DWELL_MIN_MS = 1500;
const DWELL_RAND_MS = 2500;
// When an idle dwell ends, weighted choice: walk, nap, or keep idling.
const WALK_CHANCE = 0.5;
const SLEEP_CHANCE = 0.14; // naps are less frequent now
// Once asleep, hold it 10–30s (random). Only user interaction (a grab) or the
// shelf vanishing wakes the pet before then.
const SLEEP_MIN_MS = 10000;
const SLEEP_RAND_MS = 20000;

// Grab region in window-local coords, as fractions of the window size (see
// cursorOverPet). Approximates the character so it stays grabbable while moving.
const GRAB_CX = 0.5;
const GRAB_CY = 0.58;
const GRAB_RX = 0.33;
const GRAB_RY = 0.36;

interface Support {
  feet: number; // screen y where the pet's feet rest
  rect: Rect | null; // the window shelf, or null for the screen floor
}

export class PetSim {
  private readonly win: BrowserWindow;
  private readonly size: number;

  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;
  private mode: Mode = 'idle';
  private facing: 1 | -1 = 1;

  private lastT = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  // window shelves (screen rects) the pet can stand on; updated by the watcher
  private platforms: Rect[] = [];
  private supportRect: Rect | null = null; // what the pet is currently standing on

  // drag bookkeeping
  private grabOffX = 0;
  private grabOffY = 0;
  private prevCursorX = 0;
  private prevCursorY = 0;

  // idle/walk scheduling
  private dwellUntil = 0;
  private walkTargetX = 0;

  // land / sleep timing
  private landUntil = 0;
  private sleepUntil = 0;

  // click-through state (main owns it so the pet is grabbable while moving).
  private ignore = true;

  // verbose landing logs for --climbtest
  private debug = false;

  constructor(win: BrowserWindow, size: number) {
    this.win = win;
    this.size = size;
  }

  start(): void {
    const wa = screen.getPrimaryDisplay().workArea;
    this.x = wa.x + wa.width - this.size - 48;
    this.y = this.floorFeet() - this.size;
    this.supportRect = null;
    this.applyPosition();
    this.mode = 'idle';
    this.scheduleIdle(now());
    this.send();
    this.lastT = now();
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Latest window shelves, in screen coords (from the Win32 watcher). */
  setPlatforms(rects: Rect[]): void {
    this.platforms = rects;
  }

  /** Re-place the pet at its spawn spot (for "실종된 애 불러오기"). */
  resetPosition(index = 0): void {
    const wa = screen.getPrimaryDisplay().workArea;
    this.x = Math.max(wa.x, wa.x + wa.width - this.size - 48 - index * 80);
    this.y = this.floorFeet() - this.size;
    this.vx = 0;
    this.vy = 0;
    this.supportRect = null;
    this.setMode('idle');
    this.scheduleIdle(now());
    this.applyPosition();
  }

  setDebug(on: boolean): void {
    this.debug = on;
  }

  /** Test helper: drop the pet from just above a shelf to verify climbing. */
  debugDropOnto(rect: Rect): void {
    this.x = rect.x + rect.w / 2 - this.size / 2;
    this.y = rect.y - 140 - this.size;
    this.vx = 0;
    this.vy = 0;
    this.supportRect = null;
    this.setMode('fall');
  }

  // --- input from the renderer --------------------------------------------

  onGrab(): void {
    const c = screen.getCursorScreenPoint();
    this.grabOffX = c.x - this.x;
    this.grabOffY = c.y - this.y;
    this.prevCursorX = c.x;
    this.prevCursorY = c.y;
    this.vx = 0;
    this.vy = 0;
    this.setMode('drag');
  }

  onRelease(): void {
    // Resting gently on a surface -> land there; otherwise fling.
    const s = this.supportUnder(this.centerX(), this.feetY());
    if (s && Math.abs(this.vy) < 220) {
      this.y = s.feet - this.size;
      this.supportRect = s.rect;
      this.beginLand();
    } else {
      if (this.vx !== 0) this.setFacing(this.vx < 0 ? -1 : 1);
      this.setMode('fall');
    }
  }

  // --- geometry ------------------------------------------------------------

  private workArea() {
    return screen.getPrimaryDisplay().workArea;
  }
  private feetY(): number {
    return this.y + this.size;
  }
  private centerX(): number {
    return this.x + this.size / 2;
  }
  private floorFeet(): number {
    const wa = this.workArea();
    return wa.y + wa.height;
  }
  private minX(): number {
    return this.workArea().x;
  }
  private maxX(): number {
    const wa = this.workArea();
    return wa.x + wa.width - this.size;
  }

  private spans(p: Rect, cx: number): boolean {
    return cx >= p.x && cx <= p.x + p.w;
  }

  /** Highest surface whose top the feet cross while descending fPrev -> fNext. */
  private landingSurface(cx: number, fPrev: number, fNext: number): Support | null {
    let best: Support | null = null;
    const consider = (feet: number, rect: Rect | null) => {
      if (feet >= fPrev - 1 && feet <= fNext && (!best || feet < best.feet)) best = { feet, rect };
    };
    for (const p of this.platforms) if (this.spans(p, cx)) consider(p.y, p);
    consider(this.floorFeet(), null);
    return best;
  }

  /** Surface nearest the feet within SUPPORT_SNAP (for standing / riding). */
  private supportUnder(cx: number, feet: number): Support | null {
    let best: Support | null = null;
    const consider = (f: number, rect: Rect | null) => {
      if (Math.abs(f - feet) > SUPPORT_SNAP) return;
      if (!best || Math.abs(f - feet) < Math.abs(best.feet - feet)) best = { feet: f, rect };
    };
    for (const p of this.platforms) if (this.spans(p, cx)) consider(p.y, p);
    consider(this.floorFeet(), null);
    return best;
  }

  private applyPosition(): void {
    if (this.win.isDestroyed()) return;
    // Electron's native setPosition throws ("conversion failure from …") on any
    // non-finite argument. A single NaN/Infinity from a physics edge (e.g. a
    // display reconfiguration or resume-from-sleep mid-fall) must never crash the
    // main process — repair to the floor and carry on instead.
    if (!Number.isFinite(this.x) || !Number.isFinite(this.y)) {
      console.log('[sim] non-finite position repaired:', this.x, this.y);
      const wa = this.workArea();
      if (!Number.isFinite(this.x)) this.x = wa.x + wa.width - this.size - 48;
      this.y = this.floorFeet() - this.size;
      this.vx = 0;
      this.vy = 0;
      this.supportRect = null;
    }
    this.win.setPosition(Math.round(this.x), Math.round(this.y));
  }

  // --- click-through (grabbable-while-moving) ------------------------------

  private cursorOverPet(): boolean {
    const c = screen.getCursorScreenPoint();
    const nx = (c.x - this.x - this.size * GRAB_CX) / (this.size * GRAB_RX);
    const ny = (c.y - this.y - this.size * GRAB_CY) / (this.size * GRAB_RY);
    return nx * nx + ny * ny <= 1;
  }
  private setIgnore(next: boolean): void {
    if (next === this.ignore) return;
    this.ignore = next;
    if (!this.win.isDestroyed()) this.win.setIgnoreMouseEvents(next);
  }
  private updateClickThrough(): void {
    this.setIgnore(this.mode === 'drag' ? false : !this.cursorOverPet());
  }

  // --- state transitions ---------------------------------------------------

  private setMode(m: Mode): void {
    if (m === this.mode) return;
    this.mode = m;
    this.send();
  }
  private setFacing(f: 1 | -1): void {
    if (f === this.facing) return;
    this.facing = f;
    this.send();
  }
  private send(): void {
    if (this.win.isDestroyed()) return;
    const state: PetState = { mode: this.mode, facing: this.facing };
    this.win.webContents.send('state', state);
  }
  private beginLand(): void {
    this.vx = 0;
    this.vy = 0;
    this.landUntil = now() + LAND_MS;
    this.setMode('land');
  }
  private fallOff(carryVx: number): void {
    if (this.debug) console.log('[sim] fell off support');
    this.supportRect = null;
    this.vx = carryVx;
    this.vy = 0;
    this.setMode('fall');
  }
  private scheduleIdle(t: number): void {
    this.dwellUntil = t + DWELL_MIN_MS + Math.random() * DWELL_RAND_MS;
  }

  // --- main loop -----------------------------------------------------------

  private tick(): void {
    const t = now();
    let dt = (t - this.lastT) / 1000;
    this.lastT = t;
    if (dt > 0.05) dt = 0.05; // clamp hitches so physics stays stable

    switch (this.mode) {
      case 'drag':
        this.tickDrag(dt);
        break;
      case 'fall':
        this.tickFall(dt);
        break;
      case 'land':
        if (!this.rideSupport()) break; // fell (shelf vanished) -> now falling
        if (t >= this.landUntil) {
          this.setMode('idle');
          this.scheduleIdle(t);
        }
        break;
      case 'walk':
        this.tickWalk(dt, t);
        break;
      case 'sleep':
        if (!this.rideSupport()) break;
        if (t >= this.sleepUntil) {
          this.setMode('idle');
          this.scheduleIdle(t);
        }
        break;
      case 'idle':
        this.tickIdle(t);
        break;
    }
    this.applyPosition();
    this.updateClickThrough();
  }

  /** Keep resting on (and follow) the current support; return false if it's gone. */
  private rideSupport(): boolean {
    const s = this.supportUnder(this.centerX(), this.feetY());
    if (!s) {
      this.fallOff(0);
      return false;
    }
    this.y = s.feet - this.size;
    this.supportRect = s.rect;
    return true;
  }

  private tickDrag(dt: number): void {
    const c = screen.getCursorScreenPoint();
    const instVx = (c.x - this.prevCursorX) / Math.max(dt, 0.001);
    const instVy = (c.y - this.prevCursorY) / Math.max(dt, 0.001);
    this.vx = this.vx * 0.5 + instVx * 0.5;
    this.vy = this.vy * 0.5 + instVy * 0.5;
    this.prevCursorX = c.x;
    this.prevCursorY = c.y;
    this.x = c.x - this.grabOffX;
    this.y = c.y - this.grabOffY;
  }

  private tickFall(dt: number): void {
    this.vy += GRAVITY * dt;
    this.vx = clamp(this.vx, -MAX_SPEED, MAX_SPEED);
    this.vy = clamp(this.vy, -MAX_SPEED, MAX_SPEED);
    const fPrev = this.feetY();
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const minx = this.minX();
    const maxx = this.maxX();
    if (this.x < minx) {
      this.x = minx;
      this.vx = -this.vx * WALL_BOUNCE;
      this.setFacing(1);
    } else if (this.x > maxx) {
      this.x = maxx;
      this.vx = -this.vx * WALL_BOUNCE;
      this.setFacing(-1);
    }

    if (this.vy > 0) {
      const s = this.landingSurface(this.centerX(), fPrev, this.feetY());
      if (s) {
        this.y = s.feet - this.size;
        this.supportRect = s.rect;
        // No floor bounce: settle straight into the land motion on any impact, so
        // the land clip plays once instead of stuttering through several tiny hops.
        if (this.debug) {
          const r = s.rect;
          console.log('[sim] landed on', r ? `shelf @${r.x},${r.y} ${r.w}x${r.h}` : 'floor');
        }
        this.beginLand();
      }
    }

    // Hard floor: the work-area bottom is an absolute lower bound. landingSurface
    // only catches a surface the feet *cross* this tick, so if the pet was let go
    // below the floor line moving down it would never land and sink off-screen.
    // Snap it back up to the floor and settle instead.
    if (this.mode === 'fall' && this.feetY() > this.floorFeet()) {
      this.y = this.floorFeet() - this.size;
      this.supportRect = null;
      this.beginLand();
    }
  }

  private tickWalk(dt: number, t: number): void {
    const dir: 1 | -1 = this.walkTargetX >= this.x ? 1 : -1;
    this.setFacing(dir);
    this.x += dir * WALK_SPEED * dt;

    const s = this.supportUnder(this.centerX(), this.feetY());
    if (!s) {
      this.fallOff(dir * WALK_SPEED * 0.6); // step off the edge and drop
      return;
    }
    this.y = s.feet - this.size;
    this.supportRect = s.rect;

    if ((dir === 1 && this.x >= this.walkTargetX) || (dir === -1 && this.x <= this.walkTargetX)) {
      this.x = this.walkTargetX;
      this.setMode('idle');
      this.scheduleIdle(t);
    }
  }

  private tickIdle(t: number): void {
    if (!this.rideSupport()) return;
    if (t < this.dwellUntil) return;
    const r = Math.random();
    if (r < WALK_CHANCE) {
      this.walkTargetX = this.pickWalkTarget();
      this.setMode('walk');
    } else if (r < WALK_CHANCE + SLEEP_CHANCE) {
      this.sleepUntil = t + SLEEP_MIN_MS + Math.random() * SLEEP_RAND_MS;
      this.setMode('sleep');
    } else {
      this.scheduleIdle(t);
    }
  }

  /** A wander target for `x`, kept within the current shelf (or the screen floor). */
  private pickWalkTarget(): number {
    let lo: number;
    let hi: number;
    if (this.supportRect) {
      lo = this.supportRect.x - this.size / 2 + 10;
      hi = this.supportRect.x + this.supportRect.w - this.size / 2 - 10;
    } else {
      lo = this.minX();
      hi = this.maxX();
    }
    if (hi < lo) hi = lo;
    return lo + Math.random() * (hi - lo);
  }
}

function now(): number {
  return performance.now();
}
function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
