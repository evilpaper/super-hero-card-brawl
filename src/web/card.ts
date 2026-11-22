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

/**
 * How one Card looks and moves on screen.
 * Position and rotation are springs: moveTo() sets targets and update() chases them.
 */
export default class Card implements DisplayObject {
  private card: GameCard;
  private x: Spring;
  private y: Spring;
  private rotation: Spring;
  private depth: number;
  private age: number;

  constructor(card: GameCard) {
    this.card = card;
    this.x = new Spring(0);
    this.y = new Spring(0);
    this.rotation = new Spring(0);
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

  update(dt: number): void {
    this.x.update(dt);
    this.y.update(dt);
    this.rotation.update(dt);
    this.age += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x.getValue(), this.y.getValue());
    ctx.rotate(this.rotation.getValue());
    drawFace(ctx, this.card);
    ctx.restore();
  }
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
