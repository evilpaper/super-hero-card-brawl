import Game from "../game/game";
import Loop from "./loop";
import Scene from "./scene";
import Card from "./card";
import Dealer from "./dealer";
import Input from "./input";
import { drawReadout } from "./readout";
import Script from "./script";
import Slots from "./slots";
import Title from "./title";
import KnockedOut from "./knocked-out";

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
 * Rules and the dealt Wave live here, apart from sprites. start() shuffles
 * and draws the opening Wave so the scene has real cards to show.
 */
const game = new Game();

game.start();

/**
 * What is on screen, separate from the game model, and the Slots that decide
 * where the current Wave's cards sit.
 */
const scene = new Scene();
const slots = new Slots();

/**
 * Scripted moments, like a Wave change, run here one timed step at a time.
 */
const script = new Script();

/**
 * The canvas does not follow the window on its own. The backing store is
 * resized and the Slots laid out again on every resize, and once at boot
 * before anything is drawn.
 */
/**
 * Cold-start title only. Dismissed by the first click or key.
 */
const title = new Title();

/**
 * Knocked out overlay. Shown when Health hits zero; Restart starts a new Brawl.
 */
const knockedOut = new KnockedOut();

window.addEventListener("resize", () => {
  resizeCanvas();
  slots.layout(width, height);
  title.layout(width, height);
  knockedOut.layout(width, height);
});

resizeCanvas();
slots.layout(width, height);
title.layout(width, height);
knockedOut.layout(width, height);

/**
 * What a tap means. Input only reports which object was tapped; turning that
 * into a Game command happens here. The card flips by itself once the game
 * marks it played. Knocked out locks play immediately; otherwise a complete
 * Wave brings on the next one.
 */
const input = new Input(
  scene,
  (object) => {
    if (object instanceof Card) {
      game.playCard(object.getCard());

      if (game.player.getHealth() <= 0) {
        input.lock();
        knockedOut.show();
        return;
      }

      if (game.wave.isComplete()) {
        dealer.nextWave();
      }
    }
  },
  {
    grab(object) {
      if (object instanceof Card) {
        slots.grab(object);
      }
    },
    move(object, x, y) {
      if (object instanceof Card) {
        slots.drag(object, x, y);
      }
    },
    drop(object) {
      if (object instanceof Card) {
        slots.drop(object);
      }
    },
  },
);

input.listen(canvas);
title.listen(canvas, () => input.unlock());

const dealer = new Dealer(game, scene, slots, script, input);

knockedOut.listen(canvas, () => {
  knockedOut.hide();
  dealer.restart();
});

/**
 * Springs and script steps advance by elapsed seconds rather than by frames,
 * so a slow frame does not change how far a card moves. The script runs
 * first, so a target it sets is chased in the same frame.
 */
function update(dt: number) {
  script.update(dt);
  scene.update(dt);
}

/**
 * The canvas keeps the previous frame, so each frame paints a flat background
 * before the scene. Without the clear, sprites would smear as they move.
 * Knocked out dims the table under the readout; the title paints last.
 */
function draw() {
  ctx.fillStyle = "#17171a";
  ctx.fillRect(0, 0, width, height);
  scene.draw(ctx);
  knockedOut.draw(ctx);
  drawReadout(ctx, game.player);
  title.draw(ctx);
}

/**
 * Update moves what is on screen (springs, timers) and draw writes pixels, so
 * drawing never changes what it is drawing. Neither applies the rules: Game
 * commands are called when the player acts or when an animation finishes.
 */
const loop = new Loop(update, draw);

/**
 * The loop waits for the fonts so the first frame uses the real faces.
 * The opening Wave deals under the title; input stays locked until dismiss.
 */
loadFonts().then(() => {
  dealer.dealOpeningWave(false);
  loop.start();
});
