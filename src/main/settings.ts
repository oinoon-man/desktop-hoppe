import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { isLocale, type Locale } from '../shared/i18n';
import { CHARACTERS, type CharacterId } from '../shared/types';

// Persisted user settings (userData/settings.json). Small and forgiving: unknown,
// BOM-prefixed, or corrupt files fall back to defaults.

export interface Settings {
  speech: boolean; // random speech bubbles on/off
  climbing: boolean; // stand/walk on other windows on/off
  behind: boolean; // keep the pet behind other windows (don't cover them)
  roster: Record<CharacterId, number>; // how many of each character to run (each 0..MAX_PETS)
  autostart: boolean; // launch at login
  opacity: number; // pet window opacity, 1..100 (%)
  size: number; // pet scale, one of SIZE_STEPS (%)
  stay: boolean; // "기다려!" — seal wandering (stand/sleep only), interaction still ok
  beta: boolean; // opt in to the beta update channel (test builds before they go live)
  locale: Locale; // UI + dialogue language (ko/ja/en)
}

export const MAX_PETS = 5; // per-character maximum (so up to MAX_PETS × #characters total)
export const SIZE_STEPS = [10, 30, 50, 70, 100] as const; // allowed pet sizes (%)
const DEFAULTS: Settings = {
  speech: true,
  climbing: true,
  behind: false,
  roster: { butter: 1, komi: 0 },
  autostart: false,
  opacity: 100,
  size: 100,
  stay: false,
  beta: false,
  locale: 'ko',
};

function file(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

function readText(p: string): string {
  let text = fs.readFileSync(p, 'utf-8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
  return text;
}

// A single character's count: 0..MAX_PETS (0 = none of that character).
export function clampCount(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? Math.floor(n) : 0;
  return Math.max(0, Math.min(MAX_PETS, v));
}

// Normalize a persisted roster: clamp each character 0..MAX_PETS, migrate a pre-roster
// file (single `pets` count → that many Butter), and never end up with zero total pets.
export function clampRoster(raw: { roster?: unknown; pets?: unknown } | undefined): Record<CharacterId, number> {
  const src = (raw && typeof raw.roster === 'object' && raw.roster) || {};
  const roster = {} as Record<CharacterId, number>;
  let total = 0;
  for (const id of Object.keys(CHARACTERS) as CharacterId[]) {
    roster[id] = clampCount((src as Record<string, unknown>)[id]);
    total += roster[id];
  }
  if (total === 0 && raw && typeof raw.pets === 'number') {
    roster.butter = Math.max(1, Math.min(MAX_PETS, Math.floor(raw.pets)));
    total = roster.butter;
  }
  if (total === 0) roster.butter = 1;
  return roster;
}

export function clampOpacity(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : DEFAULTS.opacity;
  return Math.max(1, Math.min(100, v));
}

// Snap an arbitrary value to the nearest allowed size step (10/30/50/70/100).
export function clampSize(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : DEFAULTS.size;
  let best: number = SIZE_STEPS[0];
  for (const s of SIZE_STEPS) if (Math.abs(s - v) < Math.abs(best - v)) best = s;
  return best;
}

export function loadSettings(): Settings {
  try {
    const raw = JSON.parse(readText(file()));
    return {
      speech: typeof raw.speech === 'boolean' ? raw.speech : DEFAULTS.speech,
      climbing: typeof raw.climbing === 'boolean' ? raw.climbing : DEFAULTS.climbing,
      behind: typeof raw.behind === 'boolean' ? raw.behind : DEFAULTS.behind,
      roster: clampRoster(raw),
      autostart: typeof raw.autostart === 'boolean' ? raw.autostart : DEFAULTS.autostart,
      opacity: clampOpacity(raw.opacity),
      size: clampSize(raw.size),
      stay: typeof raw.stay === 'boolean' ? raw.stay : DEFAULTS.stay,
      beta: typeof raw.beta === 'boolean' ? raw.beta : DEFAULTS.beta,
      locale: isLocale(raw.locale) ? raw.locale : DEFAULTS.locale,
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
