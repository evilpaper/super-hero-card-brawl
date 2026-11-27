import { CARD_HEIGHT, CARD_WIDTH } from "./card";
import { arrange } from "./slots";

const DIM = "rgba(0, 0, 0, 0.72)";
const INK = "#ffffff";
const MESSAGE = "Ouch, you are knocked out!";
const BUTTON_LABEL = "Restart";

/**
 * Restart pill size at full card scale, in CSS pixels.
 */
const BUTTON_WIDTH = 88;
const BUTTON_HEIGHT = 26;

/**
 * Gap between the card row and the Restart pill, in CSS pixels at full size.
 */
const BUTTON_GAP = 20;

/**
 * Stroke width of the Restart pill outline.
 */
const BUTTON_STROKE = 1.5;

/**
 * Knocked out overlay: dims the table, shows the loss line, and offers Restart.
 * The readout stays above this layer so Health 0 stays readable.
 */
export default class KnockedOut {
  private showing: boolean;
  private width: number;
  private height: number;
  private buttonX: number;
  private buttonY: number;
  private buttonW: number;
  private buttonH: number;

  constructor() {
    this.showing = false;
    this.width = 0;
    this.height = 0;
    this.buttonX = 0;
    this.buttonY = 0;
    this.buttonW = 0;
    this.buttonH = 0;
  }

  isShowing(): boolean {
    return this.showing;
  }

  show(): void {
    this.showing = true;
  }

  hide(): void {
    this.showing = false;
  }

  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.layoutButton();
  }

  /**
   * True when the point lands on the Restart pill while the overlay is up.
   */
  hitRestart(x: number, y: number): boolean {
    if (!this.showing) {
      return false;
    }

    return (
      x >= this.buttonX &&
      x <= this.buttonX + this.buttonW &&
      y >= this.buttonY &&
      y <= this.buttonY + this.buttonH
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.showing) {
      return;
    }

    ctx.fillStyle = DIM;
    ctx.fillRect(0, 0, this.width, this.height);

    const fontSize = messageSize(this.width);
    ctx.font = `bold ${fontSize}px "Whyte Inktrap Heavy", sans-serif`;
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(MESSAGE, this.width / 2, this.height / 2);

    this.drawRestart(ctx);
  }

  /**
   * @param onRestart - runs when the player presses the Restart pill.
   */
  listen(canvas: HTMLCanvasElement, onRestart: () => void): void {
    canvas.addEventListener("pointerdown", (event) => {
      if (!this.showing || !event.isPrimary) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (!this.hitRestart(x, y)) {
        return;
      }

      onRestart();
    });
  }

  private layoutButton(): void {
    if (this.width <= 0 || this.height <= 0) {
      return;
    }

    const { scale, centers } = arrange(this.width, this.height);
    this.buttonW = BUTTON_WIDTH * scale;
    this.buttonH = BUTTON_HEIGHT * scale;

    let right = centers[0].x;
    let bottom = centers[0].y;

    for (const center of centers) {
      right = Math.max(right, center.x);
      bottom = Math.max(bottom, center.y);
    }

    const cardRight = right + (CARD_WIDTH * scale) / 2;
    const cardBottom = bottom + (CARD_HEIGHT * scale) / 2;

    this.buttonX = cardRight - this.buttonW;
    this.buttonY = cardBottom + BUTTON_GAP * scale;
  }

  private drawRestart(ctx: CanvasRenderingContext2D): void {
    const radius = this.buttonH / 2;
    const { scale } = arrange(this.width, this.height);
    const fontSize = buttonSize(this.width);

    ctx.strokeStyle = INK;
    ctx.lineWidth = BUTTON_STROKE * Math.max(scale, 0.75);
    ctx.beginPath();
    roundPill(ctx, this.buttonX, this.buttonY, this.buttonW, this.buttonH, radius);
    ctx.stroke();

    ctx.font = `bold ${fontSize}px "Whyte Inktrap Heavy", sans-serif`;
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      BUTTON_LABEL,
      this.buttonX + this.buttonW / 2,
      this.buttonY + this.buttonH / 2,
    );
  }
}

/**
 * Capsule path without roundRect, so tests and older canvases stay happy.
 */
function roundPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  const r = Math.min(radius, h / 2, w / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Message size scales with the window, clamped so it stays readable.
 */
function messageSize(width: number): number {
  return Math.max(20, Math.min(36, width * 0.032));
}

/**
 * Restart label size; a touch smaller than the loss line.
 */
function buttonSize(width: number): number {
  return Math.max(11, Math.min(13, width * 0.012));
}
