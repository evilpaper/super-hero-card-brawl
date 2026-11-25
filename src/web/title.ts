import titleUrl from "../assets/images/title.svg";

/**
 * Intrinsic size of title.svg.
 */
const ART_WIDTH = 601;
const ART_HEIGHT = 300;

const DIM = "rgba(0, 0, 0, 0.72)";

/**
 * Cold-start title overlay: dims the table and paints title.svg until the
 * first click or key. After dismiss it stays gone for the rest of the session.
 */
export default class Title {
  private showing: boolean;
  private width: number;
  private height: number;
  private image: HTMLImageElement;

  constructor(image: HTMLImageElement = new Image()) {
    this.showing = true;
    this.width = 0;
    this.height = 0;
    this.image = image;

    if (!this.image.src) {
      this.image.src = titleUrl;
    }
  }

  isShowing(): boolean {
    return this.showing;
  }

  dismiss(): void {
    this.showing = false;
  }

  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.showing) {
      return;
    }

    ctx.fillStyle = DIM;
    ctx.fillRect(0, 0, this.width, this.height);

    if (!this.image.complete || this.image.naturalWidth === 0) {
      return;
    }

    const maxWidth = this.width * 0.8;
    const scale = Math.min(1, maxWidth / ART_WIDTH);
    const w = ART_WIDTH * scale;
    const h = ART_HEIGHT * scale;
    ctx.drawImage(
      this.image,
      (this.width - w) / 2,
      (this.height - h) / 2,
      w,
      h,
    );
  }

  /**
   * Any key dismisses while showing. Modifier-only chords are ignored.
   */
  handleKey(event: {
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    preventDefault(): void;
  }): void {
    if (!this.showing || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    event.preventDefault();
    this.dismiss();
  }

  /**
   * Any primary press dismisses while showing.
   */
  handlePointerDown(event: { isPrimary: boolean }): void {
    if (!this.showing || !event.isPrimary) {
      return;
    }

    this.dismiss();
  }

  /**
   * @param onDismiss - runs once when the title first goes away (e.g. unlock input).
   */
  listen(canvas: HTMLCanvasElement, onDismiss?: () => void): void {
    const finish = (): void => {
      if (!this.showing) {
        return;
      }

      this.dismiss();
      onDismiss?.();
    };

    window.addEventListener("keydown", (event) => {
      if (!this.showing || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      event.preventDefault();
      finish();
    });
    canvas.addEventListener("pointerdown", (event) => {
      if (!this.showing || !event.isPrimary) {
        return;
      }

      finish();
    });
  }
}
