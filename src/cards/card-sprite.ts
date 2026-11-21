import Card from "../card/card";
import Spring from "../engine/spring";
import { DisplayObject } from "../engine/display-list";
import { drawCardFace } from "./draw-card";

/**
 * A gentle idle rock so resting cards never look frozen.
 */
const SWAY_ANGLE = 0.02;
const SWAY_SPEED = 1.3;

/**
 * How one Card looks and moves on screen.
 * Position and rotation are springs: moveTo() sets targets and update() chases them.
 */
export default class CardSprite implements DisplayObject {
  private card: Card;
  private x: Spring;
  private y: Spring;
  private rotation: Spring;
  private depth: number;
  private age: number;

  constructor(card: Card) {
    this.card = card;
    this.x = new Spring(0);
    this.y = new Spring(0);
    this.rotation = new Spring(0);
    this.depth = 0;
    this.age = 0;
  }

  getCard(): Card {
    return this.card;
  }

  getDepth(): number {
    return this.depth;
  }

  setDepth(depth: number): void {
    this.depth = depth;
  }

  /** Puts the card somewhere instantly, e.g. off-screen before it's dealt. */
  placeAt(x: number, y: number, rotation = 0): void {
    this.x.snap(x);
    this.y.snap(y);
    this.rotation.snap(rotation);
  }

  moveTo(x: number, y: number, rotation = 0): void {
    this.x.setTarget(x);
    this.y.setTarget(y);
    this.rotation.setTarget(rotation);
  }

  update(dt: number): void {
    this.x.update(dt);
    this.y.update(dt);
    this.rotation.update(dt);
    this.age += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const sway = Math.sin(this.age * SWAY_SPEED) * SWAY_ANGLE;

    ctx.save();
    ctx.translate(this.x.getValue(), this.y.getValue());
    ctx.rotate(this.rotation.getValue() + sway);
    drawCardFace(ctx, this.card);
    ctx.restore();
  }
}
