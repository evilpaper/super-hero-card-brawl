export interface DisplayObject {
  getDepth(): number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;

  /**
   * Whether a point in game space falls on the object as it is drawn now.
   */
  contains(x: number, y: number): boolean;

  /**
   * Whether a tap on the object should reach the tap handler. An object that
   * is not tappable still blocks taps to anything beneath it.
   */
  isTappable(): boolean;

  /**
   * Where the pointer is while it rests on this object, in game space.
   * Null when the pointer is on something else or has left.
   */
  setPointer(x: number | null, y: number | null): void;
}

/**
 * What is on screen right now.
 * Drawn lowest depth first, so higher depth ends up on top.
 */
export default class Scene {
  private objects: DisplayObject[];
  private pointerX: number | null;
  private pointerY: number | null;
  private pointerSuspended: boolean;

  constructor() {
    this.objects = [];
    this.pointerX = null;
    this.pointerY = null;
    this.pointerSuspended = false;
  }

  add(object: DisplayObject): void {
    this.objects.push(object);
  }

  remove(object: DisplayObject): void {
    this.objects = this.objects.filter((other) => other !== object);
  }

  /**
   * The pointer moved. The object under it is told on the next placement,
   * which also runs after every update so a card that slides away loses it.
   */
  pointAt(x: number, y: number): void {
    this.pointerX = x;
    this.pointerY = y;
    this.placePointer();
  }

  /**
   * The pointer left the table.
   */
  clearPointer(): void {
    this.pointerX = null;
    this.pointerY = null;
    this.placePointer();
  }

  /**
   * A Wave change keeps the pointer's position but stops telling cards about
   * it, so nothing lifts while cards are arriving or leaving.
   */
  suspendPointer(): void {
    this.pointerSuspended = true;
    this.placePointer();
  }

  resumePointer(): void {
    this.pointerSuspended = false;
    this.placePointer();
  }

  update(dt: number): void {
    for (const object of this.objects) {
      object.update(dt);
    }

    this.placePointer();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const object of this.byDepth()) {
      object.draw(ctx);
    }
  }

  /**
   * The object drawn on top at a point, or null if the point is empty.
   */
  objectAt(x: number, y: number): DisplayObject | null {
    const topFirst = this.byDepth().reverse();
    return topFirst.find((object) => object.contains(x, y)) ?? null;
  }

  private byDepth(): DisplayObject[] {
    return [...this.objects].sort((a, b) => a.getDepth() - b.getDepth());
  }

  private placePointer(): void {
    const x = this.pointerX;
    const y = this.pointerY;
    const target =
      !this.pointerSuspended && x !== null && y !== null
        ? this.objectAt(x, y)
        : null;

    for (const object of this.objects) {
      if (object === target && x !== null && y !== null) {
        object.setPointer(x, y);
      } else {
        object.setPointer(null, null);
      }
    }
  }
}
