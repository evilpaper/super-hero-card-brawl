// Longest step update() will ever see, in seconds. Anything longer (a backgrounded
// tab, a hitch) is treated as this, so objects slow down instead of jumping.
export const MAX_FRAME_TIME = 1 / 30;

type Update = (dt: number) => void;
type Draw = () => void;

/**
 * Runs update(dt) then draw() once per animation frame.
 * dt is the time since the previous frame in seconds, capped at MAX_FRAME_TIME.
 */
export default class Loop {
  private update: Update;
  private draw: Draw;
  private frameId: number | null;
  private lastTime: number | null;

  constructor(update: Update, draw: Draw) {
    this.update = update;
    this.draw = draw;
    this.frameId = null;
    this.lastTime = null;
  }

  start(): void {
    if (this.frameId !== null) {
      return;
    }

    this.lastTime = null;
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.frameId === null) {
      return;
    }

    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  private tick = (time: DOMHighResTimeStamp): void => {
    // Request the next frame first, so a throw in update/draw doesn't stop the loop.
    this.frameId = requestAnimationFrame(this.tick);

    const dt =
      this.lastTime === null
        ? 0
        : Math.min((time - this.lastTime) / 1000, MAX_FRAME_TIME);
    this.lastTime = time;

    this.update(dt);
    this.draw();
  };
}
