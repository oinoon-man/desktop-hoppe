import { contextBridge, ipcRenderer } from 'electron';
import type { PetState, PetManifest, PetDialogue } from '../shared/types';

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
  /** Receive the prototype frame manifest once, after load. */
  onManifest: (cb: (manifest: PetManifest) => void) =>
    ipcRenderer.on('manifest', (_e, manifest: PetManifest) => cb(manifest)),
  /** Receive the dialogue pool once, after load. */
  onDialogue: (cb: (dialogue: PetDialogue) => void) =>
    ipcRenderer.on('dialogue', (_e, dialogue: PetDialogue) => cb(dialogue)),
  /** Enable/disable speech bubbles (from the tray toggle). */
  onSpeechEnabled: (cb: (enabled: boolean) => void) =>
    ipcRenderer.on('set-speech', (_e, enabled: boolean) => cb(enabled)),
  /** Pet announces an available update (one-off notice line). */
  onUpdateAnnounce: (cb: (line: string) => void) =>
    ipcRenderer.on('update-announce', (_e, line: string) => cb(line)),
});

// Opacity slider window API.
contextBridge.exposeInMainWorld('opacityAPI', {
  get: () => ipcRenderer.invoke('get-opacity'),
  set: (v: number) => ipcRenderer.send('set-opacity', v),
});
