// ---------------------------------------------------------------------------
// CreateJSAnimator — plays an Adobe Animate "HTML5 Canvas" (CreateJS) publish.
// Animate's motion tweens replay as smooth vector animation at runtime, so this
// is the "final" art path. The published Hoppe.js + createjs.min.js are loaded as
// classic <script>s (see index.html); here we find the stage-content symbol,
// preload its texture atlas, and let a CreateJS Ticker drive the pet canvas.
//
// When a composition is present this takes over rendering entirely; the frame /
// placeholder animators remain the fallback (offline, or no export yet).
//
// Uses `any` for the CreateJS runtime (no bundled type defs; loaded as globals).
/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

export class CreateJSAnimator {
  private readonly canvas: HTMLCanvasElement;
  private stage: Any = null;
  private root: Any = null;
  private width = 300;
  private ready = false;
  private labels = new Set<string>();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  /** Resolves true if an Animate composition loaded and is now driving the canvas. */
  init(basePath = './assets/animate/'): Promise<boolean> {
    const cjs: Any = (window as Any).createjs;
    const an: Any = (window as Any).AdobeAn;
    if (!cjs || !an || !an.compositions) return Promise.resolve(false);
    const ids = Object.keys(an.compositions);
    if (ids.length === 0) return Promise.resolve(false);

    const comp = an.getComposition(ids[0]);
    const lib = comp.getLibrary();
    const props = lib.properties || {};
    this.width = props.width || 300;

    const finish = (): boolean => {
      const rootName = this.findRootSymbol(lib);
      if (!rootName) {
        console.log('[createjs] could not find stage-content symbol');
        return false;
      }
      this.root = new lib[rootName]();
      this.stage = new lib.Stage(this.canvas);
      this.stage.addChild(this.root);
      try {
        const ls = this.root.labels || []; // [{ label, position }]
        this.labels = new Set(ls.map((l: Any) => l.label));
      } catch {
        /* no labels on this export -> single looping motion for all states */
      }
      this.applyScale();
      cjs.Ticker.framerate = props.fps || 30;
      cjs.Ticker.addEventListener('tick', this.stage);
      this.stage.update();
      this.ready = true;
      console.log(`[createjs] ready — comp ${ids[0]}, root "${rootName}", ${props.width}x${props.height}@${props.fps}fps`);
      return true;
    };

    return new Promise<boolean>((resolve) => {
      const manifest: Any[] = props.manifest || [];
      if (manifest.length === 0) {
        resolve(finish());
        return;
      }
      const queue = new cjs.LoadQueue(false, basePath);
      const images = comp.getImages();
      queue.addEventListener('fileload', (evt: Any) => {
        if (evt && evt.item && evt.item.type === 'image') images[evt.item.id] = evt.result;
      });
      queue.addEventListener('complete', () => {
        const ss = comp.getSpriteSheet();
        for (const m of lib.ssMetadata || []) {
          ss[m.name] = new cjs.SpriteSheet({ images: [queue.getResult(m.name)], frames: m.frames });
        }
        resolve(finish());
      });
      queue.addEventListener('error', (e: Any) => {
        console.log('[createjs] asset load error:', e && (e.title || e.message));
        resolve(false);
      });
      queue.loadManifest(manifest);
    });
  }

  /** The stage content is Animate's only `AnMovieClip`-derived symbol. */
  private findRootSymbol(lib: Any): string | null {
    const An = lib.AnMovieClip;
    if (!An) return null;
    for (const key of Object.keys(lib)) {
      const v = lib[key];
      if (typeof v === 'function' && v.prototype instanceof An) return key;
    }
    return null;
  }

  private applyScale(): void {
    if (!this.stage) return;
    const dpr = window.devicePixelRatio || 1;
    this.stage.scaleX = dpr;
    this.stage.scaleY = dpr;
  }

  isReady(): boolean {
    return this.ready;
  }

  /** Horizontal mirror to match the sim's facing (art authored facing right). */
  setFacing(facing: number): void {
    if (!this.ready || !this.root) return;
    this.root.scaleX = facing < 0 ? -1 : 1;
    this.root.x = facing < 0 ? this.width : 0;
  }

  /** Jump to a per-state label if the export defines one; else keep the loop. */
  setClip(clip: string): void {
    if (this.ready && this.root && this.labels.has(clip)) this.root.gotoAndPlay(clip);
  }

  /** Show/hide the animation (used when a placeholder covers a state instead). */
  setVisible(on: boolean): void {
    if (this.root) this.root.visible = on;
  }

  onResize(): void {
    if (!this.ready) return;
    this.applyScale();
    if (this.stage) this.stage.update();
  }
}
