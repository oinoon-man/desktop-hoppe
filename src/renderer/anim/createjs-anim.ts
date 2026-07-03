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
        cjs.Ticker.addEventListener('tick', this.stage);
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
  }

  // The art is authored facing LEFT, so the baseline is mirrored to make it face
  // right; the sim's facing then flips it. `sleep` is exempt — it always keeps
  // its authored orientation (no left/right mirroring).
  private applyFacing(root: Any, mode: Mode): void {
    if (mode === 'sleep') {
      root.scaleX = 1;
      root.x = 0;
      return;
    }
    root.scaleX = this.facing < 0 ? 1 : -1;
    root.x = this.facing < 0 ? 0 : this.width;
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
  }

  /** Show/hide the whole art (used when a placeholder covers a state instead). */
  setVisible(on: boolean): void {
    if (this.container) this.container.visible = on;
  }

  private applyScale(): void {
    if (!this.stage) return;
    const dpr = window.devicePixelRatio || 1;
    this.stage.scaleX = dpr;
    this.stage.scaleY = dpr;
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
