import GameCard from "../game/card";
import Spring from "./spring";
import { DisplayObject } from "./scene";
import {
  ART_HEIGHT,
  ART_WIDTH,
  BLACK,
  CARD_STOCK,
  drawFaceArt,
} from "./face";
import { drawGuardiansBack } from "./guardians";

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 286;

const LEFT = -CARD_WIDTH / 2;
const TOP = -CARD_HEIGHT / 2;

/**
 * In art space, where both sides of the card are authored.
 */
const CORNER_RADIUS = 30;
const BORDER_WIDTH = 1;

/**
 * How much bigger the card grows at the middle of a flip, as if lifted off
 * the table to turn it.
 */
const FLIP_LIFT = 0.12;

/**
 * How one Card looks and moves on screen.
 * Position, rotation and scale are springs: moveTo() sets targets and
 * update() chases them. Scale is relative to CARD_WIDTH by CARD_HEIGHT.
 *
 * The flip is a spring from 0 (face up) to 1 (face down). Its target follows
 * whether the game card is played, so the view never keeps its own copy of
 * that state.
 */
export default class Card implements DisplayObject {
  private card: GameCard;
  private x: Spring;
  private y: Spring;
  private rotation: Spring;
  private scale: Spring;
  private flip: Spring;
  private depth: number;
  private age: number;

  constructor(card: GameCard) {
    this.card = card;
    this.x = new Spring(0);
    this.y = new Spring(0);
    this.rotation = new Spring(0);
    this.scale = new Spring(1);
    this.flip = new Spring(card.getPlayed() ? 1 : 0, 200, 18);
    this.depth = 0;
    this.age = 0;
  }

  getCard(): GameCard {
    return this.card;
  }

  getDepth(): number {
    return this.depth;
  }

  setDepth(depth: number): void {
    this.depth = depth;
  }

  /**
   * Puts the card somewhere instantly, e.g. off-screen before it's dealt.
   */
  placeAt(x: number, y: number, rotation = 0, scale = 1): void {
    this.x.snap(x);
    this.y.snap(y);
    this.rotation.snap(rotation);
    this.scale.snap(scale);
  }

  moveTo(x: number, y: number, rotation = 0, scale = 1): void {
    this.x.setTarget(x);
    this.y.setTarget(y);
    this.rotation.setTarget(rotation);
    this.scale.setTarget(scale);
  }

  isTappable(): boolean {
    return !this.card.getPlayed();
  }

  update(dt: number): void {
    this.flip.setTarget(this.card.getPlayed() ? 1 : 0);

    this.x.update(dt);
    this.y.update(dt);
    this.rotation.update(dt);
    this.scale.update(dt);
    this.flip.update(dt);
    this.age += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x.getValue(), this.y.getValue());
    ctx.rotate(this.rotation.getValue());
    ctx.scale(this.getWidthScale(), this.getHeightScale());

    if (this.isFaceDown()) {
      drawBack(ctx);
    } else {
      drawFace(ctx, this.card);
    }

    ctx.restore();
  }

  /**
   * The point is turned into the card's own unrotated space, so a tilted or
   * mid-flip card is hit exactly where it is drawn.
   */
  contains(x: number, y: number): boolean {
    const dx = x - this.x.getValue();
    const dy = y - this.y.getValue();
    const angle = -this.rotation.getValue();
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

    return (
      Math.abs(localX) <= (CARD_WIDTH / 2) * Math.abs(this.getWidthScale()) &&
      Math.abs(localY) <= (CARD_HEIGHT / 2) * this.getHeightScale()
    );
  }

  /**
   * The card narrows to an edge and widens again as it turns over.
   * The value goes negative on the back half of the turn.
   */
  private getWidthScale(): number {
    return Math.cos(Math.PI * this.flip.getValue()) * this.getHeightScale();
  }

  private getHeightScale(): number {
    const lift = 1 + FLIP_LIFT * Math.sin(Math.PI * this.flip.getValue());
    return this.scale.getValue() * lift;
  }

  private isFaceDown(): boolean {
    return this.flip.getValue() > 0.5;
  }
}

/**
 * The Guardians back. The flip leaves the back mirrored, so it is mirrored
 * once more here to read the right way round.
 */
function drawBack(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(-1, 1);
  drawOnStock(ctx, () => drawGuardiansBack(ctx));
  ctx.restore();
}

/**
 * Draws a card face centred on the current origin.
 */
function drawFace(ctx: CanvasRenderingContext2D, card: GameCard) {
  drawOnStock(ctx, () => drawFaceArt(ctx, card));
}

/**
 * Lays down the card stock in art space, outlines it so the card stands out
 * from a light table, and paints the art clipped to the rounded corners.
 */
function drawOnStock(ctx: CanvasRenderingContext2D, paint: () => void) {
  ctx.save();
  ctx.translate(LEFT, TOP);
  ctx.scale(CARD_WIDTH / ART_WIDTH, CARD_HEIGHT / ART_HEIGHT);

  ctx.beginPath();
  ctx.roundRect(0, 0, ART_WIDTH, ART_HEIGHT, CORNER_RADIUS);
  ctx.fillStyle = CARD_STOCK;
  ctx.fill();
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = BLACK;
  ctx.stroke();
  ctx.clip();

  paint();
  ctx.restore();
}
