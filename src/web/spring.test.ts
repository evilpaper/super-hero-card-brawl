import { expect, test } from "vitest";
import Spring from "./spring";

function run(spring: Spring, seconds: number) {
  for (let t = 0; t < seconds; t += 1 / 60) {
    spring.update(1 / 60);
  }
}

test("Spring should stay put until given a new target", () => {
  const spring = new Spring(5);
  run(spring, 1);
  expect(spring.getValue()).toBe(5);
});

test("Spring should settle on its target", () => {
  const spring = new Spring(0);
  spring.setTarget(100);
  run(spring, 3);
  expect(spring.getValue()).toBeCloseTo(100, 1);
});

test("Spring with low damping should overshoot its target", () => {
  const spring = new Spring(0, 170, 10);
  spring.setTarget(100);

  let highest = 0;
  for (let t = 0; t < 2; t += 1 / 60) {
    spring.update(1 / 60);
    highest = Math.max(highest, spring.getValue());
  }

  expect(highest).toBeGreaterThan(100);
});

test("Spring should stay stable when given one long step", () => {
  const spring = new Spring(0, 2000, 40);
  spring.setTarget(100);
  spring.update(1);
  expect(spring.getValue()).toBeCloseTo(100, 0);
});

test("snap should jump to a value and stop moving", () => {
  const spring = new Spring(0);
  spring.setTarget(100);
  spring.update(0.1);
  spring.snap(50);
  run(spring, 1);
  expect(spring.getValue()).toBe(50);
});

test("kick should move the value and then return to the target", () => {
  const spring = new Spring(0);
  spring.kick(50);
  spring.update(1 / 60);
  expect(spring.getValue()).toBeGreaterThan(0);

  run(spring, 3);
  expect(spring.getValue()).toBeCloseTo(0, 1);
});
