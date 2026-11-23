import { expect, test } from "vitest";
import Input, { TAP_SLOP } from "./input";
import Scene, { DisplayObject } from "./scene";

/**
 * A square of side 100 centred on the origin.
 */
function box(tappable = true): DisplayObject {
  return {
    getDepth: () => 0,
    update: () => {},
    draw: () => {},
    contains: (x, y) => Math.abs(x) <= 50 && Math.abs(y) <= 50,
    isTappable: () => tappable,
    setPointer: () => {},
  };
}

function setup(object: DisplayObject) {
  const scene = new Scene();
  scene.add(object);
  const taps: DisplayObject[] = [];
  const input = new Input(scene, (tapped) => taps.push(tapped));
  return { input, taps };
}

test("A press and release on the same object should tap it", () => {
  const object = box();
  const { input, taps } = setup(object);

  input.press(0, 0);
  input.release(2, 2);

  expect(taps).toEqual([object]);
});

test("Moving further than the slop should not tap", () => {
  const { input, taps } = setup(box());

  input.press(0, 0);
  input.move(TAP_SLOP + 1, 0);
  input.release(0, 0);

  expect(taps).toEqual([]);
});

test("Releasing off the object should not tap", () => {
  const { input, taps } = setup(box());

  input.press(45, 0);
  input.release(52, 0);

  expect(taps).toEqual([]);
});

test("An object that is not tappable should not be tapped", () => {
  const { input, taps } = setup(box(false));

  input.press(0, 0);
  input.release(0, 0);

  expect(taps).toEqual([]);
});

test("A press while locked should not tap", () => {
  const { input, taps } = setup(box());

  input.lock();
  input.press(0, 0);
  input.unlock();
  input.release(0, 0);

  expect(taps).toEqual([]);
});

test("Locking should drop a press already in progress", () => {
  const { input, taps } = setup(box());

  input.press(0, 0);
  input.lock();
  input.unlock();
  input.release(0, 0);

  expect(taps).toEqual([]);
});

test("Unlocking should let the next press tap again", () => {
  const object = box();
  const { input, taps } = setup(object);

  input.lock();
  input.unlock();
  input.press(0, 0);
  input.release(0, 0);

  expect(taps).toEqual([object]);
});

test("Moving without a press should point at the object under the pointer", () => {
  const seen: Array<number | null> = [];
  const object = box();
  object.setPointer = (x) => seen.push(x);
  const { input } = setup(object);

  input.move(0, 0);
  input.move(80, 0);

  expect(seen).toContain(0);
  expect(seen[seen.length - 1]).toBeNull();
});

test("A cancelled press should not tap", () => {
  const { input, taps } = setup(box());

  input.press(0, 0);
  input.cancel();
  input.release(0, 0);

  expect(taps).toEqual([]);
});
