// Types shared between the main (simulation) and renderer (view) processes.
// Import these with `import type { ... }` so they erase at build time.

/** High-level animation/behavior state of the pet. */
export type Mode = 'idle' | 'walk' | 'drag' | 'fall' | 'land' | 'sleep';

/** One itch.io devlog entry (in-app patch notes list). */
export interface DevlogItem {
  title: string;
  link: string;
  date: string; // RFC-822 pubDate string
}

/** Pushed from main -> renderer whenever the pet's mode or facing changes. */
export interface PetState {
  mode: Mode;
  /** 1 = facing right, -1 = facing left (renderer mirrors the sprite). */
  facing: 1 | -1;
}

/** A screen-space rectangle (e.g. another window). Used for shelf detection. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One animation clip made of ordered frame images (prototype pipeline). */
export interface ClipDef {
  fps: number;
  loop: boolean;
  /** Frame paths relative to `assets/prototype/`, e.g. "idle/idle_00.png". */
  frames: string[];
}

/** Loaded from assets/prototype/manifest.json; sent main -> renderer. */
export interface PetManifest {
  clips: Partial<Record<Mode, ClipDef>>;
}

/** Speech-bubble line categories: each mode plus a startup greeting. */
export type DialogueCategory = Mode | 'greeting';

/** One dialogue line. Either a plain string, or an object that can flag the
 *  line as a 속마음 (inner thought) — i.e. it belongs to its motion category
 *  AND renders in the 속마음 bubble style when shown. */
export type DialogueLine = string | { text: string; thought?: boolean };

/** Loaded from assets/data/dialogue.json; sent main -> renderer. */
export type PetDialogue = Partial<Record<DialogueCategory, DialogueLine[]>>;
