import Game from "../game/game";
import Loop from "./loop";
import Scene from "./scene";
import Card, { CARD_HEIGHT } from "./card";
import Input from "./input";

/**
 * Faces the card renderer paints with. They are loaded before the first frame
 * because canvas text does not update itself when a font arrives later.
 *
 * The weight must match each @font-face rule, or load() will not find the face.
 */
const FONTS = [
  '16px "Whyte Inktrap Book"',
  '16px "Whyte Inktrap Regular"',
  'bold 16px "Whyte Inktrap Heavy"',
];

/**
 * A missing font must not block the game. Canvas falls back to sans-serif,
 * which stays readable if a custom face never arrives.
 */
function loadFonts() {
  return Promise.all(
    FONTS.map((font) => document.fonts.load(font).catch(() => [])),
  );
}

/**
 * The page owns the element so CSS can cover the window. The context is taken
 * once and reused, because every frame draws into the same surface.
 */
const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;

const ctx = canvas.getContext("2d")!;

/**
 * Layout size in CSS pixels. Centering and drawing use these rather than the
 * backing-store size, so a high-DPI screen does not move where things sit.
 */
let width = 0;
let height = 0;

/**
 * The backing store is in device pixels and the window is in CSS pixels.
 * Both are updated together, and the context is scaled so one CSS pixel stays
 * one unit of game space. Otherwise cards look soft or the wrong size.
 */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * Rules and the dealt board live here, apart from sprites. start() shuffles
 * and draws the opening room so the scene has a real card to show.
 */
const game = new Game();

game.start();

/**
 * What is on screen, separate from the game model. Only the first dealt card
 * is shown so far, which is enough to prove the deal-in motion before the
 * rest of the room is drawn.
 */
const scene = new Scene();
const firstCard = new Card(game.board.cards[0]);
scene.add(firstCard);

/**
 * The card's rest pose is the middle of the window. A resize changes that
 * point, so the spring target has to be set again or the card settles off-center.
 */
function centerFirstCard() {
  firstCard.moveTo(width / 2, height / 2);
}

/**
 * The canvas does not follow the window on its own. The backing store is
 * resized and the card retargeted on every resize, and once at boot before
 * anything is drawn.
 */
window.addEventListener("resize", () => {
  resizeCanvas();
  centerFirstCard();
});

resizeCanvas();

/**
 * What a tap means. Input only reports which object was tapped; turning that
 * into a Game command happens here. The card flips by itself once the game
 * marks it played.
 */
const input = new Input(scene, (object) => {
  if (object instanceof Card) {
    game.playCard(object.getCard());
  }
});

input.listen(canvas);

/**
 * Springs advance by elapsed seconds rather than by frames, so a slow frame
 * does not change how far the card moves.
 */
function update(dt: number) {
  scene.update(dt);
}

/**
 * The canvas keeps the previous frame, so each frame paints a flat background
 * before the scene. Without the clear, sprites would smear as they move.
 */
function draw() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  scene.draw(ctx);
}

/**
 * Update moves what is on screen (springs, timers) and draw writes pixels, so
 * drawing never changes what it is drawing. Neither applies the rules: Game
 * commands are called when the player acts or when an animation finishes.
 */
const loop = new Loop(update, draw);

/**
 * The loop waits for the fonts so the first frame uses the real faces.
 * The card is snapped in below the screen and tilted, then given the center
 * as its target, so the springs carry it in instead of it appearing at rest.
 */
loadFonts().then(() => {
  firstCard.placeAt(width / 2, height + CARD_HEIGHT, -0.4);
  centerFirstCard();
  loop.start();
});
