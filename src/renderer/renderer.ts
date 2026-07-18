// ---------------------------------------------------------------------------
// Renderer / view (M1)
// Renders whatever mode the simulation (main) pushes, and forwards grab/release.
// Click-through is owned by main (sim.ts): the window only receives mouse events
// while the cursor is over the pet's grab region, so the pet is grabbable even
// while it walks or falls. Position/physics live in main.
// ---------------------------------------------------------------------------
import type { Mode, PetState, PetManifest, PetDialogue } from '../shared/types';
import { CHARACTERS, isCharacterId } from '../shared/types';
import { PET_SIZE } from '../shared/layout';
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
  onPetSize: (cb: (size: number) => void) => void;
  onOpacity: (cb: (opacity: number) => void) => void;
  onMaxFps: (cb: (fps: number) => void) => void;
}
const petAPI: PetAPI | undefined = (window as unknown as { petAPI?: PetAPI }).petAPI;

const canvas = document.getElementById('pet') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let cssW = 0;
let cssH = 0;
// Single source of truth (shared with main) — also pushed into CSS below so the stage box
// can't drift from it.
const AUTHORED_SIZE = PET_SIZE;
document.documentElement.style.setProperty('--stage-size', `${PET_SIZE}px`);
// Authoritative pet size in px, pushed by main (onPetSize). We size the canvas and art
// from THIS, never window.innerWidth: a transparent frameless window silently grows on
// fractional-DPI displays (125/150/175 %), and deriving the scale from it made the pet
// balloon off-screen ("거대화"). A fixed canvas size ignores that window drift.
let petSize = AUTHORED_SIZE;
function resize(): void {
  const dpr = window.devicePixelRatio || 1;
  cssW = petSize;
  cssH = petSize;
  canvas.style.width = petSize + 'px'; // fixed CSS size — a grown window can't stretch it
  canvas.style.height = petSize + 'px';
  canvas.width = Math.round(petSize * dpr);
  canvas.height = Math.round(petSize * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Keep the speech bubble anchored/sized to the pet (== 1 at 100%). See #bubble's calc().
  document.documentElement.style.setProperty('--pscale', String(petSize / AUTHORED_SIZE));
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
// Pet opacity applied as CSS (cross-platform; window.setOpacity is a no-op on Linux/X11).
petAPI?.onOpacity((o) => {
  document.body.style.opacity = String(o > 0 ? Math.min(o, 1) : 1);
});
/**
 * Pin the speech bubble to the CURRENT motion's real head, measured from the art
 * (CreateJSAnimator.measureHead) instead of hard-coded constants. The art is drawn at
 * `petSize`, bottom-aligned and centred inside the fixed AUTHORED_SIZE stage, so an authored
 * point maps into stage coordinates by that offset + scale. Clearing the vars falls back to
 * the CSS defaults (the old constants), so an unmeasurable clip still renders sanely.
 */
function applyBubbleAnchor(): void {
  const root = document.documentElement.style;
  if (cjActive) cj.measureCurrentHead(); // settled state — safe (and cheap) to sample now
  const head = cjActive ? cj.getHeadAnchor() : null;
  if (!head) {
    root.removeProperty('--bubble-x');
    root.removeProperty('--bubble-y');
    return;
  }
  const scale = petSize / cj.authoredSize();
  root.setProperty('--bubble-x', `${AUTHORED_SIZE / 2 - petSize / 2 + head.ax * scale}px`);
  root.setProperty('--bubble-y', `${petSize - head.ay * scale}px`);
}

// Framerate cap (e.g. throttle under Remote Desktop). Stored so it applies once CJ is ready.
let maxFps = 0;
petAPI?.onMaxFps((fps) => {
  maxFps = fps;
  if (cjActive) cj.setMaxFps(fps);
});
petAPI?.onPetSize((n) => {
  petSize = n > 0 ? n : AUTHORED_SIZE;
  resize();
  if (cjActive) {
    cj.setPetSize(petSize);
    cj.onResize();
    applyBubbleAnchor(); // the anchor is in authored coords — re-map it for the new size
  }
});
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
    applyBubbleAnchor(); // each motion has its own head position
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

// Which character this window shows (main passes ?char= on the URL). Each character's six
// motion comps live in their own assets/animate/<dir>/ folder; load them dynamically
// (index.html no longer hard-codes one character) and init the animator from that folder.
const charParam = new URLSearchParams(location.search).get('char');
const character = CHARACTERS[isCharacterId(charParam) ? charParam : 'butter'];
const charBase = `./assets/animate/${character.motionsDir}/`;
console.log('[char]', character.id);

function loadMotionScripts(base: string): Promise<void> {
  // Sequentially — each registers into the shared createjs / AdobeAn globals.
  return ['standing', 'run', 'grab', 'fall', 'land', 'sleep'].reduce(
    (chain, m) =>
      chain.then(
        () =>
          new Promise<void>((resolve) => {
            const s = document.createElement('script');
            s.src = `${base}${m}.js`;
            s.onload = () => resolve();
            s.onerror = () => resolve(); // a missing motion shouldn't block the others
            document.head.appendChild(s);
          }),
      ),
    Promise.resolve(),
  );
}

// Prefer the Adobe Animate / CreateJS art when a published composition is present;
// otherwise fall back to the frame/placeholder canvas loop.
const cj = new CreateJSAnimator(canvas);
let cjActive = false;
cj.setFlip(character.flip); // mirror any motions this character authored facing the other way
if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __cj: unknown }).__cj = cj;

loadMotionScripts(charBase)
  .then(() => cj.init(charBase))
  .then((ready) => {
    cjActive = ready;
    if (ready) {
      cj.setPetSize(petSize); // apply any size received before init resolved
      cj.setMaxFps(maxFps); // apply any RDP framerate cap received before init resolved
      cj.onResize();
      cj.setFacing(facing);
      cj.setClip(mode);
      applyBubbleAnchor();
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

// Moving onto a monitor with a different scale factor changes devicePixelRatio, which
// resizes the canvas backing (resize()) and must re-scale the CreateJS stage (onResize) —
// otherwise the art keeps the previous monitor's scale and appears to balloon in that
// "구역" (the 특정 구역 거대화 report). Chromium does NOT reliably fire 'resize' for a
// DPI-only change of a fixed-DIP window, so watch devicePixelRatio explicitly: a
// media query on the current resolution fires exactly when it changes.
let dprQuery: MediaQueryList | null = null;
function onDprChange(): void {
  resize(); // canvas backing (petSize * new dpr) + --pscale
  if (cjActive) cj.onResize(); // CreateJS stage scale (new dpr * fit)
  watchDpr(); // re-arm for the new DPR
}
function watchDpr(): void {
  dprQuery?.removeEventListener('change', onDprChange);
  dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  dprQuery.addEventListener('change', onDprChange);
}
watchDpr();

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
