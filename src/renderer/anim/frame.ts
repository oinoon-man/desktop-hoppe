import type { IAnimator } from './types';
import type { Mode, PetManifest, ClipDef } from '../../shared/types';

// Prototype pipeline: plays PNG frame sequences described by a manifest.
// Assets live in dist/assets/prototype/ (copied from ./assets by the build) and
// are referenced same-origin so the tight CSP (img-src 'self') allows them.
const ASSET_BASE = './assets/prototype/';

interface LoadedClip {
  def: ClipDef;
  images: HTMLImageElement[];
}

export class FrameAnimator implements IAnimator {
  private clips = new Map<Mode, LoadedClip>();
  private clip: Mode | null = null;
  private frame = 0;
  private acc = 0; // ms accumulated toward the next frame

  /** Populate from the manifest sent by main; missing/empty -> hasClip() false. */
  load(manifest: PetManifest): void {
    this.clips.clear();
    for (const key of Object.keys(manifest.clips) as Mode[]) {
      const def = manifest.clips[key];
      if (!def || def.frames.length === 0) continue;
      const images = def.frames.map((f) => {
        const img = new Image();
        img.src = ASSET_BASE + f;
        return img;
      });
      this.clips.set(key, { def, images });
      // Report load result to the terminal (main forwards renderer console).
      void Promise.all(images.map((im) => im.decode().then(() => true, () => false))).then((res) => {
        const ok = res.filter(Boolean).length;
        console.log(`[frame] clip "${key}": ${ok}/${images.length} frames loaded`);
      });
    }
  }

  hasClip(clip: Mode): boolean {
    const c = this.clips.get(clip);
    if (!c) return false;
    // ready only once every frame has decoded, to avoid flashing blanks
    return c.images.every((im) => im.complete && im.naturalWidth > 0);
  }

  setClip(clip: Mode): void {
    if (clip === this.clip) return;
    this.clip = clip;
    this.frame = 0;
    this.acc = 0;
  }

  update(dtMs: number): void {
    if (this.clip === null) return;
    const c = this.clips.get(this.clip);
    if (!c) return;
    this.acc += dtMs;
    const frameMs = 1000 / Math.max(1, c.def.fps);
    while (this.acc >= frameMs) {
      this.acc -= frameMs;
      this.frame++;
    }
    const n = c.images.length;
    this.frame = c.def.loop ? this.frame % n : Math.min(this.frame, n - 1);
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, facing: number): void {
    if (this.clip === null) return;
    const c = this.clips.get(this.clip);
    if (!c) return;
    const img = c.images[this.frame];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    ctx.save();
    if (facing < 0) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
  }
}
