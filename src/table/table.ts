import CardSprite from "./card-sprite";

/**
 * Everything drawn on the table, kept in one flat list.
 * Sprites are drawn lowest depth first, so higher depth ends up on top.
 */
export default class Table {
  private sprites: CardSprite[];

  constructor() {
    this.sprites = [];
  }

  add(sprite: CardSprite): void {
    this.sprites.push(sprite);
  }

  update(dt: number): void {
    for (const sprite of this.sprites) {
      sprite.update(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    drawBackground(ctx, width, height);

    const byDepth = [...this.sprites].sort(
      (a, b) => a.getDepth() - b.getDepth(),
    );
    for (const sprite of byDepth) {
      sprite.draw(ctx);
    }
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}
