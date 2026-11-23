import Scene, { DisplayObject } from "./scene";

/**
 * How far, in CSS pixels, a pointer may move between press and release and
 * still count as a tap. Moving further is a drag, which never taps.
 */
export const TAP_SLOP = 8;

type TapHandler = (object: DisplayObject) => void;

/**
 * The one place pointer input enters the game. It finds what is under the
 * pointer and decides whether a press became a tap; what a tap means is left
 * to the handler, so objects never listen for input themselves.
 *
 * A tap is a press and release on the same tappable object without moving
 * more than TAP_SLOP. Releasing elsewhere cancels it, so a slipped thumb can
 * back out of a play.
 *
 * Every move is also reported to the scene, so a card under the pointer
 * can lift. While locked, presses are ignored and cards are not told about
 * the pointer. That is about the moment, such as a Wave changing, rather
 * than about any one object being tappable. The position is kept, so the
 * lift resumes where the pointer still is.
 */
export default class Input {
  private scene: Scene;
  private onTap: TapHandler;
  private pressed: DisplayObject | null;
  private pressX: number;
  private pressY: number;
  private locked: boolean;

  constructor(scene: Scene, onTap: TapHandler) {
    this.scene = scene;
    this.onTap = onTap;
    this.pressed = null;
    this.pressX = 0;
    this.pressY = 0;
    this.locked = false;
  }

  /**
   * A press already in progress is dropped, so it cannot land after the lock.
   */
  lock(): void {
    this.locked = true;
    this.pressed = null;
    this.scene.suspendPointer();
  }

  unlock(): void {
    this.locked = false;
    this.scene.resumePointer();
  }

  /**
   * Pointer events cover mouse, touch and pen alike. Only the primary pointer
   * is followed, and it is captured so a release outside the canvas still arrives.
   */
  listen(canvas: HTMLCanvasElement): void {
    const toLayout = (event: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };

    canvas.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) {
        return;
      }
      canvas.setPointerCapture(event.pointerId);
      const [x, y] = toLayout(event);
      this.press(x, y);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (event.isPrimary) {
        this.move(...toLayout(event));
      }
    });

    canvas.addEventListener("pointerup", (event) => {
      if (!event.isPrimary) {
        return;
      }
      const [x, y] = toLayout(event);
      this.release(x, y);

      /**
       * A touch has no pointer once the finger lifts, so the card must not
       * stay lifted. A mouse is still there and keeps the lift.
       */
      if (event.pointerType === "touch") {
        this.scene.clearPointer();
      }
    });

    canvas.addEventListener("pointerleave", () => this.scene.clearPointer());
    canvas.addEventListener("pointercancel", () => this.cancel());
  }

  press(x: number, y: number): void {
    if (this.locked) {
      return;
    }

    this.scene.pointAt(x, y);
    const target = this.scene.objectAt(x, y);
    this.pressed = target !== null && target.isTappable() ? target : null;
    this.pressX = x;
    this.pressY = y;
  }

  move(x: number, y: number): void {
    this.scene.pointAt(x, y);

    if (this.locked || this.pressed === null) {
      return;
    }

    if (Math.hypot(x - this.pressX, y - this.pressY) > TAP_SLOP) {
      this.pressed = null;
    }
  }

  release(x: number, y: number): void {
    const pressed = this.pressed;
    this.pressed = null;

    if (
      pressed !== null &&
      pressed.isTappable() &&
      this.scene.objectAt(x, y) === pressed
    ) {
      this.onTap(pressed);
    }
  }

  cancel(): void {
    this.pressed = null;
    this.scene.clearPointer();
  }
}
