import Card from "../card/card";
import { Suite } from "../card/card.types";

export const CARD_WIDTH = 112;
export const CARD_HEIGHT = 158;

const CORNER_RADIUS = 10;
const PAPER = "#f5f0e5";
const RED_INK = "#b63d37";
const BLACK_INK = "#25231f";
const RED_SUITES: Suite[] = ["♥︎", "♦︎"];

const RANK_FONT = 'bold 20px "Whyte Inktrap Heavy", sans-serif';
const CORNER_SUITE_FONT = 'bold 14px "Whyte Inktrap Heavy", sans-serif';
const CENTER_SUITE_FONT = '49px "Whyte Inktrap Regular", sans-serif';

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
  /**
   * The shadow is drawn with its own fill so it doesn't also blur the strokes.
   */
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;
  ctx.beginPath();
  ctx.roundRect(LEFT, TOP, CARD_WIDTH, CARD_HEIGHT, CORNER_RADIUS);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.restore();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(37, 35, 31, 0.2)";
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(
    LEFT + 3,
    TOP + 3,
    CARD_WIDTH - 6,
    CARD_HEIGHT - 6,
    CORNER_RADIUS - 3,
  );
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.stroke();
}

function drawCorner(ctx: CanvasRenderingContext2D, card: Card) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = RANK_FONT;
  ctx.fillText(card.getRank(), LEFT + 9, TOP + 7);
  ctx.font = CORNER_SUITE_FONT;
  ctx.fillText(card.getSuite(), LEFT + 10, TOP + 29);
}
