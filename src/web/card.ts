import GameCard from "../game/card";
import { Suite } from "../game/card.types";
import Spring from "./spring";
import { DisplayObject } from "./scene";

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 286;

const CORNER_RADIUS = 10;
const PAPER = "#ffffff";
const BORDER = "#25231f";
const RED_INK = "#b63d37";
const BLACK_INK = "#25231f";
const RED_SUITES: Suite[] = ["♥︎", "♦︎"];

const RANK_FONT = 'bold 30px "Whyte Inktrap Heavy", sans-serif';
const CORNER_SUITE_FONT = 'bold 20px "Whyte Inktrap Heavy", sans-serif';
const CENTER_SUITE_FONT = '50px "Whyte Inktrap Regular", sans-serif';

const LEFT = -CARD_WIDTH / 2;
const TOP = -CARD_HEIGHT / 2;

const BACK_INSET = 12;
const BACK_CORNER_RADIUS = 6;

/**
 * How much bigger the card grows at the middle of a flip, as if lifted off
 * the table to turn it.
 */
const FLIP_LIFT = 0.12;

/**
 * How one Card looks and moves on screen.
 * Position and rotation are springs: moveTo() sets targets and update() chases them.
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
  private flip: Spring;
  private depth: number;
  private age: number;

  constructor(card: GameCard) {
    this.card = card;
    this.x = new Spring(0);
    this.y = new Spring(0);
    this.rotation = new Spring(0);
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

  isTappable(): boolean {
    return !this.card.getPlayed();
  }

  update(dt: number): void {
    this.flip.setTarget(this.card.getPlayed() ? 1 : 0);

    this.x.update(dt);
    this.y.update(dt);
    this.rotation.update(dt);
    this.flip.update(dt);
    this.age += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x.getValue(), this.y.getValue());
    ctx.rotate(this.rotation.getValue());
    ctx.scale(this.getWidthScale(), this.getLift());

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
      Math.abs(localY) <= (CARD_HEIGHT / 2) * this.getLift()
    );
  }

  /**
   * The card narrows to an edge and widens again as it turns over.
   * The value goes negative on the back half of the turn.
   */
  private getWidthScale(): number {
    return Math.cos(Math.PI * this.flip.getValue()) * this.getLift();
  }

  private getLift(): number {
    return 1 + FLIP_LIFT * Math.sin(Math.PI * this.flip.getValue());
  }

  private isFaceDown(): boolean {
    return this.flip.getValue() > 0.5;
  }
}

/**
 * A placeholder back until the real design exists: plain paper with a solid
 * ink panel. It is symmetric, so being drawn mirrored after a flip is invisible.
 */
function drawBack(ctx: CanvasRenderingContext2D) {
  drawPaper(ctx);

  ctx.beginPath();
  ctx.roundRect(
    LEFT + BACK_INSET,
    TOP + BACK_INSET,
    CARD_WIDTH - BACK_INSET * 2,
    CARD_HEIGHT - BACK_INSET * 2,
    BACK_CORNER_RADIUS,
  );
  ctx.fillStyle = BLACK_INK;
  ctx.fill();
}

/**
 * Draws a card face centred on the current origin.
 */
function drawFace(ctx: CanvasRenderingContext2D, card: GameCard) {
  drawPaper(ctx);

  ctx.fillStyle = RED_SUITES.includes(card.getSuite()) ? RED_INK : BLACK_INK;

  drawCorner(ctx, card);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = CENTER_SUITE_FONT;
  ctx.fillText(card.getSuite(), 0, 0);

  ctx.save();
  ctx.rotate(Math.PI);
  drawCorner(ctx, card);
  ctx.restore();
}

function drawPaper(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.roundRect(LEFT, TOP, CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = BORDER;
  ctx.stroke();
}

function drawCorner(ctx: CanvasRenderingContext2D, card: GameCard) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = RANK_FONT;
  ctx.fillText(card.getRank(), LEFT + 9, TOP + 7);
  ctx.font = CORNER_SUITE_FONT;
  ctx.fillText(card.getSuite(), LEFT + 10, TOP + 40);
}
