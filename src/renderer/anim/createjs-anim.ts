// ---------------------------------------------------------------------------
// CreateJSAnimator — plays the Adobe Animate "HTML5 Canvas" (CreateJS) art.
// The art ships as one published composition PER motion (standing/run/grab/
// fall/land/sleep — see assets/animate/motions/*.js, loaded as classic <script>s
// in index.html). Each composition registers itself in AdobeAn.compositions; we
// map each to a pet Mode, preload its texture atlas, instantiate its root symbol
// once, and swap which one is visible as the state changes. Animate's own motion
// tweens carry the animation, so the app only loops — no app-side bounce.
//
// Uses `any` for the CreateJS runtime (no bundled type defs; loaded as globals).
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mode } from '../../shared/types';

type Any = any;

// Motion name (fla / atlas prefix) -> pet Mode.
const MOTION_STATE: Record<string, Mode> = {
  standing: 'idle',
  run: 'walk',
  grab: 'drag',
  fall: 'fall',
  land: 'land',
  sleep: 'sleep',
};

interface Clip {
  root: Any; // instantiated root MovieClip for this state
}

export class CreateJSAnimator {
  private readonly canvas: HTMLCanvasElement;
  private stage: Any = null;
  private container: Any = null;
  private width = 300;
  private ready = false;
  private clips = new Map<Mode, Clip>();
  private current: Mode | null = null;
  private pending: Mode = 'idle';
  private facing = 1;
  private lastLandAt = 0; // debounce crouch restarts on rapid re-lands
  private renderPaused = false; // Ticker detached while the window is hidden
  private petSize = 0; // intended pet px from main; scale the art from this, not the window
  private flip = new Set<Mode>(); // motions whose art is authored facing the other way

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  /** Resolves true once at least one motion composition is driving the canvas. */
  init(basePath = './assets/animate/motions/'): Promise<boolean> {
    const cjs: Any = (window as Any).createjs;
    const an: Any = (window as Any).AdobeAn;
    if (!cjs || !an || !an.compositions) return Promise.resolve(false);
    const ids = Object.keys(an.compositions);
    if (ids.length === 0) return Promise.resolve(false);

    // Describe each composition: which motion/state it is, its lib and props.
    const descs = ids
      .map((id) => {
        const comp = an.getComposition(id);
        const lib = comp.getLibrary();
        const props = lib.properties || {};
        const motion = motionFromManifest(props.manifest);
        return { comp, lib, props, motion, mode: MOTION_STATE[motion] };
      })
      .filter((d) => d.mode);
    if (descs.length === 0) return Promise.resolve(false);

    this.width = descs[0].props.width || 300;
    const fps = descs[0].props.fps || 30;

    return Promise.all(descs.map((d) => this.loadComp(cjs, d, basePath)))
      .then(() => {
        this.stage = new cjs.Stage(this.canvas);
        this.container = new cjs.Container();
        this.stage.addChild(this.container);

        for (const d of descs) {
          const rootName = typeof d.lib[d.motion] === 'function' ? d.motion : findRootSymbol(d.lib);
          if (!rootName) continue;
          const root = new d.lib[rootName]();
          root.visible = false;
          this.container.addChild(root);
          this.clips.set(d.mode as Mode, { root });
        }
        if (this.clips.size === 0) return false;

        this.applyScale();
        cjs.Ticker.framerate = fps;
        // Drive ticks from a timer, not requestAnimationFrame. This overlay is never
        // focused (focusable:false), and Chromium pauses/throttles rAF for a non-focused
        // window — which froze the pet mid-motion (the "일시정지" bug). TIMEOUT keeps
        // advancing while the window is visible; we still fully detach when it's hidden
        // (below). Unlike 1.0.3's backgroundThrottling:false, this doesn't disable
        // Chromium's occlusion handling, so it can't bring back the compositor RAM runaway.
        cjs.Ticker.timingMode = cjs.Ticker.TIMEOUT;
        cjs.Ticker.addEventListener('tick', this.stage);
        // Stop compositing entirely while the window is hidden (tray "숨기기" /
        // minimized): detach the stage from the Ticker so a hidden pet costs no
        // GPU/CPU. This is unrelated to the unfocused-but-visible case (which must
        // keep rendering to avoid the frozen-pose bug) — document.hidden is only
        // true when the window is actually not shown.
        document.addEventListener('visibilitychange', () => {
          if (!this.ready || !this.stage) return;
          const c: Any = (window as Any).createjs;
          if (document.hidden && !this.renderPaused) {
            c.Ticker.removeEventListener('tick', this.stage);
            this.renderPaused = true;
          } else if (!document.hidden && this.renderPaused) {
            c.Ticker.addEventListener('tick', this.stage);
            this.renderPaused = false;
            this.stage.update();
          }
        });
        this.ready = true;
        this.show(this.pending);
        this.stage.update();
        console.log(`[createjs] ready — ${this.clips.size} motions: ${[...this.clips.keys()].join(', ')}`);
        return true;
      })
      .catch((e) => {
        console.log('[createjs] init error:', e && (e.message || e));
        return false;
      });
  }

