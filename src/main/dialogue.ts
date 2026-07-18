// ---------------------------------------------------------------------------
// Dialogue loading.
//
// Each character speaks from its own pool of lines, per locale, read fresh from the bundle
// on every launch. (An older build seeded a copy into userData and then kept it, which froze
// installs on whatever lines they first launched with — updates never reached them.)
// ---------------------------------------------------------------------------
import path from 'node:path';
import fs from 'node:fs';
import type { Locale } from '../shared/i18n';
import type { PetDialogue, DialogueLine, DialogueCategory, CharacterId } from '../shared/types';
import { CHARACTERS } from '../shared/types';

function readJson<T>(rel: string, fallback: T): T {
  try {
    let text = fs.readFileSync(path.join(__dirname, rel), 'utf-8');
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object') return parsed as T;
  } catch {
    /* fall through */
  }
  return fallback;
}

// --- dialogue --------------------------------------------------------------
// The pool ships with the app (assets/data/dialogue.json) and is read fresh on
// every launch, so an app update always delivers the current lines. (It used to
// be seeded once into userData and then kept, which froze updated installs on
// whatever set they first launched with — the bundled lines never reached them.)

const DIALOGUE_KEYS: DialogueCategory[] = ['greeting', 'idle', 'walk', 'sleep', 'drag', 'fall', 'land'];

/** A line is either a plain string or `{ text, thought }`; keep the thought flag
 *  (속마음) if present. Returns null for empty/invalid entries. */
function sanitizeLine(entry: unknown): DialogueLine | null {
  if (typeof entry === 'string') {
    const text = entry.trim();
    return text ? text : null;
  }
  if (entry && typeof entry === 'object') {
    const text = String((entry as { text?: unknown }).text ?? '').trim();
    if (!text) return null;
    return { text, thought: (entry as { thought?: unknown }).thought === true };
  }
  return null;
}

function sanitizeDialogue(raw: unknown): PetDialogue {
  const out: PetDialogue = {};
  if (!raw || typeof raw !== 'object') return out;
  const obj = raw as Record<string, unknown>;
  for (const key of DIALOGUE_KEYS) {
    const arr = obj[key];
    if (Array.isArray(arr)) {
      const lines = arr.map(sanitizeLine).filter((l): l is DialogueLine => l !== null);
      if (lines.length) out[key] = lines;
    }
  }
  return out;
}

function dialogueFile(locale: Locale): string {
  return locale === 'ko' ? 'dialogue.json' : `dialogue.${locale}.json`;
}

// Each character speaks from its own pool. Butter's lives at assets/data/; every other
// character's lives under assets/data/<id>/, so Komi has separate lines from Butter.
function dialogueDir(character: CharacterId): string {
  return character === 'butter' ? path.join('assets', 'data') : path.join('assets', 'data', character);
}

export function loadDialogue(locale: Locale, character: CharacterId): PetDialogue {
  const dir = dialogueDir(character);
  const read = (file: string): PetDialogue =>
    sanitizeDialogue(readJson<PetDialogue>(path.join(dir, file), {}));
  let d = read(dialogueFile(locale));
  // Fall back to this character's Korean pool if its locale file is missing/empty…
  if (Object.keys(d).length === 0 && locale !== 'ko') d = read('dialogue.json');
  // …and to Butter's pool if a non-Butter character has no lines at all (never mute).
  if (Object.keys(d).length === 0 && character !== 'butter') return loadDialogue(locale, 'butter');
  return d;
}

export function loadAllDialogues(locale: Locale): Record<CharacterId, PetDialogue> {
  const out = {} as Record<CharacterId, PetDialogue>;
  for (const id of Object.keys(CHARACTERS) as CharacterId[]) out[id] = loadDialogue(locale, id);
  return out;
}
