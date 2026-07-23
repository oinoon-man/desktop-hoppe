// ---------------------------------------------------------------------------
// The one place the pet window's dimensions are defined.
//
// These numbers are load-bearing across four coordinate systems: the pet window (main),
// the art's authored space (the .fla canvases), the renderer's scale basis, and the CSS
// stage box. They used to be written out separately in each — including once in CSS, where
// TypeScript couldn't see it — so a change in one place would silently desync the others.
// Both processes import them from here; the renderer pushes them into CSS at startup.
// ---------------------------------------------------------------------------

/** Authored art size in px (square), and the pet window's WIDTH. Art is 300x300 per the
 *  artist guide (assets/animate/ARTIST_GUIDE.md); the size setting scales down from this. */
export const PET_SIZE = 300;

/** Empty space kept ABOVE the pet inside the window, for the speech bubble to occupy.
 *  At 100% the pet fills its 300px square with the head near the top, so without this the
 *  bubble (anchored just above the head) would be clipped by the window's top edge. */
export const BUBBLE_HEADROOM = 120;

/** The pet window's HEIGHT: the pet (PET_SIZE) sits flush at the bottom, headroom on top. */
export const STAGE_H = PET_SIZE + BUBBLE_HEADROOM;
