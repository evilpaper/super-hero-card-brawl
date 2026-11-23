import { expect, test } from "vitest";
import Scene, { DisplayObject } from "./scene";

/**
 * A square of the given size centred on the origin, enough to hit-test against.
 */
function box(size: number, depth: number): DisplayObject {
  return {
    getDepth: () => depth,
    update: () => {},
    draw: () => {},
    contains: (x, y) => Math.abs(x) <= size / 2 && Math.abs(y) <= size / 2,
    isTappable: () => true,
    setPointer: () => {},
  };
}

test("objectAt should return the object drawn on top", () => {
  const scene = new Scene();
  const top = box(10, 2);
  const bottom = box(10, 1);
  scene.add(top);
  scene.add(bottom);

  expect(scene.objectAt(0, 0)).toBe(top);
});

test("objectAt should fall through to an object beneath when the top one is missed", () => {
  const scene = new Scene();
  const small = box(2, 2);
  const large = box(10, 1);
  scene.add(small);
  scene.add(large);

  expect(scene.objectAt(4, 4)).toBe(large);
});

test("pointAt should tell the top object and clear the one beneath", () => {
  const scene = new Scene();
  let topPointer: number | null = null;
  let bottomPointer: number | null = null;
  const top: DisplayObject = {
    ...box(10, 2),
    setPointer: (x) => {
      topPointer = x;
    },
  };
  const bottom: DisplayObject = {
    ...box(10, 1),
    setPointer: (x) => {
      bottomPointer = x;
    },
  };
  scene.add(top);
  scene.add(bottom);

  scene.pointAt(0, 0);

  expect(topPointer).toBe(0);
  expect(bottomPointer).toBeNull();
});

test("Suspending the pointer should stop pointing until it resumes", () => {
  const scene = new Scene();
  let pointed: number | null = null;
  const object: DisplayObject = {
    ...box(10, 1),
    setPointer: (x) => {
      pointed = x;
    },
  };
  scene.add(object);
  scene.pointAt(1, 1);
  scene.suspendPointer();

  expect(pointed).toBeNull();

  scene.resumePointer();

  expect(pointed).toBe(1);
});

test("objectAt should return null on empty space", () => {
  const scene = new Scene();
  scene.add(box(10, 1));

  expect(scene.objectAt(50, 50)).toBeNull();
});
