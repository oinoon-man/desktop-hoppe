import { contextBridge, ipcRenderer } from 'electron';
import type { PetState, PetDialogue } from '../shared/types';

// Minimal, explicit capability surface for the sandboxed renderer.
contextBridge.exposeInMainWorld('petAPI', {
  /** Tell the simulation the user grabbed the pet (main reads the cursor). */
  grab: () => ipcRenderer.send('grab'),
  /** Tell the simulation the user released the pet. */
  release: () => ipcRenderer.send('release'),
  /** Open the right-click context menu (Quit, etc.). */
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  /** Subscribe to state pushes (mode/facing) from the simulation. */
  onState: (cb: (state: PetState) => void) =>
    ipcRenderer.on('state', (_e, state: PetState) => cb(state)),
  /** Receive the dialogue pool once, after load. */
  onDialogue: (cb: (dialogue: PetDialogue) => void) =>
    ipcRenderer.on('dialogue', (_e, dialogue: PetDialogue) => cb(dialogue)),
  /** Enable/disable speech bubbles (from the tray toggle). */
  onSpeechEnabled: (cb: (enabled: boolean) => void) =>
    ipcRenderer.on('set-speech', (_e, enabled: boolean) => cb(enabled)),
  /** Pet announces an available update (one-off notice line). */
  onUpdateAnnounce: (cb: (line: string) => void) =>
    ipcRenderer.on('update-announce', (_e, line: string) => cb(line)),
  /** Current UI language (so the renderer can pick the matching font). */
  onLocale: (cb: (locale: string) => void) =>
    ipcRenderer.on('set-locale', (_e, locale: string) => cb(locale)),
  /** Intended pet size in px (authoritative — the renderer sizes the canvas + art
   *  from this, NOT the window, which can drift/grow on fractional-DPI displays). */
  onPetSize: (cb: (size: number) => void) =>
    ipcRenderer.on('pet-size', (_e, size: number) => cb(size)),
  /** Pet opacity 0.1–1.0 (applied as CSS opacity — window.setOpacity is a no-op on Linux). */
  onOpacity: (cb: (opacity: number) => void) =>
    ipcRenderer.on('opacity', (_e, opacity: number) => cb(opacity)),
  /** Cap the animation framerate (>0), e.g. under Remote Desktop; 0 = uncapped. */
  onMaxFps: (cb: (fps: number) => void) =>
    ipcRenderer.on('max-fps', (_e, fps: number) => cb(fps)),
});

// Opacity slider window API.
contextBridge.exposeInMainWorld('opacityAPI', {
  get: () => ipcRenderer.invoke('get-opacity'),
  set: (v: number) => ipcRenderer.send('set-opacity', v),
});

// Patch-notes window API (itch.io devlog is fetched by main).
contextBridge.exposeInMainWorld('patchnotesAPI', {
  list: () => ipcRenderer.invoke('devlog-list'),
  post: (url: string) => ipcRenderer.invoke('devlog-post', url),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
});
