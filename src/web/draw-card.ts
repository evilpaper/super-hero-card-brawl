import Card from "../game/card";
import { Suite } from "../game/card.types";

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

/** Draws a card face centred on the current origin. */
export function drawCardFace(ctx: CanvasRenderingContext2D, card: Card) {
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

function drawCorner(ctx: CanvasRenderingContext2D, card: Card) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = RANK_FONT;
  ctx.fillText(card.getRank(), LEFT + 9, TOP + 7);
  ctx.font = CORNER_SUITE_FONT;
  ctx.fillText(card.getSuite(), LEFT + 10, TOP + 40);
}
