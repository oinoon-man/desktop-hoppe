// Regression tests for the pet's geometry. Every case here is a bug that actually shipped
// and was reported by users — the point is that they can't come back silently.
//
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
// .ts extension: Node's native type stripping resolves ESM specifiers literally.
import { walkableSpan, minX, maxX, cursorOverPet, spansX, clamp, type Area } from './geometry.ts';

const display = (x: number, width: number): Area => ({ x, y: 0, width, height: 1080 });
const SIZE = 300; // PET_SIZE

test('walkableSpan: single display bounds the pet inside it', () => {
  const span = walkableSpan([display(0, 1920)], 500, SIZE);
  assert.deepEqual(span, { lo: 0, hi: 1920 - SIZE });
});

test('walkableSpan: adjacent monitors form one contiguous run (pet may cross the seam)', () => {
  const areas = [display(0, 1920), display(1920, 1920)];
  const span = walkableSpan(areas, 500, SIZE);
  assert.equal(span.lo, 0);
  assert.equal(span.hi, 3840 - SIZE, 'should reach the far edge of the second monitor');
});

test('walkableSpan: a gap between monitors is NOT walkable (the dead-zone bug)', () => {
  // Monitors that do not touch: 0..1920 and 2400..4320. The pet must not be able to target
  // the 1920..2400 void, which is where it used to get stuck.
  const areas = [display(0, 1920), display(2400, 1920)];
  const left = walkableSpan(areas, 500, SIZE);
  assert.deepEqual(left, { lo: 0, hi: 1920 - SIZE }, 'left monitor run stops at its own edge');

  const right = walkableSpan(areas, 3000, SIZE);
  assert.deepEqual(right, { lo: 2400, hi: 4320 - SIZE }, 'right monitor is its own run');
});

test('walkableSpan: a point inside the gap snaps to the nearest display', () => {
  const areas = [display(0, 1920), display(2400, 1920)];
  assert.equal(walkableSpan(areas, 2000, SIZE).lo, 0, 'nearer the left monitor');
  assert.equal(walkableSpan(areas, 2350, SIZE).lo, 2400, 'nearer the right monitor');
});

test('walkableSpan: far off-screen still resolves to a real display', () => {
  const span = walkableSpan([display(0, 1920)], 99999, SIZE);
  assert.deepEqual(span, { lo: 0, hi: 1920 - SIZE });
});

test('walkableSpan: tolerates a 1px rounding gap between touching monitors', () => {
  const areas = [display(0, 1920), display(1921, 1920)];
  assert.equal(walkableSpan(areas, 500, SIZE).hi, 3841 - SIZE, 'still one run');
});

test('minX / maxX span every display', () => {
  const areas = [display(1920, 1920), display(-1920, 1920), display(0, 1920)];
  assert.equal(minX(areas), -1920);
  assert.equal(maxX(areas, SIZE), 3840 - SIZE);
});

// --- grab region ----------------------------------------------------------------
// GRAB_* as used by the sim.
const GRAB = { cx: 0.5, cy: 0.58, rx: 0.33, ry: 0.36 };
const over = (cursor: { x: number; y: number }, artSize: number) =>
  cursorOverPet(cursor, { x: 0, y: 0, size: SIZE, artSize }, GRAB);

test('grab: at 100% the region sits on the art', () => {
  assert.ok(over({ x: 150, y: 174 }, SIZE), 'centre of the pet is grabbable');
  assert.ok(!over({ x: 150, y: 5 }, SIZE), 'well above the head is not');
});

test('grab: scaled down, the region follows the art to the bottom-centre (the hitbox bug)', () => {
  // At 30% the art is a 90px box at the bottom-centre of the 300px window: x 105..195,
  // y 210..300. The region must be there — not still centred on the whole window.
  const art = 90;
  assert.ok(over({ x: 150, y: 262 }, art), 'over the small pet itself');
  assert.ok(!over({ x: 150, y: 174 }, art), 'the old window-centred spot is now empty space');
  assert.ok(!over({ x: 60, y: 262 }, art), 'left of the shrunken art is not grabbable');
});

test('grab: the region never extends past the art box', () => {
  const art = 90;
  const left = 0 + (SIZE - art) / 2; // 105
  const top = 0 + (SIZE - art); // 210
  for (const p of [
    { x: left - 1, y: top + art / 2 },
    { x: left + art + 1, y: top + art / 2 },
    { x: left + art / 2, y: top - 1 },
  ]) {
    assert.ok(!over(p, art), `outside the art box should not grab: ${JSON.stringify(p)}`);
  }
});

test('grab: artSize 0 falls back to the full window (never a dead pet)', () => {
  assert.ok(over({ x: 150, y: 174 }, 0));
});

test('spansX: inclusive shelf hit test', () => {
  const shelf = { x: 100, y: 500, w: 200, h: 20 };
  assert.ok(spansX(shelf, 100));
  assert.ok(spansX(shelf, 300));
  assert.ok(!spansX(shelf, 99));
  assert.ok(!spansX(shelf, 301));
});

test('clamp keeps a released pet inside its span', () => {
  assert.equal(clamp(-500, 0, 1620), 0);
  assert.equal(clamp(9999, 0, 1620), 1620);
  assert.equal(clamp(800, 0, 1620), 800);
});
