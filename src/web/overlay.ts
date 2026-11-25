import Screen from "./screen";
import { DisplayObject } from "./scene";

export type OverlayKind = "title" | "knockedOut" | "victory";

/**
 * Drawn above the cards so the dim covers the table. Readout is painted
 * under the overlay by the host, so stats dim with the rest.
 */
export const OVERLAY_DEPTH = 1000;

const DIM = "rgba(0, 0, 0, 0.72)";
const INK = "#ffffff";

const PROMPT_FONT = '18px "Whyte Inktrap Regular", sans-serif';
const BUTTON_FONT = '16px "Whyte Inktrap Regular", sans-serif';

const BUTTON_WIDTH = 160;
const BUTTON_HEIGHT = 44;
const BUTTON_BOTTOM = 48;

/**
 * Copy for each end Screen. Title uses its own layout.
 */
const MESSAGE: Record<"knockedOut" | "victory", string> = {
  knockedOut: "Ouch, you are knocked out!",
  victory: "Yes, you win the brawl!",
};

/**
 * A full-window overlay Screen: dim, copy, and for end Screens a Restart
 * control. It lives in the Scene so Input can hit-test Restart, but its
 * pixels are painted by the Director after the readout (see draw vs paint).
 */
export default class Overlay implements Screen, DisplayObject {
  private kind: OverlayKind;
  private width: number;
  private height: number;
  private onRestart: () => void;

  constructor(kind: OverlayKind, onRestart: () => void) {
    this.kind = kind;
    this.width = 0;
    this.height = 0;
    this.onRestart = onRestart;
  }

  getKind(): OverlayKind {
    return this.kind;
  }

  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  enter(): void {}

  exit(): void {}

  update(_dt: number): void {}

  /**
   * Scene.draw skips real paint so the host can draw the readout under the
   * dim. Director.paint calls paint() after that.
   */
  draw(_ctx: CanvasRenderingContext2D): void {}

  paint(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = DIM;
    ctx.fillRect(0, 0, this.width, this.height);

    if (this.kind === "title") {
      this.paintTitle(ctx);
      return;
    }

    this.paintMessage(ctx, MESSAGE[this.kind]);
    this.paintRestart(ctx);
  }

  getDepth(): number {
    return OVERLAY_DEPTH;
  }

  /**
   * Covers the window so cards underneath cannot be tapped.
   */
  contains(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x <= this.width && y <= this.height;
  }

  /**
   * Title dismiss is handled by the Director while input is locked. End
   * Screens accept taps so Restart can fire.
   */
  isTappable(): boolean {
    return this.kind !== "title";
  }

  setPointer(_x: number | null, _y: number | null): void {}

  /**
   * A tap on an end Screen restarts only when it lands on the control.
   */
  tap(x: number, y: number): void {
    if (this.kind === "title") {
      return;
    }

    if (this.restartContains(x, y)) {
      this.onRestart();
    }
  }

  private paintTitle(ctx: CanvasRenderingContext2D): void {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const titleSize = Math.min(72, Math.max(36, this.width / 12));
    const lineGap = titleSize * 0.95;

    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${titleSize}px "Whyte Inktrap Heavy", sans-serif`;
    ctx.fillText("SUPERHERO", cx, cy - lineGap / 2);
    ctx.fillText("CARD BRAWL", cx, cy + lineGap / 2);

    ctx.font = PROMPT_FONT;
    ctx.fillText("Click or press any button to play.", cx, this.height - 56);
  }

  private paintMessage(ctx: CanvasRenderingContext2D, text: string): void {
    const size = Math.min(36, Math.max(22, this.width / 24));

    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${size}px "Whyte Inktrap Heavy", sans-serif`;
    ctx.fillText(text, this.width / 2, this.height / 2);
  }

  private paintRestart(ctx: CanvasRenderingContext2D): void {
    const { x, y, w, h } = this.restartBox();

    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.font = BUTTON_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Restart", x + w / 2, y + h / 2);
  }

  private restartContains(x: number, y: number): boolean {
    const box = this.restartBox();
    return (
      x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h
    );
  }

  private restartBox(): { x: number; y: number; w: number; h: number } {
    return {
      x: this.width - BUTTON_BOTTOM - BUTTON_WIDTH,
      y: this.height - BUTTON_BOTTOM - BUTTON_HEIGHT,
      w: BUTTON_WIDTH,
      h: BUTTON_HEIGHT,
    };
  }
}
