import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

// Persisted user settings (userData/settings.json). Small and forgiving: unknown,
// BOM-prefixed, or corrupt files fall back to defaults.

export interface Settings {
  speech: boolean; // random speech bubbles on/off
  climbing: boolean; // stand/walk on other windows on/off
  pets: number; // number of pet instances (1..MAX_PETS)
  autostart: boolean; // launch at login
  opacity: number; // pet window opacity, 1..100 (%)
}

export const MAX_PETS = 4;
const DEFAULTS: Settings = { speech: true, climbing: true, pets: 1, autostart: false, opacity: 100 };

function file(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

function readText(p: string): string {
  let text = fs.readFileSync(p, 'utf-8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
  return text;
}

export function clampPets(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? Math.floor(n) : DEFAULTS.pets;
  return Math.max(1, Math.min(MAX_PETS, v));
}

export function clampOpacity(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : DEFAULTS.opacity;
  return Math.max(1, Math.min(100, v));
}

export function loadSettings(): Settings {
  try {
    const raw = JSON.parse(readText(file()));
    return {
      speech: typeof raw.speech === 'boolean' ? raw.speech : DEFAULTS.speech,
      climbing: typeof raw.climbing === 'boolean' ? raw.climbing : DEFAULTS.climbing,
      pets: clampPets(raw.pets),
      autostart: typeof raw.autostart === 'boolean' ? raw.autostart : DEFAULTS.autostart,
      opacity: clampOpacity(raw.opacity),
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(s: Settings): void {
  try {
    fs.writeFileSync(file(), JSON.stringify(s, null, 2));
  } catch (e) {
    console.log('[settings] save failed:', (e as Error).message);
  }
}
