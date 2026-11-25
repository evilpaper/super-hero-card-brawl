import Game from "../game/game";
import Loop from "./loop";
import Scene from "./scene";
import Card from "./card";
import Dealer from "./dealer";
import Director from "./director";
import Input from "./input";
import Overlay from "./overlay";
import { drawReadout } from "./readout";
import Script from "./script";
import Slots from "./slots";

/**
 * Beat after a finishing play so the flip can settle before the end Screen.
 */
const END_PAUSE = 0.6;

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
 * Assigned before the first tap; the handlers close over these bindings.
 */
let dealer: Dealer;
let director: Director;

/**
 * What a tap means. Input only reports which object was tapped; turning that
 * into a Game command happens here. End Screens and the title are owned by
 * the Director; card play only runs while playing.
 */
const input = new Input(
  scene,
  (object, x, y) => {
    if (object instanceof Overlay) {
      director.handleOverlayTap(object, x, y);
      return;
    }

    if (!director.isPlaying()) {
      return;
    }

    if (object instanceof Card) {
      game.playCard(object.getCard());

      if (game.isKnockedOut()) {
        input.lock();
        script.after(END_PAUSE, () => director.showKnockedOut());
        return;
      }

      if (game.hasVictory()) {
        input.lock();
        script.after(END_PAUSE, () => director.showVictory());
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

dealer = new Dealer(game, scene, slots, script, input);

/**
 * Title on cold start, knocked-out and victory overlays, and Restart.
 */
director = new Director(scene, input, () => {
  script.clear();
  dealer.redealBrawl();
});

director.listen(canvas);

/**
 * The canvas does not follow the window on its own. The backing store is
 * resized and the Slots laid out again on every resize, and once at boot
 * before anything is drawn.
 */
window.addEventListener("resize", () => {
  resizeCanvas();
  slots.layout(width, height);
  director.layout(width, height);
});

resizeCanvas();
slots.layout(width, height);
director.layout(width, height);

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
 * The readout sits above the cards; the Director paints the overlay last so
 * the dim covers both (ADR 0003).
 */
function draw() {
  ctx.fillStyle = "#17171a";
  ctx.fillRect(0, 0, width, height);
  scene.draw(ctx);
  drawReadout(ctx, game.player);
  director.paint(ctx);
}

/**
 * Update moves what is on screen (springs, timers) and draw writes pixels, so
 * drawing never changes what it is drawing. Neither applies the rules: Game
 * commands are called when the player acts or when an animation finishes.
 */
const loop = new Loop(update, draw);

/**
 * The loop waits for the fonts so the first frame uses the real faces.
 * The deal starts under the title with input left locked until dismiss.
 */
loadFonts().then(() => {
  director.showTitle();
  dealer.dealOpeningWave(false);
  loop.start();
});
