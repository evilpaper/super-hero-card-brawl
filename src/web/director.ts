import Input from "./input";
import Overlay, { OverlayKind } from "./overlay";
import Scene from "./scene";
import Screen from "./screen";

export type Mode = "title" | "playing" | "knockedOut" | "victory";

/**
 * Owns which host mode is current and mounts the overlay Screen for it.
 * The table Scene stays up underneath (ADR 0003).
 */
export default class Director {
  private scene: Scene;
  private input: Input;
  private mode: Mode;
  private screen: Overlay | null;
  private width: number;
  private height: number;
  private onRestart: () => void;

  constructor(scene: Scene, input: Input, onRestart: () => void) {
    this.scene = scene;
    this.input = input;
    this.mode = "playing";
    this.screen = null;
    this.width = 0;
    this.height = 0;
    this.onRestart = onRestart;
  }

  getMode(): Mode {
    return this.mode;
  }

  isPlaying(): boolean {
    return this.mode === "playing";
  }

  /**
   * The current overlay, if any. Playing has none.
   */
  getScreen(): Screen | null {
    return this.screen;
  }

  layout(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.screen?.layout(width, height);
  }

  /**
   * Cold start only. Input stays locked until the title is dismissed so a
   * click cannot also play a card.
   */
  showTitle(): void {
    this.input.lock();
    this.mount("title");
  }

  dismissTitle(): void {
    if (this.mode !== "title") {
      return;
    }

    this.clearScreen();
    this.mode = "playing";
    this.input.unlock();
  }

  showKnockedOut(): void {
    this.mount("knockedOut");
    this.input.unlock();
  }

  showVictory(): void {
    this.mount("victory");
    this.input.unlock();
  }

  /**
   * Title: any key. End Screens ignore the keyboard for now.
   */
  handleKey(event: KeyboardEvent): void {
    if (this.mode !== "title") {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    event.preventDefault();
    this.dismissTitle();
  }

  /**
   * Title: any primary press. End Screens reach Restart through Input.
   */
  handlePointerDown(event: PointerEvent): void {
    if (!event.isPrimary || this.mode !== "title") {
      return;
    }

    this.dismissTitle();
  }

  /**
   * A tap that landed on the overlay Screen.
   */
  handleOverlayTap(overlay: Overlay, x: number, y: number): void {
    if (overlay !== this.screen) {
      return;
    }

    overlay.tap(x, y);
  }

  /**
   * Paints the overlay after the table and readout so the dim covers both.
   */
  paint(ctx: CanvasRenderingContext2D): void {
    this.screen?.paint(ctx);
  }

  /**
   * Click and key dismissals for the title.
   */
  listen(canvas: HTMLCanvasElement): void {
    window.addEventListener("keydown", (event) => this.handleKey(event));
    canvas.addEventListener("pointerdown", (event) =>
      this.handlePointerDown(event),
    );
  }

  private mount(kind: OverlayKind): void {
    this.clearScreen();
    this.mode = kind === "title" ? "title" : kind;
    const overlay = new Overlay(kind, () => this.restart());
    overlay.layout(this.width, this.height);
    overlay.enter();
    this.scene.add(overlay);
    this.screen = overlay;
  }

  private restart(): void {
    this.clearScreen();
    this.mode = "playing";
    this.onRestart();
  }

  private clearScreen(): void {
    if (this.screen === null) {
      return;
    }

    this.screen.exit();
    this.scene.remove(this.screen);
    this.screen = null;
  }
}
