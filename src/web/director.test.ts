import { expect, test } from "vitest";
import Director from "./director";
import Input from "./input";
import Overlay from "./overlay";
import Scene from "./scene";

function setup() {
  const scene = new Scene();
  const restarts: number[] = [];
  const input = new Input(scene, () => {});
  const director = new Director(scene, input, () => {
    restarts.push(1);
  });
  director.layout(800, 600);
  return { scene, input, director, restarts };
}

test("showTitle mounts a title overlay and is not playing", () => {
  const { director, scene } = setup();

  director.showTitle();

  expect(director.getMode()).toBe("title");
  expect(director.isPlaying()).toBe(false);
  expect(director.getScreen()).toBeInstanceOf(Overlay);
  expect(scene.objectAt(400, 300)).toBeInstanceOf(Overlay);
});

test("dismissTitle clears the overlay and returns to playing", () => {
  const { director, scene } = setup();
  director.showTitle();

  director.dismissTitle();

  expect(director.getMode()).toBe("playing");
  expect(director.isPlaying()).toBe(true);
  expect(director.getScreen()).toBeNull();
  expect(scene.objectAt(400, 300)).toBeNull();
});

test("A key dismisses the title", () => {
  const { director } = setup();
  director.showTitle();

  director.handleKey({
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    preventDefault() {},
  } as KeyboardEvent);

  expect(director.isPlaying()).toBe(true);
});

test("A pointer down dismisses the title", () => {
  const { director } = setup();
  director.showTitle();

  director.handlePointerDown({ isPrimary: true } as PointerEvent);

  expect(director.isPlaying()).toBe(true);
});

test("showKnockedOut mounts the knocked-out overlay", () => {
  const { director } = setup();

  director.showKnockedOut();

  expect(director.getMode()).toBe("knockedOut");
  expect((director.getScreen() as Overlay).getKind()).toBe("knockedOut");
});

test("showVictory mounts the victory overlay", () => {
  const { director } = setup();

  director.showVictory();

  expect(director.getMode()).toBe("victory");
  expect((director.getScreen() as Overlay).getKind()).toBe("victory");
});

test("Tapping Restart on an end Screen restarts into playing without a title", () => {
  const { director, restarts, scene } = setup();
  director.showKnockedOut();
  const overlay = director.getScreen() as Overlay;

  /**
   * Restart control sits at the bottom-right of the 800×600 layout.
   */
  director.handleOverlayTap(overlay, 800 - 48 - 80, 600 - 48 - 22);

  expect(restarts).toHaveLength(1);
  expect(director.isPlaying()).toBe(true);
  expect(director.getScreen()).toBeNull();
  expect(scene.objectAt(400, 300)).toBeNull();
});

test("Tapping outside Restart on an end Screen does nothing", () => {
  const { director, restarts } = setup();
  director.showVictory();
  const overlay = director.getScreen() as Overlay;

  director.handleOverlayTap(overlay, 400, 300);

  expect(restarts).toHaveLength(0);
  expect(director.getMode()).toBe("victory");
});
