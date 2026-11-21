export interface DisplayObject {
  getDepth(): number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
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
    const byDepth = [...this.objects].sort(
      (a, b) => a.getDepth() - b.getDepth(),
    );
    for (const object of byDepth) {
      object.draw(ctx);
    }
  }
}
