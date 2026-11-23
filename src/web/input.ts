import Scene, { DisplayObject } from "./scene";

/**
 * How far, in CSS pixels, a pointer may move between press and release and
 * still count as a tap. Moving further is a drag, which never taps.
 */
export const TAP_SLOP = 8;

type TapHandler = (object: DisplayObject) => void;

/**
 * What a held object does while the pointer moves it. A tap is still a
 * separate decision: moving past TAP_SLOP picks the object up and never taps.
 */
interface Hold {
  grab(object: DisplayObject): void;
  move(object: DisplayObject, x: number, y: number): void;
  drop(object: DisplayObject): void;
}

/**
 * The one place pointer input enters the game. It finds what is under the
 * pointer and decides whether a press became a tap or a drag; what either
 * means is left to the handlers, so objects never listen for input themselves.
 *
 * A tap is a press and release on the same tappable object without moving
 * more than TAP_SLOP. Releasing elsewhere cancels it, so a slipped thumb can
 * back out of a play. Moving further picks the object up, played or not,
 * and releasing drops it. A drag never taps.
 *
 * Every move is also reported to the scene, so a card under the pointer
 * can lift. A drag stops that, so the card underneath does not lift too.
 * While locked, presses are ignored and cards are not told about the
 * pointer. That is about the moment, such as a Wave changing, rather
 * than about any one object being tappable. The position is kept, so the
 * lift resumes where the pointer still is. A drag already in hand is dropped.
 */
export default class Input {
  private scene: Scene;
  private onTap: TapHandler;
  private hold: Hold | null;
  private pressed: DisplayObject | null;
  private dragging: boolean;
  private pressX: number;
  private pressY: number;
  private locked: boolean;

  constructor(scene: Scene, onTap: TapHandler, hold: Hold | null = null) {
    this.scene = scene;
    this.onTap = onTap;
    this.hold = hold;
    this.pressed = null;
    this.dragging = false;
    this.pressX = 0;
    this.pressY = 0;
    this.locked = false;
  }

  /**
   * A press already in progress is dropped, so it cannot land after the lock.
   */
  lock(): void {
    this.dropHeld();
    this.locked = true;
    this.pressed = null;
    this.dragging = false;
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
    this.pressed = this.scene.objectAt(x, y);
    this.dragging = false;
    this.pressX = x;
    this.pressY = y;
  }

  move(x: number, y: number): void {
    if (this.dragging && this.pressed !== null && this.hold !== null) {
      this.hold.move(this.pressed, x, y);
      return;
    }

    this.scene.pointAt(x, y);

    if (this.locked || this.pressed === null) {
      return;
    }

    if (Math.hypot(x - this.pressX, y - this.pressY) <= TAP_SLOP) {
      return;
    }

    if (this.hold === null) {
      this.pressed = null;
      return;
    }

    this.dragging = true;
    this.scene.clearPointer();
    this.hold.grab(this.pressed);
    this.hold.move(this.pressed, x, y);
  }

  release(x: number, y: number): void {
    const pressed = this.pressed;
    const dragging = this.dragging;
    this.pressed = null;
    this.dragging = false;

    if (dragging && pressed !== null && this.hold !== null) {
      this.hold.drop(pressed);
      this.scene.pointAt(x, y);
      return;
    }

    if (
      pressed !== null &&
      pressed.isTappable() &&
      this.scene.objectAt(x, y) === pressed
    ) {
      this.onTap(pressed);
    }
  }

  cancel(): void {
    this.dropHeld();
    this.pressed = null;
    this.dragging = false;
    this.scene.clearPointer();
  }

  /**
   * A lock or a cancel lets go of a card already in the hand, so it can
   * spring home before the Wave moves on.
   */
  private dropHeld(): void {
    if (this.dragging && this.pressed !== null && this.hold !== null) {
      this.hold.drop(this.pressed);
    }
  }
}
