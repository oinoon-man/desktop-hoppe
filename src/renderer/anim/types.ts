import type { Mode } from '../../shared/types';

// A swappable animation source. The prototype uses PlaceholderAnimator (procedural)
// and FrameAnimator (PNG sequences); the final phase adds a CreateJS-backed one for
// the Adobe Animate output. The view picks a source per-clip, so art can be added
// incrementally (e.g. real frames for `walk`, placeholder for the rest).
export interface IAnimator {
  /** True if this source can render the given clip right now (loaded & present). */
  hasClip(clip: Mode): boolean;
  /** Switch the active clip (resets frame/timeline if it actually changed). */
  setClip(clip: Mode): void;
  /** Advance internal time by the elapsed milliseconds. */
  update(dtMs: number): void;
  /** Draw the current frame into a w×h box; facing -1 mirrors horizontally. */
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, facing: number): void;
}
