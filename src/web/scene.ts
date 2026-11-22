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
}

/**
 * What is on screen right now.
 * Drawn lowest depth first, so higher depth ends up on top.
 */
export default class Scene {
  private objects: DisplayObject[];

  constructor() {
    this.objects = [];
  }

  add(object: DisplayObject): void {
    this.objects.push(object);
  }

  update(dt: number): void {
    for (const object of this.objects) {
      object.update(dt);
    }
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
}
