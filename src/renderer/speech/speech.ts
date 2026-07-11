import type { Mode, PetDialogue, DialogueLine, DialogueCategory } from '../../shared/types';

// ---------------------------------------------------------------------------
// SpeechController — random speech bubbles.
// Ambient lines fire on a jittered timer while the pet is idle/walking/sleeping;
// event lines (grabbed, landed, greeting) interrupt immediately. Picks randomly
// from the per-category pool with a cooldown and no-immediate-repeat.
// A line may be flagged `thought` (속마음): it lives in its motion category like
// any other line, but renders in the 속마음 bubble skin when shown.
// The bubble is a DOM overlay (see index.html); positioning/fade is CSS.
// ---------------------------------------------------------------------------

const AMBIENT_MIN_MS = 9000;
const AMBIENT_RAND_MS = 11000;
const COOLDOWN_MS = 6000;
// Bubbles linger longer now so lines are comfortable to read.
const MIN_SHOW_MS = 2600;
const MAX_SHOW_MS = 7500;
const SHOW_BASE_MS = 1900;
const SHOW_PER_CHAR_MS = 145;
// One-off notices (e.g. "update available") are pinned: they stay up for a full
// minute so the user can spot them after a restart, and no ambient/event line can
// overwrite or hide them while pinned.
const ANNOUNCE_PIN_MS = 60000;
const AMBIENT_MODES: ReadonlySet<Mode> = new Set(['idle', 'walk', 'sleep']);

/** A dialogue line normalized to a common shape (see DialogueLine in types). */
interface Line {
  text: string;
  thought: boolean;
}

export class SpeechController {
  private readonly bubble: HTMLElement;
  // Lines normalized to {text, thought} per category.
  private pools: Partial<Record<DialogueCategory, Line[]>> = {};
  private mode: Mode = 'idle';
  private visible = false;
  private enabled = true;
  private greeted = false;
  private cooldownUntil = 0;
  private pinnedUntil = 0; // announce bubble stays put until this time
  private shownCat: DialogueCategory | null = null; // category of the visible bubble
  private showTimer = 0;
  private ambientTimer = 0;
  private lastLine: Partial<Record<DialogueCategory, string>> = {};
  // Per-category shuffle bags: every line is shown once before any repeats, so
  // the pool feels varied instead of randomly clumping.
  private bags: Partial<Record<DialogueCategory, Line[]>> = {};

  constructor(bubble: HTMLElement) {
    this.bubble = bubble;
  }

  load(data: PetDialogue): void {
    this.pools = normalize(data ?? {});
    this.bags = {};
    this.scheduleAmbient();
    if (!this.greeted) {
      this.greeted = true;
      window.setTimeout(() => this.say('greeting', true), 900);
    }
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    // Sleep lines (Zzz…) belong to the sleep state only: if the pet just left
    // sleep while one is showing, drop it at once so it can't linger while awake.
    if (mode !== 'sleep' && this.shownCat === 'sleep' && this.visible) this.hide();
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) {
      window.clearTimeout(this.ambientTimer);
      if (!this.isPinned()) this.hide(); // keep a pinned announce up even if chatter is off
    } else {
      this.scheduleAmbient();
    }
  }

  private isPinned(): boolean {
    return performance.now() < this.pinnedUntil;
  }

  /** Event-driven line that interrupts the current bubble (grab/land/etc). */
  trigger(cat: DialogueCategory): void {
    this.say(cat, true);
  }

  /** Force a one-off notice line (e.g. update available). Shows even when
   *  ambient bubbles are turned off, since it's an important one-time message. */
  announce(text: string): void {
    const line = text.trim();
    if (!line) return;
    // Pin it: hold the bubble for a full minute and block anything else from
    // replacing or hiding it until then (see say()/setEnabled()/hide()).
    this.pinnedUntil = performance.now() + ANNOUNCE_PIN_MS;
    this.cooldownUntil = this.pinnedUntil;
    this.shownCat = null; // a notice, not a state line
    this.show(line, false, ANNOUNCE_PIN_MS);
  }

  private scheduleAmbient(): void {
    window.clearTimeout(this.ambientTimer);
    const delay = AMBIENT_MIN_MS + Math.random() * AMBIENT_RAND_MS;
    this.ambientTimer = window.setTimeout(() => {
      if (AMBIENT_MODES.has(this.mode)) this.say(this.mode as DialogueCategory, false);
      this.scheduleAmbient();
    }, delay);
  }

  private say(cat: DialogueCategory, priority: boolean): void {
    if (!this.enabled) return;
    if (this.isPinned()) return; // a pinned announce is never overwritten, even by event lines
    const now = performance.now();
    if (!priority && (this.visible || now < this.cooldownUntil)) return;

    const line = this.nextFrom(cat);
    if (line === null) return;
    this.cooldownUntil = now + COOLDOWN_MS;
    this.shownCat = cat;
    this.show(line.text, line.thought);
  }

  /** Draw the next line from the category's shuffle bag (refills when empty). */
  private nextFrom(cat: DialogueCategory): Line | null {
    const pool = this.pools[cat];
    if (!pool || pool.length === 0) return null;
    let bag = this.bags[cat];
    if (!bag || bag.length === 0) {
      bag = shuffle(pool.slice());
      // don't let a refill immediately repeat the previous line
      if (pool.length > 1 && bag[bag.length - 1].text === this.lastLine[cat]) {
        bag.unshift(bag.pop() as Line);
      }
      this.bags[cat] = bag;
    }
    const line = bag.pop() as Line;
    this.lastLine[cat] = line.text;
    return line;
  }

  private show(text: string, isThought = false, durationOverride = 0): void {
    this.bubble.textContent = applyBreaks(text);
    // 속마음 lines get the alternate bubble skin (colors/gradient in index.html).
    this.bubble.classList.toggle('thought', isThought);
    this.bubble.classList.add('show');
    this.visible = true;
    window.clearTimeout(this.showTimer);
    const dur =
      durationOverride ||
      Math.min(MAX_SHOW_MS, Math.max(MIN_SHOW_MS, SHOW_BASE_MS + text.length * SHOW_PER_CHAR_MS));
    this.showTimer = window.setTimeout(() => this.hide(), dur);
  }

  private hide(): void {
    this.bubble.classList.remove('show');
    this.visible = false;
    this.pinnedUntil = 0; // releasing the bubble also releases any pin
    this.shownCat = null;
  }
}

/** Normalize raw dialogue (string | {text,thought}) into {text, thought} lines. */
function normalize(data: PetDialogue): Partial<Record<DialogueCategory, Line[]>> {
  const out: Partial<Record<DialogueCategory, Line[]>> = {};
  for (const key of Object.keys(data) as DialogueCategory[]) {
    const raw = data[key];
    if (!raw) continue;
    const lines = raw.map(toLine).filter((l) => l.text.length > 0);
    if (lines.length) out[key] = lines;
  }
  return out;
}

function toLine(entry: DialogueLine): Line {
  if (typeof entry === 'string') return { text: entry, thought: false };
  return { text: entry.text, thought: entry.thought === true };
}

/**
 * Line breaks are authored, not automatic: a dialogue line wraps only where the writer
 * puts one. In dialogue.json use a real newline (JSON "\n") — or a literal backslash-n,
 * normalized here. With no break the line stays on one line and the bubble grows
 * horizontally instead (see #bubble: white-space: pre, no max-width).
 */
function applyBreaks(text: string): string {
  return text.replace(/\\n/g, '\n');
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