  /** Preload one composition's texture atlas and build its sprite sheets. */
  private loadComp(cjs: Any, d: Any, basePath: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const manifest: Any[] = d.props.manifest || [];
      if (manifest.length === 0) {
        resolve();
        return;
      }
      const images = d.comp.getImages();
      const ss = d.comp.getSpriteSheet();
      const queue = new cjs.LoadQueue(false, basePath);
      queue.addEventListener('fileload', (evt: Any) => {
        if (evt && evt.item && evt.item.type === 'image') images[evt.item.id] = evt.result;
      });
      queue.addEventListener('complete', () => {
        for (const m of d.lib.ssMetadata || []) {
          ss[m.name] = new cjs.SpriteSheet({ images: [queue.getResult(m.name)], frames: m.frames });
        }
        resolve();
      });
      queue.addEventListener('error', () => resolve()); // don't block other motions
      queue.loadManifest(manifest);
    });
  }

  isReady(): boolean {
    return this.ready;
  }

  /** Horizontal mirror to match the sim's facing. */
  setFacing(facing: number): void {
    this.facing = facing < 0 ? -1 : 1;
    if (this.current) {
      const c = this.clips.get(this.current);
      if (c) this.applyFacing(c.root, this.current);
    }
    if (this.stage) this.stage.update(); // repaint now, don't wait for the next tick
  }

  // The baseline art is authored facing LEFT, so it's mirrored to make it face right and
  // the sim's facing then flips it. Some characters author a motion facing the other way
  // (`flip`); that inverts the mirror. `sleep` is exempt from facing — it keeps a fixed
  // orientation (but `flip` still mirrors a sleep authored the other way).
  private applyFacing(root: Any, mode: Mode): void {
    const flipped = this.flip.has(mode);
    if (mode === 'sleep') {
      root.scaleX = flipped ? -1 : 1;
      root.x = flipped ? this.width : 0;
      return;
    }
    // Mirror when the way we want to face differs from the way the art is authored.
    const mirror = this.facing >= 0 !== flipped;
    root.scaleX = mirror ? -1 : 1;
    root.x = mirror ? this.width : 0;
  }

  /** Swap to the composition for `clip` (restarts it from frame 0). */
  setClip(clip: string): void {
    const mode = clip as Mode;
    if (!this.ready) {
      this.pending = mode;
      return;
    }
    this.show(mode);
  }

  private show(mode: Mode): void {
    if (this.current === mode) return;
    // Never silently keep a stale clip (e.g. stay stuck on 'fall' while the pet is
    // walking): if this state's art is missing, fall back to idle / any loaded
    // motion rather than leaving the previous one on screen.
    const have = this.clips.get(mode);
    const next = have || this.clips.get('idle') || this.clips.values().next().value;
    if (!next) return; // no motions loaded at all
    const prev = this.current ? this.clips.get(this.current) : null;
    if (prev && prev !== next) prev.root.visible = false;
    next.root.visible = true;
    this.applyFacing(next.root, mode);
    // `land` is a one-shot settle: play once and hold the final (standing) frame.
    // On a *rapid* re-land — a transient support miss re-enters land within a few
    // ticks — DON'T restart from frame 0, or the crouch frame flashes again while
    // the pet is already standing; just resume (holds the last frame). Genuine
    // landings (seconds apart) still restart the full crouch→stand. Other motions
    // keep their default looping — we must NOT touch their .loop.
    if (mode === 'land' && have) {
      next.root.loop = false;
      const t = Date.now();
      const rapid = t - this.lastLandAt < 350;
      this.lastLandAt = t;
      if (rapid) {
        if (typeof next.root.play === 'function') next.root.play();
      } else if (typeof next.root.gotoAndPlay === 'function') {
        next.root.gotoAndPlay(0);
      }
    } else if (typeof next.root.gotoAndPlay === 'function') {
      next.root.gotoAndPlay(0);
    }
    this.current = mode;
    if (this.stage) this.stage.update(); // repaint immediately so a throttled Ticker can't leave a stale frame
  }

  /** Show/hide the whole art (used when a placeholder covers a state instead). */
  setVisible(on: boolean): void {
    if (this.container) this.container.visible = on;
  }

  /** Intended pet size in px (from main) — the art scales from this, never the
   *  window, which drifts/grows on fractional-DPI displays. */
  setPetSize(size: number): void {
    this.petSize = size > 0 ? size : this.width;
  }

  /** Motions whose art is authored facing the opposite way (mirror them). Set before init. */
  setFlip(modes: Mode[] | undefined): void {
    this.flip = new Set(modes);
  }

  /** Debug: each loaded motion's rendered bounds (to spot art that overflows the frame). */
  getClipBounds(): Record<string, { x: number; y: number; w: number; h: number } | null> {
    const out: Record<string, { x: number; y: number; w: number; h: number } | null> = {};
    for (const [mode, clip] of this.clips) {
      const b = clip.root.nominalBounds || (clip.root.getBounds && clip.root.getBounds());
      out[mode] = b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null;
    }
    return out;
  }

  private applyScale(): void {
    if (!this.stage) return;
    const dpr = window.devicePixelRatio || 1;
    // Fit the authored-size art (this.width, e.g. 300) into the INTENDED pet size,
    // not window.innerWidth: a fractional-DPI window silently grows, and scaling off
    // it ballooned the pet off-screen. petSize is authoritative (main pushes it).
    const fit = (this.petSize || this.width) / this.width;
    this.stage.scaleX = dpr * fit;
    this.stage.scaleY = dpr * fit;
  }

  onResize(): void {
    if (!this.ready) return;
    this.applyScale();
    if (this.stage) this.stage.update();
  }
}

/** Derive the motion name from a composition's first atlas, e.g.
 *  "images/standing_atlas_1.png" -> "standing". */
function motionFromManifest(manifest: Any[]): string {
  if (!manifest || manifest.length === 0) return '';
  const src = String(manifest[0].src || '');
  const m = src.match(/([A-Za-z]+)_atlas/);
  return m ? m[1] : '';
}

/** Fallback: the stage-content symbol is Animate's `AnMovieClip`-derived one. */
function findRootSymbol(lib: Any): string | null {
  const An = lib.AnMovieClip;
  if (!An) return null;
  for (const key of Object.keys(lib)) {
    const v = lib[key];
    if (typeof v === 'function' && v.prototype instanceof An) return key;
  }
  return null;
}
