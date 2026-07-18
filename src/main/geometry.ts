// ---------------------------------------------------------------------------
// Pure geometry for the pet simulation.
//
// These are the calculations that decide where the pet may stand, which display it
// belongs to, and whether the cursor is on it. They used to sit inside PetSim and read
// Electron's `screen` module directly, which made them impossible to test: every one of
// them needed a real display server. They take their inputs as plain data instead, so
// PetSim just supplies `screen.getAllDisplays().map(d => d.workArea)` and these stay
// verifiable on their own (see src/main/geometry.test.ts).
//
// Every function here is deterministic and side-effect free. Keep it that way.
// ---------------------------------------------------------------------------
import type { Rect } from '../shared/types';

/** A display's usable area (Electron's Display.workArea shape). */
export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Horizontal span the pet may occupy, as [lo, hi] positions for its left edge. */
export interface Span {
  lo: number;
  hi: number;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * The contiguous run of *adjacent* display work areas containing `cx` (or the nearest one
 * when `cx` falls in a gap between non-adjacent monitors), as left-edge bounds for a pet of
 * `size` px.
 *
 * Roaming used to span the union of every display, which includes the empty gaps between
 * monitors that aren't touching — the pet would walk into that void and get stuck. Limiting
 * it to a contiguous run keeps seam-crossing between touching monitors while making those
 * dead zones unreachable.
 */
export function walkableSpan(areas: Area[], cx: number, size: number): Span {
  if (areas.length === 0) return { lo: 0, hi: 0 };
  const sorted = [...areas].sort((a, b) => a.x - b.x);
  const x = Math.round(cx);
  let idx = sorted.findIndex((w) => x >= w.x && x < w.x + w.width);
  if (idx < 0) {
    // In a gap or past the outer edge: anchor to the nearest display by x-distance.
    idx = 0;
    let best = Infinity;
    sorted.forEach((w, i) => {
      const dist = x < w.x ? w.x - x : x - (w.x + w.width);
      if (dist < best) {
        best = dist;
        idx = i;
      }
    });
  }
  let lo = sorted[idx].x;
  let hi = sorted[idx].x + sorted[idx].width;
  // Extend across neighbours whose edges touch (within a rounding pixel or two).
  for (let i = idx - 1; i >= 0 && Math.abs(sorted[i].x + sorted[i].width - lo) <= 2; i--) lo = sorted[i].x;
  for (let i = idx + 1; i < sorted.length && Math.abs(sorted[i].x - hi) <= 2; i++) {
    hi = sorted[i].x + sorted[i].width;
  }
  return { lo, hi: hi - size };
}

/** Leftmost left-edge position across all displays. */
export function minX(areas: Area[]): number {
  let m = Infinity;
  for (const a of areas) m = Math.min(m, a.x);
  return m === Infinity ? 0 : m;
}

/** Rightmost left-edge position that still fits a pet of `size` px. */
export function maxX(areas: Area[], size: number): number {
  let m = -Infinity;
  for (const a of areas) m = Math.max(m, a.x + a.width);
  return (m === -Infinity ? size : m) - size;
}

/**
 * Is the cursor over the pet's grab region?
 *
 * The region is an ellipse over the ART, not the window: the art is `artSize` px, drawn
 * centred horizontally and flush to the bottom of the `size` px window, so below 100 % the
 * two differ a lot. Measuring against the window made the clickable area far larger than the
 * visible pet and offset above it — the feet weren't grabbable while empty space was.
 */
export function cursorOverPet(
  cursor: { x: number; y: number },
  pet: { x: number; y: number; size: number; artSize: number },
  grab: { cx: number; cy: number; rx: number; ry: number },
): boolean {
  const s = pet.artSize > 0 ? Math.min(pet.artSize, pet.size) : pet.size;
  const left = pet.x + (pet.size - s) / 2;
  const top = pet.y + (pet.size - s);
  const nx = (cursor.x - left - s * grab.cx) / (s * grab.rx);
  const ny = (cursor.y - top - s * grab.cy) / (s * grab.ry);
  return nx * nx + ny * ny <= 1;
}

/** Does `rect` horizontally contain the point `cx` (shelf/platform hit test)? */
export function spansX(rect: Rect, cx: number): boolean {
  return cx >= rect.x && cx <= rect.x + rect.w;
}
