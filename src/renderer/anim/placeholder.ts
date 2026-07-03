import type { IAnimator } from './types';
import type { Mode } from '../../shared/types';

// Procedural stand-in art. Every mode animates differently so the state machine
// is visible before any real frames exist. Replaced per-clip by FrameAnimator
// (prototype) and later the Adobe Animate / CreateJS source (final).
export class PlaceholderAnimator implements IAnimator {
  private t = 0; // ms, global
  private ct = 0; // ms since current clip started
  private clip: Mode = 'idle';

  hasClip(): boolean {
    return true; // placeholder can render anything
  }

  setClip(clip: Mode): void {
    if (clip === this.clip) return;
    this.clip = clip;
    this.ct = 0;
  }

  update(dtMs: number): void {
    this.t += dtMs;
    this.ct += dtMs;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, facing: number): void {
    const cx = w / 2;
    const cy = h * 0.6;
    const r = Math.min(w, h) * 0.26;

    let sx = 1;
    let sy = 1;
    let rot = 0;
    let dy = 0;
    let eyes: EyeStyle = 'normal';
    let mouth: MouthStyle = 'smile';

    switch (this.clip) {
      case 'idle': {
        const b = Math.sin(this.t / 450);
        dy = b * 6;
        sy = 1 + b * 0.02;
        sx = 1 - b * 0.02;
        eyes = blink(this.t) ? 'blink' : 'normal';
        break;
      }
      case 'walk': {
        const p = this.t / 130;
        dy = -Math.abs(Math.sin(p)) * 9;
        rot = Math.sin(p) * 0.07 * facing;
        sx = 1 + Math.sin(p * 2) * 0.02;
        break;
      }
      case 'drag': {
        sy = 1.14;
        sx = 0.9;
        dy = -8 + Math.sin(this.t / 120) * 3;
        rot = Math.sin(this.t / 200) * 0.06;
        eyes = 'wide';
        mouth = 'o';
        break;
      }
      case 'fall': {
        rot = Math.sin(this.t / 110) * 0.5;
        sy = 1.06;
        sx = 0.95;
        eyes = 'wide';
        mouth = 'o';
        break;
      }
      case 'land': {
        const k = Math.max(0, 1 - this.ct / 180); // 1 -> 0 over ~180ms
        sy = 1 - 0.28 * k;
        sx = 1 + 0.28 * k;
        eyes = 'happy';
        break;
      }
      case 'sleep': {
        const b = Math.sin(this.t / 900);
        dy = b * 4;
        sy = 1 + b * 0.015;
        sx = 1 - b * 0.015;
        eyes = 'closed';
        break;
      }
    }

    // ground shadow (unscaled, kept faint so it doesn't capture the mouse)
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.82, r * 0.95, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy + dy);
    if (facing < 0) ctx.scale(-1, 1);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    drawBody(ctx, r);
    drawFace(ctx, r, eyes, mouth);
    ctx.restore();
  }
}

type EyeStyle = 'normal' | 'blink' | 'wide' | 'happy' | 'closed';
type MouthStyle = 'smile' | 'o';

function blink(t: number): boolean {
  return Math.sin(t / 1600) > 0.985;
}

function drawBody(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.fillStyle = '#bfe6ff';
  ctx.strokeStyle = '#5b7fa6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 1.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawFace(ctx: CanvasRenderingContext2D, r: number, eyes: EyeStyle, mouth: MouthStyle): void {
  const eyeDX = r * 0.4;
  const eyeDY = -r * 0.06;
  const baseR = r * 0.13;

  ctx.fillStyle = '#2b2b2b';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 3;

  for (const s of [-1, 1]) {
    const ex = s * eyeDX;
    if (eyes === 'happy' || eyes === 'closed') {
      // happy = upward arc "^_^"; closed = gentle downward lid for sleeping
      ctx.beginPath();
      if (eyes === 'happy') ctx.arc(ex, eyeDY + baseR * 0.4, baseR, Math.PI * 1.15, Math.PI * 1.85);
      else ctx.arc(ex, eyeDY - baseR * 0.3, baseR, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      continue;
    }
    const ry = eyes === 'blink' ? baseR * 0.14 : eyes === 'wide' ? baseR * 1.25 : baseR;
    const rx = eyes === 'wide' ? baseR * 1.1 : baseR;
    ctx.beginPath();
    ctx.ellipse(ex, eyeDY, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    if (eyes !== 'blink') {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ex + rx * 0.3, eyeDY - ry * 0.35, baseR * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2b2b';
    }
  }

  // blush
  ctx.fillStyle = 'rgba(255,150,160,0.5)';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(s * r * 0.58, r * 0.26, r * 0.14, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // mouth
  ctx.strokeStyle = '#2b2b2b';
  ctx.fillStyle = '#2b2b2b';
  ctx.lineWidth = 2.5;
  if (mouth === 'o') {
    ctx.beginPath();
    ctx.ellipse(0, r * 0.34, r * 0.09, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, r * 0.3, r * 0.14, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
}
