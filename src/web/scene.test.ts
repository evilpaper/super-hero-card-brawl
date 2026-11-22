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

test("objectAt should return null on empty space", () => {
  const scene = new Scene();
  scene.add(box(10, 1));

  expect(scene.objectAt(50, 50)).toBeNull();
});
