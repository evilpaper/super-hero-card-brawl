import { expect, test } from "vitest";
import Title from "./title";

function fakeImage(): HTMLImageElement {
  return { src: "", complete: false, naturalWidth: 0 } as HTMLImageElement;
}

test("Title shows on construction and dismiss hides it", () => {
  const title = new Title(fakeImage());

  expect(title.isShowing()).toBe(true);

  title.dismiss();

  expect(title.isShowing()).toBe(false);
});

test("A primary pointer down dismisses the title once", () => {
  const title = new Title(fakeImage());

  title.handlePointerDown({ isPrimary: true });
  expect(title.isShowing()).toBe(false);

  title.handlePointerDown({ isPrimary: true });
  expect(title.isShowing()).toBe(false);
});

test("A key dismisses the title", () => {
  const title = new Title(fakeImage());
  let prevented = false;

  title.handleKey({
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    preventDefault() {
      prevented = true;
    },
  });

  expect(title.isShowing()).toBe(false);
  expect(prevented).toBe(true);
});

test("draw is a no-op after dismiss", () => {
  const title = new Title(fakeImage());
  title.layout(800, 600);
  title.dismiss();

  const calls: string[] = [];
  const ctx = {
    fillRect: () => calls.push("fill"),
    drawImage: () => calls.push("image"),
    fillStyle: "",
  } as unknown as CanvasRenderingContext2D;

  title.draw(ctx);

  expect(calls).toEqual([]);
});
