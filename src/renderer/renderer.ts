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
}
const petAPI: PetAPI | undefined = (window as unknown as { petAPI?: PetAPI }).petAPI;

const canvas = document.getElementById('pet') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let cssW = 0;
let cssH = 0;
function resize(): void {
  const dpr = window.devicePixelRatio || 1;
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

// --- animation -------------------------------------------------------------
const placeholder = new PlaceholderAnimator();
const frames = new FrameAnimator();
const speech = new SpeechController(document.getElementById('bubble') as HTMLElement);
const placeholderEl = document.getElementById('placeholder') as HTMLElement;
const zzzEl = document.getElementById('zzz') as HTMLElement;

// While a CreateJS composition is loaded, only these modes use the real Animate
// motion; every other mode shows a labeled solid placeholder (art still TODO).
const CJ_MODES = new Set<Mode>(['walk']);
const MODE_COLORS: Record<string, string> = {
  idle: '#7fb2e6',
  drag: '#e6a86b',
  fall: '#e67f7f',
  land: '#7fcf9b',
  sleep: '#a88fd6',
};

let mode: Mode = 'idle';
let facing: 1 | -1 = 1;
let prevMode: Mode = 'idle';

petAPI?.onManifest((m) => frames.load(m));
petAPI?.onDialogue((d) => speech.load(d));
petAPI?.onSpeechEnabled((on) => speech.setEnabled(on));
petAPI?.onUpdateAnnounce((line) => speech.announce(line));
petAPI?.onState((s) => {
  mode = s.mode;
  facing = s.facing;
  speech.setMode(mode);
  updateStateVisual();
  if (cjActive) cj.setFacing(facing);
  if (mode !== prevMode) {
    if (cjActive) cj.setClip(mode);
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
    updateStateVisual();
  } else {
    startCanvasLoop();
  }
});

// Route rendering per state: CreateJS motion for CJ_MODES, labeled placeholder
// otherwise. No-op when there's no composition (the canvas loop handles visuals).
function updateStateVisual(): void {
  const sleeping = mode === 'sleep';
  zzzEl.classList.toggle('show', sleeping);
  if (!cjActive) {
    placeholderEl.style.display = 'none';
    return;
  }
  if (CJ_MODES.has(mode)) {
    placeholderEl.style.display = 'none';
    placeholderEl.classList.remove('sleeping');
    cj.setVisible(true);
    return;
  }
  cj.setVisible(false);
  if (sleeping) {
    placeholderEl.textContent = '';
    placeholderEl.classList.add('sleeping');
    placeholderEl.style.background = '#8ba3bf';
  } else {
    placeholderEl.classList.remove('sleeping');
    placeholderEl.textContent = mode.toUpperCase();
    placeholderEl.style.background = MODE_COLORS[mode] ?? '#8aa0b8';
  }
  placeholderEl.style.display = 'flex';
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
