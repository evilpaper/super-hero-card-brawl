import { expect, test } from "vitest";
import Script from "./script";

test("A step should run once its delay has passed", () => {
  const script = new Script();
  const ran: string[] = [];
  script.after(0.1, () => ran.push("a"));

  script.update(0.05);
  expect(ran).toEqual([]);

  script.update(0.05);
  expect(ran).toEqual(["a"]);
});

test("Each step should wait its delay after the previous step ran", () => {
  const script = new Script();
  const ran: string[] = [];
  script.after(0, () => ran.push("a"));
  script.after(0.1, () => ran.push("b"));
  script.after(0.1, () => ran.push("c"));

  script.update(0);
  expect(ran).toEqual(["a"]);

  script.update(0.1);
  expect(ran).toEqual(["a", "b"]);

  script.update(0.1);
  expect(ran).toEqual(["a", "b", "c"]);
});

test("A long frame should run every step that became due, in order", () => {
  const script = new Script();
  const ran: string[] = [];
  script.after(0.1, () => ran.push("a"));
  script.after(0.1, () => ran.push("b"));

  script.update(0.25);

  expect(ran).toEqual(["a", "b"]);
});

test("Idle time should not count toward a step added later", () => {
  const script = new Script();
  const ran: string[] = [];

  script.update(1);
  script.after(0.1, () => ran.push("a"));
  script.update(0);

  expect(ran).toEqual([]);
});
