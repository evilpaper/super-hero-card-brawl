import GameCard from "../game/card";
import { Suite } from "../game/card.types";

/**
 * Card faces in the style of the deck-of-cards-visualizer reference. All art
 * is authored in a 512 by 716 space with the origin at the top-left corner.
 */
export const ART_WIDTH = 512;
export const ART_HEIGHT = 716;

export const CARD_STOCK = "#fbf8ef";
export const BLACK = "#1d1c22";
const RED = "#c9252d";
const RED_SUITES: Suite[] = ["♥︎", "♦︎"];

/**
 * Standard pip positions for ranks 1-10, relative to the card centre. Pips on
 * the lower half of the card are drawn upside down, like a real deck.
 */
const PIP_COLUMN = 118;
const FOUR_ROWS = [-215, -72, 72, 215];

function sideColumns(rows: number[]): number[][] {
  const spots: number[][] = [];
  for (const y of rows) {
    spots.push([-PIP_COLUMN, y], [PIP_COLUMN, y]);
  }
  return spots;
}

const PIP_LAYOUTS: Record<number, number[][]> = {
  1: [[0, 0]],
  2: [[0, -215], [0, 215]],
  3: [[0, -215], [0, 0], [0, 215]],
  4: sideColumns([-215, 215]),
  5: [...sideColumns([-215, 215]), [0, 0]],
  6: sideColumns([-215, 0, 215]),
  7: [...sideColumns([-215, 0, 215]), [0, -108]],
  8: [...sideColumns([-215, 0, 215]), [0, -108], [0, 108]],
  9: [...sideColumns(FOUR_ROWS), [0, 0]],
  10: [...sideColumns(FOUR_ROWS), [0, -143], [0, 143]],
};

function inkFor(suite: Suite) {
  return RED_SUITES.includes(suite) ? RED : BLACK;
}

/**
 * The heart is also the body of the spade, flipped upside down.
 */
function traceHeart(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.bezierCurveTo(-46, 6, -46, -38, -18, -38);
  ctx.bezierCurveTo(-7, -38, -1, -30, 0, -22);
  ctx.bezierCurveTo(1, -30, 7, -38, 18, -38);
  ctx.bezierCurveTo(46, -38, 46, 6, 0, 34);
  ctx.fill();
}

function traceStem(ctx: CanvasRenderingContext2D, fromY: number) {
  ctx.beginPath();
  ctx.moveTo(0, fromY);
  ctx.quadraticCurveTo(-2, 26, -13, 40);
  ctx.lineTo(13, 40);
  ctx.quadraticCurveTo(2, 26, 0, fromY);
  ctx.fill();
}

function drawPip(
  ctx: CanvasRenderingContext2D,
  suite: Suite,
  x: number,
  y: number,
  size: number,
  upsideDown: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  if (upsideDown) ctx.rotate(Math.PI);
  ctx.scale(size / 100, size / 100);
  ctx.fillStyle = inkFor(suite);

  if (suite === "♥︎") {
    traceHeart(ctx);
  } else if (suite === "♦︎") {
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.quadraticCurveTo(-18, -18, -30, 0);
    ctx.quadraticCurveTo(-18, 18, 0, 40);
    ctx.quadraticCurveTo(18, 18, 30, 0);
    ctx.quadraticCurveTo(18, -18, 0, -40);
    ctx.fill();
  } else if (suite === "♠︎") {
    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(0, 6);
    traceHeart(ctx);
    ctx.restore();
    traceStem(ctx, 10);
  } else {
    /**
     * A club is three leaves and a stem.
     */
    const leaves = [
      [0, -21],
      [-15.5, 3],
      [15.5, 3],
    ];
    for (const [leafX, leafY] of leaves) {
      ctx.beginPath();
      ctx.arc(leafX, leafY, 16.5, 0, Math.PI * 2);
      ctx.fill();
    }
    traceStem(ctx, 2);
  }

  ctx.restore();
}

/**
 * Draws the face over the card stock. Corner indices are drawn twice, the
 * second time turned half a circle for the opposite corner.
 */
export function drawFaceArt(ctx: CanvasRenderingContext2D, card: GameCard) {
  const suite = card.getSuite();
  const rank = card.getRank();
  const color = inkFor(suite);

  const drawCornerIndex = () => {
    ctx.fillStyle = color;
    ctx.font = "700 60px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(rank, 52, 74);
    drawPip(ctx, suite, 52, 140, 38, false);
  };
  drawCornerIndex();
  ctx.save();
  ctx.translate(ART_WIDTH, ART_HEIGHT);
  ctx.rotate(Math.PI);
  drawCornerIndex();
  ctx.restore();

  const centerX = ART_WIDTH / 2;
  const centerY = ART_HEIGHT / 2;

  if (rank === "A") {
    drawPip(ctx, suite, centerX, centerY, suite === "♠︎" ? 300 : 230, false);
  } else if (rank === "J" || rank === "Q" || rank === "K" || rank === "D") {
    drawCourtCard(ctx, rank, suite, color);
  } else {
    for (const [pipX, pipY] of PIP_LAYOUTS[parseInt(rank)]) {
      drawPip(ctx, suite, centerX + pipX, centerY + pipY, 100, pipY > 0);
    }
  }
}

/**
 * Courts, and the Donsols, are an ornate monogram rather than painted figures.
 */
function drawCourtCard(
  ctx: CanvasRenderingContext2D,
  label: string,
  suite: Suite,
  color: string,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(96, 96, 320, 524);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(106, 106, 300, 504);
  ctx.beginPath();
  ctx.moveTo(106, 106);
  ctx.lineTo(406, 610);
  ctx.stroke();

  const drawHalf = () => {
    ctx.fillStyle = color;
    ctx.font = "700 168px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 178, 226);
    drawPip(ctx, suite, 178, 404, 80, false);
  };
  drawHalf();
  ctx.save();
  ctx.translate(ART_WIDTH, ART_HEIGHT);
  ctx.rotate(Math.PI);
  drawHalf();
  ctx.restore();

  /**
   * A small diamond ornament where the halves meet.
   */
  ctx.save();
  ctx.translate(ART_WIDTH / 2, ART_HEIGHT / 2);
  ctx.rotate(Math.PI / 4);
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -20, 40, 40);
  ctx.restore();
}
