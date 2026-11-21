import Game from "./game/game";
import Loop from "./engine/loop";
import DisplayList from "./engine/display-list";
import CardSprite from "./cards/card-sprite";
import { CARD_HEIGHT } from "./cards/draw-card";

// Must match the font-weight declared in each @font-face rule, or load() won't find the face.
const FONTS = [
  '16px "Whyte Inktrap Book"',
  '16px "Whyte Inktrap Regular"',
  'bold 16px "Whyte Inktrap Heavy"',
];

function loadFonts() {
  // A missing font shouldn't block the game; canvas falls back to sans-serif.
  return Promise.all(
    FONTS.map((font) => document.fonts.load(font).catch(() => [])),
  );
}

const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;

const ctx = canvas.getContext("2d")!;

// Size of the canvas in CSS pixels, which is what everything is drawn in.
let width = 0;
let height = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  // Draw in CSS pixels; the transform maps them onto the high-DPI backing store.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const game = new Game();

game.start();

const displayList = new DisplayList();
const firstCard = new CardSprite(game.board.cards[0]);
displayList.add(firstCard);

function centerFirstCard() {
  firstCard.moveTo(width / 2, height / 2);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  centerFirstCard();
});

resizeCanvas();

function draw() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  displayList.draw(ctx);
}

const loop = new Loop((dt) => displayList.update(dt), draw);

loadFonts().then(() => {
  // Start below the screen, tilted, and let the springs bring it in.
  firstCard.placeAt(width / 2, height + CARD_HEIGHT, -0.4);
  centerFirstCard();
  loop.start();
});
