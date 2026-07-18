// ---------------------------------------------------------------------------
// The one place the pet's authored size is defined.
//
// This number is load-bearing in four different coordinate systems: the pet window's
// size (main), the art's authored space (the .fla canvases are all this big), the
// renderer's scale basis, and the CSS stage box. It used to be written out separately
// in each of them — including once in CSS, where TypeScript couldn't see it — so a
// change in one place would silently desync the others. Both processes import it from
// here, and the renderer pushes it into CSS at startup (see applyStageSize).
//
// Changing it means re-exporting the art at the new size; nothing else should hardcode it.
// ---------------------------------------------------------------------------

/** Authored art size in px, and the pet window's fixed size. Art is 300x300 per the
 *  artist guide (assets/animate/ARTIST_GUIDE.md); the size setting scales down from this. */
export const PET_SIZE = 300;
