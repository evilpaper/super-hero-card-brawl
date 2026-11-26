import { expect, test } from "vitest";
import KnockedOut from "./knocked-out";

test("KnockedOut is hidden until show", () => {
  const knockedOut = new KnockedOut();
  knockedOut.layout(1400, 800);

  expect(knockedOut.isShowing()).toBe(false);

  knockedOut.show();

  expect(knockedOut.isShowing()).toBe(true);

  knockedOut.hide();

  expect(knockedOut.isShowing()).toBe(false);
});

test("draw is a no-op while hidden", () => {
  const knockedOut = new KnockedOut();
  knockedOut.layout(1400, 800);

  const calls: string[] = [];
  const ctx = {
    fillRect: () => calls.push("fill"),
    fillText: () => calls.push("text"),
    stroke: () => calls.push("stroke"),
    beginPath: () => {},
    moveTo: () => {},
    arcTo: () => {},
    closePath: () => {},
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    textAlign: "left",
    textBaseline: "top",
  } as unknown as CanvasRenderingContext2D;

  knockedOut.draw(ctx);

  expect(calls).toEqual([]);
});

test("draw dims the table and paints the loss line while showing", () => {
  const knockedOut = new KnockedOut();
  knockedOut.layout(1400, 800);
  knockedOut.show();

  const texts: string[] = [];
  const ctx = {
    fillRect: () => {},
    fillText: (text: string) => texts.push(text),
    stroke: () => {},
    beginPath: () => {},
    moveTo: () => {},
    arcTo: () => {},
    closePath: () => {},
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    textAlign: "left",
    textBaseline: "top",
  } as unknown as CanvasRenderingContext2D;

  knockedOut.draw(ctx);

  expect(texts).toContain("Ouch, you are knocked out!");
  expect(texts).toContain("Restart");
});

test("Restart hit area is live only while showing", () => {
  const knockedOut = new KnockedOut();
  knockedOut.layout(1400, 800);

  expect(knockedOut.hitRestart(1200, 700)).toBe(false);

  knockedOut.show();

  /**
   * Walk a coarse grid and find at least one hit; the pill sits under the
   * rightmost card, so its exact pixels depend on arrange().
   */
  let hit = false;
  for (let x = 0; x < 1400; x += 8) {
    for (let y = 0; y < 800; y += 8) {
      if (knockedOut.hitRestart(x, y)) {
        hit = true;
        expect(knockedOut.hitRestart(0, 0)).toBe(false);
        break;
      }
    }
    if (hit) {
      break;
    }
  }

  expect(hit).toBe(true);
});
