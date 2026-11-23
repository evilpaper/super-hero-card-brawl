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
 * How much a card grows while the pointer is over it, on top of the size
 * its Slot gave it. The card comes off the table without leaving its Slot.
 */
const HOVER_SCALE = 1.15;

/**
 * Drawn above the other cards in the Wave while the pointer is over it,
 * so the lifted card is not covered by a neighbour.
 */
const HOVER_DEPTH = 8;

/**
 * A fast spring, kicked once as the pointer arrives, so the card flicks
 * and settles instead of slowly twisting with the pose spring.
 */
const SHAKE_STIFFNESS = 1400;
const SHAKE_DAMPING = 22;
const SHAKE_KICK = 8;

/**
 * While a card is in the hand it stays with the pointer and does not
 * overshoot, so crossing a Slot does not bounce it back into the previous one.
 * Letting go restores the usual spring, and the card wobbles into its Slot.
 */
const GRAB_STIFFNESS = 900;
const GRAB_DAMPING = 60;

/**
 * How far, in radians, a card leans per pixel per second of sideways speed,
 * and the most it may lean. The top trails the motion.
 */
const LEAN_PER_SPEED = 0.0005;
const LEAN_MAX = 0.5;

/**
 * How one Card looks and moves on screen.
 * Position, rotation and scale are springs: moveTo() sets targets and
 * update() chases them. Scale is relative to CARD_WIDTH by CARD_HEIGHT.
 *
 * The flip is a spring from 0 (face up) to 1 (face down). Its target follows
 * whether the game card is played, so the view never keeps its own copy of
 * that state.
 *
 * Hover is more springs on top of that pose: a lift and a short flick as
 * the pointer arrives. moveTo() still owns where the card sits.
 */
export default class Card implements DisplayObject {
  private card: GameCard;
  private x: Spring;
  private y: Spring;
  private rotation: Spring;
  private scale: Spring;
  private flip: Spring;
  private hover: Spring;
  private shake: Spring;
  private pointerX: number | null;
  private grabbed: boolean;
  private previousX: number;
  private depth: number;
  private age: number;

  constructor(card: GameCard) {
    this.card = card;
    this.x = new Spring(0);
    this.y = new Spring(0);
    this.rotation = new Spring(0);
    this.scale = new Spring(1);
    this.flip = new Spring(card.getPlayed() ? 1 : 0, 200, 18);
    this.hover = new Spring(0);
    this.shake = new Spring(0, SHAKE_STIFFNESS, SHAKE_DAMPING);
    this.pointerX = null;
    this.grabbed = false;
    this.previousX = 0;
    this.depth = 0;
    this.age = 0;
  }

  getCard(): GameCard {
    return this.card;
  }

  getDepth(): number {
    const lifted = this.pointerX !== null || this.grabbed;
    return this.depth + (lifted ? HOVER_DEPTH : 0);
  }

  getX(): number {
    return this.x.getValue();
  }

  getY(): number {
    return this.y.getValue();
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
    this.previousX = x;
  }

  /**
   * Picks the card up. It stays lifted, draws above the Wave, and tracks
   * the pointer without the usual overshoot. The pointer can leave it.
   */
  grab(): void {
    this.grabbed = true;
    this.x.tune(GRAB_STIFFNESS, GRAB_DAMPING);
    this.y.tune(GRAB_STIFFNESS, GRAB_DAMPING);
  }

  /**
   * Puts the card back on the table's springs. Where it sits is someone
   * else's decision.
   */
  letGo(): void {
    this.grabbed = false;
    this.x.restore();
    this.y.restore();
  }

  /**
   * Aims a held card at the pointer. Rotation is left alone so the lean
   * can follow the card's own sideways speed.
   */
  follow(x: number, y: number, scale: number): void {
    this.x.setTarget(x);
    this.y.setTarget(y);
    this.scale.setTarget(scale);
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

  /**
   * Where the pointer is while it rests on this card, in game space.
   * Null when the pointer is elsewhere. Arriving kicks the flick.
   */
  setPointer(x: number | null, y: number | null): void {
    const over = x !== null && y !== null;
    const arrived = over && this.pointerX === null;
    this.pointerX = over ? x : null;

    if (arrived) {
      this.shake.kick(SHAKE_KICK);
    }
  }

  update(dt: number): void {
    this.flip.setTarget(this.card.getPlayed() ? 1 : 0);
    const lifted = this.pointerX !== null || this.grabbed;
    this.hover.setTarget(lifted ? 1 : 0);

    this.x.update(dt);
    this.y.update(dt);

    if (this.grabbed && dt > 0) {
      const speed = (this.x.getValue() - this.previousX) / dt;
      const lean = -speed * LEAN_PER_SPEED;
      this.rotation.setTarget(Math.min(LEAN_MAX, Math.max(-LEAN_MAX, lean)));
    }

    this.previousX = this.x.getValue();
    this.rotation.update(dt);
    this.scale.update(dt);
    this.flip.update(dt);
    this.hover.update(dt);
    this.shake.update(dt);
    this.age += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x.getValue(), this.y.getValue());
    ctx.rotate(this.rotation.getValue() + this.shake.getValue());
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
    const hover = 1 + (HOVER_SCALE - 1) * this.hover.getValue();
    return this.scale.getValue() * lift * hover;
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
