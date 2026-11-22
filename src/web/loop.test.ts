import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Loop, { MAX_FRAME_TIME } from "./loop";

let nextFrame: FrameRequestCallback | null = null;

function frame(time: number) {
  const callback = nextFrame!;
  nextFrame = null;
  callback(time);
}

beforeEach(() => {
  nextFrame = null;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    nextFrame = callback;
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    nextFrame = null;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("Loop should call update before draw on every frame", () => {
  const calls: string[] = [];
  const loop = new Loop(
    () => calls.push("update"),
    () => calls.push("draw"),
  );

  loop.start();
  frame(0);
  frame(16);

  expect(calls).toEqual(["update", "draw", "update", "draw"]);
});

test("Loop should pass the time since the previous frame in seconds", () => {
  const steps: number[] = [];
  const loop = new Loop(
    (dt) => steps.push(dt),
    () => {},
  );

  loop.start();
  frame(1000);
  frame(1016);

  expect(steps[0]).toBe(0);
  expect(steps[1]).toBeCloseTo(0.016);
});

test("Loop should cap long frames", () => {
  const steps: number[] = [];
  const loop = new Loop(
    (dt) => steps.push(dt),
    () => {},
  );

  loop.start();
  frame(0);
  frame(5000);

  expect(steps[1]).toBe(MAX_FRAME_TIME);
});

test("stop should end the loop", () => {
  const loop = new Loop(
    () => {},
    () => {},
  );

  loop.start();
  frame(0);
  loop.stop();

  expect(nextFrame).toBeNull();
});
