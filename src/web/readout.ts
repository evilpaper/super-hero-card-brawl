import Player from "../game/player";

const FONT = '12px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const INK = "#979d97";
const LEFT = 16;
const TOP = 16;
const LINE_HEIGHT = 22;

/**
 * The player's Health, Defence and Stamina as plain text in the top-left
 * corner. It reads the player on every frame, so it is never out of date
 * with the rules and needs no telling when a card is played.
 *
 * Labels share one width so the numbers line up in the monospace face.
 */
export function drawReadout(ctx: CanvasRenderingContext2D, player: Player) {
  const lines = [
    `Health (heart)    ${player.getHealth()}`,
    `Defence (diamond) ${player.getDefence()}`,
    `Stamina (diamond) ${player.getStamina()}`,
  ];

  ctx.font = FONT;
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  lines.forEach((line, index) => {
    ctx.fillText(line, LEFT, TOP + index * LINE_HEIGHT);
  });
}
