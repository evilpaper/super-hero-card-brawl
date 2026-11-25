/**
 * A host mode that can sit on top of the table: title, knocked out, victory.
 * enter mounts it; exit removes it. Playing is the absence of a Screen.
 *
 * Kept small on purpose (ADR 0003). A fuller protocol (dedicated Playing
 * Screen, pointer handlers on the Screen itself) can grow here later.
 */
export default interface Screen {
  enter(): void;
  exit(): void;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
