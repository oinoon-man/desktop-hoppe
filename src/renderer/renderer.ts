// ---------------------------------------------------------------------------
// Renderer / view (M1)
// Renders whatever mode the simulation (main) pushes, and forwards grab/release.
// Click-through is owned by main (sim.ts): the window only receives mouse events
// while the cursor is over the pet's grab region, so the pet is grabbable even
// while it walks or falls. Position/physics live in main.
// ---------------------------------------------------------------------------
import type { Mode, PetState, PetManifest, PetDialogue } from '../shared/types';
import type { IAnimator } from './anim/types';
import { PlaceholderAnimator } from './anim/placeholder';
import { FrameAnimator } from './anim/frame';
import { CreateJSAnimator } from './anim/createjs-anim';
import { SpeechController } from './speech/speech';

interface PetAPI {
  grab: () => void;
  release: () => void;
  showContextMenu: () => void;
  onState: (cb: (s: PetState) => void) => void;
  onManifest: (cb: (m: PetManifest) => void) => void;
  onDialogue: (cb: (d: PetDialogue) => void) => void;
  onSpeechEnabled: (cb: (enabled: boolean) => void) => void;
  onUpdateAnnounce: (cb: (line: string) => void) => void;
  onLocale: (cb: (locale: string) => void) => void;
}
const petAPI: PetAPI | undefined = (window as unknown as { petAPI?: PetAPI }).petAPI;

const canvas = document.getElementById('pet') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let cssW = 0;
let cssH = 0;
const AUTHORED_SIZE = 300; // matches PET_SIZE; the size setting resizes the window from this
function resize(): void {
  const dpr = window.devicePixelRatio || 1;
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Keep the speech bubble anchored/sized to the pet as the size setting shrinks
  // the window (== 1 at 100%). See #bubble's calc(... * var(--pscale)).
  document.documentElement.style.setProperty('--pscale', String((cssW || AUTHORED_SIZE) / AUTHORED_SIZE));
}
resize();
window.addEventListener('resize', resize);

// --- animation -------------------------------------------------------------
const placeholder = new PlaceholderAnimator();
const frames = new FrameAnimator();
const speech = new SpeechController(document.getElementById('bubble') as HTMLElement);
const placeholderEl = document.getElementById('placeholder') as HTMLElement;

let mode: Mode = 'idle';
let facing: 1 | -1 = 1;
let prevMode: Mode = 'idle';

petAPI?.onManifest((m) => frames.load(m));
petAPI?.onDialogue((d) => speech.load(d));
// Switch the speech-bubble font to match the language (ja -> Mochiy Pop One via
// the html[lang="ja"] rule in index.html).
petAPI?.onLocale((loc) => (document.documentElement.lang = loc));
petAPI?.onSpeechEnabled((on) => speech.setEnabled(on));
petAPI?.onUpdateAnnounce((line) => speech.announce(line));
petAPI?.onState((s) => {
  mode = s.mode;
  facing = s.facing;
  speech.setMode(mode);
  updateStateVisual();
  if (cjActive) {
    cj.setFacing(facing);
    // Re-apply on every message (not just on change): setClip is a no-op when the
    // clip is already current, but it recovers an animator that drifted out of
    // sync (e.g. stuck showing 'fall' while the pet has moved on to walk/idle).
    cj.setClip(mode);
  }
  if (mode !== prevMode) {
    if (mode === 'drag') speech.trigger('drag');
    else if (mode === 'land' && Math.random() < 0.4) speech.trigger('land');
    prevMode = mode;
  }
});

function animatorFor(clip: Mode): IAnimator {
  return frames.hasClip(clip) ? frames : placeholder;
}

// Prefer the Adobe Animate / CreateJS art when a published composition is present;
// otherwise fall back to the frame/placeholder canvas loop.
const cj = new CreateJSAnimator(canvas);
let cjActive = false;

cj.init().then((ready) => {
  cjActive = ready;
  if (ready) {
    cj.setFacing(facing);
    cj.setClip(mode);
    updateStateVisual();
  } else {
    startCanvasLoop();
  }
});

// With the real Animate art loaded, every state is a published motion, so the
// art just renders/loops for whatever mode is current. Without it, the canvas
// loop (frame/placeholder animator) draws the pet instead. The DOM #placeholder
// box is unused now.
function updateStateVisual(): void {
  placeholderEl.style.display = 'none';
  if (cjActive) cj.setVisible(true);
}

window.addEventListener('resize', () => {
  if (cjActive) cj.onResize();
});

function startCanvasLoop(): void {
  let lastT = performance.now();
  function loop(t: number): void {
    const dt = t - lastT;
    lastT = t;
    const anim = animatorFor(mode);
    anim.setClip(mode);
    anim.update(dt);
    ctx.clearRect(0, 0, cssW, cssH);
    anim.draw(ctx, cssW, cssH, facing);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// --- interaction -----------------------------------------------------------
// We only receive these events when main has enabled capture (cursor over the
// pet), so a mousedown here always means "grab" — in any mode.
let dragging = false;

window.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  dragging = true;
  petAPI?.grab();
});

window.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  petAPI?.release();
});

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  petAPI?.showContextMenu();
});
