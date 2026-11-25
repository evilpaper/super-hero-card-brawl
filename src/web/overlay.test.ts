import { expect, test } from "vitest";
import Overlay from "./overlay";

test("A title overlay covers the window but is not tappable", () => {
  const overlay = new Overlay("title", () => {});
  overlay.layout(400, 300);

  expect(overlay.contains(10, 10)).toBe(true);
  expect(overlay.contains(399, 299)).toBe(true);
  expect(overlay.isTappable()).toBe(false);
});

test("An end overlay is tappable so Restart can receive a tap", () => {
  const overlay = new Overlay("knockedOut", () => {});
  overlay.layout(400, 300);

  expect(overlay.isTappable()).toBe(true);
});

test("tap on Restart runs the callback; a miss does not", () => {
  const calls: number[] = [];
  const overlay = new Overlay("victory", () => {
    calls.push(1);
  });
  overlay.layout(800, 600);

  overlay.tap(400, 300);
  expect(calls).toHaveLength(0);

  overlay.tap(800 - 48 - 80, 600 - 48 - 22);
  expect(calls).toHaveLength(1);
});
